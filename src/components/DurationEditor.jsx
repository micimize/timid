import React from 'react'
import { format, formatDuration, parseDuration } from '../utils'
import Input from './MaskedInput'
import Moment from 'moment'

export default class DurationEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        mask: `ih, M1m`,
        placeholder: '0h, 00m'
      } 
    }
  }

  format = formatDuration
  parse = parseDuration

  onChange = ({ target: { value } }) => {
    let duration = this.parse(value) 
    if(duration.asMinutes() <= 0)
      duration = undefined;
    this.setState({ value })
    this.props.update({ duration })
  }

  add = (num, str) => {
    let duration = this.props.duration ?
      this.props.duration.add(num, str) : 
      Moment.duration(num, str)
    duration = duration.asMinutes() <= 0 ? undefined : duration
    this.setState({ value: undefined })
    this.props.update({ duration })
  }

  //onEmpty = () => this.props.update({ action: 'PREVIOUS_IN_FLOW' })

  //onFull = () => this.props.update({ action: 'CONTINUE_FLOW' })
  //{/*onFull={this.onFull} onEmpty={this.onEmpty} reference={ref => this.props.reference && this.props.reference(ref)}*/}

  render() {
    return (
      <div className="duration editor">
        <Input onChange={this.onChange} autoFocus={this.props.autoFocus} config={this.state.config} 
          value={this.state.value || this.format(this.props.duration) || ""}/>
        <div className="minute controls">
          <button className="increment" onClick={_ => this.add(15, 'minutes')}>
            +15m
          </button>
          <button className="decrement" disabled={!this.props.duration || this.props.duration.asMinutes() <= 0}
            onClick={_ => this.add(-15, 'minutes')}>
            -15m
          </button>
        </div>
      </div>
    )
  }
}
