// @flow

import * as React from 'react'
import { List, Map } from 'immutable'
import ColumnGroup from "./ColumnGroup"
import Column from "./Column"
import HeaderColumn from "./HeaderColumn"
import ColumnGroupsHeader from "./ColumnGroupsHeader"
import Sort from "./Sort"
import RowSkeleton from './RowSkeleton'
import Constants from './Constants';

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

export default class Header extends React.PureComponent<HeaderProps> {

  constructor(props : HeaderProps) {
    super(props)
  }

  render = () => {

    let style = { display: 'flex', flexGrow: 0, width: '100%', backgroundColor: '#ddd', position: 'relative', borderBottom: 'solid 1px #ccc' }
    
    return [
      <ColumnGroupsHeader
        key={1}
        leftLockedColumns={this.props.leftLockedColumns}
        freeColumns={this.props.freeColumns}
        rightLockedColumns={this.props.rightLockedColumns}
        columnGroups={this.props.columnGroups}
        scrollLeft={this.props.scrollLeft}
        onScroll={this.props.onScroll}
        columnsWidth={this.props.columnsWidth}
        style={{...style, ...this.props.style}}
      />,
      this.renderHeader(this.props.leftLockedColumns, this.props.freeColumns, this.props.rightLockedColumns, style)
    ]
  }

  renderHeader = (leftLockedColumns: List<Column>, freeColumns: List<Column>, rightLockedColumns: List<Column>, style: Object) =>
    <RowSkeleton
      key={2}
      className='functional-data-grid__header'
      style={{ ...style, ...this.props.style }}
      leftLocked={this.renderColumns(leftLockedColumns)}
      free={this.renderColumns(freeColumns)}
      rightLocked={this.renderColumns(rightLockedColumns)}
      right={this.props.columnsMenu}
      scrollLeft={this.props.scrollLeft}
      onScroll={this.props.onScroll}
      rightWidth={Constants.columnsOptionsWidth}
    />

  renderColumns = (columns : List<Column | ColumnGroup>) => columns
    .map((c, index) => this.renderColumn(c))

  getColumnWidth = (c : Column) => this.props.columnsWidth.get(c.id) != null ? this.props.columnsWidth.get(c.id) : c.width

  renderColumn = (c : Column) => <HeaderColumn key={c.id} column={c} width={this.getColumnWidth(c)} direction={this.getSortDirection(c.id)} onUpdateSort={this.props.onUpdateSort} onUpdateFilter={this.props.onUpdateFilter} onColumnResize={(width : number) => this.props.onColumnResize(c.id, width)} />
  
  getSortDirection = (columnId : string) => {
    let sort = this.props.sort.find(c => c.columnId === columnId)
    return sort == null ? 'none' : sort.direction
  }
}
