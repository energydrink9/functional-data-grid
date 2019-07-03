// @flow

import React from 'react'
import Column from "./Column"
import HeaderColumnResizer from "./HeaderColumnResizer"
import { css } from 'emotion';

type HeaderColumnProps = {
  column: Column,
  direction: 'asc' | 'desc' | 'none',
  onUpdateSort : Function,
  onUpdateFilter : Function,
  onColumnResize : Function,
  width: ?number
}
type HeaderColumnState = {
  direction: 'asc' | 'desc' | 'none'
}

const headerColumnStyle = css`
  overflow: visible;
  text-overflow: ellipsis;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  border-right: solid 1px #ccc;
  position: relative;
`

const headerColumnTitleStyle = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const headerColumnFilterStyle = css`
  text-align: center;
  margin-top: 2px;
`

export default class HeaderColumn extends React.PureComponent<HeaderColumnProps, HeaderColumnState> {

  static defaultProps = {
    direction: 'none'
  }

  element : any;

  constructor(props : HeaderColumnProps) {
    super(props)
    this.state = {
      direction : this.props.direction
    }
  }

  render = () => {
    let right = this.element == null ? 0 : this.element.getBoundingClientRect().right
    return <div ref={(el => this.element = el)} key={this.props.column.id} className={[headerColumnStyle, 'functional-data-grid__cell'].join(' ')} style={Object.assign(this.getCellStyle(this.props.column), this.props.column.headerStyle)}>
      { this.props.column.resizable && <HeaderColumnResizer right={right} onResize={this.onColumnResize} /> }
      <div onClick={this.toggleSortDirection} className={headerColumnTitleStyle}>
        { this.props.column.headerRenderer(this.props.column) }
        <span> { this.state.direction === 'asc' ? '▲' : this.state.direction === 'desc' ? '▼' : '' }</span>
      </div>
      { this.props.column.filterable && <div className={headerColumnFilterStyle}>{ this.props.column.filterRenderer(this.triggerOnUpdateFilter) }</div> }
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

  getCellStyle = (c : Column) => {
    let styles : Object = {}

    if (this.props.width != null)
      styles.width = this.props.width

    if (c.sortable === true)
      styles.cursor = 'pointer'

    return styles
  }
  
  onColumnResize = (right : number) => {
    this.props.onColumnResize(right - this.element.getBoundingClientRect().left)
  }
}
