// @flow

import React from 'react'

export default class CheckBoxFilter extends React.Component {

  props: {
    onUpdateFilter : Function
  }

  state: {
    value : string
  }

  constructor(props : Object) {
    super(props)
    this.state = {
      value : ''
    }
  }

  render = () => <input type="checkbox" onChange={this.triggerOnUpdateFilter} />

  triggerOnUpdateFilter = (event : Object) => {
    event.persist()
    this.props.onUpdateFilter((value) => value === event.target.checked)
  }
}