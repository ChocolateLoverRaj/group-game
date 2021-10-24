import { FC, useContext } from 'react'
import { OnJoin, Validate } from './Api'
import { Form, Input, Button, Collapse, Typography } from 'antd'
import defaultWsPort from '../electron/defaultWsPort'
import WsClientService from './WsClientService'
import NameTakenError from './NameTakenError'
import Context from './Context'
import { WarningOutlined } from '@ant-design/icons'

const { Text } = Typography

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
        {window.location.protocol === 'https:' && (
          <Form.Item>
            <Text type='danger'>
              <WarningOutlined /> This page was loaded using the
              <Text code type='danger'>HTTPS</Text> protocol.
              Your browser may block requests that use the <Text code type='danger'>WS</Text>
              protocol.
            </Text>
            <br />
            <Collapse ghost>
              <Collapse.Panel header='Possible Solutions' key='possibleSolutions'>
                <ul>
                  <li>
                    Switch to the
                    <a href={`http://${window.location.host}`}>
                      <Text code>HTTP</Text> version of this site
                    </a>
                  </li>
                  <li>
                    {getLink(
                      'https://experienceleague.adobe.com/docs/target/using/experiences/vec/troubleshoot-composer/mixed-content.html?lang=en',
                      'Allow mixed content in your browser')}
                  </li>
                </ul>
              </Collapse.Panel>
            </Collapse>
          </Form.Item>)}
        <Form.Item>
          <Button htmlType='submit'>Connect</Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default JoinWs
