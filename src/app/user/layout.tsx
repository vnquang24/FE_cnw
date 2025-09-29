"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Menu, Avatar, Typography, Button, Space, Spin } from "antd";
import { BookOpen, ClipboardList, CheckCircle2, UserRound } from "lucide-react";
import { getUserInfo, isTokenValid, logout, type JwtPayload } from "@/lib/auth";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

type MenuKey =
  | "/user/courses"
  | "/user/progress"
  | "/user/tests"
  | "/user/profile";

const menuConfig: { key: MenuKey; label: string; icon: ReactNode }[] = [
  {
    key: "/user/courses",
    label: "Khóa học của tôi",
    icon: <BookOpen size={18} />,
  },
  {
    key: "/user/progress",
    label: "Tiến độ học tập",
    icon: <CheckCircle2 size={18} />,
  },
  {
    key: "/user/tests",
    label: "Kết quả kiểm tra",
    icon: <ClipboardList size={18} />,
  },
  {
    key: "/user/profile",
    label: "Hồ sơ học viên",
    icon: <UserRound size={18} />,
  },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userInfo, setUserInfo] = useState<JwtPayload | null>(null);

  useEffect(() => {
    let active = true;
    const verifyAuth = async () => {
      try {
        const valid = await isTokenValid();
        if (!active) return;

        if (!valid) {
          router.replace("/login");
          return;
        }

        const info = getUserInfo();

        if (!info) {
          router.replace("/login");
          return;
        }

        if (info.role === "ADMIN") {
          router.replace("/admin/dashboard");
          return;
        }

        setUserInfo(info);
      } catch (error) {
        if (active) {
          router.replace("/login");
        }
      } finally {
        if (active) {
          setIsCheckingAuth(false);
        }
      }
    };

    verifyAuth();

    return () => {
      active = false;
    };
  }, [router]);

  const selectedKey = useMemo<MenuKey>(() => {
    const match = menuConfig.find((item) => pathname.startsWith(item.key));
    return match?.key ?? "/user/courses";
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang kiểm tra phiên đăng nhập..." />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-2">
          <div className="text-red-600">Không thể tải thông tin người dùng</div>
          <Button type="primary" onClick={() => router.replace("/login")}>
            Quay lại trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} breakpoint="lg" collapsedWidth={0}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <Space align="center" size={12}>
              <Avatar size={48} style={{ backgroundColor: "#1677ff" }}>
                {userInfo?.name?.charAt(0) || userInfo?.sub?.charAt(0) || "U"}
              </Avatar>
              <div>
                <Text strong>{userInfo?.name || "Học viên"}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {userInfo?.sub || "student@example.com"}
                </Text>
              </div>
            </Space>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => router.push(String(key))}
            items={menuConfig.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: <Link href={item.key}>{item.label}</Link>,
            }))}
            style={{ flex: 1, borderInlineEnd: 0 }}
          />
          <div className="p-6 border-t border-gray-200">
            <Button block danger onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 24px" }}>
          <Text strong style={{ fontSize: 18 }}>
            Khu vực học viên
          </Text>
        </Header>
        <Content style={{ margin: "24px", minHeight: 360 }}>
          <div className="bg-white p-6 rounded-lg shadow-sm min-h-[70vh]">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
