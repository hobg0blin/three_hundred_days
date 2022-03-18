import React, {useState} from "react"

// Trying out functional React, for a good time
// TODO: if professionalized, refactor whole app to be functional
function FontSelector(props) {
  const [currentFont, setFont] = useState(0)

  function handleChange(event) {
    console.log('evt: ', event)
    setFont(event.target.value)
    console.log('key: ', event.target.index)
    props.onChange({font: props.fonts[event.target.index]})
  }

  const fonts = props.fonts.map((font, idx) => {
    return <option  key={ idx }value={font.familyName} onClick={handleChange}>{font.familyName + ' ' + font.cssFontWeight[0].toUpperCase() + font.cssFontWeight.slice(1)}</option>
  })
  return <div className="w-full basis-1/4 mx-auto text-center my-3"><select className="basis-1/4 mt-1 px-3 py-2 bg-blue-600 border w-400 border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 my-5" defaultValue={currentFont} >
    {fonts}
  </select>
  </div>

}

export {FontSelector}
