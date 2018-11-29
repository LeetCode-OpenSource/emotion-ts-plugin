import 'somepolyfill'
import { default as emotion } from '@emotion/styled'
import React from 'react'
import ReactDOM from 'react-dom'

interface Props {
  backgroundColor: string
}

const Wrapper = emotion('div')(
  {
    color: 'red',
  },
  (props: Props) => ({
    backgroundColor: props.backgroundColor,
  }),
)

export class SimpleComponent extends React.PureComponent {
  render() {
    return (
      <Wrapper backgroundColor="blue">
        <span>hello</span>
      </Wrapper>
    )
  }
}

ReactDOM.render(<SimpleComponent />, document.querySelector('#app'))
