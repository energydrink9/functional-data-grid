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
  value : ?moment,
  operator: string
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
      value : null,
      operator: 'eq'
    }
  }

  updateOperator = (e: Object) => {
    let operator = e.target.value
    this.setState({
      operator: operator
    }, () => this.updateFilter())
  }

  render = () => <div style={{ display: 'flex', textAlign: 'center' }}>
    <select value={this.state.operator} onChange={this.updateOperator} style={{ marginRight: '4px' }}>
      <option value="le">&le;</option>
      <option value="eq">=</option>
      <option value="ge">&ge;</option>
    </select>
    <DatePicker selected={this.state.value} isClearable={true} customInput={<CustomInput />} onChange={this.triggerOnUpdateFilter}
      showYearDropdown
      dropdownMode="select"  
      popperContainer={this.container}
      {...this.props}
    ></DatePicker>
  </div>

  triggerOnUpdateFilter = (value : moment) => {
    this.setState({
      value: value
    }, () => this.updateFilter())
  }

  updateFilter = () => {
    let value = this.state.value
    this.props.onUpdateFilter((val: moment) => {
      return value == null
        || (this.state.operator === 'le' && value.isSameOrAfter(val, 'day'))
        || (this.state.operator === 'eq' && value.isSame(val, 'day'))
        || (this.state.operator === 'ge' && value.isSameOrBefore(val, 'day'))
    })
  }
}
