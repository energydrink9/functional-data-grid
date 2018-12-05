// @flow

import React from 'react'
import Constants from './Constants'
import { css } from 'emotion'

type FooterProps<T> = {
  style: Object,
  totalElements : number
}

const footerStyle = css`
  background-color: #eee;
  text-align: right;
  font-style: italic;
  flex-shrink: 0;
  flex-grow: 0;
  padding: 2px 10px;
`

export default class Footer<T> extends React.PureComponent<FooterProps<T>> {

  getStyle = () => ({
    ...this.props.style,
    lineHeight: Constants.defaultFooterHeight + 'px',
    height: Constants.defaultFooterHeight + 'px'
  })

  render = () => <div className={footerStyle} style={ this.getStyle() }>{ this.props.totalElements } elements</div>
}