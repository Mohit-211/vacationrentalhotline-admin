import {
  ContactsOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  KeyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Spin,
  Typography,
  type MenuProps,
} from "antd";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useNavigation } from "react-router";
import logoMark from "@/assets/logo-mark.png";
import { useAuth } from "@/features/auth/AuthContext";
import { useProfile } from "@/features/auth/useProfile";
import { paths } from "@/routes/paths";
import styles from "./AppLayout.module.css";

const NAV_ITEMS = [
  { path: paths.dashboard, label: "Dashboard", icon: <DashboardOutlined /> },
  { path: paths.users, label: "Users", icon: <TeamOutlined /> },
  { path: paths.payments, label: "Payments", icon: <CreditCardOutlined /> },
  { path: paths.contact, label: "Contact", icon: <ContactsOutlined /> },
  { path: paths.admins, label: "Access Management", icon: <SafetyCertificateOutlined /> },
];

const MENU_ITEMS: MenuProps["items"] = NAV_ITEMS.map((item) => ({
  key: item.path,
  icon: item.icon,
  label: <Link to={item.path}>{item.label}</Link>,
}));

/** Highlights the section of the current page, including its add/edit/detail sub-pages. */
function getSelectedKey(pathname: string): string | undefined {
  if (pathname === paths.dashboard) return paths.dashboard;
  return NAV_ITEMS.find((item) => item.path !== paths.dashboard && pathname.startsWith(item.path))
    ?.path;
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const selectedKey = getSelectedKey(pathname);

  const accountMenu: MenuProps = {
    items: [
      { key: "profile", icon: <UserOutlined />, label: "My profile" },
      { key: "change-password", icon: <KeyOutlined />, label: "Change password" },
      { type: "divider" },
      { key: "sign-out", icon: <LogoutOutlined />, label: "Sign out", danger: true },
    ],
    onClick: ({ key }) => {
      if (key === "profile") navigate(paths.profile);
      if (key === "change-password") navigate(paths.changePassword);
      if (key === "sign-out") signOut();
    },
  };

  return (
    <Layout className={styles.root}>
      <Layout.Sider
        width={250}
        breakpoint="lg"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        className={styles.sider}
      >
        <div className={styles.logo}>
          {/* The name is shown as text when expanded; the image carries it when collapsed. */}
          <img
            src={logoMark}
            alt={collapsed ? "Vacation Rental Hotline" : ""}
            className={styles.logoMark}
          />
          {!collapsed && <span className={styles.logoText}>Vacation Rental Hotline</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={MENU_ITEMS}
          selectedKeys={selectedKey ? [selectedKey] : []}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          />
          <Dropdown menu={accountMenu} trigger={["click"]} placement="bottomRight">
            <Button type="text" className={styles.userButton} aria-label="Account menu">
              <Flex align="center" gap="small">
                <Avatar size="small" icon={<UserOutlined />} />
                <Flex vertical className={styles.userText}>
                  <Typography.Text strong>{profile?.name ?? "Admin"}</Typography.Text>
                  {profile?.admin_role?.name && (
                    <Typography.Text type="secondary" className={styles.userRole}>
                      {profile.admin_role.name}
                    </Typography.Text>
                  )}
                </Flex>
              </Flex>
            </Button>
          </Dropdown>
        </Layout.Header>
        <Layout.Content className={styles.content}>
          <Spin spinning={navigation.state === "loading"} delay={200}>
            <Outlet />
          </Spin>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
