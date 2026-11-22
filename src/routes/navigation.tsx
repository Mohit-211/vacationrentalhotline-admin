import {
  ApartmentOutlined,
  ContactsOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  HistoryOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type { Permission } from "@/features/auth/permissions";
import { paths } from "./paths";

export interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
  /** The menu shows the item only to roles with this permission. */
  permission: Permission;
}

/** The sidebar, in order. Pages a role can't open are left out of its menu. */
export const NAV_ITEMS: NavItem[] = [
  {
    path: paths.dashboard,
    label: "Dashboard",
    icon: <DashboardOutlined />,
    permission: "dashboard.view",
  },
  {
    path: paths.customers,
    label: "Customers",
    icon: <TeamOutlined />,
    permission: "customers.view",
  },
  {
    path: paths.properties,
    label: "Properties",
    icon: <HomeOutlined />,
    permission: "customers.view",
  },
  {
    path: paths.payments,
    label: "Payments",
    icon: <CreditCardOutlined />,
    permission: "customers.view",
  },
  {
    path: paths.messages,
    label: "Contact forms",
    icon: <ContactsOutlined />,
    permission: "messages.view",
  },
  {
    path: paths.signIns,
    label: "Sign-in history",
    icon: <HistoryOutlined />,
    permission: "activity.view",
  },
  {
    path: paths.staff,
    label: "Staff",
    icon: <SafetyCertificateOutlined />,
    permission: "staff.manage",
  },
  { path: paths.roles, label: "Roles", icon: <ApartmentOutlined />, permission: "staff.manage" },
];
