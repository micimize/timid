import React from 'react'
import Moment from 'moment'
import { storiesOf } from '@kadira/storybook'
import Wrapper from './ControlledEditableWrapper'

import Entry, { Record, RecordChronicle } from '../src/entry/components'
import * as types from '../src/time/types'

const record = {
  time: {
    moment: Moment(),
    duration: Moment.duration(15, 'minutes')
  },
  title: "Ate breakfast"
}

export default storiesOf('Journal Record', module)
  .add('Record', () => (
    <Wrapper editing={false}
      time={record.time}
      title="Ate a sandwich">
      <Record />
    </Wrapper>
  ))
  .add('Record Editor', () => (
    <Wrapper editing={true}>
      <Record />
    </Wrapper>
  ))
  .add('Record Chronicle', () => (
    <Wrapper editing={true} records={[record]}>
      <RecordChronicle/>
    </Wrapper>
  ))
  .add('Full Entry', () => (
    <Wrapper editing={false} {...{ date: Moment({hour: 0}), records: [record] }}>
      <Entry/>
    </Wrapper>
  ))
