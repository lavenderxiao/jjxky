import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, theme } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  SettingOutlined,
  BankOutlined,
  BookOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  LineChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useNavigate, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

// Pages
import Dashboard from '@/pages/Dashboard'
import AgentConfig from '@/pages/SystemConfig/AgentConfig'
import UniversityList from '@/pages/University/UniversityList'
import SubjectList from '@/pages/Subject/SubjectList'
import KnowledgePointList from '@/pages/KnowledgePoint/KnowledgePointList'
import QuestionList from '@/pages/Question/QuestionList'
import ScoreLineList from '@/pages/ScoreLine/ScoreLineList'
import EnrollmentList from '@/pages/Enrollment/EnrollmentList'
import UserList from '@/pages/User/UserList'

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '数据概览',
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统配置',
      children: [
        { key: '/system/agent', label: '智能体配置' },
      ],
    },
    {
      key: '/university',
      icon: <BankOutlined />,
      label: '院校管理',
      children: [
        { key: '/university/list', label: '院校列表' },
      ],
    },
    {
      key: '/subject',
      icon: <BookOutlined />,
      label: '科目管理',
      children: [
        { key: '/subject/list', label: '科目列表' },
      ],
    },
    {
      key: '/knowledge',
      icon: <FileTextOutlined />,
      label: '知识点管理',
      children: [
        { key: '/knowledge/list', label: '知识点列表' },
      ],
    },
    {
      key: '/question',
      icon: <QuestionCircleOutlined />,
      label: '题库管理',
      children: [
        { key: '/question/list', label: '试题列表' },
      ],
    },
    {
      key: '/data',
      icon: <LineChartOutlined />,
      label: '数据管理',
      children: [
        { key: '/data/score-line', label: '分数线管理' },
        { key: '/data/enrollment', label: '招生数据' },
      ],
    },
    {
      key: '/user',
      icon: <TeamOutlined />,
      label: '用户管理',
      children: [
        { key: '/user/list', label: '管理员列表' },
      ],
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout()
    } else {
      navigate(key)
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: collapsed ? 16 : 18,
            fontWeight: 'bold',
          }}
        >
          {collapsed ? '考研' : '考研管理后台'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {collapsed ? (
              <MenuUnfoldOutlined
                style={{ fontSize: 18, cursor: 'pointer' }}
                onClick={() => setCollapsed(false)}
              />
            ) : (
              <MenuFoldOutlined
                style={{ fontSize: 18, cursor: 'pointer' }}
                onClick={() => setCollapsed(true)}
              />
            )}
          </div>
          <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} src={user?.avatar} />
              <span style={{ marginLeft: 8 }}>{user?.realName}</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/system/agent" element={<AgentConfig />} />
            <Route path="/university/list" element={<UniversityList />} />
            <Route path="/subject/list" element={<SubjectList />} />
            <Route path="/knowledge/list" element={<KnowledgePointList />} />
            <Route path="/question/list" element={<QuestionList />} />
            <Route path="/data/score-line" element={<ScoreLineList />} />
            <Route path="/data/enrollment" element={<EnrollmentList />} />
            <Route path="/user/list" element={<UserList />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}
