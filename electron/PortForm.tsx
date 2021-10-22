import { FC, useEffect } from 'react'
import { Form, InputNumber, Button } from 'antd'

export type Validate = (port: number) => Promise<void>

export interface PortFormProps {
  validate: Validate
  defaultPort: number
  on: {
    port: number
    onStop: () => Promise<void>
  } | undefined
}

interface FormData {
  port: number
}

const PortForm: FC<PortFormProps> = ({ validate, on, defaultPort }) => {
  const [form] = Form.useForm<FormData>()
  useEffect(() => {
    if (on?.port !== undefined) form.setFieldsValue({ port: on.port })
  }, [on?.port])
  const isHosting = on !== undefined
  const handleStop = on?.onStop

  return (
    <Form form={form} initialValues={{ port: defaultPort }}>
      <Form.Item
        name='port'
        label='Port'
        required
        rules={[{
          validateTrigger: 'finish',
          validator: async (_rule, port) => await validate(port)
        }]}
      >
        <InputNumber disabled={isHosting} />
      </Form.Item>
      <Form.Item>
        <Button htmlType='submit' disabled={isHosting}>
          {isHosting ? 'Server is Listening' : 'Create'}
        </Button>
      </Form.Item>
      {isHosting && (
        <Form.Item>
          <Button danger onClick={handleStop}>Stop Server</Button>
        </Form.Item>)}
    </Form>
  )
}

export default PortForm
