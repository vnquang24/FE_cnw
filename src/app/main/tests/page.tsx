"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Input,
  Select,
} from "antd";
import {
  FileText,
  Clock,
  Users,
  CheckCircle,
  Search,
  Plus,
  Edit,
  Eye,
} from "lucide-react";

const { Title, Text } = Typography;
const { Option } = Select;

export default function TestsPage() {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data cho bài kiểm tra
  const tests = [
    {
      key: "1",
      id: 1,
      title: "Kiểm tra JavaScript Cơ bản",
      course: "JavaScript Cơ bản",
      questions: 20,
      duration: 30,
      attempts: 145,
      avgScore: 8.2,
      status: "published",
      type: "multiple_choice",
      createdAt: "2024-01-15",
    },
    {
      key: "2",
      id: 2,
      title: "Bài tập React Hooks",
      course: "React Advanced",
      questions: 15,
      duration: 45,
      attempts: 89,
      avgScore: 7.8,
      status: "published",
      type: "coding",
      createdAt: "2024-01-20",
    },
    {
      key: "3",
      id: 3,
      title: "Quiz Node.js Express",
      course: "Node.js Backend",
      questions: 25,
      duration: 40,
      attempts: 76,
      avgScore: 8.5,
      status: "draft",
      type: "multiple_choice",
      createdAt: "2024-02-01",
    },
    {
      key: "4",
      id: 4,
      title: "Database SQL Practice",
      course: "Database Design",
      questions: 18,
      duration: 60,
      attempts: 123,
      avgScore: 9.1,
      status: "published",
      type: "practical",
      createdAt: "2024-01-10",
    },
  ];

  const columns = [
    {
      title: "Bài kiểm tra",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>{text}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            Khóa học: {record.course}
          </div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const typeMap = {
          multiple_choice: { color: "blue", text: "Trắc nghiệm" },
          coding: { color: "green", text: "Lập trình" },
          practical: { color: "purple", text: "Thực hành" },
        };
        const typeInfo = typeMap[type as keyof typeof typeMap];
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      },
    },
    {
      title: "Câu hỏi",
      dataIndex: "questions",
      key: "questions",
      render: (count: number) => (
        <Space>
          <FileText size={14} />
          <span>{count}</span>
        </Space>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => (
        <Space>
          <Clock size={14} />
          <span>{duration} phút</span>
        </Space>
      ),
    },
    {
      title: "Lượt làm",
      dataIndex: "attempts",
      key: "attempts",
      render: (count: number) => (
        <Space>
          <Users size={14} />
          <span>{count}</span>
        </Space>
      ),
    },
    {
      title: "Điểm TB",
      dataIndex: "avgScore",
      key: "avgScore",
      render: (score: number) => (
        <span
          style={{
            color: score >= 8 ? "#52c41a" : score >= 6 ? "#fa8c16" : "#ff4d4f",
            fontWeight: "bold",
          }}
        >
          {score}/10
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap = {
          published: { color: "green", text: "Đã xuất bản" },
          draft: { color: "orange", text: "Nháp" },
          archived: { color: "gray", text: "Lưu trữ" },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<Eye size={14} />} size="small">
            Xem
          </Button>
          <Button type="link" icon={<Edit size={14} />} size="small">
            Sửa
          </Button>
          <Button type="link" icon={<CheckCircle size={14} />} size="small">
            Kết quả
          </Button>
        </Space>
      ),
    },
  ];

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchText.toLowerCase()) ||
      test.course.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || test.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Quản lý bài kiểm tra</Title>
        <Text type="secondary">
          Quản lý và theo dõi tất cả các bài kiểm tra
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng bài kiểm tra"
              value={tests.length}
              prefix={<FileText size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã xuất bản"
              value={tests.filter((t) => t.status === "published").length}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng lượt làm"
              value={tests.reduce((sum, test) => sum + test.attempts, 0)}
              prefix={<Users size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Điểm trung bình"
              value={8.4}
              precision={1}
              suffix="/10"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space>
              <Input
                placeholder="Tìm kiếm bài kiểm tra hoặc khóa học..."
                prefix={<Search size={14} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: 150 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="published">Đã xuất bản</Option>
                <Option value="draft">Nháp</Option>
                <Option value="archived">Lưu trữ</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<Plus size={14} />}>
              Tạo bài kiểm tra mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tests Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTests}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bài kiểm tra`,
          }}
        />
      </Card>
    </div>
  );
}
