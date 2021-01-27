import styled from '@emotion/styled'
import ReactDOM from 'react-dom'

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
