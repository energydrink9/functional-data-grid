//@flow

import * as React from 'react'

const columnsOptionsWidth = 26

type RowSkeletonProps = {
  leftLocked: ?React.Node,
  free: ?React.Node,
  rightLocked: ?React.Node,
  right: ?React.Node,
  scrollLeft: number,
  onScroll: Function,
  scrollbar: boolean
}

type RowSkeletonState = {
  scrollingDiv: ?HTMLElement
}

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
    let { leftLocked, free, rightLocked, right, scrollLeft, onScroll, scrollbar, ...otherProps } = this.props;
    return <div {...otherProps}>
      <div style={{display: 'flex'}}>
        { leftLocked }
      </div>
      <div style={{display: 'flex', overflow: scrollbar ? 'auto': 'hidden', flexGrow: 1}} ref={(el) => this.setState({ scrollingDiv: el }, () => this.updateScroll())} onScroll={this.triggerOnScroll}>
        { free }
      </div>
      <div style={{display: 'flex'}}>    
        { rightLocked }
      </div>
      <div style={{ flexShrink: 0, width: `${columnsOptionsWidth}px` }}>
        { right }
      </div>
    </div>
  }
}