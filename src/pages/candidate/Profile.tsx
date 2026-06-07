import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, DatePicker, Radio, message, Space } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import dayjs from 'dayjs';

const { TextArea } = Input;

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        full_name: user.full_name,
        date_of_birth: user.date_of_birth ? dayjs(user.date_of_birth) : null,
        gender: user.gender,
        phone_number: user.phone_number,
        email: user.email,
        address: user.address,
        national_id: user.national_id,
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(user!.id, {
        full_name: values.full_name,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : undefined,
        gender: values.gender,
        phone_number: values.phone_number,
        address: values.address,
        national_id: values.national_id,
      });
      updateUser(updatedUser);
      message.success('Profile updated successfully!');
    } catch (error: any) {
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card title="Profile Information">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            full_name: user?.full_name,
            email: user?.email,
          }}
        >
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>

          <Form.Item name="date_of_birth" label="Date of Birth">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="gender" label="Gender">
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input disabled placeholder="Email" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <TextArea rows={3} placeholder="Your Address" />
          </Form.Item>

          <Form.Item name="national_id" label="National ID (CCCD)">
            <Input placeholder="National ID" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Profile
              </Button>
              <Button onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;