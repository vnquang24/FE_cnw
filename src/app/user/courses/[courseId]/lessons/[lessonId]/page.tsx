"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Segmented,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  MessageCircle,
  Shuffle,
  Sparkles,
} from "lucide-react";
import {
  useFindUniqueLesson,
  useFindManyUserLesson,
  useFindManyComponent,
} from "@/generated/hooks";
import { getUserId } from "@/lib/auth";

const { Title, Text, Paragraph } = Typography;

const lessonStatusConfig: Record<string, { label: string; color: string }> = {
  TODO: { label: "Chưa học", color: "default" },
  DOING: { label: "Đang học", color: "blue" },
  PASS: { label: "Hoàn thành", color: "green" },
  FAIL: { label: "Cần ôn lại", color: "volcano" },
};

const componentLabel: Record<string, string> = {
  WORD: "Từ vựng",
  TEST: "Bài kiểm tra",
  PARAGRAPH: "Nội dung học",
};

export default function LessonLearningPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string | undefined;
  const lessonId = params?.lessonId as string | undefined;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const lessonArgs = useMemo(
    () => ({
      where: { id: lessonId ?? "" },
      include: {
        course: true,
      },
    }),
    [lessonId],
  );

  const {
    data: lesson,
    isLoading: lessonLoading,
    isFetching: lessonFetching,
    error: lessonError,
  } = useFindUniqueLesson(lessonArgs, {
    enabled: Boolean(lessonId),
  });

  const userLessonArgs = useMemo(
    () => ({
      where: {
        userId: userId ?? "",
        lessonId: lessonId ?? "",
      },
      take: 1,
    }),
    [userId, lessonId],
  );

  const { data: userLesson } = useFindManyUserLesson(userLessonArgs, {
    enabled: Boolean(userId && lessonId),
  });

  const componentArgs = useMemo(
    () => ({
      where: {
        lessonId: lessonId ?? "",
      },
      include: {
        word: true,
        test: {
          include: {
            questions: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
      orderBy: { indexInLesson: "asc" as const },
    }),
    [lessonId],
  );

  const {
    data: components,
    isLoading: componentLoading,
    isFetching: componentFetching,
    error: componentError,
  } = useFindManyComponent(componentArgs, {
    enabled: Boolean(lessonId),
  });

  const wordComponents = useMemo(
    () =>
      (components ?? []).filter(
        (component) => component.componentType === "WORD" && component.word,
      ),
    [components],
  );

  const otherComponents = useMemo(
    () =>
      (components ?? []).filter(
        (component) => component.componentType !== "WORD",
      ),
    [components],
  );

  const [wordViewMode, setWordViewMode] = useState<"list" | "flashcard">(
    "list",
  );
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  useEffect(() => {
    setFlashcardIndex(0);
    setShowMeaning(false);
  }, [wordViewMode, wordComponents.length]);

  const flashcardWord =
    wordComponents.length > 0
      ? (wordComponents[flashcardIndex % wordComponents.length]?.word ?? null)
      : null;
  const hasOtherComponents = otherComponents.length > 0;

  if (
    !lessonId ||
    lessonLoading ||
    lessonFetching ||
    componentLoading ||
    componentFetching
  ) {
    return (
      <div className="flex justify-center items-center h-72">
        <Spin size="large" tip="Đang tải nội dung bài học..." />
      </div>
    );
  }

  if (lessonError || componentError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Không thể tải bài học"
        description="Vui lòng thử lại sau hoặc liên hệ hỗ trợ."
      />
    );
  }

  if (!lesson) {
    return <Empty description="Không tìm thấy bài học." />;
  }

  const currentStatusKey = userLesson?.[0]?.status ?? "TODO";
  const currentStatus =
    lessonStatusConfig[currentStatusKey] ?? lessonStatusConfig.TODO;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space size={12} align="center">
        <Button
          icon={<ArrowLeft size={16} />}
          onClick={() =>
            router.push(
              courseId ? `/user/courses/${courseId}` : "/user/courses",
            )
          }
        >
          Quay lại khóa học
        </Button>
        {courseId && (
          <Link href={`/user/courses/${courseId}`}>
            <Button type="link" icon={<BookOpen size={16} />}>
              Xem danh sách bài học
            </Button>
          </Link>
        )}
      </Space>

      <Card>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={18}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Title level={3} style={{ margin: 0 }}>
                {lesson.title}
              </Title>
              <Text type="secondary">
                Thuộc khóa học: {lesson.course?.title || ""}
              </Text>
              <Space size={8}>
                <Tag color={currentStatus.color}>{currentStatus.label}</Tag>
                <Tag icon={<ClipboardList size={14} />}>
                  {components?.length || 0} nội dung
                </Tag>
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Card bordered={false} className="bg-gray-50">
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Statistic
                  title="Thứ tự trong khóa học"
                  value={lesson.position ?? 0}
                />
                {userLesson?.[0]?.completedAt && (
                  <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label="Hoàn thành">
                      {new Date(userLesson[0].completedAt).toLocaleString(
                        "vi-VN",
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {wordComponents.length > 0 && (
        <Card
          title="Từ vựng trong bài"
          extra={
            <Segmented
              options={[
                { label: "Danh sách", value: "list" },
                { label: "Flashcard", value: "flashcard" },
              ]}
              value={wordViewMode}
              onChange={(value) =>
                setWordViewMode(value as "list" | "flashcard")
              }
            />
          }
        >
          {wordViewMode === "list" ? (
            <Row gutter={[12, 12]}>
              {wordComponents.map((component) => {
                const word = component.word!;
                return (
                  <Col key={component.id} xs={24} md={12} lg={8}>
                    <Card size="small" className="h-full">
                      <Space
                        direction="vertical"
                        size={6}
                        style={{ width: "100%" }}
                      >
                        <Title level={4} style={{ margin: 0 }}>
                          {word.content}
                        </Title>
                        <Tag color="geekblue">{word.wordType}</Tag>
                        <Paragraph style={{ marginBottom: 0 }}>
                          {word.meaning}
                        </Paragraph>
                      </Space>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            flashcardWord && (
              <Space
                direction="vertical"
                size={16}
                style={{ width: "100%", alignItems: "center" }}
              >
                <Card
                  hoverable
                  className="w-full md:w-2/3 text-center"
                  onClick={() => setShowMeaning((prev) => !prev)}
                >
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <Tag color="geekblue">Từ số {flashcardIndex + 1}</Tag>
                    <Title level={3} style={{ margin: 0 }}>
                      {flashcardWord.content}
                    </Title>
                    <Tag color="green">{flashcardWord.wordType}</Tag>
                    <Paragraph style={{ minHeight: 48 }}>
                      {showMeaning
                        ? flashcardWord.meaning
                        : "Nhấp vào thẻ để xem nghĩa"}
                    </Paragraph>
                  </Space>
                </Card>
                <Space size={12} wrap>
                  <Button
                    onClick={() => {
                      setFlashcardIndex((index) =>
                        index === 0 ? wordComponents.length - 1 : index - 1,
                      );
                      setShowMeaning(false);
                    }}
                  >
                    Trước
                  </Button>
                  <Button
                    icon={<Shuffle size={16} />}
                    onClick={() => {
                      if (wordComponents.length <= 1) return;
                      const randomIndex = Math.floor(
                        Math.random() * wordComponents.length,
                      );
                      setFlashcardIndex(randomIndex);
                      setShowMeaning(false);
                    }}
                  >
                    Ngẫu nhiên
                  </Button>
                  <Button
                    onClick={() => {
                      setFlashcardIndex((index) =>
                        index === wordComponents.length - 1 ? 0 : index + 1,
                      );
                      setShowMeaning(false);
                    }}
                  >
                    Tiếp
                  </Button>
                </Space>
                <Text type="secondary">
                  {flashcardIndex + 1}/{wordComponents.length} thẻ
                </Text>
              </Space>
            )
          )}
        </Card>
      )}

      {hasOtherComponents ? (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {otherComponents.map((component, index) => {
            const label = componentLabel[component.componentType] ?? "Nội dung";
            const order = (component.indexInLesson ?? index) + 1;

            if (component.componentType === "TEST" && component.test) {
              const questions = component.test.questions ?? [];
              return (
                <Card
                  key={component.id}
                  title={`${order}. ${label}`}
                  extra={<Tag color="purple">{questions.length} câu hỏi</Tag>}
                >
                  <Space
                    direction="vertical"
                    size={8}
                    style={{ width: "100%" }}
                  >
                    <Title level={4} style={{ margin: 0 }}>
                      {component.test.name}
                    </Title>
                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                      Thời lượng: {component.test.duration} phút · Tối đa{" "}
                      {component.test.maxAttempts} lần làm
                    </Paragraph>
                    <Button type="primary" icon={<Sparkles size={16} />}>
                      Bắt đầu làm bài
                    </Button>
                  </Space>
                </Card>
              );
            }

            return (
              <Card key={component.id} title={`${order}. ${label}`}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Paragraph style={{ marginBottom: 0 }}>
                    {component.content || "Nội dung đang cập nhật."}
                  </Paragraph>
                  <Tag icon={<MessageCircle size={14} />} color="cyan">
                    Hãy ghi chú lại những điểm quan trọng
                  </Tag>
                </Space>
              </Card>
            );
          })}
        </Space>
      ) : wordComponents.length === 0 ? (
        <Empty description="Bài học chưa có nội dung." />
      ) : null}
    </Space>
  );
}
