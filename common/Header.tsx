import { FC, useContext } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu, Typography, MenuItemProps } from 'antd'
import Context from './Context'
import { BranchesOutlined, SettingOutlined } from '@ant-design/icons'

const { Text } = Typography

const menuItems: Record<string, MenuItemProps> = {
  '': { children: 'Group Game' },
  settings: { icon: <SettingOutlined />, children: 'Settings' }
}

const Header: FC = () => {
  const { environment: { tagPrefix }, version, getLink } = useContext(Context)
  const { pathname } = useLocation()

  return (
    <Menu mode='horizontal' selectedKeys={[pathname.slice(1)]}>
      {Object.entries(menuItems).map(([path, props]) =>
        <Menu.Item key={path} {...props}>
          <Link to={path}>{props.children}</Link>
        </Menu.Item>)}
      <Menu.Item key='github' icon={<BranchesOutlined />}>
        {getLink(
          `https://github.com/ChocolateLoverRaj/group-game/releases/tag/${tagPrefix}-v${version}`,
          <Text type='secondary'>v{version}</Text>)}
      </Menu.Item>
    </Menu>
  )
}

export default Header
