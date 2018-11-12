// @flow

import * as React from 'react'
import { List, Map } from 'immutable'
import ColumnGroup from "./ColumnGroup"
import Column from "./Column"
import HeaderColumn from "./HeaderColumn"
import Sort from "./Sort"

type HeaderProps = {
  leftLockedColumns: List<Column>,
  freeColumns: List<Column>,
  rightLockedColumns: List<Column>,
  columnGroups: List<ColumnGroup>,
  scrollLeft: number,
  onScroll: Function,
  sort : List<Sort>,
  onUpdateSort : Function,
  onUpdateFilter : Function,
  onColumnResize : Function,
  columnsWidth : Map<string, number>,
  style: Object,
  columnsMenu: React.Node
}

const columnsOptionsWidth = 26

export default class Header extends React.PureComponent<HeaderProps> {

  scrollingDiv : any
  columnGroupsScrollingDiv : any

  constructor(props : HeaderProps) {
    super(props)
  }

  componentDidMount = () => {
    this.updateScroll()
  }

  componentDidUpdate = (prevProps: HeaderProps) => {
    if (this.props.scrollLeft !== this.scrollingDiv.scrollLeft)
      this.updateScroll()
    if (this.props.scrollLeft !== this.columnGroupsScrollingDiv.scrollLeft)
      this.updateColumnGroupsScroll()
  }

  updateScroll = () => {
    this.scrollingDiv.scrollLeft = this.props.scrollLeft
  }

  updateColumnGroupsScroll = () => {
    this.columnGroupsScrollingDiv.scrollLeft = this.props.scrollLeft
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
    
    return [
      this.renderColumnGroupsHeader(style),
      this.renderHeader(this.props.leftLockedColumns, this.props.freeColumns, this.props.rightLockedColumns, style)
    ]
  }

  renderColumnGroupsHeader = (style: Object) => this.props.columnGroups.size > 0 && <div key={1} style={{ ...style, ...this.props.style }}>
    <div style={{display: 'flex'}}>
      { this.renderColumnGroupsHeaderForColumns(this.props.leftLockedColumns) }
    </div>
    <div style={{display: 'flex', overflow: 'hidden', flexGrow: 1}} ref={(el) => this.columnGroupsScrollingDiv = el} onScroll={this.triggerOnScroll}>
      { this.renderColumnGroupsHeaderForColumns(this.props.freeColumns) }
    </div>
    <div style={{display: 'flex'}}>    
      { this.renderColumnGroupsHeaderForColumns(this.props.rightLockedColumns) }
    </div>
    <div style={{ flexShrink: 0, width: `${columnsOptionsWidth}px` }}></div>
  </div>
  
  renderColumnGroupHeader = (c: Column | ColumnGroup, w: number, index: number) => <div style={{ flexShrink: 0, width: `${w}px`, padding: '8px', borderRight: 'solid 1px #ccc' }} key={index}>
    { c instanceof ColumnGroup && c.headerRenderer() }
  </div>
  
  renderColumnGroupsHeaderForColumns = (columns: List<Column>) => columns
    .reduce((accumulator: List<Column | ColumnGroup>, c: Column) => accumulator.size === 0 || c.columnGroup == null || (accumulator.last() instanceof Column ? accumulator.last().columnGroup : accumulator.last().id) !== c.columnGroup
      ? this.addColumnGroup(accumulator, c)
      : accumulator
      , List())
    .map(g => [g, this.getColumnGroupWidth(g, columns)])
    .map((g, index) => this.renderColumnGroupHeader(g[0], g[1], index))

  addColumnGroup = (accumulator: List<Column | ColumnGroup>, c: Column | ColumnGroup) => accumulator.push(
    c.columnGroup != null
      ? this.getColumnGroupById(c.columnGroup)
      : c
  )

  getColumnGroupWidth = (g: Column | ColumnGroup, columns: List<Column>) => (g instanceof Column ? [g] : this.getColumnGroupColumns(g, columns))
    .reduce((accumulator: number, c: Column) => accumulator + this.getColumnWidth(c), 0)

  getColumnGroupColumns = (g: ColumnGroup, columns: List<Column>) => columns.filter(c => c.columnGroup === g.id)

  getColumnGroupById = (id: string) => this.props.columnGroups.find(g => g.id === id)

  renderHeader = (leftLockedColumns: List<Column>, freeColumns: List<Column>, rightLockedColumns: List<Column>, style: Object) => <div key={2} className='functional-data-grid__header' style={{...style, ...this.props.style}}>
    <div style={{display: 'flex'}}>
      { this.renderColumns(leftLockedColumns) }
    </div>
    <div style={{display: 'flex', overflow: 'hidden', flexGrow: 1}} ref={(el) => this.scrollingDiv = el} onScroll={this.triggerOnScroll}>
      { this.renderColumns(freeColumns) }
    </div>
    <div style={{display: 'flex'}}>
      { this.renderColumns(rightLockedColumns) }
    </div>
    <div style={{ width: `${columnsOptionsWidth}px` }}>{ this.props.columnsMenu }</div>
  </div>

  renderColumns = (columns : List<Column | ColumnGroup>) => columns
    .map((c, index) => this.renderColumn(c))

  getColumnWidth = (c : Column) => this.props.columnsWidth.get(c.id) != null ? this.props.columnsWidth.get(c.id) : c.width

  renderColumn = (c : Column) => <HeaderColumn key={c.id} column={c} width={this.getColumnWidth(c)} direction={this.getSortDirection(c.id)} onUpdateSort={this.props.onUpdateSort} onUpdateFilter={this.props.onUpdateFilter} onColumnResize={(width : number) => this.props.onColumnResize(c.id, width)} />
  
  getSortDirection = (columnId : string) => {
    let sort = this.props.sort.find(c => c.columnId === columnId)
    return sort == null ? 'none' : sort.direction
  }
}
