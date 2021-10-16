import { FC, ReactNode } from 'react'
import dot from './dot.png'
import { Button, Menu, Typography } from 'antd'
import useTheme from './useTheme'
import { BranchesOutlined } from '@ant-design/icons'

const { Text } = Typography

export interface AppProps {
  environment: {
    tagPrefix: string
    displayName: string
  }
  version: string
  dialog: () => void
  getLink: (url: string, contents: ReactNode) => ReactNode
}

const App: FC<AppProps> = ({ environment: { tagPrefix, displayName }, dialog, version, getLink }) => {
  useTheme()

  return (
    <>
      <Menu mode='horizontal' selectedKeys={[]}>
        <Menu.Item key='name' icon={<BranchesOutlined />}>
          {getLink(`https://github.com/ChocolateLoverRaj/group-game/releases/tag/${tagPrefix}-v${version}`, <>Group Game <Text type='secondary'>v{version}</Text></>)}
        </Menu.Item>
      </Menu>
      Environment: {displayName} <br />
      <img src={dot} alt='Dot' />
      <Button onClick={dialog}>Show dialog</Button>
    </>
  )
}

export default App
