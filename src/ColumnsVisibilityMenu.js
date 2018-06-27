// @flow

import React from 'react'
import {List, Map} from 'immutable'
import BaseColumn from './BaseColumn'
import ColumnGroup from './ColumnGroup'

type ColumnsVisibilityMenuPropsType = {
  columns: List<BaseColumn | ColumnGroup>,
  columnsVisibility: Map<string, boolean>,
  onColumnVisibilityChange: Function
}

export default class ColumnsVisibilityMenu extends React.Component<ColumnsVisibilityMenuPropsType> {
  
  props: ColumnsVisibilityMenuPropsType
  static defaultProps = {
    onColumnVisibilityChange: () => {}
  }

  render = () => <div style={{ padding: '5px', backgroundColor: '#ddd', border: 'solid 1px #ccc', lineHeight: '26px' }}>
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