"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Typography,
  Tag,
  Spin,
  Alert,
  Card,
  Space,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import { Plus, Edit, Trash2, Settings, BookOpen } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  useFindUniqueCourse,
  useFindManyLesson,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from "@/generated/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { getUserId } from "@/lib/auth";

const { Title, Text } = Typography;

interface LessonFormData {
  title: string;
  position: number;
}

interface LessonData {
  id: string;
  title: string;
  position: number;
  _count?: {
    components: number;
    userLessons: number;
  };
  creator?: {
    id: string;
    name: string;
  };
}

export default function LessonsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonData | null>(null);
  const [form] = Form.useForm();

  // Fetch course data
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useFindUniqueCourse(
    {
      where: { id: courseId },
      select: {
        id: true,
        title: true,
      },
    },
    {
      enabled: !!courseId,
    },
  );

  // Fetch lessons
  const { data: lessons, isLoading: lessonsLoading } = useFindManyLesson(
    {
      where: { courseId },
      include: {
        _count: {
          select: {
            components: true,
            userLessons: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { position: "asc" },
    },
    {
      enabled: !!courseId,
    },
  );

  // Mutations
  const createLessonMutation = useCreateLesson({
    onSuccess: () => {
      message.success("Thêm bài học thành công!");
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["Lesson"] });
    },
    onError: (error) => {
      console.error("Error creating lesson:", error);
      message.error("Có lỗi xảy ra khi thêm bài học!");
    },
  });

  const updateLessonMutation = useUpdateLesson({
    onSuccess: () => {
      message.success("Cập nhật bài học thành công!");
      setIsModalOpen(false);
      setEditingLesson(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["Lesson"] });
    },
    onError: (error) => {
      console.error("Error updating lesson:", error);
      message.error("Có lỗi xảy ra khi cập nhật bài học!");
    },
  });

  const deleteLessonMutation = useDeleteLesson({
    onSuccess: () => {
      message.success("Xóa bài học thành công!");
      queryClient.invalidateQueries({ queryKey: ["Lesson"] });
    },
    onError: (error) => {
      console.error("Error deleting lesson:", error);
      message.error("Có lỗi xảy ra khi xóa bài học!");
    },
  });

  const handleAddLesson = () => {
    setEditingLesson(null);
    form.resetFields();
    form.setFieldsValue({
      position: (lessons?.length || 0) + 1,
    });
    setIsModalOpen(true);
  };

  const handleEditLesson = (lesson: LessonData) => {
    setEditingLesson(lesson);
    form.setFieldsValue({
      title: lesson.title,
      position: lesson.position,
    });
    setIsModalOpen(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content:
        "Bạn có chắc chắn muốn xóa bài học này? Tất cả thành phần bên trong sẽ bị xóa.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        deleteLessonMutation.mutate({
          where: { id: lessonId },
        });
      },
    });
  };

  const handleSubmit = async (values: LessonFormData) => {
    try {
      const data = {
        title: values.title,
        position: values.position,
        courseId,
        createdBy: getUserId(),
      };

      if (editingLesson) {
        await updateLessonMutation.mutateAsync({
          where: { id: editingLesson.id },
          data: {
            title: values.title,
            position: values.position,
          },
        });
      } else {
        await createLessonMutation.mutateAsync({
          data,
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "position",
      key: "position",
      width: 80,
      render: (position: number) => (
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
          {position}
        </div>
      ),
    },
    {
      title: "Tên bài học",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: LessonData) => (
        <Link
          href={`/admin/courses/${courseId}/lessons/${record.id}`}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {title}
        </Link>
      ),
    },
    {
      title: "Thành phần",
      key: "components",
      width: 120,
      render: (record: LessonData) => (
        <Tag color="blue">{record._count?.components || 0} thành phần</Tag>
      ),
    },
    {
      title: "Học viên hoàn thành",
      key: "userLessons",
      width: 150,
      render: (record: LessonData) => (
        <Tag color="green">{record._count?.userLessons || 0} học viên</Tag>
      ),
    },
    {
      title: "Tác giả",
      key: "creator",
      width: 120,
      render: (record: LessonData) => (
        <Text type="secondary">{record.creator?.name || "N/A"}</Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (record: LessonData) => (
        <Space size="small">
          <Link href={`/admin/courses/${courseId}/lessons/${record.id}`}>
            <Button
              type="default"
              size="small"
              icon={<Settings className="w-4 h-4" />}
              className="text-purple-600 hover:text-purple-700"
            >
              Chi tiết
            </Button>
          </Link>
          <Button
            type="default"
            size="small"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEditLesson(record)}
            className="text-gray-600 hover:text-gray-700"
          >
            Sửa
          </Button>
          <Button
            type="default"
            size="small"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDeleteLesson(record.id)}
            className="text-red-600 hover:text-red-700"
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="p-6">
        <Alert
          message="Lỗi"
          description="Không thể tải thông tin khóa học. Vui lòng thử lại sau."
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => router.back()}>
              Quay lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/admin/courses" className="hover:text-gray-900">
            Khóa học
          </Link>
          <span>/</span>
          <Link
            href={`/admin/courses/${courseId}`}
            className="hover:text-gray-900"
          >
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-gray-900">Bài học</span>
        </div>
        <div className="flex items-center justify-between">
          <Title level={2}>Quản lý bài học</Title>
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleAddLesson}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Thêm bài học
          </Button>
        </div>
      </div>

      {/* Lessons Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={lessons}
          loading={lessonsLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bài học`,
          }}
          locale={{
            emptyText: (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <Title level={4} className="text-gray-500 mb-2">
                  Chưa có bài học nào
                </Title>
                <Text type="secondary" className="mb-4">
                  Tạo bài học đầu tiên cho khóa học này
                </Text>
                <Button
                  type="primary"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleAddLesson}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Thêm bài học
                </Button>
              </div>
            ),
          }}
        />
      </Card>

      {/* Lesson Form Modal */}
      <Modal
        title={editingLesson ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingLesson(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={
            createLessonMutation.isPending || updateLessonMutation.isPending
          }
        >
          <Form.Item
            label="Tên bài học"
            name="title"
            rules={[
              { required: true, message: "Vui lòng nhập tên bài học!" },
              { min: 3, message: "Tên bài học phải có ít nhất 3 ký tự!" },
              { max: 255, message: "Tên bài học không được quá 255 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên bài học..." />
          </Form.Item>

          <Form.Item
            label="Vị trí"
            name="position"
            rules={[
              { required: true, message: "Vui lòng nhập vị trí bài học!" },
              { type: "number", min: 1, message: "Vị trí phải lớn hơn 0!" },
            ]}
          >
            <InputNumber
              placeholder="Nhập vị trí bài học..."
              className="w-full"
              min={1}
            />
          </Form.Item>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setEditingLesson(null);
                form.resetFields();
              }}
              disabled={
                createLessonMutation.isPending || updateLessonMutation.isPending
              }
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                createLessonMutation.isPending || updateLessonMutation.isPending
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingLesson ? "Cập nhật" : "Thêm"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
