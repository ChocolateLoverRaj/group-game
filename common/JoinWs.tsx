import { FC, useContext } from 'react'
import { Form, Collapse, Typography } from 'antd'
import WsClientService from './WsClientService'
import Context from './Context'
import { WarningOutlined } from '@ant-design/icons'
import JoinSocket, { GeneralProps } from './JoinSocket'
import defaultWsPort from './defaultWsPort'

const { Text } = Typography

const JoinWs: FC<GeneralProps> = props => {
  const { getLink } = useContext(Context)

  return (
    <JoinSocket
      {...props}
      Service={WsClientService}
      additionalFormItems={window.location.protocol === 'https:' && (
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
      defaultPort={defaultWsPort}
    />
  )
}

export default JoinWs
