// @flow

import React from 'react'
import BaseColumn from "./BaseColumn"
import { List, Map } from 'immutable'
import Cell from './Cell'
import DataRow from './DataRow'

type RowProps = {
  columns : List<BaseColumn>,
  element : DataRow<any>,
  style : Object,
  rowStyle: Object,
  aggregateStyle: Object,
  groupStyle: Object,
  cellStyle: Object,
  scrollLeft : number,
  onScroll : Function,
  rowIndex : number,
  columnsWidth : Map<string, number>,
  columnsVisibility: Map<string, boolean>,
  enableColumnsVisibilityMenu: boolean
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

  getStyles = () => {
    let style : Object = Object.assign({}, this.props.style)
    style.display = 'flex'
    style.borderBottom = 'solid 1px #eee'
    style.backgroundColor = '#fff'
    style.lineHeight = '25px'
    if (this.props.element.type === 'aggregate')
      style.backgroundColor = '#eee'
    return style
  }

  getCellStyle = () => {
    return {
      overflow: 'hidden',
      flexShrink: 0,
      padding: '2px 10px',
      position: 'relative'
    }
  }

  render = () => {

    let firstUnlockedColumnIndex = this.props.columns.findIndex((c) => ! c.locked)

    return this.props.element.type === 'group-header'
      ? this.groupHeaderRowRenderer()
      : this.elementsRowRenderer(firstUnlockedColumnIndex)
  }

  groupHeaderRowRenderer = () => <div className="functional-data-grid__row functional-data-grid__row--group-header" onMouseEnter={this.onMouseOver} onMouseLeave={this.onMouseOut} style={{...this.getStyles(), ...this.props.rowStyle, ...this.props.groupStyle}}>
    <div style={{display: 'flex'}}>
      <div style={this.getCellStyle()}>
        { Object.entries(this.props.element.content).map((e: [any, any], index) => <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}><span>{ e[0] }</span>: <b>{ e[1] }</b></div>) }
      </div>
    </div>
    <div style={{display: 'flex', overflowX: 'hidden', 'flexGrow': 1}} ref={el => this.scrollingDiv = el}>
    </div>
    <div style={{display: 'flex'}}>
    </div>
  </div>

  elementsRowRenderer = (firstUnlockedColumnIndex: number) => <div data-index={this.props.rowIndex} data-original-index={this.props.element.originalIndex} className={'functional-data-grid__row ' + (this.props.element.type === 'aggregate' ? 'functional-data-grid__row--aggregate' : 'functional-data-grid__row--element')} onMouseEnter={this.onMouseOver} onMouseLeave={this.onMouseOut} style={{...this.getStyles(), ...this.props.rowStyle, ...(this.props.element.type === 'aggregate' ? this.props.aggregateStyle : {})}}>
    <div style={{display: 'flex'}}>
      { this.props.columns.filter((c, index) => c.locked && index < firstUnlockedColumnIndex).filter(c => this.isColumnVisible(c.id)).map((c, index) => <Cell key={index} rowHover={this.state.hover} column={c} width={this.getColumnWidth(c)} element={this.props.element} rowIndex={this.props.rowIndex} style={this.props.cellStyle} />) }
    </div>
    <div style={{display: 'flex', overflowX: 'hidden', 'flexGrow': 1}} ref={el => this.scrollingDiv = el} onScroll={this.triggerOnScroll}>
      { this.props.columns.filter(c => this.isColumnVisible(c.id)).filter(c => ! c.locked).map((c, index) => <Cell key={index} rowHover={this.state.hover} column={c} width={this.getColumnWidth(c)} element={this.props.element} rowIndex={this.props.rowIndex} style={this.props.cellStyle} />) }
    </div>
    <div style={{display: 'flex'}}>
      { this.props.columns.filter((c, index) => c.locked && index >= firstUnlockedColumnIndex).filter(c => this.isColumnVisible(c.id)).map((c, index) => <Cell key={index} rowHover={this.state.hover} column={c} width={this.getColumnWidth(c)} element={this.props.element} rowIndex={this.props.rowIndex} style={this.props.cellStyle} />) }
    </div>
    {  this.props.enableColumnsVisibilityMenu && <div style={{ width: '26px' }}></div> }
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