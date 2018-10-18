// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { List, Map } from 'immutable'
import ColumnGroup from "./ColumnGroup"
import BaseColumn from "./BaseColumn"
import HeaderColumn from "./HeaderColumn"
import Sort from "./Sort"
import ColumnsMenu from './ColumnsMenu'
import { Manager, Reference, Popper } from 'react-popper'

type HeaderProps = {
  columns: List<BaseColumn | ColumnGroup>,
  scrollLeft: number,
  onScroll: Function,
  sort : List<Sort>,
  onUpdateSort : Function,
  onUpdateFilter : Function,
  onColumnResize : Function,
  columnsWidth : Map<string, number>,
  style: Object,
  columnsVisibility: Map<string, boolean>,
  enableColumnsShowAndHide: boolean,
  enableColumnsSorting: boolean,
  onColumnVisibilityChange: Function,
  onColumnsOrderChange: List<string> => void,
  columnsOrder: List<string>,
  popperContainer: ?HTMLElement
}

type HeaderState = {
  showColumnsMenu: boolean
}

const columnsOptionsWidth = 26

export default class Header extends React.PureComponent<HeaderProps, HeaderState> {

  props: HeaderProps
  state: HeaderState

  scrollingDiv : any

  static defaultProps = {
    popperContainer: document.body
  }

  constructor(props : HeaderProps) {
    super(props)
    this.state = {
      showColumnsMenu: false
    }
  }

  componentDidMount = () => {
    this.updateScroll()
  }

  componentDidUpdate = (prevProps: HeaderProps) => {
    if (this.props.scrollLeft !== this.scrollingDiv.scrollLeft)
      this.updateScroll()
  }

  updateScroll = () => {
    this.scrollingDiv.scrollLeft = this.props.scrollLeft // eslint-disable-line
  }

  triggerOnScroll = (event : Object) => {
    let scrollEvent = {
      scrollLeft: event.target.scrollLeft
    }
    if (this.props.onScroll != null)
      this.props.onScroll(scrollEvent)
  }

  render = () => {
    let style = { display: 'flex', flexGrow: 0, width: '100%', backgroundColor: '#ddd', position: 'relative', borderBottom: 'solid 1px #ccc' }

    let firstUnlockedColumnIndex = this.props.columns.findIndex((c) => ! c.locked)

    let firstLockedColumns = this.props.columns.filter((c, index) => c.locked && (firstUnlockedColumnIndex === -1 || index < firstUnlockedColumnIndex))
    let nonLockedColumns = this.props.columns.filter(c => ! c.locked)
    let secondLockedColumns = this.props.columns.filter((c, index) => c.locked && firstUnlockedColumnIndex !== -1 && index >= firstUnlockedColumnIndex)

    return this.renderHeader(firstLockedColumns, nonLockedColumns, secondLockedColumns, style)
  }

  renderHeader = (firstLockedColumns: List<BaseColumn>, nonLockedColumns: List<BaseColumn>, secondLockedColumns: List<BaseColumn>, style: Object) => <div className='functional-data-grid__header' style={{...style, ...this.props.style}}>
    <div style={{display: 'flex'}}>
      { this.renderColumns(firstLockedColumns) }
    </div>
    <div style={{display: 'flex', overflow: 'hidden', flexGrow: 1}} ref={(el) => this.scrollingDiv = el} onScroll={this.triggerOnScroll}>
      { this.renderColumns(nonLockedColumns) }
    </div>
    <div style={{display: 'flex'}}>
      { this.renderColumns(secondLockedColumns) }
    </div>
    { (this.props.enableColumnsShowAndHide || this.props.enableColumnsSorting) && <div style={{ width: `${columnsOptionsWidth}px` }}>{ this.renderColumnsMenu() }</div> }
  </div>

  renderColumnsMenu = () => <Manager>
    <Reference>
      {({ ref }) => (
        <div ref={ref} style={{ padding: '5px', cursor: 'pointer', userSelect: 'none', fontSize: '16px' }} onClick={this.toggleColumnsMenu}>&#x22ee;</div>
      )}
    </Reference>
    { this.state.showColumnsMenu && this.props.popperContainer != null && ReactDOM.createPortal(
      <Popper placement={'bottom-end'} modifiers={{ preventOverflow: { enabled: false }, flip: { enabled: false } }}>
        {({ placement, ref, style }) => (
          <div ref={ref} style={style} data-placement={placement} className={'functional-data-grid__columns-visibility-menu'}>
            <ColumnsMenu columns={this.props.columns} enableColumnsShowAndHide={this.props.enableColumnsShowAndHide} enableColumnsSorting={this.props.enableColumnsSorting} columnsVisibility={this.props.columnsVisibility} onColumnVisibilityChange={this.props.onColumnVisibilityChange} onClose={this.toggleColumnsMenu} onColumnsOrderChange={this.props.onColumnsOrderChange} columnsOrder={this.props.columnsOrder} />,
          </div>
        )}
      </Popper>,
      this.props.popperContainer
    )}
  </Manager>

  toggleColumnsMenu = () => {
    this.setState({
      showColumnsMenu: ! this.state.showColumnsMenu
    })
  }

  renderColumns = (columns : List<BaseColumn | ColumnGroup>) => columns
    .map((c, index) => c instanceof ColumnGroup ? this.renderColumnGroup(c, index) : (this.isColumnVisible(c.id) && this.renderColumn(c)))

  renderColumnGroup = (cg : ColumnGroup, index : number) => <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
    { cg.headerRenderer() }
    <div style={{ display: 'flex' }}>
      { cg.columns.filter(c => this.isColumnVisible(c.id)).map(c => this.renderColumn(c)) }
    </div>
  </div>

  getColumnWidth = (c : BaseColumn) => this.props.columnsWidth.get(c.id) != null ? this.props.columnsWidth.get(c.id) : c.width

  renderColumn = (c : BaseColumn) => <HeaderColumn key={c.id} column={c} width={this.getColumnWidth(c)} direction={this.getSortDirection(c.id)} onUpdateSort={this.props.onUpdateSort} onUpdateFilter={this.props.onUpdateFilter} onColumnResize={(width : number) => this.props.onColumnResize(c.id, width)} />
  
  getSortDirection = (columnId : string) => {
    let sort = this.props.sort.find(c => c.columnId === columnId)
    return sort == null ? 'none' : sort.direction
  }

  isColumnVisible = (columnId: string) => this.props.columnsVisibility.get(columnId)
}
