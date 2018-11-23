// @flow

import * as React from 'react'
import { List, Map } from 'immutable'
import ColumnGroup from "./ColumnGroup"
import Column from "./Column"
import RowSkeleton from './RowSkeleton'
import type { ComputedColumnGroup } from './ComputedColumnGroup'
import { getComputedColumnGroups } from './Utils'

type ColumnGroupsHeaderProps = {
  leftLockedColumns: List<Column>,
  freeColumns: List<Column>,
  rightLockedColumns: List<Column>,
  columnGroups: List<ColumnGroup>,
  scrollLeft: number,
  onScroll: Function,
  columnsWidth : Map<string, number>,
  style: Object
}

export default class ColumnGroupsHeader extends React.PureComponent<ColumnGroupsHeaderProps> {

  constructor(props : ColumnGroupsHeaderProps) {
    super(props)
  }

  render = () => this.renderColumnGroupsHeader(this.props.style)

  renderColumnGroupsHeader = (style: Object) => this.props.columnGroups.size > 0 && <RowSkeleton
    key={1}
    style={{ ...style, ...this.props.style }}
    leftLocked={this.renderColumnGroupsHeaderForColumns(this.props.leftLockedColumns)}
    free={this.renderColumnGroupsHeaderForColumns(this.props.freeColumns)}
    rightLocked={this.renderColumnGroupsHeaderForColumns(this.props.rightLockedColumns)}
    scrollLeft={this.props.scrollLeft}
    onScroll={this.props.onScroll}
  />
  
  renderColumnGroupHeader = (c: ComputedColumnGroup, index: number) => <div style={{ flexShrink: 0, width: `${this.getColumnsWidth(c.columns)}px`, padding: '8px', borderRight: 'solid 1px #ccc' }} key={index}>
    { c.columnGroup != null && this.getColumnGroupById(c.columnGroup).headerRenderer() }
  </div>
  
  renderColumnGroupsHeaderForColumns = (columns: List<Column>) => getComputedColumnGroups(columns)
    .map((g, index) => this.renderColumnGroupHeader(g, index))

  getColumnGroupById = (id: string) => this.props.columnGroups.find(g => g.id === id)

  getColumnsWidth = (columns: List<Column>) => columns.reduce((accumulator: number, c: Column) => accumulator + this.getColumnWidth(c), 0)

  getColumnWidth = (c : Column) => this.props.columnsWidth.get(c.id) != null ? this.props.columnsWidth.get(c.id) : c.width
}
