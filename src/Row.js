// @flow

import React from 'react'
import BaseColumn from "./BaseColumn"
import { List, Map } from 'immutable'
import Cell from './Cell'

export default class Row extends React.Component {

  props : {
    columns : List<BaseColumn>,
    element : any,
    style : Object,
    scrollLeft : number,
    onScroll : Function,
    rowIndex : number,
    columnWidths : Map<string, number>
  };

  componentDidMount = () => {
    this.updateScroll()
  }

  componentDidUpdate = () => {
    this.updateScroll()
  }

  updateScroll = () => {
    this.refs.scrollingDiv.scrollLeft = this.props.scrollLeft
  }

  getStyles = () => {
    let style : Object = Object.assign({}, this.props.style)
    style.display = 'flex'
    style.borderBottom = 'solid 1px #eee'
    style.backgroundColor = '#fff'
    style.lineHeight = '25px'
    if (this.props.element._isAggregate)
      style.backgroundColor = '#ddd'
    return style
  }

  render = () => <div style={this.getStyles()}>
    <div style={{display: 'flex'}}>
      { this.props.columns.filter(c => ! c.hidden).filter(c => c.locked).map((c, index) => <Cell key={index} column={c} width={this.getColumnWidth(c)} element={this.props.element} rowIndex={this.props.rowIndex} />) }
    </div>
    <div style={{display: 'flex', overflow: 'hidden'}} ref="scrollingDiv">
    { this.props.columns.filter(c => ! c.hidden).filter(c => ! c.locked).map((c, index) => <Cell key={index} column={c} width={this.getColumnWidth(c)} element={this.props.element} rowIndex={this.props.rowIndex} />) }
    </div>
  </div>

  getColumnWidth = (c : BaseColumn) => this.props.columnWidths.get(c.id) != null ? this.props.columnWidths.get(c.id) : c.width
}
