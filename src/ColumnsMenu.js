// @flow

import React from 'react'
import {List, Map} from 'immutable'
import BaseColumn from './BaseColumn'
import ColumnGroup from './ColumnGroup'

type ColumnsMenuPropsType = {
  columns: List<BaseColumn | ColumnGroup>,
  columnsVisibility: Map<string, boolean>,
  onColumnVisibilityChange: Function,
  onClose: () => void
}

export default class ColumnsMenu extends React.PureComponent<ColumnsMenuPropsType> {
  
  ref: HTMLDivElement
  props: ColumnsMenuPropsType
  
  static defaultProps = {
    onColumnVisibilityChange: () => {},
    onClose: () => {}
  }

  componentDidMount = () => {
    document.addEventListener('click', this.handleClickOutside, true)
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = (event: Object) => {
    if (this.ref != null && ! this.ref.contains(event.target)) {
      this.props.onClose()
      event.stopPropagation()
    }
  }

  render = () => <div ref={ref => this.ref = ref} style={{ padding: '5px', backgroundColor: '#ddd', border: 'solid 1px #ccc', lineHeight: '26px', maxHeight: '500px', overflow: 'auto' }}>
    { this.props.columnsVisibility.entrySeq().map(e => this.renderColumnVisibility(e[0], e[1])) }
  </div>

  renderColumnVisibility = (columnId: string, columnVisibility: boolean) => <div>
    <input type="checkbox" checked={columnVisibility} onChange={this.onColumnVisibilityChange(columnId)} /> { this.getColumn(columnId).title }
  </div>

  onColumnVisibilityChange = (columnId: string) => (event: Object) => {
    this.props.onColumnVisibilityChange(columnId, event.target.checked)
  }

  getColumn = (columnId: string) => this.props.columns.find(c => c.id === columnId)
}