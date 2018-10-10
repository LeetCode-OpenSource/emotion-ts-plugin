import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'react-emotion'

interface Props {
  backgroundColor: string
}

const Wrapper = styled('div')(
  {
    color: 'red',
  },
  (props: Props) => ({
    backgroundColor: props.backgroundColor,
  }),
)

const Parent = styled('div')({
  [`${Wrapper}`]: {
    fontSize: '100px',
  }
})

export class SimpleComponent extends React.PureComponent {
  render() {
    return (
      <Parent>
        <Wrapper backgroundColor="blue">
          <span>hello</span>
        </Wrapper>
      </Parent>
    )
  }
}

ReactDOM.render(<SimpleComponent />, document.querySelector('#app'))
