import React from 'react'
export default function Skeleton({ className='h-4 w-full bg-gray-200 rounded' }){
  return <div className={`animate-pulse ${className}`} />
}
