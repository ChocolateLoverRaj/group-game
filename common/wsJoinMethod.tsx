import { JoinMethod } from './Api'
import JoinWs from './JoinWs'

const wsJoinMethod: JoinMethod = {
  key: 'ws',
  name: 'Connect to Web Socket Server',
  render: (validate, onJoin) => <JoinWs validate={validate} onJoin={onJoin} />
}

export default wsJoinMethod
