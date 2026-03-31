import { useState } from 'react'
import { Card, Form, Input, Button, ColorPicker, message, Space } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

export default function AgentConfig() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const initialValues = {
    name: '经济学考研AI导师',
    displayName: '小研',
    welcomeMessage: '你好！我是你的经济学考研AI导师。你可以问我关于目标院校、分数线、专业知识或志愿填报的问题。',
    description: '专业的经济学考研辅导AI助手',
    primaryColor: '#1890ff',
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('保存配置:', values)
      message.success('配置保存成功')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>智能体配置</h1>
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Form.Item
            label="智能体名称"
            name="name"
            rules={[{ required: true, message: '请输入智能体名称' }]}
          >
            <Input placeholder="如：经济学考研AI导师" />
          </Form.Item>

          <Form.Item
            label="显示名称"
            name="displayName"
            rules={[{ required: true, message: '请输入显示名称' }]}
          >
            <Input placeholder="如：小研" />
          </Form.Item>

          <Form.Item
            label="欢迎语"
            name="welcomeMessage"
            rules={[{ required: true, message: '请输入欢迎语' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="用户首次进入时显示的欢迎消息"
            />
          </Form.Item>

          <Form.Item
            label="系统描述"
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="智能体的简短描述"
            />
          </Form.Item>

          <Form.Item
            label="主题色"
            name="primaryColor"
          >
            <ColorPicker showText />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                保存配置
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
