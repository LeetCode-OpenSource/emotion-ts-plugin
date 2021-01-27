import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'
import ReactDOM from 'react-dom'

const styles = (props: any) =>
  css({
    color: 'red',
    background: 'yellow',
    width: `${props.scale * 100}px`,
  })

const Container = styled('button')`
  ${styles}
  ${() =>
    css({
      background: 'red',
    })}
`
export class SimpleComponent extends React.PureComponent {
  render() {
    return (
      <Container>
        <span>hello</span>
      </Container>
    )
  }
}

ReactDOM.render(<SimpleComponent />, document.querySelector('#app'))
