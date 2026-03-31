import { Table, Button, Space, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

export default function SubjectList() {
  const data = [
    { id: '1', name: '微观经济学', code: 'MICRO', type: 'specialized', status: 'active' },
    { id: '2', name: '宏观经济学', code: 'MACRO', type: 'specialized', status: 'active' },
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '科目名称', dataIndex: 'name', key: 'name' },
    { title: '科目代码', dataIndex: 'code', key: 'code' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t === 'specialized' ? '专业课' : '公共课'}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'success' : 'default'}>{s === 'active' ? '启用' : '禁用'}</Tag> },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />}>新增科目</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  )
}
