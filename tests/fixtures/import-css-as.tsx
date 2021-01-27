import { css as emotionCss } from '@emotion/react'
import React from 'react'
import ReactDOM from 'react-dom'

const className = emotionCss({
  color: 'red',
  background: 'yellow',
})

export class SimpleComponent extends React.PureComponent {
  render() {
    return (
      <div css={className}>
        <span>hello</span>
      </div>
    )
  }
}

ReactDOM.render(<SimpleComponent />, document.querySelector('#app'))
