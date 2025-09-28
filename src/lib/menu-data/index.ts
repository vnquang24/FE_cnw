import {
  Home,
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  GraduationCap,
  Database,
  FolderOpen,
  Monitor,
  Settings,
  CircleDot,
  Activity,
  BarChart3,
  UserCheck,
} from "lucide-react";
import { MenuItem } from "@/components/panel/menu-item/type";

export const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    pathname: "/main/dashboard",
  },
  {
    icon: BookOpen,
    label: "Quản lý khóa học",
    pathname: "/main/courses",
    subMenu: [
      {
        label: "Danh sách khóa học",
        pathname: "/main/courses",
        icon: CircleDot,
      },
      {
        label: "Bài giảng",
        pathname: "/main/lessons",
        icon: CircleDot,
      },
      {
        label: "Từ vựng",
        pathname: "/main/words",
        icon: CircleDot,
      },
    ],
  },
  {
    icon: FileText,
    label: "Bài kiểm tra",
    pathname: "",
    subMenu: [
      {
        label: "Danh sách bài kiểm tra",
        pathname: "/main/tests",
        icon: CircleDot,
      },
      {
        label: "Câu hỏi",
        pathname: "/main/questions",
        icon: CircleDot,
      },
      {
        label: "Kết quả kiểm tra",
        pathname: "/main/test-results",
        icon: CircleDot,
      },
    ],
  },
  {
    icon: Users,
    label: "Quản lý người dùng",
    pathname: "",
    subMenu: [
      {
        label: "Danh sách người dùng",
        pathname: "/main/users",
        icon: CircleDot,
      },
      {
        label: "Nhóm người dùng",
        pathname: "/main/user-groups",
        icon: CircleDot,
      },
      {
        label: "Phân quyền",
        pathname: "/main/permissions",
        icon: CircleDot,
      },
    ],
  },
  {
    icon: BarChart3,
    label: "Báo cáo & Thống kê",
    pathname: "",
    subMenu: [
      {
        label: "Tiến độ học tập",
        pathname: "/main/reports/progress",
        icon: CircleDot,
      },
      {
        label: "Kết quả học tập",
        pathname: "/main/reports/results",
        icon: CircleDot,
      },
      {
        label: "Thống kê khóa học",
        pathname: "/main/reports/courses",
        icon: CircleDot,
      },
    ],
  },
  {
    icon: FolderOpen,
    label: "Quản lý tệp",
    pathname: "/main/minio",
  },
  {
    icon: Monitor,
    label: "Demo & Thử nghiệm",
    pathname: "",
    subMenu: [
      {
        label: "Demo Components",
        pathname: "/main/demo",
        icon: CircleDot,
      },
      {
        label: "API Examples",
        pathname: "/main/example",
        icon: CircleDot,
      },
    ],
  },
  {
    icon: Settings,
    label: "Cài đặt hệ thống",
    pathname: "",
    subMenu: [
      {
        label: "Cấu hình chung",
        pathname: "/main/settings/general",
        icon: CircleDot,
      },
      {
        label: "Cài đặt thiết bị",
        pathname: "/main/settings/devices",
        icon: CircleDot,
      },
    ],
  },
];
