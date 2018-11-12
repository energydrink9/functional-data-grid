// @flow

import React from 'react'
import { List, Map } from 'immutable'
import ColumnGroup from "./ColumnGroup"
import Column from "./Column"

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

  scrollingDiv : any

  constructor(props : HorizontalScrollbarProps) {
    super(props)
  }

  componentDidMount = () => {
    this.updateScroll()
  }

  componentDidUpdate = (prevProps: HorizontalScrollbarProps) => {
    if (this.props.scrollLeft !== this.scrollingDiv.scrollLeft)
      this.updateScroll()
  }

  updateScroll = () => {
    this.scrollingDiv.scrollLeft = this.props.scrollLeft // eslint-disable-line
  }

  triggerOnScroll = (event : Object) => {
    let scrollEvent = {
      scrollLeft: event.target.scrollLeft
    }
    if (this.props.onScroll != null)
      this.props.onScroll(scrollEvent)
  }

  render = () => {
    let style = { display: 'flex', flexGrow: 0, width: '100%', backgroundColor: 'transparent', position: 'relative', borderBottom: 'solid 1px #ccc' }

    return <div className='functional-data-grid__horizontal-scrollbar' style={{...style}}>
      <div style={{display: 'flex'}}>
        { this.renderEmptyDiv(this.props.leftLockedColumnsWidth) }
      </div>
      <div style={{display: 'flex', overflow: 'auto', flexGrow: 1}} ref={(el) => this.scrollingDiv = el} onScroll={this.triggerOnScroll}>
        { this.renderEmptyDiv(this.props.freeColumnsWidth) }
      </div>
      <div style={{display: 'flex'}}>
        { this.renderEmptyDiv(this.props.rightLockedColumnsWidth) }
      </div>
      <div style={{ flexShrink: 0, width: '26px' }}></div>
    </div>
  }

  renderEmptyDiv = (width : number) => <div style={{width: `${width}px`, flexShrink: 0, minHeight: '1px'}} />
}