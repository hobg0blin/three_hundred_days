
//FIXME: still using global state variable, would ideally refactor -- base all this on promises?
const currentKeys = {}

function MIDILogger() {
  if (navigator.requestMIDIAccess) {
    console.log('MIDILogger: midi supported')
    navigator.requestMIDIAccess().then((midi) => {
        console.log('midi: ', midi)
        startLoggingMIDIInput(midi)
    })
  } else {
    console.log('MIDILogger: midi not supported')
  }
}

function onMIDIMessage( event) {
  if (event.data[0] == 144 && event.data[2] > 0 ) {
                //subtract 48 bc thats minimum key code
    currentKeys[event.data[1]] = 'on'
  }
  if (event.data[2] == 0) {
    console.log('note off: ', event.data)
//                keyboard[event.data[1] - 48].scale(1)
    currentKeys[event.data[1]] = 'off'
  }
//            console.log('current keys: ', currentKeys)
           }

function startLoggingMIDIInput( midiAccess) {
    for (var input of midiAccess.inputs.values()) {
      input.onmidimessage = onMIDIMessage
    }
  }

export { MIDILogger, currentKeys }
