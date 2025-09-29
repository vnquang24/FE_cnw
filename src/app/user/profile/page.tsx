"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Alert,
  Avatar,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  Award,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useFindUniqueUser } from "@/generated/hooks";
import { getUserId } from "@/lib/auth";

const { Title, Text } = Typography;

const genderMap: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

export default function UserProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const queryArgs = useMemo(() => {
    if (!userId) return undefined;
    return {
      where: { id: userId },
      include: {
        userCourses: true,
        userLessons: true,
        testResults: true,
        group: {
          include: {
            permission: true,
          },
        },
      },
    };
  }, [userId]);

  const {
    data: user,
    isLoading,
    isFetching,
    error,
  } = useFindUniqueUser(queryArgs, {
    enabled: Boolean(userId),
  });

  const courseStats = useMemo(() => {
    const list = user?.userCourses ?? [];
    const total = list.length;
    const inProgress = list.filter(
      (item) => item.enrolmentStatus === "IN_PROGRESS",
    ).length;
    const completed = list.filter(
      (item) => item.enrolmentStatus === "COMPLETED",
    ).length;
    const averageProgress = total
      ? Math.round(
          list.reduce((acc, item) => acc + (item.progress ?? 0), 0) / total,
        )
      : 0;

    return { total, inProgress, completed, averageProgress };
  }, [user?.userCourses]);

  const lessonStats = useMemo(() => {
    const list = user?.userLessons ?? [];
    const total = list.length;
    const completed = list.filter((lesson) => lesson.status === "PASS").length;
    const doing = list.filter((lesson) => lesson.status === "DOING").length;

    return { total, completed, doing };
  }, [user?.userLessons]);

  const testStats = useMemo(() => {
    const list = user?.testResults ?? [];
    const total = list.length;
    const passed = list.filter((test) => test.status === "PASSED").length;

    return { total, passed };
  }, [user?.testResults]);

  if (!userId || isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-72">
        <Spin size="large" tip="Đang tải hồ sơ học viên..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Không thể tải hồ sơ"
        description="Vui lòng thử lại sau hoặc liên hệ hỗ trợ."
      />
    );
  }

  if (!user) {
    return <Empty description="Không tìm thấy thông tin học viên." />;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={3}>Hồ sơ học viên</Title>
        <Text type="secondary">
          Thông tin tài khoản và kết quả học tập tổng quan của bạn.
        </Text>
      </div>

      <Card>
        <Space size={16} align="start">
          <Avatar size={96} style={{ backgroundColor: "#1677ff" }}>
            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
          </Avatar>
          <Space direction="vertical" size={8}>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {user.name || "Học viên"}
              </Title>
              <Tag color="blue">{user.role || "USER"}</Tag>
            </div>
            <Space size={12} wrap>
              <InfoChip icon={<Mail size={16} />} text={user.email} />
              {user.phone && (
                <InfoChip icon={<Phone size={16} />} text={user.phone} />
              )}
              {user.birthday && (
                <InfoChip
                  icon={<Calendar size={16} />}
                  text={new Date(user.birthday).toLocaleDateString("vi-VN")}
                />
              )}
              {user.gender && (
                <InfoChip
                  icon={<UserRound size={16} />}
                  text={genderMap[user.gender] || user.gender}
                />
              )}
            </Space>
          </Space>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Khóa học đã đăng ký"
              value={courseStats.total}
              prefix={<BookOpen size={18} className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Bài học đã hoàn thành"
              value={lessonStats.completed}
              prefix={<Award size={18} className="text-emerald-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Điểm bài kiểm tra đạt"
              value={testStats.passed}
              prefix={<Award size={18} className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Tổng quan khóa học">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Đang học">
                {courseStats.inProgress}
              </Descriptions.Item>
              <Descriptions.Item label="Đã hoàn thành">
                {courseStats.completed}
              </Descriptions.Item>
              <Descriptions.Item label="Tiến độ trung bình">
                {courseStats.averageProgress}%
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Nhóm người dùng">
            {user.group?.length ? (
              <Space direction="vertical" size={8}>
                {user.group.map((group) => (
                  <Card key={group.id} size="small" bordered>
                    <Space direction="vertical" size={6}>
                      <Text strong>{group.name}</Text>
                      <Space size={4} wrap>
                        {group.permission?.map((permission) => (
                          <Tag key={permission.id} color="geekblue">
                            {permission.name} · {permission.permissionType}
                          </Tag>
                        ))}
                      </Space>
                    </Space>
                  </Card>
                ))}
              </Space>
            ) : (
              <Text type="secondary">Bạn chưa thuộc nhóm nào.</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Tiến độ học tập">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Tổng bài học">
                {lessonStats.total}
              </Descriptions.Item>
              <Descriptions.Item label="Đang học">
                {lessonStats.doing}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Kết quả kiểm tra">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Tổng số bài">
                {testStats.total}
              </Descriptions.Item>
              <Descriptions.Item label="Số bài đạt">
                {testStats.passed}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

type InfoChipProps = {
  icon: ReactNode;
  text: string;
};

function InfoChip({ icon, text }: InfoChipProps) {
  return (
    <Tag icon={icon} color="default" style={{ padding: "4px 8px" }}>
      {text}
    </Tag>
  );
}
