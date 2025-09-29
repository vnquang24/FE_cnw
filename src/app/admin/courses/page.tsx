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
  Avatar,
  Input,
  Select,
} from "antd";
import {
  BookOpen,
  Users,
  Clock,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";

const { Title, Text } = Typography;
const { Option } = Select;

export default function CoursesPage() {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data cho khóa học
  const courses = [
    {
      key: "1",
      id: 1,
      title: "JavaScript Cơ bản",
      description: "Học lập trình JavaScript từ cơ bản đến nâng cao",
      instructor: "Nguyễn Văn A",
      students: 45,
      lessons: 12,
      duration: "6 tuần",
      status: "active",
      level: "Cơ bản",
      createdAt: "2024-01-15",
    },
    {
      key: "2",
      id: 2,
      title: "React Advanced",
      description: "Khóa học React nâng cao cho developers",
      instructor: "Trần Thị B",
      students: 32,
      lessons: 15,
      duration: "8 tuần",
      status: "active",
      level: "Nâng cao",
      createdAt: "2024-01-20",
    },
    {
      key: "3",
      id: 3,
      title: "Node.js Backend",
      description: "Phát triển backend với Node.js và Express",
      instructor: "Lê Văn C",
      students: 28,
      lessons: 10,
      duration: "5 tuần",
      status: "draft",
      level: "Trung bình",
      createdAt: "2024-02-01",
    },
    {
      key: "4",
      id: 4,
      title: "Database Design",
      description: "Thiết kế và quản lý cơ sở dữ liệu",
      instructor: "Phạm Thị D",
      students: 25,
      lessons: 8,
      duration: "4 tuần",
      status: "completed",
      level: "Trung bình",
      createdAt: "2024-01-10",
    },
  ];

  const columns = [
    {
      title: "Khóa học",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>{text}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: "Giảng viên",
      dataIndex: "instructor",
      key: "instructor",
      render: (text: string) => (
        <Space>
          <Avatar size="small">{text.charAt(0)}</Avatar>
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Học viên",
      dataIndex: "students",
      key: "students",
      render: (count: number) => (
        <Space>
          <Users size={14} />
          <span>{count}</span>
        </Space>
      ),
    },
    {
      title: "Bài học",
      dataIndex: "lessons",
      key: "lessons",
      render: (count: number) => (
        <Space>
          <BookOpen size={14} />
          <span>{count}</span>
        </Space>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      render: (duration: string) => (
        <Space>
          <Clock size={14} />
          <span>{duration}</span>
        </Space>
      ),
    },
    {
      title: "Cấp độ",
      dataIndex: "level",
      key: "level",
      render: (level: string) => {
        const color =
          level === "Cơ bản"
            ? "green"
            : level === "Trung bình"
              ? "orange"
              : "red";
        return <Tag color={color}>{level}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap = {
          active: { color: "green", text: "Đang hoạt động" },
          draft: { color: "orange", text: "Nháp" },
          completed: { color: "blue", text: "Hoàn thành" },
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
          <Button type="link" danger icon={<Trash2 size={14} />} size="small">
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchText.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Quản lý khóa học</Title>
        <Text type="secondary">Quản lý và theo dõi tất cả các khóa học</Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng khóa học"
              value={courses.length}
              prefix={<BookOpen size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={courses.filter((c) => c.status === "active").length}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng học viên"
              value={courses.reduce((sum, course) => sum + course.students, 0)}
              prefix={<Users size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng bài học"
              value={courses.reduce((sum, course) => sum + course.lessons, 0)}
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
                placeholder="Tìm kiếm khóa học hoặc giảng viên..."
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
                <Option value="active">Đang hoạt động</Option>
                <Option value="draft">Nháp</Option>
                <Option value="completed">Hoàn thành</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<Plus size={14} />}>
              Thêm khóa học mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Courses Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredCourses}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} khóa học`,
          }}
        />
      </Card>
    </div>
  );
}
