// @flow

import React from 'react'

type CheckBoxFilterProps = {
  onUpdateFilter : Function
}
type CheckBoxFilterState = {
  value : ?null
}

export default class CheckBoxFilter extends React.PureComponent<CheckBoxFilterProps, CheckBoxFilterState> {
  
  constructor(props : Object) {
    super(props)
    this.state = {
      value : null
    }
  }

  render = () => <input type="checkbox" checked={this.state.value} onChange={this.triggerOnUpdateFilter} />

  triggerOnUpdateFilter = (event : Object) => {
    event.persist()
    this.setState({
      value: event.target.checked
    }, () => {
      this.props.onUpdateFilter((value) => value === this.state.value)
    })
  }
}