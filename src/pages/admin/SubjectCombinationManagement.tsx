import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Card, Typography, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { subjectCombinationService } from '../../services/subjectCombination.service';
import { majorService } from '../../services/major.service';
import { SubjectCombination, Major } from '../../types';

const { Title } = Typography;
const { Option } = Select;

const SubjectCombinationManagement: React.FC = () => {
  const [combinations, setCombinations] = useState<SubjectCombination[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCombination, setEditingCombination] = useState<SubjectCombination | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [comboData, majorData] = await Promise.all([
        subjectCombinationService.getAll(),
        majorService.getAll()
      ]);
      setCombinations(comboData);
      setMajors(majorData);
    } catch (error) {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCombination(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: SubjectCombination) => {
    setEditingCombination(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await subjectCombinationService.delete(id);
      message.success('Subject combination deleted successfully');
      await loadData();
    } catch (error) {
      message.error('Failed to delete subject combination');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingCombination) {
        await subjectCombinationService.update(editingCombination.id, values);
        message.success('Subject combination updated successfully');
      } else {
        await subjectCombinationService.create(values);
        message.success('Subject combination created successfully');
      }
      setModalVisible(false);
      await loadData();
    } catch (error: any) {
      message.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const getMajorName = (majorId: string) => {
    const major = majors.find(m => m.id === majorId);
    return major?.name || 'N/A';
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Major',
      key: 'major',
      render: (_: any, record: SubjectCombination) => getMajorName(record.major_id),
    },
    {
      title: 'Subjects',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects: string[]) => (
        <>
          {subjects && subjects.map(subject => (
            <Tag key={subject} color="green">{subject}</Tag>
          ))}
        </>
      ),
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
      render: (_: any, record: SubjectCombination) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Subject Combination"
            description="Are you sure you want to delete this subject combination?"
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
          <Title level={3}>Subject Combination Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Subject Combination
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={combinations}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingCombination ? 'Edit Subject Combination' : 'Add Subject Combination'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="Combination Code"
            rules={[{ required: true, message: 'Please enter combination code (e.g., A00, D01)' }]}
          >
            <Input placeholder="Enter combination code" />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="Combination Name"
            rules={[{ required: true, message: 'Please enter combination name' }]}
          >
            <Input placeholder="e.g., Mathematics, Physics, Chemistry" />
          </Form.Item>
          
          <Form.Item
            name="major_id"
            label="Major"
            rules={[{ required: true, message: 'Please select major' }]}
          >
            <Select placeholder="Select major" showSearch>
              {majors.map(major => (
                <Option key={major.id} value={major.id}>{major.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="subjects"
            label="Subjects"
            rules={[{ required: true, message: 'Please enter subjects' }]}
          >
            <Select
              mode="tags"
              placeholder="Type subject and press Enter (e.g., Mathematics, Physics, Chemistry)"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCombination ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectCombinationManagement;