// @flow

import React from 'react'
import BaseColumn from "./BaseColumn"
import HeaderColumnResizer from "./HeaderColumnResizer"

type HeaderColumnProps = {
  column: BaseColumn,
  direction: 'asc' | 'desc' | 'none',
  onUpdateSort : Function,
  onUpdateFilter : Function,
  onColumnResize : Function,
  width: ?number
}
type HeaderColumnState = {
  direction: 'asc' | 'desc' | 'none',
  hover: boolean
}

export default class HeaderColumn extends React.Component<HeaderColumnProps, HeaderColumnState> {

  static defaultProps = {
    direction: 'none'
  }

  props: HeaderColumnProps
  state: HeaderColumnState

  element : any;

  constructor(props : Object) {
    super(props)
    this.state = {
      direction : this.props.direction,
      hover : false
    }
  }

  render = () => {
    let right = this.element == null ? 0 : this.element.getBoundingClientRect().right
    return <div ref={(el => this.element = el)} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} key={this.props.column.id} style={Object.assign(this.getCellStyle(this.props.column), this.props.column.headerStyle)}>
      <HeaderColumnResizer right={right} onResize={this.onColumnResize} />
      <div onClick={this.toggleSortDirection} style={{textOverflow: 'ellipsis', overflow: 'hidden',whiteSpace: 'nowrap'}}>
        { this.props.column.headerRenderer(this.props.column) }
        <span> { this.state.direction === 'asc' ? '▲' : this.state.direction === 'desc' ? '▼' : '' }</span>
      </div>
      { this.props.column.filterable && <div style={{ textAlign: 'center' }}>{ this.props.column.filterRenderer(this.triggerOnUpdateFilter) }</div> }
    </div>
  }

  toggleSortDirection = () => {
    if (this.props.column.sortable) {
      this.setState({
        direction: this.nextSortDirection(this.state.direction)
      }, () => this.props.onUpdateSort(this.props.column.id, this.state.direction))
    }
  }

  nextSortDirection = (direction : 'asc' | 'desc' | 'none') => direction === 'none' ? 'asc' : direction === 'asc' ? 'desc' : 'none'

  triggerOnUpdateFilter = (matcher : Function) => {
    this.props.onUpdateFilter(this.props.column.id, matcher)
  }

  getCellStyle = (c : BaseColumn) => {
    let styles : Object = {
      overflow: 'visible',
      textOverflow: 'ellipsis',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '10px 8px 20px 8px',
      borderRight: 'solid 1px #ccc',
      position: 'relative'
    }

    if (this.props.width != null)
      styles.width = this.props.width

    if (c.sortable === true)
      styles.cursor = 'pointer'

    return styles
  }

  onMouseEnter = () => {
    this.setState({
      hover : true
    })
  }
  onMouseLeave = () => {
    this.setState({
      hover : false
    })
  }
  onColumnResize = (right : number) => {
    this.props.onColumnResize(right - this.element.getBoundingClientRect().left)
  }
}
