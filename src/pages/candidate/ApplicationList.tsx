import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Modal, Descriptions } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/application.service';
import { universityService } from '../../services/university.service';
import { majorService } from '../../services/major.service';
import { subjectCombinationService } from '../../services/subjectCombination.service';
import { Application } from '../../types';

const { Title } = Typography;

const ApplicationList: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      const userApps = applicationService.getByUser(user.id);
      setApplications(userApps);
    }
  }, [user]);

  const getStatusTag = (status: string) => {
    const colors = {
      pending: 'gold',
      approved: 'green',
      rejected: 'red',
    };
    return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
  };

  const getUniversityName = (id: string) => {
    const university = universityService.getById(id);
    return university?.name || 'N/A';
  };

  const getMajorName = (id: string) => {
    const major = majorService.getById(id);
    return major?.name || 'N/A';
  };

  const getSubjectCombinationName = (id: string) => {
    const combo = subjectCombinationService.getById(id);
    return combo ? `${combo.code} - ${combo.name}` : 'N/A';
  };

  const columns = [
    {
      title: 'Application ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => id.slice(-8),
    },
    {
      title: 'University',
      key: 'university',
      render: (_: any, record: Application) => getUniversityName(record.universityId),
    },
    {
      title: 'Major',
      key: 'major',
      render: (_: any, record: Application) => getMajorName(record.majorId),
    },
    {
      title: 'Submission Date',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Application) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedApp(record);
            setModalVisible(true);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title level={3}>My Applications</Title>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Application Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedApp && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Application ID">{selectedApp.id}</Descriptions.Item>
            <Descriptions.Item label="University">
              {getUniversityName(selectedApp.universityId)}
            </Descriptions.Item>
            <Descriptions.Item label="Major">
              {getMajorName(selectedApp.majorId)}
            </Descriptions.Item>
            <Descriptions.Item label="Subject Combination">
              {getSubjectCombinationName(selectedApp.subjectCombinationId)}
            </Descriptions.Item>
            <Descriptions.Item label="Exam Score">{selectedApp.examScore}</Descriptions.Item>
            <Descriptions.Item label="Priority Category">
              {selectedApp.priorityCategory === 'none' ? 'No Priority' : 
               selectedApp.priorityCategory === 'group1' ? 'Group 1 (Ethnic minority)' :
               selectedApp.priorityCategory === 'group2' ? 'Group 2 (Policy beneficiaries)' :
               'Group 3 (Other priorities)'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {getStatusTag(selectedApp.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Submission Date">
              {new Date(selectedApp.submissionDate).toLocaleString()}
            </Descriptions.Item>
            {selectedApp.notes && (
              <Descriptions.Item label="Notes">{selectedApp.notes}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationList;