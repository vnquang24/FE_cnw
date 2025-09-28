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
  Avatar,
} from "antd";
import {
  Users,
  UserPlus,
  Search,
  Plus,
  Edit,
  Eye,
  Shield,
  Mail,
} from "lucide-react";

const { Title, Text } = Typography;
const { Option } = Select;

export default function UsersPage() {
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Mock data cho người dùng
  const users = [
    {
      key: "1",
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      role: "student",
      status: "active",
      coursesEnrolled: 5,
      testsCompleted: 12,
      avgScore: 8.5,
      lastLogin: "2024-02-20",
      createdAt: "2024-01-15",
    },
    {
      key: "2",
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      role: "instructor",
      status: "active",
      coursesCreated: 3,
      studentsTeaching: 89,
      rating: 4.8,
      lastLogin: "2024-02-21",
      createdAt: "2024-01-10",
    },
    {
      key: "3",
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      role: "admin",
      status: "active",
      permissions: "full",
      lastLogin: "2024-02-21",
      createdAt: "2024-01-01",
    },
    {
      key: "4",
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      role: "student",
      status: "inactive",
      coursesEnrolled: 2,
      testsCompleted: 5,
      avgScore: 7.2,
      lastLogin: "2024-02-15",
      createdAt: "2024-01-20",
    },
  ];

  const columns = [
    {
      title: "Người dùng",
      key: "user",
      render: (record: any) => (
        <Space>
          <Avatar size={40}>{record.name.charAt(0)}</Avatar>
          <div>
            <div style={{ fontWeight: "bold" }}>{record.name}</div>
            <div style={{ color: "#666", fontSize: "12px" }}>
              <Mail size={12} style={{ marginRight: 4 }} />
              {record.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const roleMap = {
          admin: { color: "red", text: "Quản trị viên" },
          instructor: { color: "blue", text: "Giảng viên" },
          student: { color: "green", text: "Học viên" },
        };
        const roleInfo = roleMap[role as keyof typeof roleMap];
        return (
          <Tag color={roleInfo.color} icon={<Shield size={12} />}>
            {roleInfo.text}
          </Tag>
        );
      },
    },
    {
      title: "Thống kê",
      key: "stats",
      render: (record: any) => {
        if (record.role === "student") {
          return (
            <div>
              <div>Khóa học: {record.coursesEnrolled}</div>
              <div>Bài kiểm tra: {record.testsCompleted}</div>
              <div>
                Điểm TB:{" "}
                <span style={{ color: "#52c41a" }}>{record.avgScore}</span>
              </div>
            </div>
          );
        } else if (record.role === "instructor") {
          return (
            <div>
              <div>Khóa học tạo: {record.coursesCreated}</div>
              <div>Học viên: {record.studentsTeaching}</div>
              <div>
                Đánh giá:{" "}
                <span style={{ color: "#fa8c16" }}>⭐ {record.rating}</span>
              </div>
            </div>
          );
        } else {
          return (
            <div>
              <div>Quyền: {record.permissions}</div>
              <div>Quản trị viên</div>
            </div>
          );
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap = {
          active: { color: "green", text: "Hoạt động" },
          inactive: { color: "red", text: "Không hoạt động" },
          suspended: { color: "orange", text: "Tạm khóa" },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Đăng nhập cuối",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (date: string) => <Text type="secondary">{date}</Text>,
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
          <Button type="link" danger size="small">
            Khóa
          </Button>
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Quản lý người dùng</Title>
        <Text type="secondary">
          Quản lý và theo dõi tất cả người dùng trong hệ thống
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={users.length}
              prefix={<Users size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Học viên"
              value={users.filter((u) => u.role === "student").length}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Giảng viên"
              value={users.filter((u) => u.role === "instructor").length}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={users.filter((u) => u.status === "active").length}
              prefix={<UserPlus size={20} />}
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
                placeholder="Tìm kiếm theo tên hoặc email..."
                prefix={<Search size={14} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                value={filterRole}
                onChange={setFilterRole}
                style={{ width: 150 }}
              >
                <Option value="all">Tất cả vai trò</Option>
                <Option value="admin">Quản trị viên</Option>
                <Option value="instructor">Giảng viên</Option>
                <Option value="student">Học viên</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<Plus size={14} />}>
              Thêm người dùng mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
        />
      </Card>
    </div>
  );
}
