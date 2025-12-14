"use client";

import { useState, useMemo } from "react";
import type { Prisma } from "@prisma/client";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Input,
  Select,
  Tag,
  Avatar,
  Space,
  Pagination,
  Empty,
  Checkbox,
  Badge,
  Spin,
  Modal,
  Divider,
  Descriptions,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useFindManyCourse } from "../../../../generated/hooks";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

// Real data from database schema
const levelConfig = {
  BEGINNER: { label: "Cơ bản", color: "green" },
  INTERMEDIATE: { label: "Trung cấp", color: "blue" },
  ADVANCED: { label: "Nâng cao", color: "red" },
};

const statusConfig = {
  ACTIVE: { label: "Đang mở", color: "success" },
  INACTIVE: { label: "Đã đóng", color: "default" },
};

type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type CourseStatus = "ACTIVE" | "INACTIVE";

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<CourseLevel[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<CourseStatus[]>([
    "ACTIVE",
  ]); // Default show only active courses
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const pageSize = 12; // Better for 4-column layout

  // Fetch courses from database - only active courses by default
  const {
    data: courses,
    isLoading,
    error,
  } = useFindManyCourse({
    where: {
      status: {
        in:
          selectedStatuses.length > 0
            ? (selectedStatuses as any)
            : (["ACTIVE"] as any),
      },
    },
    include: {
      userCourses: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      lessons: {
        include: {
          components: true,
        },
      },
    },
    orderBy: { createdAt: "desc" as const },
  });

  // Filter và sort logic
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    let filtered = courses.filter((course) => {
      // Search filter
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description &&
          course.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (course.creator?.name &&
          course.creator.name.toLowerCase().includes(searchTerm.toLowerCase()));

      // Level filter
      const matchesLevel =
        selectedLevels.length === 0 || selectedLevels.includes(course.level);

      return matchesSearch && matchesLevel;
    });

    // Sort courses
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "duration-high":
          return b.duration - a.duration;
        case "duration-low":
          return a.duration - b.duration;
        case "popular":
        default:
          return (b.userCourses?.length || 0) - (a.userCourses?.length || 0);
      }
    });
  }, [courses, searchTerm, selectedLevels, sortBy]);

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handleLevelChange = (levels: CourseLevel[]) => {
    setSelectedLevels(levels);
    setCurrentPage(1);
  };

  const handleStatusChange = (statuses: CourseStatus[]) => {
    setSelectedStatuses(statuses);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedLevels([]);
    setSelectedStatuses(["ACTIVE"]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleViewDetails = (course: any) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  const handleEnroll = (courseId: string) => {
    setModalVisible(false);
    router.push(`/user/courses/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" tip="Đang tải khóa học...">
          <div style={{ minHeight: 50, minWidth: 100 }} />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Title level={3} type="danger">
            Không thể tải khóa học
          </Title>
          <Paragraph>Vui lòng thử lại sau.</Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 shadow-lg">
        <div className="w-full px-6">
          <Title level={1} className="text-white mb-2">
            🎓 Khám phá khóa học
          </Title>
          <Paragraph className="text-blue-100 text-lg mb-0">
            Khám phá {filteredCourses.length} khóa học chất lượng cao từ các
            chuyên gia hàng đầu
          </Paragraph>
        </div>
      </section>

      <div className="w-full px-6 py-8">
        <Row gutter={24}>
          {/* Filters Sidebar */}
          <Col xs={24} lg={5}>
            <Card
              className="sticky top-4 shadow-md"
              styles={{
                header: {
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "8px 8px 0 0",
                },
              }}
              title={
                <Space>
                  <SearchOutlined />
                  <span>Bộ lọc</span>
                </Space>
              }
              extra={
                <Button
                  type="link"
                  onClick={resetFilters}
                  size="small"
                  style={{ color: "white" }}
                >
                  Xóa tất cả
                </Button>
              }
            >
              <Space direction="vertical" className="w-full" size="large">
                {/* Search */}
                <div>
                  <Text strong className="block mb-2">
                    Tìm kiếm
                  </Text>
                  <Search
                    placeholder="Tìm khóa học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                  />
                </div>

                {/* Levels */}
                <div>
                  <Text strong className="block mb-2">
                    Cấp độ
                  </Text>
                  <Checkbox.Group
                    value={selectedLevels}
                    onChange={handleLevelChange}
                    className="flex flex-col space-y-2"
                  >
                    <Checkbox value="BEGINNER">
                      {levelConfig.BEGINNER.label}
                    </Checkbox>
                    <Checkbox value="INTERMEDIATE">
                      {levelConfig.INTERMEDIATE.label}
                    </Checkbox>
                    <Checkbox value="ADVANCED">
                      {levelConfig.ADVANCED.label}
                    </Checkbox>
                  </Checkbox.Group>
                </div>

                {/* Status */}
                <div>
                  <Text strong className="block mb-2">
                    Trạng thái
                  </Text>
                  <Checkbox.Group
                    value={selectedStatuses}
                    onChange={handleStatusChange}
                    className="flex flex-col space-y-2"
                  >
                    <Checkbox value="ACTIVE">
                      {statusConfig.ACTIVE.label}
                    </Checkbox>
                    <Checkbox value="INACTIVE">
                      {statusConfig.INACTIVE.label}
                    </Checkbox>
                  </Checkbox.Group>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={19}>
            {/* Sort and View Controls */}
            <Card className="mb-6 shadow-sm">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <Space>
                  <BookOutlined className="text-blue-600" />
                  <Text strong>
                    Hiển thị {startIndex + 1}-
                    {Math.min(startIndex + pageSize, filteredCourses.length)} /{" "}
                    {filteredCourses.length} khóa học
                  </Text>
                </Space>

                <Space>
                  <Text>Sắp xếp:</Text>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-56"
                    size="large"
                  >
                    <Option value="popular">🔥 Phổ biến nhất</Option>
                    <Option value="newest">🆕 Mới nhất</Option>
                    <Option value="oldest">📅 Cũ nhất</Option>
                    <Option value="duration-high">
                      ⏰ Thời lượng dài nhất
                    </Option>
                    <Option value="duration-low">
                      ⚡ Thời lượng ngắn nhất
                    </Option>
                  </Select>
                </Space>
              </div>
            </Card>

            {/* Courses Grid */}
            {currentCourses.length > 0 ? (
              <Row gutter={[24, 24]}>
                {currentCourses.map((course) => {
                  const levelInfo =
                    levelConfig[course.level as keyof typeof levelConfig];
                  const statusInfo =
                    statusConfig[course.status as keyof typeof statusConfig];
                  const totalComponents = (course.lessons?.reduce(
                    (sum: number, lesson: any) =>
                      sum + (lesson.components?.length || 0),
                    0,
                  ) || 0) as number;

                  return (
                    <Col xs={24} sm={12} lg={8} key={course.id}>
                      <Card
                        hoverable
                        cover={
                          <div className="relative bg-linear-to-br from-blue-50 to-indigo-100 h-48">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                                <BookOutlined className="text-blue-600 text-2xl" />
                              </div>
                            </div>
                            {course.status === "ACTIVE" && (
                              <Badge.Ribbon
                                text={statusInfo.label}
                                color="green"
                              >
                                <div />
                              </Badge.Ribbon>
                            )}
                          </div>
                        }
                        actions={[
                          <Button
                            type="primary"
                            block
                            key="enroll"
                            href={`/user/courses/${course.id}`}
                          >
                            Xem chi tiết
                          </Button>,
                        ]}
                        className="h-full"
                      >
                        <div className="p-4">
                          <Title
                            level={5}
                            className="mb-3 line-clamp-2 min-h-[3rem]"
                            style={{ color: "#1e40af" }}
                          >
                            {course.title}
                          </Title>

                          {course.description && (
                            <Paragraph
                              type="secondary"
                              className="text-sm line-clamp-2 mb-3"
                              style={{ minHeight: "2.5rem" }}
                            >
                              {course.description}
                            </Paragraph>
                          )}

                          <Divider className="my-3" />

                          <Space
                            direction="vertical"
                            size={8}
                            className="w-full"
                          >
                            <div className="flex items-center text-sm">
                              <Avatar
                                size="small"
                                icon={<UserOutlined />}
                                className="bg-blue-500"
                              />
                              <Text className="ml-2 truncate flex-1">
                                {course.creator?.name || "Chưa cập nhật"}
                              </Text>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <Space size={4}>
                                <ClockCircleOutlined className="text-orange-500" />
                                <Text type="secondary">
                                  {Math.floor(course.duration / 60)}h{" "}
                                  {course.duration % 60 > 0
                                    ? `${course.duration % 60}m`
                                    : ""}
                                </Text>
                              </Space>
                              <Space size={4}>
                                <BookOutlined className="text-blue-500" />
                                <Text type="secondary">
                                  {course.lessons?.length || 0} bài
                                </Text>
                              </Space>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <Space size={4}>
                                <UserOutlined className="text-green-500" />
                                <Text type="secondary">
                                  {course.userCourses?.length || 0} HV
                                </Text>
                              </Space>
                              {totalComponents > 0 && (
                                <Space size={4}>
                                  <TrophyOutlined className="text-purple-500" />
                                  <Text type="secondary">
                                    {totalComponents} nội dung
                                  </Text>
                                </Space>
                              )}
                            </div>
                          </Space>

                          <Divider className="my-3" />

                          <Space className="w-full" size={8}>
                            <Button
                              type="default"
                              icon={<EyeOutlined />}
                              onClick={() => handleViewDetails(course)}
                              className="flex-1"
                            >
                              Chi tiết
                            </Button>
                            <Button
                              type="primary"
                              icon={<PlayCircleOutlined />}
                              onClick={() => handleEnroll(course.id)}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                            >
                              Học ngay
                            </Button>
                          </Space>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <Card className="text-center py-12">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Space direction="vertical">
                      <Title level={4} type="secondary">
                        😔 Không tìm thấy khóa học
                      </Title>
                      <Text type="secondary">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                      </Text>
                      <Button type="primary" onClick={resetFilters}>
                        Xóa bộ lọc
                      </Button>
                    </Space>
                  }
                />
              </Card>
            )}

            {/* Pagination */}
            {filteredCourses.length > pageSize && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  total={filteredCourses.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} / ${total} khóa học`
                  }
                  className="bg-white px-4 py-2 rounded-lg shadow-sm"
                />
              </div>
            )}
          </Col>
        </Row>
      </div>

      {/* Course Detail Modal */}
      <Modal
        title={
          <Space>
            <BookOutlined className="text-blue-600" />
            <span>Chi tiết khóa học</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="enroll"
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => selectedCourse && handleEnroll(selectedCourse.id)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
          >
            Bắt đầu học
          </Button>,
        ]}
      >
        {selectedCourse && (
          <Space direction="vertical" size={16} className="w-full">
            <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-40 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <BookOutlined className="text-blue-600 text-2xl" />
                </div>
              </div>
            </div>

            <Title level={3} className="mb-0">
              {selectedCourse.title}
            </Title>

            {selectedCourse.description && (
              <Paragraph>{selectedCourse.description}</Paragraph>
            )}

            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Giảng viên" span={2}>
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {selectedCourse.creator?.name || "Chưa cập nhật"}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Cấp độ">
                <Tag
                  color={
                    levelConfig[
                      selectedCourse.level as keyof typeof levelConfig
                    ].color
                  }
                >
                  {
                    levelConfig[
                      selectedCourse.level as keyof typeof levelConfig
                    ].label
                  }
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    selectedCourse.status === "ACTIVE" ? "success" : "default"
                  }
                >
                  {
                    statusConfig[
                      selectedCourse.status as keyof typeof statusConfig
                    ].label
                  }
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Thời lượng">
                <Space>
                  <ClockCircleOutlined />
                  {Math.floor(selectedCourse.duration / 60)} giờ{" "}
                  {selectedCourse.duration % 60 > 0
                    ? `${selectedCourse.duration % 60} phút`
                    : ""}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Số bài học">
                <Space>
                  <BookOutlined />
                  {selectedCourse.lessons?.length || 0} bài học
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Học viên">
                <Space>
                  <UserOutlined />
                  {selectedCourse.userCourses?.length || 0} người
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Nội dung học">
                <Space>
                  <TrophyOutlined />
                  {selectedCourse.lessons?.reduce(
                    (sum: number, lesson: any) =>
                      sum + (lesson.components?.length || 0),
                    0,
                  ) || 0}{" "}
                  nội dung
                </Space>
              </Descriptions.Item>
            </Descriptions>

            {selectedCourse.lessons && selectedCourse.lessons.length > 0 && (
              <div>
                <Divider orientation="left">Danh sách bài học</Divider>
                <div className="max-h-60 overflow-y-auto">
                  <Space direction="vertical" className="w-full" size={8}>
                    {selectedCourse.lessons.map(
                      (lesson: any, index: number) => (
                        <Card
                          key={lesson.id}
                          size="small"
                          className="bg-gray-50"
                        >
                          <Space className="w-full justify-between">
                            <Space>
                              <Tag color="blue">Bài {index + 1}</Tag>
                              <Text strong>{lesson.title}</Text>
                            </Space>
                            <Text type="secondary" className="text-xs">
                              {lesson.components?.length || 0} nội dung
                            </Text>
                          </Space>
                        </Card>
                      ),
                    )}
                  </Space>
                </div>
              </div>
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
}
