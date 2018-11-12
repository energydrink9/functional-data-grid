// @flow

import React from 'react'
import Column from "./Column"
import { List, Map } from 'immutable'
import Cell from './Cell'
import DataRow from './DataRow'
import Group from './Group'

type RowProps = {
  leftLockedColumns: List<Column>,
  freeColumns: List<Column>,
  rightLockedColumns: List<Column>,
  element : DataRow<any>,
  style : Object,
  aggregateStyle: Object,
  groupStyle: Object,
  cellStyle: Object,
  scrollLeft : number,
  onScroll : Function,
  rowIndex : number,
  columnsWidth : Map<string, number>,
  groups: List<Group<any, any>>
}

type RowState = {
  hover: boolean
}

export default class Row extends React.PureComponent<RowProps, RowState> {

  scrollingDiv : any

  constructor(props: RowProps) {
    super(props)

    this.state = {
      hover: false
    }
  }

  componentDidMount = () => {
    this.updateScroll()
  }

  componentDidUpdate = (prevProps: RowProps) => {
    if (this.props.scrollLeft !== this.scrollingDiv.scrollLeft)
      this.updateScroll()
  }

  updateScroll = () => {
    this.scrollingDiv.scrollLeft = this.props.scrollLeft
  }

  triggerOnScroll = (event : Object) => {

    let scrollEvent = {
      scrollLeft: event.target.scrollLeft
    }
    if (this.props.onScroll != null)
      this.props.onScroll(scrollEvent)
  }

  render = () => {

    let rowStyle = this.getRowStyle(this.props.element.type, this.props.style, this.props.groupStyle, this.props.aggregateStyle)

    return this.props.element.type === 'group-header'
      ? this.groupHeaderRowRenderer(rowStyle, this.props.element, this.props.groups, this.onMouseOver, this.onMouseOut, this.setScrollingDiv)
      : this.elementsRowRenderer(this.props.rowIndex, this.props.element, this.props.leftLockedColumns, this.props.freeColumns, this.props.rightLockedColumns, this.triggerOnScroll, this.setScrollingDiv, this.onMouseOver, this.onMouseOut, this.state.hover, this.props.cellStyle, rowStyle, this.getColumnWidth)
  }

  getRowStyle = (type: string, style: Object, groupStyle: Object, aggregateStyle: Object) => {

    return {
      ...{
        display: 'flex',
        borderBottom: 'solid 1px #eee',
        lineHeight: '25px',
        backgroundColor: '#fff'
      },
      ...style,
      ...(type === 'group-header' ? groupStyle : {}),
      ...(type === 'aggregate' ? { backgroundColor: '#eee', ...aggregateStyle } : {})
    }
  }

  setScrollingDiv = (el: any) => {
    this.scrollingDiv = el
  }

  groupHeaderRowRenderer = (style: Object, element: DataRow<any>, groups: List<Group<any, any>>, onMouseOver: Function, onMouseOut: Function, onScrollingDivSet: Function) => 
    <div className="functional-data-grid__row functional-data-grid__row--group-header" onMouseEnter={onMouseOver} onMouseLeave={onMouseOut} style={style}>
      <div style={{display: 'flex'}}>
        <div style={{
            overflow: 'hidden',
            flexShrink: 0,
            padding: '2px 10px',
            position: 'relative'
          }}>
          { this.renderGroups(element, groups) }
        </div>
      </div>
      <div style={{display: 'flex', overflow: 'hidden', 'flexGrow': 1}} ref={onScrollingDivSet}>
      </div>
      <div style={{display: 'flex'}}>
      </div>
    </div>

  renderGroups = (element: DataRow<any>, groups: List<Group<any, any>>) => {
    let entries: List<[string, any]> = List(Object.entries(element.content))

    return entries.map((e: [string, any], index: number) => {
    
      return <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
        { this.renderGroup(groups.find(g => g.id === e[0]), e[1]) }
      </div>
    })
  }

  renderGroup = (group: Group<any, any>, v: any) => group.renderer(v, group)

  elementsRowRenderer = (rowIndex: number, element: DataRow<any>, leftLockedColumns : List<Column>, freeColumns : List<Column>, rightLockedColumns : List<Column>, onScroll: Function, onScrollingDivSet: Function, onMouseOver: Function, onMouseOut: Function, hover: boolean, cellStyle: Object, style: Object, columnWidthGetter: Function) =>
    this.renderElementsRow(
      leftLockedColumns,
      freeColumns,
      rightLockedColumns,
      rowIndex,
      element,
      onScroll,
      onScrollingDivSet,
      onMouseOver,
      onMouseOut,
      hover,
      cellStyle,
      style,
      columnWidthGetter
    )

  renderElementsRow = (leftLockedColumns: List<Column>, freeColumns: List<Column>, rightLockedColumns : List<Column>, rowIndex: number, element: DataRow<any>, onScroll: Function, onScrollingDivSet: Function, onMouseOver: Function, onMouseOut: Function, hover: boolean, cellStyle: Object, style: Object, columnWidthGetter: Function) =>
    <div data-index={rowIndex} data-original-index={element.originalIndex} className={'functional-data-grid__row ' + (element.type === 'aggregate' ? 'functional-data-grid__row--aggregate' : 'functional-data-grid__row--element')} onMouseEnter={onMouseOver} onMouseLeave={onMouseOut} style={style}>
      <div style={{display: 'flex'}}>
        { this.renderCells(leftLockedColumns, hover, element, rowIndex, cellStyle, columnWidthGetter) }
      </div>
      <div style={{display: 'flex', overflow: 'hidden', 'flexGrow': 1}} ref={onScrollingDivSet} onScroll={onScroll}>
        { this.renderCells(freeColumns, hover, element, rowIndex, cellStyle, columnWidthGetter) }
      </div>
      <div style={{display: 'flex'}}>
        { this.renderCells(rightLockedColumns, hover, element, rowIndex, cellStyle, columnWidthGetter) }
      </div>
    </div>

  renderCells = (columns: List<Column>, hover: boolean, element: DataRow<any>, rowIndex: number, cellStyle: Object, columnWidthGetter: Function) =>
    columns.map((c: Column) =>
      <Cell value={this.computeValue(c, element)}
            key={c.id}
            rowHover={hover}
            column={c}
            width={columnWidthGetter(c)}
            rowIndex={rowIndex}
            style={cellStyle}
            type={element.type}
            content={element.content}
            originalIndex={element.originalIndex != null ? element.originalIndex : -1}
      />)

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