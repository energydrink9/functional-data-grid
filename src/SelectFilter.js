// @flow

import React from 'react'
import {List} from 'immutable'

type SelectFilterProps = {
  choices : List<[string, any]>,
  onUpdateFilter : Function
}
type SelectFilterState = {
  value : ?any
}

export default class SelectFilter extends React.Component<SelectFilterProps, SelectFilterState> {

  props: SelectFilterProps
  state: SelectFilterState

  constructor(props : Object) {
    super(props)
    this.state = {
      value : null
    }
  }

  render = () => <select style={{width: '100%', boxSizing: 'border-box', padding: '2.5px'}} onChange={this.triggerOnUpdateFilter}>
    <option key={-1} value={''} />
    { this.props.choices.map((c, index) => <option key={index} value={c[1]}>{ c[0] }</option>) }
  </select>

  triggerOnUpdateFilter = (event : Object) => {
    event.persist()
    this.props.onUpdateFilter((value) => event.target.value === '' || (value === event.target.value))
  }
}
