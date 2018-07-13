// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { List, Map } from 'immutable'
import ColumnGroup from "./ColumnGroup"
import BaseColumn from "./BaseColumn"
import HeaderColumn from "./HeaderColumn"
import Sort from "./Sort"
import ColumnsVisibilityMenu from './ColumnsVisibilityMenu'
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
  enableColumnsVisibilityMenu: boolean,
  onColumnVisibilityChange: Function
}

type HeaderState = {
  showColumnsVisibilityMenu: boolean
}

export default class Header extends React.Component<HeaderProps, HeaderState> {

  props: HeaderProps
  state: HeaderState

  scrollingDiv : any

  constructor(props : HeaderProps) {
    super(props)
    this.state = {
      showColumnsVisibilityMenu: false
    }
  }

  componentDidMount = () => {
    this.updateScroll()
  }

  componentDidUpdate = () => {
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

    return <div className='functional-data-grid__header' style={{...style, ...this.props.style}}>
      <div style={{display: 'flex'}}>
        { this.renderColumns(this.props.columns.filter((c, index) => c.locked && index < firstUnlockedColumnIndex)) }
      </div>
      <div style={{display: 'flex', overflow: 'overlay', flexGrow: 1}} ref={(el) => this.scrollingDiv = el} onScroll={this.triggerOnScroll}>
        { this.renderColumns(this.props.columns.filter(c => ! c.locked)) }
      </div>
      <div style={{display: 'flex'}}>
        { this.renderColumns(this.props.columns.filter((c, index) => c.locked && index >= firstUnlockedColumnIndex)) }
      </div>
      { this.props.enableColumnsVisibilityMenu && <div style={{ width: '26px' }}>{ this.renderColumnsVisibilityMenu() }</div> }
    </div>
  }

  renderColumnsVisibilityMenu = () => <Manager>
    <Reference>
      {({ ref }) => (
        <div ref={ref} style={{ padding: '5px', cursor: 'pointer', userSelect: 'none', fontSize: '16px' }} onClick={this.toggleColumnsVisibilityMenu}>&#x22ee;</div>
      )}
    </Reference>
    { this.state.showColumnsVisibilityMenu && document.body != null && ReactDOM.createPortal(
      <Popper placement={'bottom-end'}>
        {({ placement, ref, style }) => (
          <div ref={ref} style={style} data-placement={placement} className={'functional-data-grid__columns-visibility-menu'}>
            <ColumnsVisibilityMenu columns={this.props.columns} columnsVisibility={this.props.columnsVisibility} onColumnVisibilityChange={this.props.onColumnVisibilityChange} />,
          </div>
        )}
      </Popper>,
      document.body
    )}
  </Manager>

  toggleColumnsVisibilityMenu = () => {
    this.setState({
      showColumnsVisibilityMenu: ! this.state.showColumnsVisibilityMenu
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
