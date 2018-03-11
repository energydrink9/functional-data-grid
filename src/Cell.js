// @flow

import React from 'react'
import BaseColumn from "./BaseColumn"
import DataRow from './DataRow'

type CellProps = {
  column : BaseColumn,
  element : DataRow<any>,
  rowIndex : number,
  width : ?number
}
type CellState = {
  hover : boolean
}

export default class Cell extends React.Component<CellProps, CellState> {
  props : CellProps
  state : CellState

  constructor(props : Object) {
    super(props)
    this.state = {
      hover : false
    }
  }

  render = () => {
    return <div style={Object.assign(this.getCellStyle(), this.props.column.style)} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
      <div style={this.getContentStyle()}>
        { this.renderValue(this.props.column, this.props.element) }
      </div>
    </div>
  }

  onMouseEnter = () => this.setState({ 'hover': true })
  onMouseLeave = () => this.setState({ 'hover': false })

  renderValue = (c : BaseColumn, e : DataRow<any>) => e.type === 'aggregate'
    ? c.aggregateValueGetter == null ? <span/> : c.aggregateRenderer(c.aggregateValueGetter(e.content.content, e.content.key), e.content, this.props.rowIndex, e.originalIndex)
    : c.valueGetter == null ? <span/> : c.renderer(c.valueGetter(e.content), e.content, this.props.rowIndex, e.originalIndex)

  getCellStyle = () => {
    let styles : Object = {
      overflow: 'hidden',
      flexShrink: 0,
      padding: '2px 10px',
      position: 'relative',
      display: 'flex'
    }

    if (this.state.hover) {
      styles.overflow = 'visible'
    }

    if (this.props.width != null)
      styles.width = this.props.width

    return styles
  }

  getContentStyle = () => {
    let styles : Object = {
      backgroundColor: 'inherit',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      zIndex: 1,
      alignSelf: 'center',
      width: '100%'
    }

    return styles
  }
}
