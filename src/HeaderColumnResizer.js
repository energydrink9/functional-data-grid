// @flow

import React from 'react'

type HeaderColumnResizerProps = {
  right : number,
  onResize : Function
}
type HeaderColumnResizerState = {
  clicked : boolean,
  hover: boolean
}

export default class HeaderColumnResizer extends React.PureComponent<HeaderColumnResizerProps, HeaderColumnResizerState> {

  element : any;

  constructor(props : Object) {
    super(props)
    this.state = {
      clicked : false,
      hover: false
    }
  }

  render = () => {
    let style : Object = {
      position: 'absolute',
      right: '-10px',
      top: 0,
      bottom: 0,
      width: '20px',
      backgroundColor: 'transparent',
      cursor: 'col-resize',
      opacity: 0,
      zIndex: 1
    }
    if (this.state.clicked || this.state.hover)
      style.opacity = 1

    return <div ref={el => this.element = el} style={style} onMouseDown={this.onMouseDown} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
      </div>
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

  onMouseDown = (e : Object) => {

    e.preventDefault()

    if (document.body != null) {

      this.setState({
        clicked: true
      })

      let diff = e.clientX - this.props.right
      let mouseMoveListener = (e : Object) => {
        let currentPosition = e.clientX - diff
        this.props.onResize(currentPosition)
      }

      if (document.body != null)
        document.body.addEventListener('mousemove', mouseMoveListener)

      let mouseUpOutListener = (e : Object) => {
        this.setState({
          clicked: false
        })
        if (document.body != null)
          document.body.removeEventListener('mousemove', mouseMoveListener)
        if (document.body != null)
          document.body.removeEventListener('mouseup', mouseUpOutListener)
      }
      if (document.body != null)
        document.body.addEventListener('mouseup', mouseUpOutListener)
    }
  }
}
