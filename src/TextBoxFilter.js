// @flow

import React from 'react'

type TextBoxFilterProps = {
  onUpdateFilter : Function
}
type TextBoxFilterState = {
  value : string
}

export default class TextBoxFilter extends React.PureComponent<TextBoxFilterProps, TextBoxFilterState> {

  props: TextBoxFilterProps
  state: TextBoxFilterState

  constructor(props : Object) {
    super(props)
    this.state = {
      value : ''
    }
  }

  render = () => <input type="text" style={{width: '100%', boxSizing: 'border-box', padding: '2px 5px', backgroundColor: '#eee', border: 'solid 1px #ccc', color: '#000'}} onChange={this.triggerOnUpdateFilter} />

  triggerOnUpdateFilter = (event : Object) => {
    event.persist()
    this.props.onUpdateFilter((value) => (value == null ? '' : value.toString()).toUpperCase().includes(event.target.value.toUpperCase()))
  }
}
