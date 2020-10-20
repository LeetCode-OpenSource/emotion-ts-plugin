import React from 'react'
import ReactDOM from 'react-dom'
import emotion from '@emotion/css'

const className = emotion.css({
  color: 'red',
  background: 'yellow',
})

export class SimpleComponent extends React.PureComponent {
  render() {
    return (
      <div className={className}>
        <span>hello</span>
      </div>
    )
  }
}

ReactDOM.render(<SimpleComponent />, document.querySelector('#app'))
