import { Tree, Button, Space, Card } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

export default function KnowledgePointList() {
  const treeData = [
    {
      title: '微观经济学',
      key: '0',
      children: [
        { title: '消费者行为理论', key: '0-0' },
        { title: '生产理论', key: '0-1' },
        { title: '市场结构', key: '0-2' },
      ],
    },
    {
      title: '宏观经济学',
      key: '1',
      children: [
        { title: 'IS-LM模型', key: '1-0' },
        { title: 'AD-AS模型', key: '1-1' },
      ],
    },
  ]

  return (
    <div>
      <Card
        title="知识点树"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            新增知识点
          </Button>
        }
      >
        <Tree
          showLine
          defaultExpandAll
          treeData={treeData}
          titleRender={(node) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{node.title as string}</span>
              <Space size="small" style={{ marginLeft: 16 }}>
                <Button type="link" size="small" icon={<EditOutlined />} />
                <Button type="link" size="small" danger icon={<DeleteOutlined />} />
              </Space>
            </div>
          )}
        />
      </Card>
    </div>
  )
}
