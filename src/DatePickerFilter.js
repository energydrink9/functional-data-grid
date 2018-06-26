// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker-cssmodules.css'

type DatePickerFilterProps = {
  onUpdateFilter : Function,
}
type DatePickerFilterState = {
  value : ?moment
}

const style = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '2px 5px',
  backgroundColor: '#eee',
  border: 'solid 1px #ccc',
  color: '#000'
}

class CustomInput extends React.Component<Object> {
  props: Object
  
  render = () =>
    <input type="text" value={this.props.value} readOnly onClick={this.props.onClick} style={style}></input>
}

export default class DatePickerFilter extends React.Component<DatePickerFilterProps, DatePickerFilterState> {

  props: DatePickerFilterProps
  state: DatePickerFilterState

  container = ({children} : any) => {
    const el = document.body
  
    return ReactDOM.createPortal(
      children,
      el
    )
  }
  
  constructor(props : Object) {
    super(props)
    this.state = {
      value : null
    }
  }

  render = () => <DatePicker selected={this.state.value} isClearable={true} customInput={<CustomInput />} onChange={this.triggerOnUpdateFilter} {...this.props}
  popperContainer={this.container}
  ></DatePicker>

  triggerOnUpdateFilter = (value : moment) => {
    this.setState({
      value: value
    })
    this.props.onUpdateFilter((val: moment) => {
      return value == null || (value.isSame(val, 'day'))
    })
  }
}
