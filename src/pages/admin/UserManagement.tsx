import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Typography, Tag, Modal, Input } from 'antd';
import { LockOutlined, UnlockOutlined, ReloadOutlined } from '@ant-design/icons';
import { userService } from '../../services/user.service';
import { Application, User } from '../../types';

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

  const loadUsers = () => {
    setLoading(true);
    const allUsers = userService.getAll();
    setUsers(allUsers.filter(u => u.role === 'candidate'));
    setLoading(false);
  };

  const handleLock = (userId: string) => {
    userService.lockAccount(userId);
    message.success('Account locked successfully');
    loadUsers();
  };

  const handleUnlock = (userId: string) => {
    userService.unlockAccount(userId);
    message.success('Account unlocked successfully');
    loadUsers();
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setResetPasswordVisible(true);
  };

  const confirmResetPassword = () => {
    if (selectedUser && newPassword) {
      userService.resetPassword(selectedUser.id, newPassword);
      message.success('Password reset successfully');
      setResetPasswordVisible(false);
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: User) => (
        <Tag color={record.isLocked ? 'red' : 'green'}>
          {record.isLocked ? 'Locked' : 'Active'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          {record.isLocked ? (
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
        <p>Reset password for: <strong>{selectedUser?.fullName}</strong></p>
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