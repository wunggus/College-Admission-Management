import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Typography, Tag, Modal, Input } from 'antd';
import { LockOutlined, UnlockOutlined, ReloadOutlined } from '@ant-design/icons';
import { userService } from '../../services/user.service';
import { User } from '../../types';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await userService.getAll();
      setUsers(allUsers.filter(u => u.role === 'candidate'));
    } catch (error) {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async (userId: string) => {
    try {
      await userService.lockAccount(userId);
      message.success('Account locked successfully');
      await loadUsers();
    } catch (error) {
      message.error('Failed to lock account');
    }
  };

  const handleUnlock = async (userId: string) => {
    try {
      await userService.unlockAccount(userId);
      message.success('Account unlocked successfully');
      await loadUsers();
    } catch (error) {
      message.error('Failed to unlock account');
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setResetPasswordVisible(true);
  };

  const confirmResetPassword = async () => {
    if (selectedUser && newPassword) {
      try {
        await userService.resetPassword(selectedUser.id, newPassword);
        message.success('Password reset successfully');
        setResetPasswordVisible(false);
      } catch (error) {
        message.error('Failed to reset password');
      }
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Registration Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: User) => (
        <Tag color={record.is_locked ? 'red' : 'green'}>
          {record.is_locked ? 'Locked' : 'Active'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          {record.is_locked ? (
            <Button
              type="link"
              icon={<UnlockOutlined />}
              onClick={() => handleUnlock(record.id)}
            >
              Unlock
            </Button>
          ) : (
            <Button
              type="link"
              danger
              icon={<LockOutlined />}
              onClick={() => handleLock(record.id)}
            >
              Lock
            </Button>
          )}
          <Button
            type="link"
            icon={<ReloadOutlined />}
            onClick={() => handleResetPassword(record)}
          >
            Reset Password
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>User Management</Title>
        </div>
        
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Reset Password"
        open={resetPasswordVisible}
        onOk={confirmResetPassword}
        onCancel={() => setResetPasswordVisible(false)}
      >
        <p>Reset password for: <strong>{selectedUser?.full_name}</strong></p>
        <Input.Password
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ marginTop: 16 }}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;