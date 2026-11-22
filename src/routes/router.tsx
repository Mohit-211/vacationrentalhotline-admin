import type { ComponentType } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/PageLoader";
import type { Permission } from "@/features/auth/permissions";
import { HomeRoute } from "./HomeRoute";
import { LegacyRedirect } from "./LegacyRedirect";
import { NotFoundPage } from "./NotFoundPage";
import { paths } from "./paths";
import { RequireAuth } from "./RequireAuth";
import { RequirePermission } from "./RequirePermission";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

/** Loads a page's code the first time its route is visited. */
function lazyPage<Name extends string>(
  load: () => Promise<Record<Name, ComponentType>>,
  name: Name,
): RouteObject["lazy"] {
  return async () => ({ Component: (await load())[name] });
}

/** Routes that only roles with `permission` can open. */
function allowed(permission: Permission, children: RouteObject[]): RouteObject {
  return { element: <RequirePermission permission={permission} />, children };
}

/**
 * URLs from earlier versions of the panel, redirected so bookmarks keep working. Records now
 * have UUIDs, so links to a single record from the old panel go to its list.
 */
const LEGACY_REDIRECTS: Array<[from: string, to: string]> = [
  ["users", paths.customers],
  ["users/new", paths.newCustomer],
  ["users/:userId", paths.customers],
  ["admins", paths.staff],
  ["admins/new", paths.newStaff],
  ["admins/:adminId/edit", paths.staff],
  ["contact", paths.messages],
  ["viewAdmin", paths.profile],
  ["adminList", paths.staff],
  ["addAdmin", paths.newStaff],
  ["editAdmin/:adminId", paths.staff],
  ["addUser", paths.newCustomer],
  ["viewUser/:userId", paths.customers],
  ["support", paths.messages],
  ["viewProperty/:propertyId", paths.properties],
  ["viewPropertyDetails/:propertyId", paths.properties],
  ["loginLogs", paths.signIns],
  ["error401", paths.dashboard],
];

const appRoutes: RouteObject[] = [
  {
    element: <HomeRoute />,
    children: [
      {
        index: true,
        lazy: lazyPage(() => import("@/features/dashboard/pages/DashboardPage"), "DashboardPage"),
      },
    ],
  },
  {
    path: "profile",
    lazy: lazyPage(() => import("@/features/auth/pages/ProfilePage"), "ProfilePage"),
  },
  {
    path: "change-password",
    lazy: lazyPage(() => import("@/features/auth/pages/ChangePasswordPage"), "ChangePasswordPage"),
  },
  allowed("customers.view", [
    {
      path: "customers",
      lazy: lazyPage(() => import("@/features/customers/pages/CustomersPage"), "CustomersPage"),
    },
    {
      path: "customers/:customerId",
      lazy: lazyPage(
        () => import("@/features/customers/pages/CustomerDetailsPage"),
        "CustomerDetailsPage",
      ),
    },
    {
      path: "properties",
      lazy: lazyPage(() => import("@/features/properties/pages/PropertiesPage"), "PropertiesPage"),
    },
    {
      path: "properties/:propertyId",
      lazy: lazyPage(
        () => import("@/features/properties/pages/PropertyDetailsPage"),
        "PropertyDetailsPage",
      ),
    },
    {
      path: "payments",
      lazy: lazyPage(() => import("@/features/payments/pages/PaymentsPage"), "PaymentsPage"),
    },
    {
      path: "payments/:paymentId",
      lazy: lazyPage(
        () => import("@/features/payments/pages/PaymentDetailsPage"),
        "PaymentDetailsPage",
      ),
    },
  ]),
  allowed("customers.manage", [
    {
      path: "customers/new",
      lazy: lazyPage(
        () => import("@/features/customers/pages/CustomerCreatePage"),
        "CustomerCreatePage",
      ),
    },
    {
      path: "customers/:customerId/edit",
      lazy: lazyPage(
        () => import("@/features/customers/pages/CustomerEditPage"),
        "CustomerEditPage",
      ),
    },
    {
      path: "customers/:customerId/properties/new",
      lazy: lazyPage(
        () => import("@/features/properties/pages/PropertyCreatePage"),
        "PropertyCreatePage",
      ),
    },
    {
      path: "properties/:propertyId/edit",
      lazy: lazyPage(
        () => import("@/features/properties/pages/PropertyEditPage"),
        "PropertyEditPage",
      ),
    },
  ]),
  allowed("messages.view", [
    {
      path: "messages",
      lazy: lazyPage(() => import("@/features/messages/pages/MessagesPage"), "MessagesPage"),
    },
  ]),
  allowed("activity.view", [
    {
      path: "sign-ins",
      lazy: lazyPage(() => import("@/features/sign-ins/pages/SignInsPage"), "SignInsPage"),
    },
  ]),
  allowed("staff.manage", [
    {
      path: "staff",
      lazy: lazyPage(() => import("@/features/staff/pages/StaffPage"), "StaffPage"),
    },
    {
      path: "staff/new",
      lazy: lazyPage(() => import("@/features/staff/pages/StaffCreatePage"), "StaffCreatePage"),
    },
    {
      path: "staff/:staffId/edit",
      lazy: lazyPage(() => import("@/features/staff/pages/StaffEditPage"), "StaffEditPage"),
    },
    {
      path: "roles",
      lazy: lazyPage(() => import("@/features/roles/pages/RolesPage"), "RolesPage"),
    },
    {
      path: "roles/new",
      lazy: lazyPage(() => import("@/features/roles/pages/RoleCreatePage"), "RoleCreatePage"),
    },
    {
      path: "roles/:roleName/edit",
      lazy: lazyPage(() => import("@/features/roles/pages/RoleEditPage"), "RoleEditPage"),
    },
  ]),
  ...LEGACY_REDIRECTS.map(([path, to]) => ({ path, element: <LegacyRedirect to={to} /> })),
  { path: "*", Component: NotFoundPage },
];

export const router = createBrowserRouter([
  {
    HydrateFallback: PageLoader,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        path: paths.login,
        lazy: lazyPage(() => import("@/features/auth/pages/LoginPage"), "LoginPage"),
      },
      {
        path: paths.forgotPassword,
        lazy: lazyPage(
          () => import("@/features/auth/pages/ForgotPasswordPage"),
          "ForgotPasswordPage",
        ),
      },
      {
        path: paths.resetPassword,
        lazy: lazyPage(
          () => import("@/features/auth/pages/ResetPasswordPage"),
          "ResetPasswordPage",
        ),
      },
      {
        Component: RequireAuth,
        children: [
          { Component: AppLayout, ErrorBoundary: RouteErrorBoundary, children: appRoutes },
        ],
      },
    ],
  },
]);
