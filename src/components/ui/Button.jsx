import React from 'react'
export default function Button({ children, className='', ...props }){
  return <button className={`px-3 py-2 rounded-md bg-primary-500 text-white hover:opacity-95 ${className}`} {...props}>{children}</button>
}
