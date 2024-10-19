import React from 'react'

interface ModelData {
  text?: string;
}

const ModelBox = ({data}:{data:ModelData[]}) => {
  return (
    <div className='w-fit bg-blue-900 p-2 rounded-3xl rounded-bl-none'>
      {data.map((item, index) => (
        <div key={index}>
          {item.text ? (
            <p className='px-2'>{item.text}</p>
          ): null}
        </div>
      ))}
    </div>
  )
}

export default ModelBox