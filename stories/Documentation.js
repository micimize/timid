import React from 'react';
import { storiesOf } from '@kadira/storybook'

const styles = {
  main: {
    margin: 15,
    maxWidth: 600,
    lineHeight: 1.4,
    fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
  },

  logo: {
    width: 200,
  },

  link: {
    color: '#1474f3',
    textDecoration: 'none',
    borderBottom: '1px solid #1474f3',
    paddingBottom: 2,
  },

  code: {
    fontSize: 15,
    fontWeight: 600,
    padding: "2px 5px",
    border: "1px solid #eae9e9",
    borderRadius: 4,
    backgroundColor: '#f3f2f2',
    color: '#3a3a3a',
  },
};

function ReadMe(){
  return (
    <div style={styles.main}>
      <h1>Journal Storybook</h1>
      <ul>
        <li>
          Stories are defined in <code style={styles.code}>src/stories</code>
        </li>
        <li>
          A story is a single state of one or more UI components.
        </li>
        <li>
          Use stories to develop components in isolation, like visual, hot-reloading UX test cases
        </li>
      </ul>
    </div>
  )
}

export default storiesOf('Documentation', module)
  .add('Read Me', ReadMe)
