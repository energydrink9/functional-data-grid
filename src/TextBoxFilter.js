// @flow

import React from 'react'

export default class TextBoxFilter extends React.Component {

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

  render = () => <input type="text" style={{width: '100%', padding: '2px 5px', backgroundColor: '#eee', border: 'solid 1px #ccc', color: '#000'}} onChange={this.triggerOnUpdateFilter} />

  triggerOnUpdateFilter = (event : Object) => {
    event.persist()
    this.props.onUpdateFilter((value) => (value == null ? '' : value.toUpperCase()).toString().includes(event.target.value.toUpperCase()))
  }
}
