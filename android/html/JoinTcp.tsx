import JoinSocket, { GeneralProps } from '../../common/JoinSocket'
import { FC } from 'react'
import TcpClientService from './TcpClientService'
import defaultTcpPort from '../../common/defaultTcpPort'
import { Typography } from 'antd'

const { Text } = Typography

const JoinTcp: FC<GeneralProps> = props => (
  <>
    {JSON.parse(Android.canJoinTcp()) as boolean
      ? (
        <JoinSocket
          {...props}
          Service={TcpClientService}
          defaultPort={defaultTcpPort}
        />)
      : <Text type='secondary'>This device does not support joining with this method</Text>}
  </>
)

export default JoinTcp
