import React, { useState, useEffect } from 'react';
import { Card, Result, List, Tag, Empty, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/application.service';
import { universityService } from '../../services/university.service';
import { majorService } from '../../services/major.service';
import { Application, User } from '../../types';

const { Title } = Typography;

const AdmissionResult: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (user) {
      const userApps = applicationService.getByUser(user.id);
      setApplications(userApps);
    }
  }, [user]);

  const getResultIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />;
      case 'rejected':
        return <CloseCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined style={{ fontSize: 48, color: '#faad14' }} />;
    }
  };

  const getResultMessage = (status: string, universityName: string, majorName: string) => {
    switch (status) {
      case 'approved':
        return `Congratulations! You have been admitted to ${universityName} for ${majorName}.`;
      case 'rejected':
        return `We regret to inform you that your application to ${universityName} for ${majorName} has not been successful.`;
      default:
        return `Your application to ${universityName} for ${majorName} is currently under review.`;
    }
  };

  const approvedApps = applications.filter(app => app.status === 'approved');
  const pendingApps = applications.filter(app => app.status === 'pending');
  const rejectedApps = applications.filter(app => app.status === 'rejected');

  return (
    <div>
      <Title level={2}>Admission Results</Title>
      
      {applications.length === 0 ? (
        <Card>
          <Empty description="No applications submitted yet" />
        </Card>
      ) : (
        <>
          {approvedApps.length > 0 && (
            <Card title="Approved Applications" style={{ marginBottom: 24 }}>
              <List
                dataSource={approvedApps}
                renderItem={(app) => {
                  const university = universityService.getById(app.universityId);
                  const major = majorService.getById(app.majorId);
                  return (
                    <List.Item>
                      <Result
                        icon={getResultIcon(app.status)}
                        status="success"
                        title="Application Approved!"
                        subTitle={getResultMessage(app.status, university?.name || 'N/A', major?.name || 'N/A')}
                        extra={[
                          <Tag color="green" key="status">Status: Approved</Tag>,
                          <Tag color="blue" key="date">Submitted: {new Date(app.submissionDate).toLocaleDateString()}</Tag>,
                        ]}
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>
          )}

          {pendingApps.length > 0 && (
            <Card title="Pending Applications" style={{ marginBottom: 24 }}>
              <List
                dataSource={pendingApps}
                renderItem={(app) => {
                  const university = universityService.getById(app.universityId);
                  const major = majorService.getById(app.majorId);
                  return (
                    <List.Item>
                      <Result
                        icon={getResultIcon(app.status)}
                        status="info"
                        title="Application Under Review"
                        subTitle={getResultMessage(app.status, university?.name || 'N/A', major?.name || 'N/A')}
                        extra={[
                          <Tag color="gold" key="status">Status: Pending</Tag>,
                          <Tag color="blue" key="date">Submitted: {new Date(app.submissionDate).toLocaleDateString()}</Tag>,
                        ]}
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>
          )}

          {rejectedApps.length > 0 && (
            <Card title="Rejected Applications">
              <List
                dataSource={rejectedApps}
                renderItem={(app) => {
                  const university = universityService.getById(app.universityId);
                  const major = majorService.getById(app.majorId);
                  return (
                    <List.Item>
                      <Result
                        icon={getResultIcon(app.status)}
                        status="error"
                        title="Application Not Approved"
                        subTitle={getResultMessage(app.status, university?.name || 'N/A', major?.name || 'N/A')}
                        extra={[
                          <Tag color="red" key="status">Status: Rejected</Tag>,
                          <Tag color="blue" key="date">Submitted: {new Date(app.submissionDate).toLocaleDateString()}</Tag>,
                        ]}
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdmissionResult;