import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Input, Space, Tag, message, Card, Typography, Modal, Descriptions, Row, Col } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
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

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, statusFilter, universityFilter, searchText]);

  const loadApplications = () => {
    setLoading(true);
    const apps = applicationService.getAll();
    setApplications(apps);
    setFilteredApps(apps);
    setLoading(false);
  };

  const filterApplications = () => {
    let filtered = [...applications];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (universityFilter !== 'all') {
      filtered = filtered.filter(app => app.universityId === universityFilter);
    }
    
    if (searchText) {
      filtered = filtered.filter(app => {
        const user = getUserInfo(app.userId);
        return user?.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
               user?.email.toLowerCase().includes(searchText.toLowerCase()) ||
               app.id.includes(searchText);
      });
    }
    
    setFilteredApps(filtered);
  };

  const getUserInfo = (userId: string): User | null => {
    const users = userService.getAll();
    return users.find(u => u.id === userId) || null;
  };

  const getUniversityName = (id: string) => {
    const university = universityService.getById(id);
    return university?.name || 'N/A';
  };

  const getMajorName = (id: string) => {
    const major = majorService.getById(id);
    return major?.name || 'N/A';
  };

  const handleViewDetail = (id: string) => {
    navigate(`/admin/applications/${id}`);
  };

  const handleApprove = (id: string, userId: string) => {
    Modal.confirm({
      title: 'Approve Application',
      content: 'Are you sure you want to approve this application?',
      onOk: () => {
        applicationService.updateStatus(id, 'approved', userId);
        message.success('Application approved successfully');
        loadApplications();
      },
    });
  };

  const handleReject = (id: string, userId: string) => {
    Modal.confirm({
      title: 'Reject Application',
      content: 'Are you sure you want to reject this application?',
      onOk: () => {
        applicationService.updateStatus(id, 'rejected', userId);
        message.success('Application rejected successfully');
        loadApplications();
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
        const user = getUserInfo(record.userId);
        return user ? user.fullName : 'N/A';
      },
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
      title: 'Exam Score',
      dataIndex: 'examScore',
      key: 'examScore',
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
                onClick={() => handleApprove(record.id, record.userId)}
              >
                Approve
              </Button>
              <Button
                type="link"
                icon={<CloseOutlined />}
                style={{ color: '#ff4d4f' }}
                onClick={() => handleReject(record.id, record.userId)}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const universities = universityService.getAll();

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