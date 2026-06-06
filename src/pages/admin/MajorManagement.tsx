import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Card, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { majorService } from '../../services/major.service';
import { universityService } from '../../services/university.service';
import { Major, University } from '../../types';

const { Title } = Typography;
const { Option } = Select;

const MajorManagement: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const majorData = majorService.getAll();
    const universityData = universityService.getAll();
    setMajors(majorData);
    setUniversities(universityData);
  };

  const handleAdd = () => {
    setEditingMajor(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Major) => {
    setEditingMajor(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    majorService.delete(id);
    message.success('Major deleted successfully');
    loadData();
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingMajor) {
        await majorService.update(editingMajor.id, values);
        message.success('Major updated successfully');
      } else {
        await majorService.create(values);
        message.success('Major created successfully');
      }
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const getUniversityName = (universityId: string) => {
    const university = universities.find(u => u.id === universityId);
    return university?.name || 'N/A';
  };

  const columns = [
    {
      title: 'Major Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'University',
      key: 'university',
      render: (_: any, record: Major) => getUniversityName(record.universityId),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Major) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Major"
            description="Are you sure you want to delete this major?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>Major Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Major
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={majors}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingMajor ? 'Edit Major' : 'Add Major'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Major Name"
            rules={[{ required: true, message: 'Please enter major name' }]}
          >
            <Input placeholder="Enter major name" />
          </Form.Item>
          
          <Form.Item
            name="universityId"
            label="University"
            rules={[{ required: true, message: 'Please select university' }]}
          >
            <Select placeholder="Select university">
              {universities.map(univ => (
                <Option key={univ.id} value={univ.id}>{univ.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingMajor ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MajorManagement;