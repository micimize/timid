import React from 'react'
import Moment from 'moment'
import { getTypeName } from '../types'

if($ES.CONTEXT == 'BROWSER')
  require('./bullet.scss');


function radians (angle) {
  return angle * (Math.PI / 180);
}

function lineProps({radius, degrees, length}){
  let x2 = radius + (length * Math.sin(radians(degrees)))
  let y2 = radius - (length * Math.cos(radians(degrees)))
  return { x1: radius, y1: radius, x2, y2 }
}

function Hand({radius, degrees, length, ...rest}){
  return <line {...lineProps({radius, degrees, length})} {...rest}/>
}

function HandWithDuration({ className, degreeMultiplier, start, end, ...rest }){
  let s = lineProps({degrees: degreeMultiplier * start, ...rest})
  let e = lineProps({degrees: degreeMultiplier * end, ...rest})
  var d = `M${s.x1},${s.y1} L${s.x2},${s.y2} A${s.x1},${s.y1} 0 0,1 ${e.x2},${e.y2} z` //1 means clockwise
  return <g className={`${className} duration`} >
    <path d={d} {...rest}/>
    <line className={`${className} end`} {...e} />
    <line className={`${className} start`} {...s} />
  </g>
}


function getEnd({moment, duration=Moment.duration(15, 'minutes')}){
  return Moment(moment).add(duration || 0)
}

function HandFromField({
  time: {moment = Moment({hour: 0}), duration} = {},
  field, degreeMultiplier, ...rest
}){
  return duration ? (
    <HandWithDuration className={field} degreeMultiplier={degreeMultiplier}
      start={moment[field]()} end={getEnd({moment, duration})[field]()} {...rest} />
  ) : <Hand className={field} degrees={degreeMultiplier * moment[field]()} {...rest}/>
}

export default function Bullet({ time }) {
  let radius = 50
  return (
    <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`}
         className={`time bullet ${getTypeName(time).toLowerCase()}`} >
      <circle cx={radius} cy={radius} r={radius} />
      <HandFromField time={time} field="minutes" length={40} degreeMultiplier={6} {...{radius, }}/>
      <HandFromField time={time} field="hours" length={30} degreeMultiplier={30} {...{radius, }}/>
    </svg>
  )
}
