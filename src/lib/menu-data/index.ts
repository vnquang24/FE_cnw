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
    pathname: "/admin/dashboard",
  },
  {
    icon: BookOpen,
    label: "Quản lý khóa học",
    pathname: "/admin/courses",
    subMenu: [
      {
        label: "Danh sách khóa học",
        pathname: "/admin/courses",
        icon: CircleDot,
      },
      {
        label: "Bài giảng",
        pathname: "/admin/lessons",
        icon: CircleDot,
      },
      {
        label: "Từ vựng",
        pathname: "/admin/words",
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
        pathname: "/admin/tests",
        icon: CircleDot,
      },
      {
        label: "Câu hỏi",
        pathname: "/admin/questions",
        icon: CircleDot,
      },
      {
        label: "Kết quả kiểm tra",
        pathname: "/admin/test-results",
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
        pathname: "/admin/admins",
        icon: CircleDot,
      },
      {
        label: "Nhóm người dùng",
        pathname: "/admin/admin-groups",
        icon: CircleDot,
      },
      {
        label: "Phân quyền",
        pathname: "/admin/permissions",
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
        pathname: "/admin/reports/progress",
        icon: CircleDot,
      },
      {
        label: "Kết quả học tập",
        pathname: "/admin/reports/results",
        icon: CircleDot,
      },
      {
        label: "Thống kê khóa học",
        pathname: "/admin/reports/courses",
        icon: CircleDot,
      },
    ],
  },
  {
    icon: FolderOpen,
    label: "Quản lý tệp",
    pathname: "/admin/minio",
  },
  {
    icon: Monitor,
    label: "Demo & Thử nghiệm",
    pathname: "",
    subMenu: [
      {
        label: "Demo Components",
        pathname: "/admin/demo",
        icon: CircleDot,
      },
      {
        label: "API Examples",
        pathname: "/admin/example",
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
        pathname: "/admin/settings/general",
        icon: CircleDot,
      },
      {
        label: "Cài đặt thiết bị",
        pathname: "/admin/settings/devices",
        icon: CircleDot,
      },
    ],
  },
];
