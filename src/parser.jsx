/** @jsx createElement */
import { Time, TimeDuration } from 'elliptical-datetime'
import { String } from 'elliptical-string'
import { createElement, compile } from 'elliptical'

const parser = compile(
  <sequence>
    {/*<choice id='fuzz'>
      <literal text='~'/>
      <literal text='about'/>
      <literal text='roughly'/>
    </choice>*/}
    <Time id='moment' optional prepositions />
    <repeat separator={<literal text=' '/>} min={0} >
      <choice>
        <literal text="" />
        <literal text="for" />
      </choice>
    </repeat>
    <TimeDuration id='duration' optional prepositions />
  </sequence>
)

export function parse(str){
  let [ { score = 0, result } = {} ] = parser(str)
  window.parsed = parser(str)
  return result
    /*if(score == 1)
      return result;*/
}
