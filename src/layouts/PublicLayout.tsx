import React from 'react';
import { Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const PublicLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 24px' }}>
        <Title level={3} style={{ color: 'white', margin: '16px 0' }}>
          University Admission Management System
        </Title>
      </Header>
      <Content style={{ padding: '50px', background: '#f0f2f5' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        © 2024 University Admission System. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default PublicLayout;