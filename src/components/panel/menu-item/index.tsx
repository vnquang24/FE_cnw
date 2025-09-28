"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Tooltip, theme } from "antd";
import { ChevronUp, ChevronDown } from "lucide-react";
import { MenuItemProps } from "./type";
import { useStoreState } from "@/lib/redux/hook";

const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  depth = 0,
  hidden,
}) => {
  const { token } = theme.useToken();
  const pathname = usePathname();
  const isShowSidebar = useStoreState((state) => state.appState.isShowSidebar);

  // Recursively check if any child menu item is active
  const hasActiveChild = React.useCallback(
    (menuItem: MenuItemProps["item"]): boolean => {
      if (!menuItem.subMenu) {
        return false;
      }
      return menuItem.subMenu.some(
        (sub) =>
          (sub.pathname && pathname.startsWith(sub.pathname)) ||
          hasActiveChild(sub),
      );
    },
    [pathname],
  );

  const [isOpen, setIsOpen] = useState(hasActiveChild(item));

  // Update open state when path changes
  useEffect(() => {
    if (!isShowSidebar) {
      setIsOpen(hasActiveChild(item));
    }
  }, [pathname, item, hasActiveChild, isShowSidebar]);

  // Check hidden to decide whether to render
  if (hidden || item.hidden) {
    return null;
  }

  // An item is active if its path is a prefix of the current path
  const isActive = item.pathname ? pathname.startsWith(item.pathname) : false;
  // An item is a parent of an active item if it has an active child
  const isParentOfActive = hasActiveChild(item);

  // Calculate icon size based on depth
  const getIconSize = (depth: number) => {
    if (depth === 0) return 22;
    if (depth === 1) return 18;
    return 14;
  };

  // Handle click for menu items
  const handleItemClick = (e: React.MouseEvent) => {
    // Only handle open/close submenu if has submenu
    if (item.subMenu && item.subMenu.length > 0) {
      e.preventDefault(); // Prevent default Link behavior
      setIsOpen(!isOpen);
    }
  };

  // Icon and label content
  const iconElement = item.icon && (
    <item.icon
      size={getIconSize(depth)}
      style={{
        color:
          isActive || (isParentOfActive && isShowSidebar)
            ? token.colorPrimary
            : depth > 0
              ? token.colorTextTertiary
              : token.colorText,
        flexShrink: 0,
      }}
    />
  );

  const labelElement = !isShowSidebar && (
    <span
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: isActive
          ? token.colorPrimary
          : isParentOfActive
            ? token.colorPrimary
            : token.colorText,
        fontWeight: isActive || isParentOfActive ? 500 : 400,
        fontSize: token.fontSize,
      }}
    >
      {item.label}
    </span>
  );

  // Menu item content
  const menuItemContent = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: isShowSidebar ? 0 : token.marginSM,
        justifyContent: isShowSidebar ? "center" : "flex-start",
        width: isShowSidebar ? "auto" : "192px", // w-48 equivalent
        overflow: "hidden",
      }}
    >
      {iconElement}
      {labelElement}
    </div>
  );

  // Calculate margin left for nesting
  const getMarginLeft = (depth: number) => {
    if (isShowSidebar) return 0;
    if (depth === 1) return 16; // ml-4
    if (depth === 2) return 32; // ml-8
    if (depth === 3) return 48; // ml-12
    if (depth >= 4) return 64; // ml-16
    return 0;
  };

  // Render item with submenu
  if (item.subMenu && item.subMenu.length > 0) {
    const menuItemElement = (
      <div
        onClick={handleItemClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: !isShowSidebar ? "space-between" : "center",
          padding: `${token.paddingXS}px ${isShowSidebar ? token.paddingXS : token.paddingSM}px`,
          borderRadius: token.borderRadius,
          cursor: "pointer",
          marginLeft: getMarginLeft(depth),
          width: isShowSidebar ? "100%" : "auto",
          boxSizing: "border-box",
          backgroundColor:
            isShowSidebar && isParentOfActive
              ? token.colorPrimaryBg
              : "transparent",
          color:
            !isShowSidebar && isParentOfActive
              ? token.colorPrimary
              : token.colorText,
          fontWeight: !isShowSidebar && isParentOfActive ? 500 : 400,
          transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = token.colorBgTextHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            isShowSidebar && isParentOfActive
              ? token.colorPrimaryBg
              : "transparent";
        }}
      >
        {menuItemContent}
        {!isShowSidebar && item.subMenu && item.subMenu.length > 0 && (
          <div style={{ color: token.colorTextTertiary, flexShrink: 0 }}>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        )}
      </div>
    );

    return (
      <div style={{ width: "100%" }}>
        {isShowSidebar ? (
          <Tooltip title={item.label} placement="right">
            {menuItemElement}
          </Tooltip>
        ) : (
          menuItemElement
        )}

        {isOpen && !isShowSidebar && item.subMenu && (
          <div style={{ marginTop: token.marginXXS }}>
            {item.subMenu
              .filter((subItem) => !subItem.hidden)
              .map((subItem) => (
                <MenuItemComponent
                  key={subItem.label}
                  item={subItem}
                  depth={depth + 1}
                  hidden={subItem.hidden}
                />
              ))}
          </div>
        )}
      </div>
    );
  }

  // Render regular link item
  const linkElement = (
    <Link
      href={item.pathname || "#"}
      style={{
        display: "flex",
        alignItems: "center",
        padding: `${token.paddingXS}px ${isShowSidebar ? token.paddingXS : token.paddingSM}px`,
        borderRadius: token.borderRadius,
        textDecoration: "none",
        marginLeft: getMarginLeft(depth),
        width: isShowSidebar ? "100%" : "auto",
        boxSizing: "border-box",
        justifyContent: !isShowSidebar ? "flex-start" : "center",
        backgroundColor: isActive ? token.colorPrimaryBg : "transparent",
        color: isActive ? token.colorPrimary : token.colorText,
        fontWeight: isActive ? 500 : 400,
        transition: "all 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = token.colorBgTextHover;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isActive
          ? token.colorPrimaryBg
          : "transparent";
      }}
    >
      {menuItemContent}
    </Link>
  );

  return (
    <div style={{ width: "100%" }}>
      {isShowSidebar ? (
        <Tooltip title={item.label} placement="right">
          {linkElement}
        </Tooltip>
      ) : (
        linkElement
      )}
    </div>
  );
};

export default MenuItemComponent;
