import { useContext } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu, Typography, MenuItemProps, Badge } from 'antd'
import Context from './Context'
import { BranchesOutlined, SettingOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { game } from './Game'

const { Text } = Typography

const menuItems: Record<string, MenuItemProps> = {
  '': { children: 'Group Game' },
  settings: { icon: <SettingOutlined />, children: 'Settings' }
}

const Header = observer(() => {
  const { tagPrefix, version, getLink } = useContext(Context)
  const { pathname } = useLocation()

  return (
    <Menu mode='horizontal' selectedKeys={[pathname.slice(1)]}>
      {Object.entries(menuItems).map(([path, props]) =>
        <Menu.Item key={path} {...props}>
          <Badge dot={path === '' && game.playing && pathname !== '/'}>
            <Link to={path}>{props.children}</Link>
          </Badge>
        </Menu.Item>)}
      <Menu.Item key='github' icon={<BranchesOutlined />}>
        {getLink(
          `https://github.com/ChocolateLoverRaj/group-game/releases/tag/${tagPrefix}-v${version}`,
          <Text type='secondary'>v{version}</Text>)}
      </Menu.Item>
    </Menu>
  )
})

export default Header
