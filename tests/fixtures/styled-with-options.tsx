import React from 'react'
import ReactDOM from 'react-dom'
import emotion from '@emotion/styled'

interface Props {
  backgroundColor: string
}

const Wrapper = emotion('div', {
  label: 'Yes-This-Is-A-Label',
})(
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
