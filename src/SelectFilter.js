// @flow

import React from 'react'
import {List} from 'immutable'

export default class SelectFilter extends React.Component {

  props: {
    choices : List<[string, any]>,
    onUpdateFilter : Function
  }

  state: {
    value : ?any
  }

  constructor(props : Object) {
    super(props)
    this.state = {
      value : null
    }
  }

  render = () => <select style={{width: '100%', padding: '2.5px'}} onChange={this.triggerOnUpdateFilter}>
    <option key={-1} value={''} />
    { this.props.choices.map((c, index) => <option key={index} value={c[1]}>{ c[0] }</option>) }
  </select>

  triggerOnUpdateFilter = (event : Object) => {
    event.persist()
    this.props.onUpdateFilter((value) => event.target.value === '' || (value === event.target.value))
  }
}