import React, { Component } from "react"
import ReactDOM from "react-dom"

console.log('ping')

export default class TextForm extends Component {
  constructor(props) {
    super(props)
    console.log('props: ', props)
//    this.state = {value: props.value}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(event) {
    this.props.handleChange(event)
  }
  handleSubmit(event) {
    event.preventDefault()
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="grid place-items-center justify-items-center text-xl">
            <input className="flex grow border-black w-1/2 block bg-white border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-center" type="text" value={this.props.value} onChange={this.handleChange} />
      </form>
    );
  }
}

