import {
  DownOutlined,
  KeyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Grid,
  Layout,
  Menu,
  Spin,
  Typography,
  type MenuProps,
} from "antd";
import { useId, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useNavigation } from "react-router";
import logoMark from "@/assets/logo-mark-96.png";
import { useAuth } from "@/features/auth/AuthContext";
import { NAV_ITEMS } from "@/routes/navigation";
import { paths } from "@/routes/paths";
import { layoutSizes } from "@/styles/theme";

const BRAND_NAME = "Vacation Rental Hotline";

/** Highlights the section of the current page, including its add/edit/detail sub-pages. */
function getSelectedKey(pathname: string): string | undefined {
  if (pathname === paths.dashboard) return paths.dashboard;
  return NAV_ITEMS.find((item) => item.path !== paths.dashboard && pathname.startsWith(item.path))
    ?.path;
}

/** "Ada Lovelace" -> "AL", shown in the account avatar. */
function getInitials(name: string | undefined): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "A";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

export function AppLayout() {
  // Below the md breakpoint (768px) the menu moves into a drawer so pages get the full width.
  const isMobile = Grid.useBreakpoint().md === false;
  const [collapsed, setCollapsed] = useState(false);
  // The drawer belongs to the page it was opened on, so it closes by itself after navigating.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const brandNameId = useId();
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { me, can, signOut } = useAuth();
  const selectedKey = getSelectedKey(pathname);
  const menuItems: MenuProps["items"] = NAV_ITEMS.filter((item) => can(item.permission)).map(
    (item) => ({
      key: item.path,
      icon: item.icon,
      label: <Link to={item.path}>{item.label}</Link>,
    }),
  );
  const showCollapsed = collapsed && !isMobile;
  const closeMenu = () => setMenuOpenOn(null);

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
      if (key === "sign-out") void signOut();
    },
  };

  const sidebarContent = (
    <>
      <div className={showCollapsed ? "app-brand app-brand--collapsed" : "app-brand"}>
        {/* The name is shown as text when expanded; the image carries it when collapsed. */}
        <img src={logoMark} alt={showCollapsed ? BRAND_NAME : ""} className="app-brand__mark" />
        {!showCollapsed && (
          <span id={brandNameId} className="app-brand__name">
            {BRAND_NAME}
          </span>
        )}
      </div>
      <nav aria-label="Main">
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={selectedKey ? [selectedKey] : []}
          onClick={closeMenu}
          className="app-menu"
        />
      </nav>
    </>
  );

  return (
    <Layout className="app-shell">
      {isMobile ? (
        <Drawer
          placement="left"
          size={layoutSizes.siderWidth}
          open={menuOpenOn === pathname}
          onClose={closeMenu}
          closable={false}
          aria-labelledby={brandNameId}
          classNames={{ body: "app-drawer__body" }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Layout.Sider
          theme="light"
          width={layoutSizes.siderWidth}
          collapsedWidth={layoutSizes.siderCollapsedWidth}
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
          className="app-sider"
        >
          {sidebarContent}
        </Layout.Sider>
      )}
      <Layout>
        <Layout.Header className="app-header">
          <div className="app-header__start">
            {isMobile ? (
              <>
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMenuOpenOn(pathname)}
                  aria-label="Open menu"
                />
                <img src={logoMark} alt={BRAND_NAME} className="app-brand__mark" />
              </>
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed((value) => !value)}
                aria-label={collapsed ? "Expand menu" : "Collapse menu"}
              />
            )}
          </div>
          <Dropdown menu={accountMenu} trigger={["click"]} placement="bottomRight">
            {/* Named by its text (name and role), which stays readable to screen readers on phones. */}
            <Button type="text" className="app-account">
              <Avatar className="app-account__avatar" aria-hidden>
                {getInitials(me?.name)}
              </Avatar>
              <span className="app-account__text">
                <Typography.Text strong>{me?.name ?? "Account"}</Typography.Text>
                {me?.roleLabel && <span className="app-account__role">{me.roleLabel}</span>}
              </span>
              <DownOutlined className="app-account__caret" />
            </Button>
          </Dropdown>
        </Layout.Header>
        <Layout.Content className="app-content">
          <Spin spinning={navigation.state === "loading"} delay={200}>
            <Outlet />
          </Spin>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
