import React from 'react'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled'

interface Props {
  backgroundColor: string
}

const Wrapper = styled('div')<Props>(
  {
    color: 'red',
  },
  (props) => ({
    backgroundColor: props.backgroundColor,
  }),
)

const WrapperPropertyAccess = styled.div<Props>(
  {
    color: 'yellow',
  },
  (props) => ({
    backgroundColor: props.backgroundColor,
  }),
)

const Parent = styled('div')({
  [`${Wrapper}`]: {
    fontSize: '100px',
  },
  [`${WrapperPropertyAccess}`]: {
    fontSize: '80px',
  }
})

export class SimpleComponent extends React.PureComponent {
  render() {
    return (
      <Parent>
        <Wrapper backgroundColor="blue">
          <span>hello</span>
        </Wrapper>
        <WrapperPropertyAccess backgroundColor="cyan">
          <span>world</span>
        </WrapperPropertyAccess>
      </Parent>
    )
  }
}

ReactDOM.render(<SimpleComponent />, document.querySelector('#app'))
