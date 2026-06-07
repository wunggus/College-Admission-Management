import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Input, Space, Tag, message, Card, Typography, Row, Col, Modal } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/application.service';
import { universityService } from '../../services/university.service';
import { majorService } from '../../services/major.service';
import { userService } from '../../services/user.service';
import { Application, User } from '../../types';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const ApplicationManagement: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [universityFilter, setUniversityFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, statusFilter, universityFilter, searchText]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, allUsers, allUniversities] = await Promise.all([
        applicationService.getAll(),
        userService.getAll(),
        universityService.getAll()
      ]);
      setApplications(apps);
      setFilteredApps(apps);
      setUsers(allUsers);
      setUniversities(allUniversities);
    } catch (error) {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (universityFilter !== 'all') {
      filtered = filtered.filter(app => app.university_id === universityFilter);
    }
    
    if (searchText) {
      filtered = filtered.filter(app => {
        const user = users.find(u => u.id === app.user_id);
        return user?.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
               user?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
               app.id.includes(searchText);
      });
    }
    
    setFilteredApps(filtered);
  };

  const getUserInfo = (userId: string): User | null => {
    return users.find(u => u.id === userId) || null;
  };

  const getUniversityName = (id: string) => {
    const university = universities.find(u => u.id === id);
    return university?.name || 'N/A';
  };

  const getMajorName = async (id: string) => {
    const majors = await majorService.getAll();
    const major = majors.find(m => m.id === id);
    return major?.name || 'N/A';
  };

  const handleViewDetail = (id: string) => {
    navigate(`/admin/applications/${id}`);
  };

  const handleApprove = async (id: string, userId: string) => {
    Modal.confirm({
      title: 'Approve Application',
      content: 'Are you sure you want to approve this application?',
      onOk: async () => {
        try {
          await applicationService.updateStatus(id, 'approved', userId);
          message.success('Application approved successfully');
          await loadData();
        } catch (error) {
          message.error('Failed to approve application');
        }
      },
    });
  };

  const handleReject = async (id: string, userId: string) => {
    Modal.confirm({
      title: 'Reject Application',
      content: 'Are you sure you want to reject this application?',
      onOk: async () => {
        try {
          await applicationService.updateStatus(id, 'rejected', userId);
          message.success('Application rejected successfully');
          await loadData();
        } catch (error) {
          message.error('Failed to reject application');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Application ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => id.slice(-8),
    },
    {
      title: 'Candidate',
      key: 'candidate',
      render: (_: any, record: Application) => {
        const user = getUserInfo(record.user_id);
        return user ? user.full_name : 'N/A';
      },
    },
    {
      title: 'University',
      key: 'university',
      render: (_: any, record: Application) => getUniversityName(record.university_id),
    },
    {
      title: 'Exam Score',
      dataIndex: 'exam_score',
      key: 'exam_score',
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
      render: (status: string) => {
        const colors = {
          pending: 'gold',
          approved: 'green',
          rejected: 'red',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Application) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleApprove(record.id, record.user_id)}
              >
                Approve
              </Button>
              <Button
                type="link"
                icon={<CloseOutlined />}
                style={{ color: '#ff4d4f' }}
                onClick={() => handleReject(record.id, record.user_id)}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title level={3}>Application Management</Title>
        
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">All Status</Option>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by university"
              value={universityFilter}
              onChange={setUniversityFilter}
              showSearch
            >
              <Option value="all">All Universities</Option>
              {universities.map(univ => (
                <Option key={univ.id} value={univ.id}>{univ.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Search
              placeholder="Search by candidate name or email"
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={filteredApps}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ApplicationManagement;