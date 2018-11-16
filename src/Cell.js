// @flow

import React from 'react'
import Column from "./Column"
import { css } from 'emotion'

type CellProps = {
  value: any,
  column : Column,
  rowIndex : number,
  width : ?number,
  style: Object,
  rowHover: boolean,
  type: 'element' | 'group-header' | 'aggregate',
  content: any,
  originalIndex: number
}

type CellState = {
  hover : boolean
}

const contentClassName = css`
  background-color: inherit;
  text-overflow: ellipsis;
  white-space: nowrap;
  align-self: center;
  width: 100%;
`

const cellClassName = css`
  overflow: hidden;
  flex-shrink: 0;
  padding: 2px 10px;
  position: relative;
  display: flex;
`

export default class Cell extends React.PureComponent<CellProps, CellState> {

  constructor(props : Object) {
    super(props)
    this.state = {
      hover : false
    }
  }

  render = () => {
    return <div className={`functional-data-grid__cell ${cellClassName}`} style={{...this.getCellStyle(), ...this.props.column.style, ...this.props.style}} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
      <div className={`functional-data-grid__cell-content ${contentClassName}`}>
        { this.renderValue(this.props.column, this.props.type, this.props.content, this.props.originalIndex) }
      </div>
    </div>
  }

  onMouseEnter = () => this.setState({ 'hover': true })
  onMouseLeave = () => this.setState({ 'hover': false })

  renderValue = (c : Column, type: 'element' | 'group-header' | 'aggregate', content: any, originalIndex: number) => type === 'aggregate'
    ? this.props.value == null ? <span /> : c.aggregateRenderer(this.props.value, content, this.props.rowIndex, originalIndex, this.props.rowHover, this.state.hover)
    : c.renderer(this.props.value, content, this.props.rowIndex, originalIndex, this.props.rowHover, this.state.hover)

  getCellStyle = () => {
    let styles : Object = {
    }

    if (this.state.hover) {
      styles.overflow = 'visible'
    }

    if (this.props.width != null)
      styles.width = this.props.width

    return styles
  }
}
