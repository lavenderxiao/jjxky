import { Table, Button, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

export default function EnrollmentList() {
  const data = [
    { id: '1', year: 2024, university: '北京大学', major: '理论经济学', enrollment: 25, applicants: 450, ratio: '18:1' },
    { id: '2', year: 2024, university: '清华大学', major: '应用经济学', enrollment: 15, applicants: 380, ratio: '25:1' },
  ]

  const columns = [
    { title: '年份', dataIndex: 'year', key: 'year', width: 80 },
    { title: '院校', dataIndex: 'university', key: 'university' },
    { title: '专业', dataIndex: 'major', key: 'major' },
    { title: '招生人数', dataIndex: 'enrollment', key: 'enrollment', width: 100 },
    { title: '报考人数', dataIndex: 'applicants', key: 'applicants', width: 100 },
    { title: '报录比', dataIndex: 'ratio', key: 'ratio', width: 100 },
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
        <Button type="primary" icon={<PlusOutlined />}>新增招生数据</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  )
}
