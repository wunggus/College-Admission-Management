import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Space, Tag, message, Row, Col, Typography, Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { applicationService } from '../../services/application.service';
import { universityService } from '../../services/university.service';
import { majorService } from '../../services/major.service';
import { subjectCombinationService } from '../../services/subjectCombination.service';
import { userService } from '../../services/user.service';
import { Application, User } from '../../types';

const { Title, Text } = Typography;

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [candidate, setCandidate] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadApplication(id);
    }
  }, [id]);

  const loadApplication = (appId: string) => {
    const app = applicationService.getById(appId);
    if (app) {
      setApplication(app);
      const user = userService.getAll().find(u => u.id === app.userId);
      setCandidate(user || null);
    }
    setLoading(false);
  };

  const handleApprove = () => {
    if (application) {
      Modal.confirm({
        title: 'Approve Application',
        content: 'Are you sure you want to approve this application?',
        onOk: () => {
          applicationService.updateStatus(application.id, 'approved', application.userId);
          message.success('Application approved successfully');
          loadApplication(application.id);
        },
      });
    }
  };

  const handleReject = () => {
    if (application) {
      Modal.confirm({
        title: 'Reject Application',
        content: 'Are you sure you want to reject this application?',
        onOk: () => {
          applicationService.updateStatus(application.id, 'rejected', application.userId);
          message.success('Application rejected successfully');
          loadApplication(application.id);
        },
      });
    }
  };

  const downloadFile = (base64String: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64String;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!application || !candidate) {
    return <div>Application not found</div>;
  }

  const university = universityService.getById(application.universityId);
  const major = majorService.getById(application.majorId);
  const subjectCombination = subjectCombinationService.getById(application.subjectCombinationId);

  return (
    <div>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/applications')}>
            Back
          </Button>
          <Title level={3} style={{ margin: 0 }}>Application Details</Title>
        </Space>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Candidate Information">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Full Name">{candidate.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{candidate.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{candidate.phoneNumber || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">{candidate.dateOfBirth || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Gender">{candidate.gender || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="National ID">{candidate.nationalId || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>{candidate.address || 'N/A'}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Application Information">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Application ID">{application.id}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={
                    application.status === 'approved' ? 'green' :
                    application.status === 'rejected' ? 'red' : 'gold'
                  }>
                    {application.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="University">{university?.name || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Major">{major?.name || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Subject Combination">
                  {subjectCombination ? `${subjectCombination.code} - ${subjectCombination.name}` : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Exam Score">{application.examScore}</Descriptions.Item>
                <Descriptions.Item label="Priority Category">
                  {application.priorityCategory === 'none' ? 'No Priority' :
                   application.priorityCategory === 'group1' ? 'Group 1 (Ethnic minority)' :
                   application.priorityCategory === 'group2' ? 'Group 2 (Policy beneficiaries)' :
                   'Group 3 (Other priorities)'}
                </Descriptions.Item>
                <Descriptions.Item label="Submission Date" span={2}>
                  {new Date(application.submissionDate).toLocaleString()}
                </Descriptions.Item>
                {application.notes && (
                  <Descriptions.Item label="Notes" span={2}>{application.notes}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>

          {application.transcriptFile && (
            <Col span={12}>
              <Card title="Transcript File">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadFile(application.transcriptFile!, 'transcript.pdf')}
                >
                  Download Transcript
                </Button>
              </Card>
            </Col>
          )}

          {application.idCardFile && (
            <Col span={12}>
              <Card title="ID Card File">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadFile(application.idCardFile!, 'id_card.pdf')}
                >
                  Download ID Card
                </Button>
              </Card>
            </Col>
          )}

          {application.status === 'pending' && (
            <Col span={24}>
              <Card>
                <Space>
                  <Button type="primary" icon={<CheckOutlined />} onClick={handleApprove}>
                    Approve Application
                  </Button>
                  <Button danger icon={<CloseOutlined />} onClick={handleReject}>
                    Reject Application
                  </Button>
                </Space>
              </Card>
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default ApplicationDetail;