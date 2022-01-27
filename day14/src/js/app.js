import Config from './data/config';
import Detector from './utils/detector';
import Texture from './app/main';
import React, { Component } from "react"
import ReactDOM from "react-dom"
import { TextForm, fonts } from './components/React/TextForm'

// Styles
import '../css/main.css'

// Check environment and set the Config helper
if(__ENV__ === 'dev') {
  console.log('----- RUNNING IN DEV ENVIRONMENT! -----')

  Config.isDev = true
}

const defaultText = "A Goat Eating Dough In A PolyEthylene Bag"

const mappedFonts = fonts.map(font => {
  return {name: font.familyName, font: font}
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { value: defaultText, font: "helvetiker" }
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
      this.three = new Texture(this.state.value)
    //TODO: should prob rename this
    this.three.render(20)
  }
  handleChange(event) {
    console.log('new val: ', event)
    if (event.hasOwnProperty("font")) {
    this.setState({font: event.font}, () => {
      this.three.updateText({ font: this.state.font})
  })
    }
    if (event.hasOwnProperty("value")) {
    this.setState({value: event.value}, () => {
      this.three.updateText({ value: this.state.value })
  })

    }
  }
  render() {
    return (
      <div className="grid grid-cols-1">
        <TextForm handleChange={this.handleChange} value={this.state.value }/>
      </div>
    );
  }
}

const rootEl = document.getElementById("root")
ReactDOM.render(<App value={defaultText}/>, rootEl)

