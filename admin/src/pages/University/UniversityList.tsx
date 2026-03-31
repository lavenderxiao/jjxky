import { useState } from 'react'
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Select,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons'

interface University {
  id: string
  name: string
  shortName: string
  province: string
  level: '985' | '211' | '双一流' | '普通'
  type: string
  status: 'active' | 'inactive'
}

const mockData: University[] = [
  {
    id: '1',
    name: '北京大学',
    shortName: '北大',
    province: '北京',
    level: '985',
    type: '综合',
    status: 'active',
  },
  {
    id: '2',
    name: '清华大学',
    shortName: '清华',
    province: '北京',
    level: '985',
    type: '理工',
    status: 'active',
  },
]

export default function UniversityList() {
  const [data, setData] = useState<University[]>(mockData)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<University | null>(null)
  const [form] = Form.useForm()

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '院校名称', dataIndex: 'name', key: 'name' },
    { title: '简称', dataIndex: 'shortName', key: 'shortName', width: 100 },
    { title: '省份', dataIndex: 'province', key: 'province', width: 100 },
    {
      title: '层级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          '985': 'red',
          '211': 'orange',
          '双一流': 'blue',
          '普通': 'default',
        }
        return <Tag color={colorMap[level]}>{level}</Tag>
      },
    },
    { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: University) => (
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
            title="确定删除吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingRecord(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: University) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    setData(data.filter(item => item.id !== id))
    message.success('删除成功')
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingRecord) {
        setData(data.map(item => (item.id === editingRecord.id ? { ...item, ...values } : item)))
        message.success('更新成功')
      } else {
        setData([{ id: String(Date.now()), ...values, status: 'active' }, ...data])
        message.success('添加成功')
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input placeholder="搜索院校" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增院校
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
      />

      <Modal
        title={editingRecord ? '编辑院校' : '新增院校'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="院校名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="简称" name="shortName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="省份" name="province" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="层级" name="level" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="985">985</Select.Option>
              <Select.Option value="211">211</Select.Option>
              <Select.Option value="双一流">双一流</Select.Option>
              <Select.Option value="普通">普通</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="类型" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="综合">综合</Select.Option>
              <Select.Option value="理工">理工</Select.Option>
              <Select.Option value="财经">财经</Select.Option>
              <Select.Option value="师范">师范</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
