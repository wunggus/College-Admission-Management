import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notification.service';
import { useState, useEffect } from 'react';

const { Header, Content, Sider, Footer } = Layout;
const { Text } = Typography;

const CandidateLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const count = notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    }
  }, [user]);

  const menuItems = [
    {
      key: '/candidate/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/candidate/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: '/candidate/application-form',
      icon: <FileAddOutlined />,
      label: 'New Application',
    },
    {
      key: '/candidate/applications',
      icon: <FileSearchOutlined />,
      label: 'My Applications',
    },
    {
      key: '/candidate/result',
      icon: <CheckCircleOutlined />,
      label: 'Admission Result',
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
          Admission Portal
        </Typography.Title>
        <Space>
          <Badge count={unreadCount}>
            <BellOutlined style={{ fontSize: '20px', color: 'white', cursor: 'pointer' }} />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <Text style={{ color: 'white' }}>{user?.fullName}</Text>
            </Space>
          </Dropdown>
        </Space>
      </Header>
      <Layout>
        <Sider width={250} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['/candidate/dashboard']}
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
            © 2026 University Admission System
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CandidateLayout;