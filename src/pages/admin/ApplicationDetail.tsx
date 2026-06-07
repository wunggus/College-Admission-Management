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
  const [university, setUniversity] = useState<any>(null);
  const [major, setMajor] = useState<any>(null);
  const [subjectCombination, setSubjectCombination] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadApplication(id);
    }
  }, [id]);

  const loadApplication = async (appId: string) => {
    setLoading(true);
    try {
      const app = await applicationService.getById(appId);
      if (app) {
        setApplication(app);
        
        const [user, univ, maj, subCombo] = await Promise.all([
          userService.getAll().then(users => users.find(u => u.id === app.user_id)),
          universityService.getById(app.university_id),
          majorService.getById(app.major_id),
          subjectCombinationService.getById(app.subject_combination_id)
        ]);
        
        setCandidate(user || null);
        setUniversity(univ);
        setMajor(maj);
        setSubjectCombination(subCombo);
      }
    } catch (error) {
      message.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (application) {
      Modal.confirm({
        title: 'Approve Application',
        content: 'Are you sure you want to approve this application?',
        onOk: async () => {
          try {
            await applicationService.updateStatus(application.id, 'approved', application.user_id);
            message.success('Application approved successfully');
            await loadApplication(application.id);
          } catch (error) {
            message.error('Failed to approve application');
          }
        },
      });
    }
  };

  const handleReject = async () => {
    if (application) {
      Modal.confirm({
        title: 'Reject Application',
        content: 'Are you sure you want to reject this application?',
        onOk: async () => {
          try {
            await applicationService.updateStatus(application.id, 'rejected', application.user_id);
            message.success('Application rejected successfully');
            await loadApplication(application.id);
          } catch (error) {
            message.error('Failed to reject application');
          }
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
                <Descriptions.Item label="Full Name">{candidate.full_name}</Descriptions.Item>
                <Descriptions.Item label="Email">{candidate.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{candidate.phone_number || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">{candidate.date_of_birth || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Gender">{candidate.gender || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="National ID">{candidate.national_id || 'N/A'}</Descriptions.Item>
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
                <Descriptions.Item label="Exam Score">{application.exam_score}</Descriptions.Item>
                <Descriptions.Item label="Priority Category">
                  {application.priority_category === 'none' ? 'No Priority' :
                   application.priority_category === 'group1' ? 'Group 1 (Ethnic minority)' :
                   application.priority_category === 'group2' ? 'Group 2 (Policy beneficiaries)' :
                   'Group 3 (Other priorities)'}
                </Descriptions.Item>
                <Descriptions.Item label="Submission Date" span={2}>
                  {new Date(application.submission_date).toLocaleString()}
                </Descriptions.Item>
                {application.notes && (
                  <Descriptions.Item label="Notes" span={2}>{application.notes}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>

          {application.transcript_file && (
            <Col span={12}>
              <Card title="Transcript File">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadFile(application.transcript_file!, 'transcript.pdf')}
                >
                  Download Transcript
                </Button>
              </Card>
            </Col>
          )}

          {application.id_card_file && (
            <Col span={12}>
              <Card title="ID Card File">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadFile(application.id_card_file!, 'id_card.pdf')}
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