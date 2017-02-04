import Moment from 'moment'

export function keyValue(obj){
  let key = Object.keys(obj)[0]
  let value = obj[key]
  return { key, value }
}

export function newPadLeft(padding, char='0'){
  function padLeft(str){
    return Array(padding-String(str).length+1).join(char)+str;
  }
  return padLeft
}

const padTwo = newPadLeft(2)

export function formatDateAshourMinute(date){
  return `${padTwo(date.getHours())}:${padTwo(date.getMinutes())}`
}

function ensureNumber(val){
  return typeof(val) == 'number' ? val : undefined 
}

export function formatMoment(moment){
  return moment instanceof Date ? formatDateAshourMinute(moment) :
    moment instanceof Moment ? moment.format('HH:mma') : ""
}

export function formatDuration(duration){
  return duration ? `${duration.hours() || 0}h, ${padTwo(duration.minutes() || 0)}m` : undefined
}

export function format({ moment, duration, fuzz } = {}){
  return [formatMoment(moment), duration ? formatMoment(moment.clone().add(duration)) : undefined].filter(f => f).join('-')
}

export function parseDuration(str='_h, __m'){
  let [hours, minutes] = str.split(/h, |m/).map(i => parseInt(i.replace(/_/g, '0')) || 0)
  return Moment.duration({
    hours, minutes
  })
}

export function parseMoment(str){
  if(!str)
    return;
  let m = Moment(str, 'hh:mm')
  if(m.isValid()){
    return m
  }
}

