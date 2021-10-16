import { FC } from 'react'
import { Result, Typography, Button } from 'antd'
import { useLocation, Link } from 'react-router-dom'

const { Text } = Typography

const NoMatch: FC = () => {
  const { pathname } = useLocation()

  return (
    <Result
      status='404'
      title='Page not found'
      subTitle={<>No page found for <Text code>{pathname}</Text></>}
      extra={<Button type='link'><Link to='/'>Go to main page</Link></Button>}
    />
  )
}

export default NoMatch
