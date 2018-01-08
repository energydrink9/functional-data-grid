// @flow

import React from 'react'

type CheckBoxFilterProps = {
  onUpdateFilter : Function
}
type CheckBoxFilterState = {
  value : string
}

export default class CheckBoxFilter extends React.Component<CheckBoxFilterProps, CheckBoxFilterState> {

  props: CheckBoxFilterProps
  state: CheckBoxFilterState

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