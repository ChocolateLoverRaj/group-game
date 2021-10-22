import { FC } from 'react'
import { OnJoin, Validate } from '../common/Api'
import { Form, Input, Button } from 'antd'
import defaultTcpPort from './defaultTcpPort'
import TcpClientService from './TcpClientService'
import NameTakenError from '../common/NameTakenError'

export interface JoinTcpProps {
  validate: Validate
  onJoin: OnJoin
}

const JoinTcp: FC<JoinTcpProps> = ({ validate, onJoin }) => {
  return (
    <Form>
      <Form.Item
        name='addressPort'
        label='Server Address (Including Port)'
        required
        rules={[{ required: true }, {
          validateTrigger: 'finish',
          validator: async (_rule, addressPort) => {
            if (!await validate() || typeof addressPort !== 'string') return
            const [address, portStr] = addressPort.split(':')
            const port = portStr !== undefined ? parseInt(portStr) : defaultTcpPort
            if (!Number.isInteger(port)) {
              throw new Error(`'${portStr}' is not a valid port`)
            }
            const service = new TcpClientService(address, port)
            try {
              await service.start()
            } catch (e) {
              if (e instanceof NameTakenError) throw e
              console.error('Error connecting', e)
              throw new Error('Error connecting')
            }
            onJoin(service)
          }
        }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button htmlType='submit'>Connect</Button>
      </Form.Item>
    </Form>
  )
}

export default JoinTcp
