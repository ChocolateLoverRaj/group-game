import { useContext, Fragment, MouseEventHandler } from 'react'
import { Button, Row, Col, Input, Form, Typography, FormProps } from 'antd'
import styled from 'styled-components'
import { maxDisplayNameLength } from './config'
import Context from './Context'
import { game } from './Game'
import { action, flow } from 'mobx'
import { OnJoin, Validate } from './Api'
import { observer } from 'mobx-react-lite'
import localStorage from 'mobx-localstorage'

const { Text } = Typography

const StyledCol = styled(Col)({
  'text-align': 'center'
})

interface FormData {
  name: string
}

const localStorageNameKey = 'name'

const NotInGame = observer(() => {
  const { joinMethods, hostMethods } = useContext(Context)
  const [form] = Form.useForm<FormData>()
  const canHost = hostMethods.length > 0

  const handleCreateGame: MouseEventHandler = flow(function * () {
    yield form.validateFields()
    game.hostServices = new Map()
    game.isHost = true
    game.playing = true
  })

  const handleJoinGame: OnJoin = action(clientService => {
    game.isHost = false
    game.clientService = clientService
    game.playing = true
  })

  const validate: Validate = async () => {
    try {
      await form.validateFields()
      return true
    } catch {
      return false
    }
  }

  const handleFieldsChange: FormProps<FormData>['onFieldsChange'] = (fields) => {
    localStorage.setItem(localStorageNameKey, fields[0].value)
    game.myName = form.getFieldValue('name')
  }

  return (
    <>
      <Row>
        <StyledCol span={24}>
          <Form
            form={form}
            initialValues={{ name: localStorage.getItem(localStorageNameKey) }}
            onFieldsChange={handleFieldsChange}
          >
            <Form.Item
              name='name'
              required
              label='Display Name'
              rules={[{
                max: maxDisplayNameLength
              }, {
                required: true
              }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </StyledCol>
      </Row>
      <Row>
        <StyledCol span={12}>
          <h1>Join a Game</h1>
          {joinMethods.map(({ key, name, render }) =>
            <Fragment key={key}>
              <h2>{name}</h2>
              {render(validate, handleJoinGame)}
            </Fragment>)}
          {joinMethods.length === 0 &&
            <Text type='secondary'>This environment / device cannot join games</Text>}
        </StyledCol>
        <StyledCol span={12}>
          <h1>Host a Game</h1>
          <Button disabled={!canHost} onClick={handleCreateGame}>Create Game</Button>
          {!canHost && (
            <>
              <br />
              <Text type='secondary'>This environment / device cannot host games</Text>
            </>)}
        </StyledCol>
      </Row>
    </>
  )
})

export default NotInGame
