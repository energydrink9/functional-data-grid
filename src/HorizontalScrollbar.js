// @flow

import React from 'react'
import { List, Map } from 'immutable'
import ColumnGroup from "./ColumnGroup"
import Column from "./Column"
import RowSkeleton from './RowSkeleton'

type HorizontalScrollbarProps = {
  leftLockedColumnsWidth: number,
  freeColumnsWidth: number,
  rightLockedColumnsWidth: number,
  scrollLeft: number,
  onScroll: Function,
  columnsWidth : Map<string, number>,
  columnsVisibility: Map<string, boolean>
}

export default class HorizontalScrollbar extends React.PureComponent<HorizontalScrollbarProps> {

  constructor(props : HorizontalScrollbarProps) {
    super(props)
  }

  render = () => {
    let style = { display: 'flex', flexGrow: 0, width: '100%', backgroundColor: 'transparent', position: 'relative', borderBottom: 'solid 1px #ccc' }

    return <RowSkeleton
      className='functional-data-grid__horizontal-scrollbar'
      style={style}
      leftLocked={this.renderEmptyDiv(this.props.leftLockedColumnsWidth)}
      free={this.renderEmptyDiv(this.props.freeColumnsWidth)}
      rightLocked={this.renderEmptyDiv(this.props.rightLockedColumnsWidth)}
      onScroll={this.props.onScroll}
      scrollLeft={this.props.scrollLeft}
      scrollbar
    />
  }

  renderEmptyDiv = (width : number) => <div style={{width: `${width}px`, flexShrink: 0, minHeight: '1px'}} />
}