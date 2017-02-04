import React from 'react'
import t from 'tcomb'
import Time, { getTypeName, timeProps } from '../types'
import { format, formatMoment, formatDuration } from '../utils'
import MomentEditor from './MomentEditor'
import DurationEditor from './DurationEditor'
import Input from './MaskedInput'
import Bullet from './Bullet'
import Moment from 'moment'
import fromJSON from 'tcomb/lib/fromJSON'

if($ES.CONTEXT == 'BROWSER')
  require('./time.scss');

export default timeProps.extend({update: t.Function})(
  class TimeEditor extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        editing: 'moment',
        //flow: ['moment', 'duration']
      }
    }

    edit = editing => this.setState({ editing })

    formatters = {
      moment: formatMoment,
      duration: formatDuration,
    }

    select = key => this[key] && this[key].focus()

    wrap = (key, Component) => {
      let { update, time = Time({}) } = this.props
      //let flow = this.state.flow
      let select = this.select
      let props = {
        [key]: time[key],
        update({ action, ...obj }){
          update({time: Time(Object.assign({}, time, obj))})
          /*if(action){
            select( flow[flow.indexOf(key) + (action == 'CONTINUE_FLOW' ? 1 : -1)] )
            }*/
          //reference={ref => this[key] = ref}*/{/*ref={ref => this[key] = ref}
        }
      }

      return time[key] || this.state.editing == key ?
        <Component autoFocus={true} {...props}/> : (
        <button  className={`${key} add`} onClick={_=>this.edit(key)}>
          <i className="add"/>
          <i/>
        </button>
      )
    }

    render() {
      return (
        <div className="time editor">
          {this.wrap('moment', MomentEditor)}
          {this.wrap('duration', DurationEditor)}
        </div>
      )
    }
  }
)
