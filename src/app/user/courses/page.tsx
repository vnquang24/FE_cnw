"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  List,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { BookOpen, GraduationCap, Clock, TrendingUp } from "lucide-react";
import { useFindManyUserCourse } from "@/generated/hooks";
import { getUserId } from "@/lib/auth";

const { Title, Text } = Typography;

const statusColorMap: Record<string, string> = {
  PENDING: "blue",
  APPROVED: "geekblue",
  REJECTED: "red",
  IN_PROGRESS: "gold",
  COMPLETED: "green",
};

export default function UserCoursesPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const queryArgs = useMemo(() => {
    if (!userId) return undefined;
    return {
      where: { userId },
      include: {
        course: {
          include: {
            lessons: true,
            creator: true,
          },
        },
      },
      orderBy: { createdAt: "desc" as const },
    };
  }, [userId]);

  const {
    data: enrolments,
    isLoading,
    isFetching,
    error,
  } = useFindManyUserCourse(queryArgs, {
    enabled: Boolean(userId),
  });

  const totals = useMemo(() => {
    const list = enrolments ?? [];
    const totalCourses = list.length;
    const completedCourses = list.filter(
      (course) => course.enrolmentStatus === "COMPLETED",
    ).length;
    const inProgress = list.filter((course) =>
      ["IN_PROGRESS", "APPROVED"].includes(course.enrolmentStatus),
    ).length;
    const averageProgress = totalCourses
      ? Math.round(
          list.reduce((acc, item) => acc + (item.progress ?? 0), 0) /
            totalCourses,
        )
      : 0;

    return { totalCourses, completedCourses, inProgress, averageProgress };
  }, [enrolments]);

  if (!userId || isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-72">
        <Spin size="large" tip="Đang tải khóa học của bạn..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Không thể tải khóa học"
        description="Vui lòng thử lại sau hoặc liên hệ hỗ trợ."
      />
    );
  }

  if (!enrolments?.length) {
    return (
      <Empty
        description="Bạn chưa đăng ký khóa học nào."
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={3}>Khóa học của tôi</Title>
        <Text type="secondary">
          Theo dõi trạng thái và tiến độ các khóa học bạn đã đăng ký.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số khóa học"
              value={totals.totalCourses}
              prefix={<BookOpen size={18} className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang học"
              value={totals.inProgress}
              prefix={<Clock size={18} className="text-amber-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={totals.completedCourses}
              prefix={<GraduationCap size={18} className="text-emerald-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tiến độ trung bình"
              value={totals.averageProgress}
              suffix="%"
              prefix={<TrendingUp size={18} className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>

      <List
        dataSource={enrolments}
        renderItem={(item) => {
          const course = item.course;
          if (!course) return null;
          const lessonsCount = course.lessons?.length ?? 0;
          const progressValue = Math.min(item.progress ?? 0, 100);
          const statusColor =
            statusColorMap[item.enrolmentStatus] ?? statusColorMap.PENDING;

          return (
            <List.Item>
              <Card className="w-full" hoverable>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} md={18}>
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%" }}
                    >
                      <Space align="center" size={12}>
                        <Avatar
                          shape="square"
                          size={56}
                          style={{ background: "#1677ff10" }}
                        >
                          <BookOpen size={24} className="text-blue-600" />
                        </Avatar>
                        <div>
                          <Title level={4} style={{ margin: 0 }}>
                            {course.title}
                          </Title>
                          <Text type="secondary">
                            {lessonsCount} bài học · {course.duration} phút
                          </Text>
                        </div>
                      </Space>
                      <Text>
                        Trạng thái:{" "}
                        <Tag color={statusColor}>{item.enrolmentStatus}</Tag>
                      </Text>
                      <div>
                        <Text type="secondary">Tiến độ khóa học</Text>
                        <Progress
                          percent={progressValue}
                          status={progressValue === 100 ? "success" : undefined}
                        />
                      </div>
                      <Link href={`/user/courses/${course.id}`}>
                        <Button type="primary">Vào học</Button>
                      </Link>
                    </Space>
                  </Col>
                  <Col xs={24} md={6}>
                    <Card bordered={false} className="bg-gray-50">
                      <Space direction="vertical" size={6}>
                        <Text type="secondary">Giảng viên</Text>
                        <Space align="center">
                          <Avatar
                            size={32}
                            style={{ backgroundColor: "#52c41a" }}
                          >
                            {course.creator?.name?.charAt(0) || "G"}
                          </Avatar>
                          <Text>{course.creator?.name || "Chưa cập nhật"}</Text>
                        </Space>
                        <Text type="secondary">Ngày đăng ký</Text>
                        <Text>
                          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          );
        }}
      />
    </Space>
  );
}
