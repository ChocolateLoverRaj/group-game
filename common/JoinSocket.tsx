import { FC, ReactNode } from 'react'
import { OnJoin, Validate } from './Api'
import { Form, Input, Button } from 'antd'
import NameTakenError from './NameTakenError'
import SocketClientService from './SocketClientService'

export interface GeneralProps {
  validate: Validate
  onJoin: OnJoin
}

export interface JoinSocketProps extends GeneralProps {
  Service: typeof SocketClientService
  additionalFormItems?: ReactNode
  defaultPort: number
}

const JoinSocket: FC<JoinSocketProps> = ({
  Service,
  validate,
  onJoin,
  additionalFormItems,
  defaultPort
}) => (
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
          const port = portStr !== undefined ? parseInt(portStr) : defaultPort
          if (!Number.isInteger(port)) {
            throw new Error(`'${portStr}' is not a valid port`)
          }
          const service: SocketClientService = new (Service as any)(address, port)
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
    {additionalFormItems}
    <Form.Item>
      <Button htmlType='submit'>Connect</Button>
    </Form.Item>
  </Form>
)

export default JoinSocket
