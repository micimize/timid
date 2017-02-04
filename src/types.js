import t from 'tcomb'
import { propTypes } from 'tcomb-react'
import _moment from 'moment'
import { props } from '../utils'
import installTypeFormatter from 'tcomb/lib/installTypeFormatter'
import fromJSON from 'tcomb/lib/fromJSON'
installTypeFormatter()

const _Moment = t.irreducible('moment', m => _moment.isMoment(m))
_Moment.fromJSON = str => _moment(str)

const _Duration = t.irreducible('Duration', _moment.isDuration)
_Duration.fromJSON = str => _moment.duration(str)

const Instant = t.struct({ }, 'Instant') 

const Duration = t.struct({
  duration: _Duration
}, 'Duration')

const Fuzz = t.struct({
  fuzz: t.maybe(_Duration)
}, 'Fuzz')

const Moment = Instant.extend([{
  moment: _Moment
}, Fuzz], 'Moment')

const Interval = Moment.extend(Duration, 'Interval')

const TimeTypes = { Instant, Duration, Moment, Interval }

const Time = t.union(Object.values(TimeTypes), 'Time')

export function getTypeName(t = {}){
  let { moment, duration } = t
  if(moment && duration)
    return 'Interval';
  if(moment)
    return 'Moment';
  if(duration)
    return 'Duration';
  return 'Instant'
}

Time.dispatch = function dispatch(t) {
  return TimeTypes[getTypeName(t)]
}

const CalendarDate = t.refinement(_Moment, date => {
  for (let unit of ['hour', 'minute', 'second', 'millisecond']){
    if (date.get(unit)){
      return false;
    }
  }
  return true
}, 'CalendarDate')

export const timeProps = props({ time: Time })
export { Instant, Duration, Moment, Interval, CalendarDate  }
export default Time

function addFromJSONType(type, jsonType, func){
  let deserializers = Symbol('deserializers')
  if(!type[deserializers]){
    type[deserializers] = {
      default(json) {
        let _fromJSON = type.fromJSON
        type.fromJSON = undefined
        let result = fromJSON(json, type)
        type.fromJSON = _fromJSON
        return result
      }
    }
    type.fromJSON = function fromJSON(json){
      return (type[deserializers][typeof(json)] || type[deserializers].default)(json)
    }
  }
  type[deserializers][jsonType] = func
}


Instant.prototype.toJSON = function toJSON(){
  return ''
}
Moment.prototype.toJSON = function toJSON(){
  if(this.fuzz){
    return this.moment.toJSON() + '~' + this.fuzz.toJSON()
  }
  return this.moment.toJSON()
}
Duration.prototype.toJSON = function toJSON(){
  return '/' + this.duration.toJSON()
}
Interval.prototype.toJSON = function toJSON(){
  return Moment.prototype.toJSON.bind(this)() + Duration.prototype.toJSON.bind(this)()
}

addFromJSONType(Time, 'string', function fromJSON(str){
  let moment, fuzz, duration;
  let [fuzzyMoment, durationStr = undefined] = str.split('/')
  if (fuzzyMoment) {
    let [momentStr, fuzzStr = undefined] = fuzzyMoment.split('~')
    moment = _moment(momentStr)
    if(fuzzStr){
      fuzz = _moment.duration(fuzzStr)
    }
  }
  if (durationStr){
    duration = _moment.duration(durationStr)
  }
  return Object.assign(
    moment ? {moment} : {},
    fuzz ? { fuzz } : {},
    duration ? { duration } : {})
})

if($ES.CONTEXT == 'BROWSER'){
  window.Time = Time
  window._moment = _moment
}
