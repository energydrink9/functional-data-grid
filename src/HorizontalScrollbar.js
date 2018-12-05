// @flow

import React from 'react'
import { Map } from 'immutable'
import RowSkeleton from './RowSkeleton'
import Constants from './Constants';
import { css } from 'emotion'

type HorizontalScrollbarProps = {
  leftLockedColumnsWidth: number,
  freeColumnsWidth: number,
  rightLockedColumnsWidth: number,
  scrollLeft: number,
  onScroll: Function,
  columnsWidth : Map<string, number>,
  columnsVisibility: Map<string, boolean>
}

const horizontalScrollbarStyle = css`
  display: flex;
  flex-grow: 0;
  width: 100%;
  background-color: transparent;
  position: relative;
  border-bottom: solid 1px #ccc;
`

const emptyDivStyle = css`
  flex-shrink: 0;
  min-height: 1px;
`

export default class HorizontalScrollbar extends React.PureComponent<HorizontalScrollbarProps> {

  render = () => <RowSkeleton
      className={`functional-data-grid__horizontal-scrollbar ${horizontalScrollbarStyle}`}
      leftLocked={this.renderEmptyDiv(this.props.leftLockedColumnsWidth)}
      free={this.renderEmptyDiv(this.props.freeColumnsWidth)}
      rightLocked={this.renderEmptyDiv(this.props.rightLockedColumnsWidth)}
      onScroll={this.props.onScroll}
      scrollLeft={this.props.scrollLeft}
      scrollbar
      rightWidth={Constants.columnsOptionsWidth}
    />

  renderEmptyDiv = (width : number) => <div className={emptyDivStyle} style={{width: `${width}px`}} />
}