import React from 'react'

function Button(props) {
  console.log('button props: ', props)
  function handleChange(event) {
    props.handleChange(event)
  }
  return <div className="text-center"><button className="basis-1/4 bg-transparent hover:bg-blue-700 border border-slate-300  font-bold py-2 px-4 rounded-md" onClick={handleChange}>  🦀 Mode   </button></div>
}

export { Button }
