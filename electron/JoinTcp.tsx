import { FC } from 'react'
import TcpClientService from './TcpClientService'
import JoinSocket, { GeneralProps } from '../common/JoinSocket'
import defaultTcpPort from './defaultTcpPort'

const JoinTcp: FC<GeneralProps> = props => (
  <JoinSocket
    {...props}
    Service={TcpClientService}
    defaultPort={defaultTcpPort}
  />)

export default JoinTcp
