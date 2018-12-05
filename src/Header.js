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
import { css } from 'emotion'

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

const headerStyle = css`
  display: flex;
  flex-grow: 0;
  width: 100%;
  background-color: #ddd;
  position: relative;
  border-bottom: solid 1px #ccc;
`

export default class Header extends React.PureComponent<HeaderProps> {

  render = () => {
   
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
        className={`functional-data-grid__column-groups-header ${headerStyle}`}
        style={this.props.style}
      />,
      this.renderHeader(this.props.leftLockedColumns, this.props.freeColumns, this.props.rightLockedColumns)
    ]
  }

  renderHeader = (leftLockedColumns: List<Column>, freeColumns: List<Column>, rightLockedColumns: List<Column>) =>
    <RowSkeleton
      key={2}
      className={`functional-data-grid__header ${headerStyle}`}
      style={this.props.style}
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
