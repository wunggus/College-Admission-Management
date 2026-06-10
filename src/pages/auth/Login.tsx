import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'candidate' | 'admin'>('candidate');
  
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      message
      const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
     
      if (currentUser.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/candidate/dashboard';
      }
    } catch (error: any) {
      message.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    onFinish({
      email: 'admin@admission.com',
      password: 'admin123',
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 100 }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Login
        </Title>
        <Radio.Group
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          style={{ marginBottom: 20, display: 'block', textAlign: 'center' }}
        >
          <Radio.Button value="candidate">Candidate</Radio.Button>
          <Radio.Button value="admin">Admin</Radio.Button>
        </Radio.Group>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log in
            </Button>
          </Form.Item>

          {userType === 'admin' && (
            <Button type="link" onClick={fillAdminCredentials} block>
              Fill Admin Credentials
            </Button>
          )}

          {userType === 'candidate' && (
            <div style={{ textAlign: 'center' }}>
              <Button type="link" onClick={() => navigate('/register')}>
                Don't have an account? Register here
              </Button>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Login;