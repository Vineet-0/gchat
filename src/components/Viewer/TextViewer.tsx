import React from 'react'

const TextViewer = ({data}:{data:string}) => {
  return (
    <pre className="overflow-auto px-2 py-1 scrollbar-custom text-white whitespace-pre-wrap">{data}</pre>
  )
}

export default TextViewer