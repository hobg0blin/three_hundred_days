import React, { Component } from "react"
import ReactDOM from "react-dom"
import { FontSelector } from './fontSelector.js'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
import helvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json'
import optimerRegular from 'three/examples/fonts/optimer_regular.typeface.json'
import optimerBold from 'three/examples/fonts/optimer_bold.typeface.json'
import gentilisRegular from 'three/examples/fonts/gentilis_regular.typeface.json'
import gentilisBold from 'three/examples/fonts/gentilis_bold.typeface.json'
import droidSans from 'three/examples/fonts/droid/droid_sans_regular.typeface.json'
import droidSansBold from 'three/examples/fonts/droid/droid_sans_bold.typeface.json'
import droidSerif from 'three/examples/fonts/droid/droid_serif_regular.typeface.json'
import droidSerifBold from 'three/examples/fonts/droid/droid_serif_bold.typeface.json'

let fonts = [helvetiker, helvetikerBold, optimerRegular, optimerBold, gentilisRegular, gentilisBold, droidSans, droidSansBold, droidSerif, droidSerifBold]
console.log('fonts: ', fonts)

class TextForm extends Component {
  constructor(props) {
    super(props)
    console.log('props: ', props)
//    this.state = {value: props.value}
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleFontChange = this.handleFontChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleTextChange(event) {
    console.log('text')
    this.props.handleChange({'value': event.target.value})
  }
  handleFontChange(event) {
    console.log('evt', event)
    this.props.handleChange(event)
  }

  handleSubmit(event) {
    event.preventDefault()
  }
  render() {
    return (
      <div className="grid-cols-1 justify-items-center place-items-center items-center">
      <form onSubmit={this.handleSubmit} className="grid place-items-center justify-items-center text-xl border-solid border-black w-full">
            <input className="flex grow border-black w-1/2 block bg-white border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-center bg-green-400" type="text" value={this.props.value} onChange={this.handleTextChange} />
      </form>
      </div>
    );
  }
}
export { TextForm, fonts}
