import React from 'react'
import t from 'tcomb'
import { getTypeName, timeProps } from '../types'
import { format, formatMoment, formatDuration } from '../utils'

if($ES.CONTEXT == 'BROWSER')
  require('./time.scss');

function MomentDisplay({ moment }){
  return <time className="moment">{ formatMoment(moment) }</time>
}

function DurationDisplay({ duration }){
  return <time className="duration">{ formatDuration(duration) }</time>
}

export default timeProps(
  function TimeDisplay({ time = {}, className, ...props }){
    let type = getTypeName(time).toLowerCase()
    return (
      <div className={`time ${type} ${className}`} {...props}>
        { ['interval', 'moment'].includes(type) && <MomentDisplay moment={time.moment}/> }
        { ['interval', 'duration'].includes(type) && <DurationDisplay duration={time.duration}/> }
      </div>
    )
  }
)
