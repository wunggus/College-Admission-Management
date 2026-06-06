import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Typography, Tag, Empty } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/application.service';
import { notificationService } from '../../services/notification.service';
import { Application, Notification } from '../../types';
import { universityService } from '../../services/university.service';
import { majorService } from '../../services/major.service';

const { Title, Text } = Typography;

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    if (user) {
      const userApps = applicationService.getByUser(user.id);
      setApplications(userApps);
      
      const userNotifs = notificationService.getByUser(user.id);
      setNotifications(userNotifs.slice(0, 5));
      
      setStats({
        total: userApps.length,
        pending: userApps.filter(a => a.status === 'pending').length,
        approved: userApps.filter(a => a.status === 'approved').length,
        rejected: userApps.filter(a => a.status === 'rejected').length,
      });
    }
  }, [user]);

  const getLatestApplication = () => {
    if (applications.length === 0) return null;
    return applications.sort((a, b) => 
      new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    )[0];
  };

  const getUniversityName = (universityId: string) => {
    const university = universityService.getById(universityId);
    return university?.name || 'Unknown';
  };

  const getMajorName = (majorId: string) => {
    const major = majorService.getById(majorId);
    return major?.name || 'Unknown';
  };

  const latestApp = getLatestApplication();

  return (
    <div>
      <Title level={2}>Welcome, {user?.fullName}!</Title>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Applications"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Approved"
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Rejected"
              value={stats.rejected}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Latest Application Status">
            {latestApp ? (
              <div>
                <p><strong>University:</strong> {getUniversityName(latestApp.universityId)}</p>
                <p><strong>Major:</strong> {getMajorName(latestApp.majorId)}</p>
                <p><strong>Status:</strong> 
                  <Tag color={
                    latestApp.status === 'approved' ? 'green' : 
                    latestApp.status === 'rejected' ? 'red' : 'gold'
                  }>
                    {latestApp.status.toUpperCase()}
                  </Tag>
                </p>
                <p><strong>Submission Date:</strong> {new Date(latestApp.submissionDate).toLocaleDateString()}</p>
              </div>
            ) : (
              <Empty description="No applications submitted yet" />
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Recent Notifications">
            <List
              dataSource={notifications}
              renderItem={(notification) => (
                <List.Item>
                  <List.Item.Meta
                    title={notification.title}
                    description={
                      <>
                        <Text type="secondary">{notification.message}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(notification.createdAt).toLocaleString()}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: <Empty description="No notifications" /> }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CandidateDashboard;