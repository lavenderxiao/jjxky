import { Row, Col, Card, Statistic } from 'antd'
import {
  QuestionCircleOutlined,
  BankOutlined,
  BookOutlined,
  UserOutlined,
} from '@ant-design/icons'

export default function Dashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>数据概览</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="题库总数"
              value={1289}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="院校数量"
              value={156}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="知识点数"
              value={342}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户数量"
              value={2845}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="快速操作">
            <p>欢迎使用经济学考研AI助手管理后台</p>
            <p>请从左侧菜单选择功能模块进行管理</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
