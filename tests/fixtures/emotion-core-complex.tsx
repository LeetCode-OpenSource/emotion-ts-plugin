import React from 'react'
import { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { css } from '@emotion/react'

const className = css({
  color: 'red',
  background: 'yellow',
})

export class SimpleComponent extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <div css={className}>
          <span>hello</span>
        </div>
      </React.Fragment>
    )
  }
}

ReactDOM.render(<SimpleComponent />, document.querySelector('#app'))
