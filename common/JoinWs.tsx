import { FC, useContext } from 'react'
import { OnJoin, Validate } from './Api'
import { Form, Input, Button } from 'antd'
import defaultWsPort from '../electron/defaultWsPort'
import WsClientService from './WsClientService'
import NameTakenError from './NameTakenError'
import Context from './Context'

export interface JoinTcpProps {
  validate: Validate
  onJoin: OnJoin
}

const JoinWs: FC<JoinTcpProps> = ({ validate, onJoin }) => {
  const { getLink } = useContext(Context)

  return (
    <>
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
              const port = portStr !== undefined ? parseInt(portStr) : defaultWsPort
              if (!Number.isInteger(port)) {
                throw new Error(`'${portStr}' is not a valid port`)
              }
              const service = new WsClientService(address, port)
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
          You may need to {getLink('https://experienceleague.adobe.com/docs/target/using/experiences/vec/troubleshoot-composer/mixed-content.html?lang=en', 'allow mixed content in your browser')}
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit'>Connect</Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default JoinWs
