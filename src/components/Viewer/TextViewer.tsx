import React from 'react'

const TextViewer = ({text}:{text:string}) => {
  return (
    <pre className="overflow-auto px-2 py-1 scrollbar-custom text-white whitespace-pre-wrap">{text}</pre>
  )
}

export default TextViewer