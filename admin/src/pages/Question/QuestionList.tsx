import { useState } from 'react'
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Question {
  id: string
  type: 'choice' | 'qa' | 'calculation'
  content: string
  subject: string
  knowledgePoint: string
  difficulty: '简单' | '中等' | '困难'
  source: string
  year: number
  status: 'active' | 'inactive'
  reviewStatus: 'pending' | 'approved' | 'rejected'
}

const mockData: Question[] = [
  {
    id: '1',
    type: 'choice',
    content: '在完全竞争市场上，厂商实现利润最大化的条件是（ ）。',
    subject: '微观经济学',
    knowledgePoint: '市场结构',
    difficulty: '中等',
    source: '北京大学2024年真题',
    year: 2024,
    status: 'active',
    reviewStatus: 'approved',
  },
  // 更多模拟数据...
]

export default function QuestionList() {
  const [data, setData] = useState<Question[]>(mockData)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [form] = Form.useForm()

  const columns: ColumnsType<Question> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '题型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          choice: { text: '单选题', color: 'blue' },
          qa: { text: '问答题', color: 'green' },
          calculation: { text: '计算题', color: 'orange' },
        }
        const config = typeMap[type] || { text: type, color: 'default' }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      width: 120,
    },
    {
      title: '知识点',
      dataIndex: 'knowledgePoint',
      key: 'knowledgePoint',
      width: 120,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      render: (difficulty: string) => {
        const colorMap: Record<string, string> = {
          简单: 'green',
          中等: 'orange',
          困难: 'red',
        }
        return <Tag color={colorMap[difficulty]}>{difficulty}</Tag>
      },
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          pending: { text: '待审核', color: 'default' },
          approved: { text: '已通过', color: 'success' },
          rejected: { text: '已驳回', color: 'error' },
        }
        const config = statusMap[status] || { text: status, color: 'default' }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这道题目吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingQuestion(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: Question) => {
    setEditingQuestion(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setData(data.filter(item => item.id !== id))
      message.success('删除成功')
    } catch (error) {
      message.error('删除失败')
    } finally {
      setLoading(false)
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))

      if (editingQuestion) {
        // 更新
        setData(
          data.map(item =>
            item.id === editingQuestion.id ? { ...item, ...values } : item
          )
        )
        message.success('更新成功')
      } else {
        // 新增
        const newQuestion: Question = {
          id: String(Date.now()),
          ...values,
          status: 'active',
          reviewStatus: 'pending',
        }
        setData([newQuestion, ...data])
        message.success('添加成功')
      }

      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="搜索题目内容"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <Select placeholder="科目" style={{ width: 120 }} allowClear>
            <Select.Option value="微观经济学">微观经济学</Select.Option>
            <Select.Option value="宏观经济学">宏观经济学</Select.Option>
            <Select.Option value="政治经济学">政治经济学</Select.Option>
          </Select>
          <Select placeholder="难度" style={{ width: 100 }} allowClear>
            <Select.Option value="简单">简单</Select.Option>
            <Select.Option value="中等">中等</Select.Option>
            <Select.Option value="困难">困难</Select.Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>
            搜索
          </Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增题目
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          total: data.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title={editingQuestion ? '编辑题目' : '新增题目'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        width={800}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="题型"
            name="type"
            rules={[{ required: true, message: '请选择题型' }]}
          >
            <Select>
              <Select.Option value="choice">单选题</Select.Option>
              <Select.Option value="qa">问答题</Select.Option>
              <Select.Option value="calculation">计算题</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="题目内容"
            name="content"
            rules={[{ required: true, message: '请输入题目内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入题目内容" />
          </Form.Item>

          <Form.Item
            label="科目"
            name="subject"
            rules={[{ required: true, message: '请选择科目' }]}
          >
            <Select>
              <Select.Option value="微观经济学">微观经济学</Select.Option>
              <Select.Option value="宏观经济学">宏观经济学</Select.Option>
              <Select.Option value="政治经济学">政治经济学</Select.Option>
              <Select.Option value="计量经济学">计量经济学</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="知识点"
            name="knowledgePoint"
            rules={[{ required: true, message: '请输入知识点' }]}
          >
            <Input placeholder="如：市场结构" />
          </Form.Item>

          <Form.Item
            label="难度"
            name="difficulty"
            rules={[{ required: true, message: '请选择难度' }]}
          >
            <Select>
              <Select.Option value="简单">简单</Select.Option>
              <Select.Option value="中等">中等</Select.Option>
              <Select.Option value="困难">困难</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="来源" name="source">
            <Input placeholder="如：北京大学2024年真题" />
          </Form.Item>

          <Form.Item label="年份" name="year">
            <Input type="number" placeholder="如：2024" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
