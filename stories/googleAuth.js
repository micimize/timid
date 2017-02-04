import React from 'react'
import { storiesOf } from '@kadira/storybook'
import AuthenticationButton from '../src/google-calendar/components/AuthenticationButton'

export default storiesOf('Google Authentication', module)
  .add('Button', () => (
    <AuthenticationButton onSuccess={_=>alert('authenticated!')}/>
  ))
