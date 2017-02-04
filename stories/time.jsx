import React from 'react'
import Moment from 'moment'
import { storiesOf } from '@kadira/storybook'
import Wrapper from './ControlledEditableWrapper'

import Time from '../src/time/components/index'
import TimeBullet from '../src/time/components/Bullet'
import TimeEditor, { MomentEditor, DurationEditor } from '../src/time/components/Editor'

export default storiesOf('Time', module)
  .add('Time Component', () => (
    <Wrapper editing={false}>
      <Time/>
    </Wrapper>
  ))
  .add('Time Editor', () => (
    <Wrapper editing={true}>
      <TimeEditor/>
    </Wrapper>
  ))
  .add('Moment Editor', () => (
    <Wrapper editing={true}>
      <MomentEditor/>
    </Wrapper>
  ))
  .add('Duration Editor', () => (
    <Wrapper editing={true}>
      <DurationEditor/>
    </Wrapper>
  ))
  .add('Time Bullet', () => (
    <TimeBullet time={{
      moment: Moment(),
      duration: Moment.duration(15, 'minutes') }}/>
  ))
