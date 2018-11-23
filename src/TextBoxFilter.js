// @flow

import React from 'react'

type TextBoxFilterProps = {
  onUpdateFilter : Function
}

export default class TextBoxFilter extends React.PureComponent<TextBoxFilterProps> {

  constructor(props : Object) {
    super(props)
  }

  render = () => <input type="text" style={{width: '100%', boxSizing: 'border-box', padding: '2px 5px', backgroundColor: '#eee', border: 'solid 1px #ccc', color: '#000'}} onChange={this.triggerOnUpdateFilter} />

  triggerOnUpdateFilter = (event : Object) => {
    event.persist()
    this.props.onUpdateFilter((value) => (value == null ? '' : value.toString()).toUpperCase().includes(event.target.value.toUpperCase()))
  }
}
