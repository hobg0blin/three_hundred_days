import Config from './data/config';
import Detector from './utils/detector';
import Texture from './app/main';
import React, { Component } from "react"
import ReactDOM from "react-dom"
import TextForm from './components/React/TextForm'

// Styles
import '../css/assets/main.css'

// Check environment and set the Config helper
if(__ENV__ === 'dev') {
  console.log('----- RUNNING IN DEV ENVIRONMENT! -----')

  Config.isDev = true
}

const defaultText = "A Squid Eating Dough In A PolyEthylene Bag"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { value: defaultText }
    this.three
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
      this.three = new Texture(this.state.value)
    //TODO: should prob rename this
    this.three.render(20)
  }
  handleChange(event) {
    console.log('new val: ', event.target.value)
    this.setState({value: event.target.value}, () => {
      this.three.updateText(this.state.value)
    })
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

