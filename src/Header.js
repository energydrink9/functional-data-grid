// @flow

import React from 'react'
import { List, Map } from 'immutable'
import ColumnGroup from "./ColumnGroup"
import BaseColumn from "./BaseColumn"
import HeaderColumn from "./HeaderColumn"
import Sort from "./Sort"

type HeaderProps = {
  columns: List<BaseColumn | ColumnGroup>,
  scrollLeft: number,
  onScroll: Function,
  sort : List<Sort>,
  onUpdateSort : Function,
  onUpdateFilter : Function,
  onColumnResize : Function,
  columnWidths : Map<string, number>,
  style: Object
}

export default class Header extends React.Component<HeaderProps> {

  props: HeaderProps
  scrollingDiv : any

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
    let style = { display: 'flex', flexGrow: 0, width: '100%', backgroundColor: '#ddd' }
    return <div style={{...style, ...this.props.style}}>
      <div style={{display: 'flex'}}>
        { this.renderColumns(this.props.columns.filter(c => (this.columnIsLocked(c)) || c instanceof ColumnGroup && c.columns.find(c => this.columnIsLocked(c)) != null)) }
      </div>
      <div style={{display: 'flex', overflow: 'visible'}} ref={(el) => this.scrollingDiv = el} onScroll={this.triggerOnScroll}>
        { this.renderColumns(this.props.columns.filter(c => !(this.columnIsLocked(c)) && !(c instanceof ColumnGroup && c.columns.find(c => this.columnIsLocked(c)) != null))) }
      </div>
    </div>
  }

  columnIsLocked = (c : BaseColumn | ColumnGroup) => c instanceof BaseColumn && c.locked

  renderColumns = (columns : List<BaseColumn | ColumnGroup>) => columns
    .map((c, index) => c instanceof ColumnGroup ? this.renderColumnGroup(c, index) : (!c.hidden && this.renderColumn(c)))

  renderColumnGroup = (cg : ColumnGroup, index : number) => <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
    { cg.headerRenderer() }
    <div style={{ display: 'flex' }}>
      { cg.columns.filter(c => ! c.hidden).map(c => this.renderColumn(c)) }
    </div>
  </div>

  getColumnWidth = (c : BaseColumn) => this.props.columnWidths.get(c.id) != null ? this.props.columnWidths.get(c.id) : c.width

  renderColumn = (c : BaseColumn) => <HeaderColumn key={c.id} column={c} width={this.getColumnWidth(c)} direction={this.getSortDirection(c.id)} onUpdateSort={this.props.onUpdateSort} onUpdateFilter={this.props.onUpdateFilter} onColumnResize={(width : number) => this.props.onColumnResize(c.id, width)} />
  getSortDirection = (columnId : string) => {
    let sort = this.props.sort.find(c => c.columnId === columnId)
    return sort == null ? 'none' : sort.direction
  }
}
