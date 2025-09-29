"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Spin } from "antd";
import { isTokenValid, getUserInfo } from "@/lib/auth";
import StoreProviderWrapper from "@/components/store-provider";
import Header from "@/components/panel/header";
import Sidebar from "@/components/panel/side-bars";

const { Content } = Layout;

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("🔍 Đang kiểm tra xác thực..."); // Debug log
      try {
        const valid = await isTokenValid();
        console.log("🔍 Token valid:", valid); // Debug log
        if (!valid) {
          console.log("🔍 Token không hợp lệ, chuyển hướng đến login"); // Debug log
          router.push("/login");
          return;
        }

        const info = getUserInfo();
        console.log("🔍 User info từ token:", info); // Debug log

        if (!info) {
          router.push("/login");
          return;
        }

        if (info.role !== "ADMIN") {
          const fallback = info?.role === "USER" ? "/user/courses" : "/login";
          router.push(fallback);
          return;
        }

        setUserInfo({
          id: info.userId || "",
          name: info.sub || "Người dùng",
          email: info.sub || "",
          role: info.role,
          avatar: undefined,
        });
        console.log("🔍 Đã set user info thành công"); // Debug log
      } catch (error) {
        console.error("🔍 Lỗi kiểm tra auth:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
        console.log("🔍 Hoàn thành kiểm tra auth"); // Debug log
      }
    };

    // Chỉ chạy một lần khi component mount
    if (isLoading) {
      checkAuth();
    }
  }, []); // Bỏ router dependency để tránh re-run

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-2">
            Không thể tải thông tin người dùng
          </div>
          <div className="text-gray-500">Vui lòng thử đăng nhập lại</div>
        </div>
      </div>
    );
  }

  return (
    <StoreProviderWrapper>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Header user={userInfo} pathName="Dashboard" />
          <Content
            style={{
              margin: "16px",
              overflow: "initial",
            }}
          >
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: "#fff",
                borderRadius: 8,
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </StoreProviderWrapper>
  );
}
