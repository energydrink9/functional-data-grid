// @flow

import React from 'react'
import BaseColumn from "./BaseColumn"
import { List, Map } from 'immutable'
import Cell from './Cell'

type RowProps = {
  columns : List<BaseColumn>,
  element : DataRow<any>,
  style : Object,
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

  render = () => <div style={this.getStyles()}>
    <div style={{display: 'flex'}}>
      { this.props.columns.filter(c => ! c.hidden).filter(c => c.locked).map((c, index) => <Cell key={index} column={c} width={this.getColumnWidth(c)} element={this.props.element} rowIndex={this.props.rowIndex} />) }
    </div>
    <div style={{display: 'flex', overflow: 'hidden', 'flexGrow': 1}} ref={el => this.scrollingDiv = el}>
    { this.props.columns.filter(c => ! c.hidden).filter(c => ! c.locked).map((c, index) => <Cell key={index} column={c} width={this.getColumnWidth(c)} element={this.props.element} rowIndex={this.props.rowIndex} />) }
    </div>
  </div>

  getColumnWidth = (c : BaseColumn) => this.props.columnWidths.get(c.id)
}
