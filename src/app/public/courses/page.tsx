"use client";

import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Input,
  Select,
  Tag,
  Rate,
  Avatar,
  Space,
  Pagination,
  Empty,
  Slider,
  Checkbox,
  Collapse,
  Badge,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  GiftOutlined,
  BookOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;

// Extended mock data
const mockCourses = [
  {
    id: 1,
    title: "React.js từ Cơ Bản đến Nâng Cao",
    description:
      "Học React.js toàn diện từ những kiến thức cơ bản đến các kỹ thuật nâng cao trong phát triển web hiện đại. Khóa học bao gồm Hooks, Context API, Redux và nhiều thư viện phổ biến khác.",
    instructor: "Nguyễn Văn A",
    price: 599000,
    originalPrice: 899000,
    rating: 4.8,
    students: 2543,
    duration: "15 giờ",
    lessons: 45,
    level: "Trung cấp",
    category: "Frontend",
    image: "https://via.placeholder.com/300x200/1890ff/ffffff?text=React.js",
    hot: true,
    bestseller: true,
    language: "Tiếng Việt",
    lastUpdated: "2024-09-01",
  },
  {
    id: 2,
    title: "Node.js & Express Backend Development",
    description:
      "Xây dựng API mạnh mẽ và scalable với Node.js và Express framework. Học cách làm việc với database, authentication, và deploy ứng dụng lên cloud.",
    instructor: "Trần Thị B",
    price: 699000,
    originalPrice: 999000,
    rating: 4.9,
    students: 1876,
    duration: "20 giờ",
    lessons: 60,
    level: "Nâng cao",
    category: "Backend",
    image: "https://via.placeholder.com/300x200/68d391/ffffff?text=Node.js",
    hot: false,
    bestseller: true,
    language: "Tiếng Việt",
    lastUpdated: "2024-08-15",
  },
  {
    id: 3,
    title: "Python cho Data Science",
    description:
      "Phân tích dữ liệu và machine learning với Python, Pandas, NumPy và Scikit-learn. Từ cơ bản đến nâng cao với các project thực tế.",
    instructor: "Lê Văn C",
    price: 799000,
    originalPrice: 1199000,
    rating: 4.7,
    students: 3241,
    duration: "25 giờ",
    lessons: 75,
    level: "Trung cấp",
    category: "Data Science",
    image: "https://via.placeholder.com/300x200/f6ad55/ffffff?text=Python",
    hot: true,
    bestseller: false,
    language: "Tiếng Việt",
    lastUpdated: "2024-09-10",
  },
  {
    id: 4,
    title: "UI/UX Design với Figma",
    description:
      "Thiết kế giao diện đẹp và trải nghiệm người dùng tối ưu với Figma. Học từ wireframe đến prototype hoàn chỉnh.",
    instructor: "Hoàng Thị D",
    price: 499000,
    originalPrice: 699000,
    rating: 4.6,
    students: 1532,
    duration: "12 giờ",
    lessons: 36,
    level: "Cơ bản",
    category: "Design",
    image: "https://via.placeholder.com/300x200/ec4899/ffffff?text=UI/UX",
    hot: false,
    bestseller: false,
    language: "Tiếng Việt",
    lastUpdated: "2024-07-20",
  },
  {
    id: 5,
    title: "DevOps với Docker & Kubernetes",
    description:
      "Container hóa ứng dụng và quản lý hạ tầng với Docker và Kubernetes. Học CI/CD, monitoring và best practices.",
    instructor: "Phạm Văn E",
    price: 899000,
    originalPrice: 1299000,
    rating: 4.8,
    students: 987,
    duration: "30 giờ",
    lessons: 90,
    level: "Nâng cao",
    category: "DevOps",
    image: "https://via.placeholder.com/300x200/6366f1/ffffff?text=DevOps",
    hot: true,
    bestseller: false,
    language: "Tiếng Việt",
    lastUpdated: "2024-09-05",
  },
  {
    id: 6,
    title: "Mobile App với React Native",
    description:
      "Phát triển ứng dụng mobile đa nền tảng với React Native. Từ setup môi trường đến publish app lên store.",
    instructor: "Vũ Thị F",
    price: 649000,
    originalPrice: 949000,
    rating: 4.7,
    students: 1654,
    duration: "18 giờ",
    lessons: 54,
    level: "Trung cấp",
    category: "Mobile",
    image:
      "https://via.placeholder.com/300x200/06b6d4/ffffff?text=React+Native",
    hot: false,
    bestseller: true,
    language: "Tiếng Việt",
    lastUpdated: "2024-08-30",
  },
  // Thêm courses để test pagination
  {
    id: 7,
    title: "Angular Framework Complete Guide",
    description:
      "Học Angular từ cơ bản đến nâng cao với TypeScript, RxJS và Angular Material.",
    instructor: "Nguyễn Thị G",
    price: 549000,
    originalPrice: 799000,
    rating: 4.5,
    students: 1200,
    duration: "22 giờ",
    lessons: 66,
    level: "Trung cấp",
    category: "Frontend",
    image: "https://via.placeholder.com/300x200/dd1b16/ffffff?text=Angular",
    hot: false,
    bestseller: false,
    language: "Tiếng Việt",
    lastUpdated: "2024-08-10",
  },
  {
    id: 8,
    title: "WordPress Development từ A-Z",
    description:
      "Phát triển website với WordPress từ cơ bản đến nâng cao. Custom theme, plugin và WooCommerce.",
    instructor: "Trần Văn H",
    price: 399000,
    originalPrice: 599000,
    rating: 4.4,
    students: 2100,
    duration: "16 giờ",
    lessons: 48,
    level: "Cơ bản",
    category: "Web Development",
    image: "https://via.placeholder.com/300x200/21759b/ffffff?text=WordPress",
    hot: false,
    bestseller: false,
    language: "Tiếng Việt",
    lastUpdated: "2024-07-15",
  },
];

