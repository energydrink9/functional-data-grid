// @flow

import React from 'react'
import { List } from 'immutable'

const defaultFooterHeight = 22

type FooterProps<T> = {
  style: Object,
  totalElements : number
}

export default class Footer<T> extends React.Component<FooterProps<T>> {
  render = () => {
    let style={ backgroundColor: '#eee', textAlign: 'right', fontStyle: 'italic', lineHeight: defaultFooterHeight + 'px', height: defaultFooterHeight + 'px', flexShrink: 0, flexGrow: 0, padding: '2px 10px' }

    return  <div style={{ ...style, ...this.props.style }}>{ this.props.totalElements } elements</div>
  }
}