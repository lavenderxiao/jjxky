import { Table, Button, Space, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

export default function ScoreLineList() {
  const data = [
    { id: '1', year: 2024, university: '北京大学', major: '理论经济学', type: '学硕', totalScore: 380, status: 'active' },
    { id: '2', year: 2024, university: '清华大学', major: '应用经济学', type: '学硕', totalScore: 385, status: 'active' },
  ]

  const columns = [
    { title: '年份', dataIndex: 'year', key: 'year', width: 80 },
    { title: '院校', dataIndex: 'university', key: 'university' },
    { title: '专业', dataIndex: 'major', key: 'major' },
    { title: '类型', dataIndex: 'type', key: 'type', width: 80, render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: '总分', dataIndex: 'totalScore', key: 'totalScore', width: 80 },
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
        <Button type="primary" icon={<PlusOutlined />}>新增分数线</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  )
}
