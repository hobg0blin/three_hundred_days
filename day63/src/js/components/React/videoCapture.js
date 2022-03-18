import React, {useEffect} from 'react'
function VideoCapture(props) {
  function stream() {
    if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
      navigator.mediaDevices.enumerateDevices().then(devices=> {
        console.log('devices: ', devices)
        const constraints = { video: {deviceId: devices[1].deviceId, width: 1280, height: 720, facingMode: 'user' } };
      navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {
        // apply the stream to the video element used in the texture
        video.srcObject = stream;
        video.play();
      } ).catch( function ( error ) {
        console.error( 'Unable to access the camera/webcam.', error );
      } );
    })
    } else {
      console.error( 'MediaDevices interface not available.' );
      }
  }
  useEffect(() => {
    stream()
  })

  return <video id ="video" style={{display:'none'}} autoPlay playsInline></video>
}

export { VideoCapture }
