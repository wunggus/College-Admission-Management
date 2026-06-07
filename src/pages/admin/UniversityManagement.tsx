import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Card, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { universityService } from '../../services/university.service';
import { University } from '../../types';

const { Title } = Typography;

const UniversityManagement: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    setLoading(true);
    try {
      const data = await universityService.getAll();
      setUniversities(data);
    } catch (error) {
      message.error('Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUniversity(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: University) => {
    setEditingUniversity(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await universityService.delete(id);
      message.success('University deleted successfully');
      await loadUniversities();
    } catch (error) {
      message.error('Failed to delete university');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingUniversity) {
        await universityService.update(editingUniversity.id, values);
        message.success('University updated successfully');
      } else {
        await universityService.create(values);
        message.success('University created successfully');
      }
      setModalVisible(false);
      await loadUniversities();
    } catch (error: any) {
      message.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'University Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: University) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete University"
            description="Are you sure you want to delete this university?"
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
          <Title level={3}>University Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add University
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={universities}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingUniversity ? 'Edit University' : 'Add University'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="University Name"
            rules={[{ required: true, message: 'Please enter university name' }]}
          >
            <Input placeholder="Enter university name" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingUniversity ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UniversityManagement;