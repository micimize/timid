import React from 'react'
import Display from './Display'
import Editor from './Editor'

export default function Time({update, ...props}){
  return update ?
    <Editor update={update} {...props}/> :
    <Display {...props}/>
}

export { default as Bullet } from './Bullet'
