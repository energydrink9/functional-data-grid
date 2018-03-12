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
  columnWidths : Map<string, number>
}

export default class Row extends React.Component<RowProps> {

  props : RowProps
  scrollingDiv : any

  componentDidMount = () => {
    this.updateScroll()
  }

  componentDidUpdate = () => {
    this.updateScroll()
  }

  updateScroll = () => {
    this.scrollingDiv.scrollLeft = this.props.scrollLeft
  }

  getStyles = () => {
    let style : Object = Object.assign({}, this.props.style)
    style.display = 'flex'
    style.borderBottom = 'solid 1px #eee'
    style.backgroundColor = '#fff'
    style.lineHeight = '25px'
    if (this.props.element.type === 'aggregate')
      style.backgroundColor = '#ddd'
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

  render = () => this.props.element.type === 'group-header'
      ? this.groupHeaderRowRenderer()
      : this.elementsRowRenderer()

  groupHeaderRowRenderer = () => <div style={{...this.getStyles(), ...this.props.rowStyle, ...this.props.groupStyle}}>
    <div style={{display: 'flex'}}>
      <div style={this.getCellStyle()}>
        { Object.entries(this.props.element.content).map((e: [any, any], index) => <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}><span>{ e[0] }</span>: <b>{ e[1] }</b></div>) }
      </div>
    </div>
    <div style={{display: 'flex', overflow: 'hidden', 'flexGrow': 1}} ref={el => this.scrollingDiv = el}>
    </div>
  </div>

  elementsRowRenderer = () => <div style={{...this.getStyles(), ...this.props.rowStyle, ...(this.props.element.type === 'aggregate' ? this.props.aggregateStyle : {})}}>
    <div style={{display: 'flex'}}>
      { this.props.columns.filter(c => ! c.hidden).filter(c => c.locked).map((c, index) => <Cell key={index} column={c} width={this.getColumnWidth(c)} element={this.props.element} rowIndex={this.props.rowIndex} style={this.props.cellStyle} />) }
    </div>
    <div style={{display: 'flex', overflow: 'hidden', 'flexGrow': 1}} ref={el => this.scrollingDiv = el}>
      { this.props.columns.filter(c => ! c.hidden).filter(c => ! c.locked).map((c, index) => <Cell key={index} column={c} width={this.getColumnWidth(c)} element={this.props.element} rowIndex={this.props.rowIndex} style={this.props.cellStyle} />) }
    </div>
  </div>

  getColumnWidth = (c : BaseColumn) => this.props.columnWidths.get(c.id)
}