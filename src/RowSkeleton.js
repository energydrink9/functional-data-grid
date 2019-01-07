//@flow

import * as React from 'react'
import { css } from 'emotion'

type RowSkeletonProps = {
  leftLocked: ?React.Node,
  free: ?React.Node,
  rightLocked: ?React.Node,
  right: ?React.Node,
  scrollLeft: number,
  onScroll: Function,
  scrollbar: boolean,
  rightWidth: number
}

type RowSkeletonState = {
  scrollingDiv: ?HTMLElement
}

const leftLockedClassName = css`
  display: flex;
`
const freeClassName = (scrollbar: boolean) => css`
  display: flex;
  flex-grow: 1;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  -webkit-overflow-scrolling: touch;
`
const rightLockedClassName = css`
  display: flex;
`
const rightClassName = css`
  flex-shrink: 0;
`

export default class RowSkeleton extends React.PureComponent<RowSkeletonProps, RowSkeletonState> {

  constructor(props: RowSkeletonProps) {
    super(props)
    this.state = {
      scrollingDiv: null
    }
  }

  static defaultProps = {
    leftLocked: null,
    free: null,
    rightLocked: null,
    right: null,
    scrollbar: false,
    onScroll: () => {},
    scrollLeft: 0
  }

  componentDidUpdate = (prevProps: RowSkeletonProps) => {
    let scrollingDiv = this.state.scrollingDiv
    if (scrollingDiv != null && this.props.scrollLeft !== scrollingDiv.scrollLeft)
      this.updateScroll()
  }

  componentDidUpdate = (prevProps: RowSkeletonProps) => {
    let scrollingDiv = this.state.scrollingDiv
    if (scrollingDiv != null && this.props.scrollLeft !== scrollingDiv.scrollLeft)
      this.updateScroll()
  }

  componentDidUpdate = (prevProps: RowSkeletonProps) => {
    let scrollingDiv = this.state.scrollingDiv
    if (scrollingDiv != null && this.props.scrollLeft !== scrollingDiv.scrollLeft)
      this.updateScroll()
  }

  updateScroll = () => {
    let scrollingDiv = this.state.scrollingDiv
    if (scrollingDiv != null)
      scrollingDiv.scrollLeft = this.props.scrollLeft
  }

  triggerOnScroll = (event : Object) => {
    let scrollEvent = {
      scrollLeft: event.target.scrollLeft
    }
    if (this.props.onScroll != null)
      this.props.onScroll(scrollEvent)
  }

  render = () => {
    const { leftLocked, free, rightLocked, right, scrollLeft, onScroll, scrollbar, rightWidth, ...otherProps } = this.props;
    return <div {...otherProps}>
      <div className={`functional-data-grid__row__left-locked ${leftLockedClassName}`}>
        { leftLocked }
      </div>
      <div className={`functional-data-grid__row__free ${freeClassName(scrollbar)}`} ref={(el) => this.setState({ scrollingDiv: el }, () => this.updateScroll())} onScroll={this.triggerOnScroll}>
        <div style={{display: 'flex'}}>
          { free }
        </div>
      </div>
      <div className={`functional-data-grid__row__right-locked ${rightLockedClassName}`}>
        { rightLocked }
      </div>
      <div className={`functional-data-grid__row__right ${rightClassName}`} style={{width: `${rightWidth}px`}}>
        { right }
      </div>
    </div>
  }
}