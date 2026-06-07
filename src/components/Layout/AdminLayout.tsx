import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  BankOutlined,
  BookOutlined,
  TableOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Header, Content, Sider, Footer } = Layout;
const { Text } = Typography;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/universities',
      icon: <BankOutlined />,
      label: 'Universities',
    },
    {
      key: '/admin/majors',
      icon: <BookOutlined />,
      label: 'Majors',
    },
    {
      key: '/admin/subject-combinations',
      icon: <TableOutlined />,
      label: 'Subject Combinations',
    },
    {
      key: '/admin/applications',
      icon: <FileTextOutlined />,
      label: 'Applications',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'User Management',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={3} style={{ color: 'white', margin: 0 }}>
          Admin Dashboard
        </Typography.Title>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <Text style={{ color: 'white' }}>{user?.full_name}</Text>
          </Space>
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={250} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['/admin/dashboard']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => handleMenuClick(key)}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
              borderRadius: 8,
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center', background: 'transparent' }}>
            © 2026 University Admission System - Admin Panel
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;