import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Select, Upload, message, InputNumber, Space, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { universityService } from '../../services/university.service';
import { majorService } from '../../services/major.service';
import { subjectCombinationService } from '../../services/subjectCombination.service';
import { applicationService } from '../../services/application.service';
import { University, Major, SubjectCombination } from '../../types';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const ApplicationForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [subjectCombinations, setSubjectCombinations] = useState<SubjectCombination[]>([]);
  const [transcriptFile, setTranscriptFile] = useState<string>();
  const [idCardFile, setIdCardFile] = useState<string>();

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    const data = await universityService.getAll();
    setUniversities(data);
  };

  const handleUniversityChange = async (universityId: string) => {
    const majorsForUniversity = await majorService.getByUniversity(universityId);
    setMajors(majorsForUniversity);
    form.setFieldsValue({ major_id: undefined, subject_combination_id: undefined });
    setSubjectCombinations([]);
  };

  const handleMajorChange = async (majorId: string) => {
    const combinations = await subjectCombinationService.getByMajor(majorId);
    setSubjectCombinations(combinations);
    form.setFieldsValue({ subject_combination_id: undefined });
  };

  const handleFileUpload = (file: File, type: 'transcript' | 'idCard'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'transcript') {
          setTranscriptFile(base64String);
        } else {
          setIdCardFile(base64String);
        }
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onFinish = async (values: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await applicationService.create({
        user_id: user.id,
        university_id: values.university_id,
        major_id: values.major_id,
        subject_combination_id: values.subject_combination_id,
        exam_score: values.exam_score,
        priority_category: values.priority_category,
        notes: values.notes,
        transcript_file: transcriptFile,
        id_card_file: idCardFile,
      });
      
      message.success('Application submitted successfully!');
      navigate('/candidate/applications');
    } catch (error: any) {
      message.error(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <Title level={3}>New Admission Application</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="university_id"
            label="Select University"
            rules={[{ required: true, message: 'Please select a university' }]}
          >
            <Select
              placeholder="Choose a university"
              onChange={handleUniversityChange}
              showSearch
            >
              {universities.map(univ => (
                <Option key={univ.id} value={univ.id}>{univ.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="major_id"
            label="Select Major"
            rules={[{ required: true, message: 'Please select a major' }]}
          >
            <Select
              placeholder="Choose a major"
              onChange={handleMajorChange}
              disabled={!form.getFieldValue('university_id')}
              showSearch
            >
              {majors.map(major => (
                <Option key={major.id} value={major.id}>{major.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subject_combination_id"
            label="Select Subject Combination"
            rules={[{ required: true, message: 'Please select a subject combination' }]}
          >
            <Select
              placeholder="Choose subject combination"
              disabled={!form.getFieldValue('major_id')}
            >
              {subjectCombinations.map(combo => (
                <Option key={combo.id} value={combo.id}>
                  {combo.code} - {combo.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="exam_score"
            label="Exam Score"
            rules={[{ required: true, message: 'Please enter your exam score' }]}
          >
            <InputNumber
              min={0}
              max={30}
              step={0.1}
              style={{ width: '100%' }}
              placeholder="Enter your total exam score"
            />
          </Form.Item>

          <Form.Item
            name="priority_category"
            label="Priority Category"
            rules={[{ required: true, message: 'Please select priority category' }]}
          >
            <Select placeholder="Select priority category">
              <Option value="none">No Priority</Option>
              <Option value="group1">Group 1 (Ethnic minority)</Option>
              <Option value="group2">Group 2 (Policy beneficiaries)</Option>
              <Option value="group3">Group 3 (Other priorities)</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes">
            <TextArea rows={4} placeholder="Any additional information you'd like to provide" />
          </Form.Item>

          <Form.Item label="Upload Transcript">
            <Upload
              beforeUpload={(file) => {
                handleFileUpload(file, 'transcript');
                return false;
              }}
              maxCount={1}
              accept=".pdf,.jpg,.png"
            >
              <Button icon={<UploadOutlined />}>Upload Transcript File</Button>
            </Upload>
            {transcriptFile && <Typography.Text type="success">File uploaded successfully</Typography.Text>}
          </Form.Item>

          <Form.Item label="Upload ID Card">
            <Upload
              beforeUpload={(file) => {
                handleFileUpload(file, 'idCard');
                return false;
              }}
              maxCount={1}
              accept=".pdf,.jpg,.png"
            >
              <Button icon={<UploadOutlined />}>Upload ID Card</Button>
            </Upload>
            {idCardFile && <Typography.Text type="success">File uploaded successfully</Typography.Text>}
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit Application
              </Button>
              <Button onClick={() => navigate('/candidate/applications')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ApplicationForm;