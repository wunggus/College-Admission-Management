import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Empty } from 'antd';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { applicationService } from '../../services/application.service';
import { universityService } from '../../services/university.service';
import { userService } from '../../services/user.service';
import { Application } from '../../types';
import { majorService } from '../../services/major.service';

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [universityStats, setUniversityStats] = useState<any[]>([]);
  const [majorStats, setMajorStats] = useState<any[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);

  useEffect(() => {
    const allApps = applicationService.getAll();
    setApplications(allApps);
    
    const appStats = applicationService.getStats();
    setStats(appStats);
    
    const candidates = userService.getCandidates();
    setTotalCandidates(candidates.length);
    
    // Applications by University
    const universities = universityService.getAll();
    const univStats = universities.map(univ => ({
      name: univ.name,
      Applications: allApps.filter(app => app.universityId === univ.id).length,
    })).filter(item => item.Applications > 0);
    setUniversityStats(univStats);
    
    // Applications by Major (Top 5)
    const majorMap = new Map();
    const allMajors = majorService.getAll();

    allApps.forEach(app => {
      const major = allMajors.find(m => m.id === app.majorId);
      const majorName = major ? major.name : 'Unknown Major';
      const count = majorMap.get(majorName) || 0;
      majorMap.set(majorName, count + 1);
    });

    const majorStatsData = Array.from(majorMap.entries())
      .map(([name, count]) => ({
        name: name.length > 20 ? name.substring(0, 20) + '...' : name,
        Amount: count,
      }))
      .sort((a, b) => b.Amount - a.Amount)
      .slice(0, 5);
    setMajorStats(majorStatsData);
  }, []);

  const STATUS_COLORS = ['#faad14', '#52c41a', '#ff4d4f'];

  const pieData = [
    { name: 'Pending', value: stats.pending },
    { name: 'Approved', value: stats.approved },
    { name: 'Rejected', value: stats.rejected },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Candidates"
              value={totalCandidates}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
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
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Applications by Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} applications`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Applications by University">
            {universityStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={universityStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value} applications`, 'Applications']} />
                  <Bar dataKey="Applications" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="No data available" />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Applications by Major (Top 5)">
            {majorStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={majorStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value} applications`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="Amount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="No data available" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;