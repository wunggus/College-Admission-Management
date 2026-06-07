import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Modal, Descriptions } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/application.service';
import { universityService } from '../../services/university.service';
import { majorService } from '../../services/major.service';
import { subjectCombinationService } from '../../services/subjectCombination.service';
import { Application, University, Major, SubjectCombination } from '../../types';

const { Title } = Typography;

const ApplicationList: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [universities, setUniversities] = useState<Record<string, University>>({});
  const [majors, setMajors] = useState<Record<string, Major>>({});
  const [combinations, setCombinations] = useState<Record<string, SubjectCombination>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userApps = await applicationService.getByUser(user.id);
      setApplications(userApps);
      
      // Fetch all related data
      const univMap: Record<string, University> = {};
      const majorMap: Record<string, Major> = {};
      const comboMap: Record<string, SubjectCombination> = {};
      
      for (const app of userApps) {
        if (!univMap[app.university_id]) {
          const univ = await universityService.getById(app.university_id);
          if (univ) univMap[app.university_id] = univ;
        }
        if (!majorMap[app.major_id]) {
          const maj = await majorService.getById(app.major_id);
          if (maj) majorMap[app.major_id] = maj;
        }
        if (!comboMap[app.subject_combination_id]) {
          const combo = await subjectCombinationService.getById(app.subject_combination_id);
          if (combo) comboMap[app.subject_combination_id] = combo;
        }
      }
      
      setUniversities(univMap);
      setMajors(majorMap);
      setCombinations(comboMap);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const colors = {
      pending: 'gold',
      approved: 'green',
      rejected: 'red',
    };
    return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
  };

  const getUniversityName = (id: string) => {
    return universities[id]?.name || 'N/A';
  };

  const getMajorName = (id: string) => {
    return majors[id]?.name || 'N/A';
  };

  const getSubjectCombinationName = (id: string) => {
    const combo = combinations[id];
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
      render: (_: any, record: Application) => getUniversityName(record.university_id),
    },
    {
      title: 'Major',
      key: 'major',
      render: (_: any, record: Application) => getMajorName(record.major_id),
    },
    {
      title: 'Submission Date',
      dataIndex: 'submission_date',
      key: 'submission_date',
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

  if (loading) {
    return <div>Loading...</div>;
  }

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
              {getUniversityName(selectedApp.university_id)}
            </Descriptions.Item>
            <Descriptions.Item label="Major">
              {getMajorName(selectedApp.major_id)}
            </Descriptions.Item>
            <Descriptions.Item label="Subject Combination">
              {getSubjectCombinationName(selectedApp.subject_combination_id)}
            </Descriptions.Item>
            <Descriptions.Item label="Exam Score">{selectedApp.exam_score}</Descriptions.Item>
            <Descriptions.Item label="Priority Category">
              {selectedApp.priority_category === 'none' ? 'No Priority' : 
               selectedApp.priority_category === 'group1' ? 'Group 1 (Ethnic minority)' :
               selectedApp.priority_category === 'group2' ? 'Group 2 (Policy beneficiaries)' :
               'Group 3 (Other priorities)'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {getStatusTag(selectedApp.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Submission Date">
              {new Date(selectedApp.submission_date).toLocaleString()}
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