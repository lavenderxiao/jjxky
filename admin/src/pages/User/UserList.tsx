import { Table, Button, Space, Tag, Avatar } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'

export default function UserList() {
  const data = [
    { id: '1', username: 'admin', realName: '系统管理员', email: 'admin@example.com', role: '超级管理员', status: 'active' },
    { id: '2', username: 'editor', realName: '内容编辑', email: 'editor@example.com', role: '内容管理员', status: 'active' },
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: '用户',
      key: 'user',
      render: (_: any, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>{record.realName}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.username}</div>
          </div>
        </Space>
      ),
    },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '角色', dataIndex: 'role', key: 'role', render: (r: string) => <Tag color="blue">{r}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'success' : 'default'}>{s === 'active' ? '启用' : '禁用'}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 150,
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
        <Button type="primary" icon={<PlusOutlined />}>新增管理员</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  )
}
