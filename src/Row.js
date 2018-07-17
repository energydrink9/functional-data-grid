// @flow
/*eslint-disable*/
import React from 'react'
import BaseColumn from "./BaseColumn"
import { List, Map } from 'immutable'
import Cell from './Cell'
import DataRow from './DataRow'
import Group from './Group'
const columnsOptionsWidth = 26

type RowProps = {
  columns : List<BaseColumn>,
  element : DataRow<any>,
  style : Object,
  aggregateStyle: Object,
  groupStyle: Object,
  cellStyle: Object,
  scrollLeft : number,
  onScroll : Function,
  rowIndex : number,
  columnsWidth : Map<string, number>,
  columnsVisibility: Map<string, boolean>,
  enableColumnsVisibilityMenu: boolean,
  groups: List<Group>
}

type RowState = {
  hover: boolean
}

export default class Row extends React.Component<RowProps, RowState> {

  props: RowProps
  state: RowState
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

  componentDidUpdate = () => {
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

    let firstUnlockedColumnIndex = this.props.columns.findIndex((c) => ! c.locked)

    let rowStyle = this.getRowStyle(this.props.element.type, this.props.style, this.props.groupStyle, this.props.aggregateStyle)

    return this.props.element.type === 'group-header'
      ? this.groupHeaderRowRenderer(rowStyle, this.props.element, this.props.groups, this.onMouseOver, this.onMouseOut, this.setScrollingDiv)
      : this.elementsRowRenderer(firstUnlockedColumnIndex,this.props.rowIndex, this.props.element, this.props.columns, this.triggerOnScroll, this.props.enableColumnsVisibilityMenu, this.setScrollingDiv, this.onMouseOver, this.onMouseOut, this.state.hover, this.props.cellStyle, rowStyle, this.isColumnVisible, this.getColumnWidth)
  }

  getRowStyle = (type: string, style: Object, groupStyle: Object, aggregateStyle: Object) => {

    return { ...{
        display: 'flex',
        borderBottom: 'solid 1px #eee',
        lineHeight: '25px'
      },
      ...style,
      ...(type === 'group-header' ? groupStyle : {}),
      ...(type === 'aggregate' ? { backgroundColor: '#fff', ...aggregateStyle } : {})
    }
  }

  setScrollingDiv = (el: any) => {
    this.scrollingDiv = el
  }

  groupHeaderRowRenderer = (style: Object, element: DataRow<any>, groups: List<Group>, onMouseOver: Function, onMouseOut: Function, onScrollingDivSet: Function) => 
    <div className="functional-data-grid__row functional-data-grid__row--group-header" onMouseEnter={onMouseOver} onMouseLeave={onMouseOut} style={style}>
      <div style={{display: 'flex'}}>
        <div style={{
            overflow: 'hidden',
            flexShrink: 0,
            padding: '2px 10px',
            position: 'relative'
          }}>
          { Object.entries(element.content).map((e: [any, any], index) => <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
            { this.renderGroup(groups.find(g => g.id === e[0]), e[1]) }
          </div>) }
        </div>
      </div>
      <div style={{display: 'flex', overflow: 'hidden', 'flexGrow': 1}} ref={onScrollingDivSet}>
      </div>
      <div style={{display: 'flex'}}>
      </div>
    </div>

  renderGroup = (group: Group, v: any) => group.renderer(v, group)

  elementsRowRenderer = (firstUnlockedColumnIndex: number, rowIndex: number, element: DataRow<any>, columns : List<BaseColumn>, onScroll: Function, enableColumnsVisibilityMenu: boolean, onScrollingDivSet: Function, onMouseOver: Function, onMouseOut: Function, hover: boolean, cellStyle: Object, style: Object, isColumnVisible: Function, columnWidthGetter: Function) => <div data-index={rowIndex} data-original-index={element.originalIndex} className={'functional-data-grid__row ' + (element.type === 'aggregate' ? 'functional-data-grid__row--aggregate' : 'functional-data-grid__row--element')} onMouseEnter={onMouseOver} onMouseLeave={onMouseOut} style={style}>
    <div style={{display: 'flex'}}>
      { columns.filter((c, index) => c.locked && index < firstUnlockedColumnIndex).filter(c => isColumnVisible(c.id)).map((c, index) => <Cell key={index} rowHover={hover} column={c} width={columnWidthGetter(c)} element={element} rowIndex={rowIndex} style={cellStyle} />) }
    </div>
    <div style={{display: 'flex', overflow: 'hidden', 'flexGrow': 1}} ref={onScrollingDivSet} onScroll={onScroll}>
      { columns.filter(c => isColumnVisible(c.id)).filter(c => ! c.locked).map((c, index) => <Cell key={index} rowHover={hover} column={c} width={columnWidthGetter(c)} element={element} rowIndex={rowIndex} style={cellStyle} />) }
    </div>
    <div style={{display: 'flex'}}>
      { columns.filter((c, index) => c.locked && index >= firstUnlockedColumnIndex).filter(c => isColumnVisible(c.id)).map((c, index) => <Cell key={index} rowHover={hover} column={c} width={columnWidthGetter(c)} element={element} rowIndex={rowIndex} style={cellStyle} />) }
    </div>
    {  enableColumnsVisibilityMenu && <div style={{ width: `${columnsOptionsWidth}px` }}></div> }
  </div>

  getColumnWidth = (c : BaseColumn) => this.props.columnsWidth.get(c.id)

  isColumnVisible = (columnId: string) => this.props.columnsVisibility.get(columnId)

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