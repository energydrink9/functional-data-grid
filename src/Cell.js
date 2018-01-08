// @flow

import React from 'react'
import BaseColumn from "./BaseColumn"

type CellProps = {
  column : BaseColumn,
  element : any,
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

  renderValue = (c : BaseColumn, e : any) => c.renderer(c.valueGetter(e), e, this.props.rowIndex)

  getCellStyle = () => {
    let styles : Object = {
      overflow: 'hidden',
      flexShrink: 0,
      padding: '2px 10px',
      position: 'relative'
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
      zIndex: 1
    }

    return styles
  }
}
