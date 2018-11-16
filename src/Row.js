// @flow

import React from 'react'
import Column from "./Column"
import { List, Map } from 'immutable'
import Cell from './Cell'
import DataRow from './DataRow'
import Group from './Group'
import RowSkeleton from './RowSkeleton'
import { css } from 'emotion'

type RowProps = {
  leftLockedColumns: List<Column>,
  freeColumns: List<Column>,
  rightLockedColumns: List<Column>,
  element : DataRow<any>,
  style : Object,
  cellStyle: Object,
  scrollLeft : number,
  onScroll : Function,
  rowIndex : number,
  columnsWidth : Map<string, number>,
  groups: List<Group<any, any>>,
  onClick: (Object) => void
}

type RowState = {
  hover: boolean
}

const rowClassName = css`
  display: flex;
  border-bottom: solid 1px #eee;
  line-height: 25px;
  background-color: #fff;
  &:hover {
    background-color: #fafafa;
  }
`

const groupClassName = css`
  overflow: hidden;
  flex-shrink: 0;
  padding: 2px 10px;
  position: relative;
`

export default class Row extends React.PureComponent<RowProps, RowState> {

  constructor(props: RowProps) {
    super(props)

    this.state = {
      hover: false
    }
  }

  render = () => {

    return this.props.element.type === 'group-header'
      ? this.groupHeaderRowRenderer(this.props.style, this.props.element, this.props.groups, this.onMouseOver, this.onMouseOut)
      : this.elementsRowRenderer(this.props.rowIndex, this.props.element, this.props.leftLockedColumns, this.props.freeColumns, this.props.rightLockedColumns, this.onMouseOver, this.onMouseOut, this.state.hover, this.props.cellStyle, this.props.style, this.getColumnWidth)
  }

  groupHeaderRowRenderer = (style: Object, element: DataRow<any>, groups: List<Group<any, any>>, onMouseOver: Function, onMouseOut: Function) =>
    <RowSkeleton
      className={`${rowClassName} functional-data-grid__row functional-data-grid__row--group-header`}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOut}
      style={style}
      onClick={this.props.onClick}
      leftLocked={<div className={groupClassName}>
        { this.renderGroups(element, groups) }
      </div>}
    />

  renderGroups = (element: DataRow<any>, groups: List<Group<any, any>>) => {
    let entries: List<[string, any]> = List(Object.entries(element.content))

    return entries.map((e: [string, any], index: number) => {
    
      return <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
        { this.renderGroup(groups.find(g => g.id === e[0]), e[1]) }
      </div>
    })
  }

  renderGroup = (group: Group<any, any>, v: any) => group.renderer(v, group)

  elementsRowRenderer = (rowIndex: number, element: DataRow<any>, leftLockedColumns : List<Column>, freeColumns : List<Column>, rightLockedColumns : List<Column>, onMouseOver: Function, onMouseOut: Function, hover: boolean, cellStyle: Object, style: Object, columnWidthGetter: Function) =>
    this.renderElementsRow(
      leftLockedColumns,
      freeColumns,
      rightLockedColumns,
      rowIndex,
      element,
      onMouseOver,
      onMouseOut,
      hover,
      cellStyle,
      style,
      columnWidthGetter
    )

renderElementsRow = (
  leftLockedColumns: List<Column>,
  freeColumns: List<Column>,
  rightLockedColumns : List<Column>,
  rowIndex: number,
  element: DataRow<any>,
  onMouseOver: Function,
  onMouseOut: Function,
  hover: boolean,
  cellStyle: Object,
  style: Object,
  columnWidthGetter: Function
) => <RowSkeleton
  data-index={rowIndex}
  data-original-index={element.originalIndex}
  className={`${rowClassName} functional-data-grid__row functional-data-grid__row--${element.type}`}
  onMouseEnter={onMouseOver}
  onMouseLeave={onMouseOut}
  style={style}
  leftLocked={ this.renderCells(leftLockedColumns, hover, element, rowIndex, cellStyle, columnWidthGetter) }
  free={this.renderCells(freeColumns, hover, element, rowIndex, cellStyle, columnWidthGetter)}
  rightLocked={this.renderCells(rightLockedColumns, hover, element, rowIndex, cellStyle, columnWidthGetter)}
  scrollLeft={this.props.scrollLeft}
  onScroll={this.props.onScroll}
  onClick={this.props.onClick}
/>

  renderCells = (columns: List<Column>, hover: boolean, element: DataRow<any>, rowIndex: number, cellStyle: Object, columnWidthGetter: Function) =>
    columns.map((c: Column) => {
      let value = this.computeValue(c, element)
      return <Cell value={value}
        key={c.id}
        rowHover={hover}
        column={c}
        width={columnWidthGetter(c)}
        rowIndex={rowIndex}
        style={cellStyle}
        type={element.type}
        content={element.content}
        originalIndex={element.originalIndex != null ? element.originalIndex : -1}
      />
    })

  computeValue = (c: Column, e: DataRow<any>) => e.type === 'aggregate'
    ? c.aggregateValueGetter == null ? null : c.aggregateValueGetter(e.content.content, e.content.key)
    : c.valueGetter(e.content)

  getColumnWidth = (c : Column) => this.props.columnsWidth.get(c.id)

  onMouseOver = () => {
    this.setState({
      hover: true
    })
  }

  onMouseOut = () => {
    this.setState({
      hover: false
    })
  }
}