const categories = [
  "Frontend",
  "Backend",
  "Data Science",
  "Design",
  "DevOps",
  "Mobile",
  "Web Development",
];

const levels = ["Cơ bản", "Trung cấp", "Nâng cao"];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500000]);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 8;

  // Filter và sort logic
  let filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(course.category);

    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(course.level);

    const matchesPrice =
      course.price >= priceRange[0] && course.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  // Sort courses
  filteredCourses = filteredCourses.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      case "popular":
      default:
        return b.students - a.students;
    }
  });

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentPage(1);
  };

  const handleLevelChange = (levels: string[]) => {
    setSelectedLevels(levels);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceRange([0, 1500000]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <section className="bg-white  py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <Title level={1}>Tất cả khóa học</Title>
          <Paragraph type="secondary" className="text-lg">
            Khám phá {mockCourses.length} khóa học chất lượng cao từ các chuyên
            gia
          </Paragraph>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={24}>
          {/* Filters Sidebar */}
          <Col xs={24} lg={6}>
            <Card className="sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <Title level={4}>Bộ lọc</Title>
                <Button type="link" onClick={resetFilters} size="small">
                  Xóa tất cả
                </Button>
              </div>

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

                {/* Categories */}
                <div>
                  <Text strong className="block mb-2">
                    Danh mục
                  </Text>
                  <Checkbox.Group
                    options={categories}
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    className="flex flex-col space-y-2"
                  />
                </div>

                {/* Levels */}
                <div>
                  <Text strong className="block mb-2">
                    Cấp độ
                  </Text>
                  <Checkbox.Group
                    options={levels}
                    value={selectedLevels}
                    onChange={handleLevelChange}
                    className="flex flex-col space-y-2"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <Text strong className="block mb-2">
                    Giá (VNĐ)
                  </Text>
                  <Slider
                    range
                    min={0}
                    max={1500000}
                    step={50000}
                    value={priceRange}
                    onChange={(value) =>
                      setPriceRange(value as [number, number])
                    }
                    tooltip={{
                      formatter: (value) =>
                        `${value?.toLocaleString("vi-VN")}đ`,
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{priceRange[0].toLocaleString("vi-VN")}đ</span>
                    <span>{priceRange[1].toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={18}>
            {/* Sort and View Controls */}
            <div className="flex justify-between items-center mb-6 bg-white  p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <Text>
                  Hiển thị {startIndex + 1}-
                  {Math.min(startIndex + pageSize, filteredCourses.length)}
                  trong {filteredCourses.length} kết quả
                </Text>
              </div>

              <div className="flex items-center space-x-4">
                <Text>Sắp xếp:</Text>
                <Select value={sortBy} onChange={setSortBy} className="w-40">
                  <Option value="popular">Phổ biến nhất</Option>
                  <Option value="rating">Đánh giá cao nhất</Option>
                  <Option value="newest">Mới nhất</Option>
                  <Option value="price-low">Giá thấp đến cao</Option>
                  <Option value="price-high">Giá cao đến thấp</Option>
                </Select>

                <Button
                  icon={<FilterOutlined />}
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Lọc
                </Button>
              </div>
            </div>

            {/* Courses Grid */}
            {currentCourses.length > 0 ? (
              <Row gutter={[24, 24]}>
                {currentCourses.map((course) => (
                  <Col xs={24} sm={12} xl={8} key={course.id}>
                    <Card
                      hoverable
                      cover={
                        <div className="relative">
                          <img
                            alt={course.title}
                            src={course.image}
                            className="h-48 w-full object-cover"
                          />
                          {course.hot && (
                            <Badge.Ribbon text="HOT" color="red">
                              <div />
                            </Badge.Ribbon>
                          )}
                          {course.bestseller && (
                            <Tag
                              color="orange"
                              icon={<TrophyOutlined />}
                              className="absolute top-2 left-2"
                            >
                              Bestseller
                            </Tag>
                          )}
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<PlayCircleOutlined />}
                            size="large"
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity"
                          />
                        </div>
                      }
                      actions={[
                        <Button type="primary" block key="enroll">
                          Xem chi tiết
                        </Button>,
                      ]}
                      className="h-full"
                    >
                      <div className="space-y-3">
                        <div>
                          <Tag color="blue">{course.category}</Tag>
                          <Tag color="green">{course.level}</Tag>
                        </div>

                        <Title level={5} className="!mb-2 line-clamp-2">
                          {course.title}
                        </Title>

                        <div className="flex items-center space-x-2 text-sm">
                          <Avatar size="small" icon={<UserOutlined />} />
                          <Text type="secondary">{course.instructor}</Text>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <Space>
                            <Rate disabled defaultValue={course.rating} />
                            <Text type="secondary">({course.students})</Text>
                          </Space>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <ClockCircleOutlined className="mr-1" />
                          <Text type="secondary">
                            {course.duration} • {course.lessons} bài học
                          </Text>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Text strong className="text-lg text-red-600">
                              {course.price.toLocaleString("vi-VN")}đ
                            </Text>
                            <Text delete type="secondary" className="ml-2">
                              {course.originalPrice.toLocaleString("vi-VN")}đ
                            </Text>
                          </div>
                          <Tag color="red" icon={<GiftOutlined />}>
                            -
                            {Math.round(
                              (1 - course.price / course.originalPrice) * 100,
                            )}
                            %
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                image={<BookOutlined className="text-6xl text-gray-400" />}
                description={
                  <div>
                    <Title level={3} type="secondary">
                      Không tìm thấy khóa học
                    </Title>
                    <Text type="secondary">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </Text>
                  </div>
                }
              />
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
                    `${range[0]}-${range[1]} của ${total} khóa học`
                  }
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}
