import { FC } from 'react'
import dot from './dot.png'
import { Button, Menu } from 'antd'
import useTheme from './useTheme'

export interface AppProps {
  environment: string
  dialog: () => void
}

const App: FC<AppProps> = ({ environment, dialog }) => {
  useTheme()

  return (
    <>
      <Menu mode='horizontal'>
        <Menu.Item key='name'>Group Game</Menu.Item>
      </Menu>
      Environment: {environment} <br />
      <img src={dot} alt='Dot' />
      <Button onClick={dialog}>Show dialog</Button>
    </>
  )
}

export default App
