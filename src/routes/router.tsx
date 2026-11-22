import type { ComponentType } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/PageLoader";
import { LegacyRedirect } from "./LegacyRedirect";
import { NotFoundPage } from "./NotFoundPage";
import { paths } from "./paths";
import { RequireAuth } from "./RequireAuth";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

/** Loads a page's code the first time its route is visited. */
function lazyPage<Name extends string>(
  load: () => Promise<Record<Name, ComponentType>>,
  name: Name,
): RouteObject["lazy"] {
  return async () => ({ Component: (await load())[name] });
}

/** URLs from the previous version of the app, redirected so bookmarks keep working. */
const LEGACY_REDIRECTS: Array<[from: string, to: string]> = [
  ["reset-password", paths.changePassword],
  ["viewAdmin", paths.profile],
  ["adminList", paths.admins],
  ["addAdmin", paths.newAdmin],
  ["editAdmin/:adminId", "/admins/:adminId/edit"],
  ["addUser", paths.newUser],
  ["viewUser/:userId", "/users/:userId"],
  ["support", paths.contact],
  ["viewProperty/:propertyId", "/properties/:propertyId"],
  ["viewPropertyDetails/:propertyId", "/properties/:propertyId"],
  ["error401", paths.users],
];

const appRoutes: RouteObject[] = [
  {
    index: true,
    lazy: lazyPage(() => import("@/features/dashboard/pages/DashboardPage"), "DashboardPage"),
  },
  {
    path: "profile",
    lazy: lazyPage(() => import("@/features/auth/pages/ProfilePage"), "ProfilePage"),
  },
  {
    path: "change-password",
    lazy: lazyPage(() => import("@/features/auth/pages/ChangePasswordPage"), "ChangePasswordPage"),
  },
  {
    path: "users",
    lazy: lazyPage(() => import("@/features/users/pages/UsersPage"), "UsersPage"),
  },
  {
    path: "users/new",
    lazy: lazyPage(() => import("@/features/users/pages/UserCreatePage"), "UserCreatePage"),
  },
  {
    path: "users/:userId",
    lazy: lazyPage(() => import("@/features/users/pages/UserDetailsPage"), "UserDetailsPage"),
  },
  {
    path: "admins",
    lazy: lazyPage(() => import("@/features/admins/pages/AdminsPage"), "AdminsPage"),
  },
  {
    path: "admins/new",
    lazy: lazyPage(() => import("@/features/admins/pages/AdminCreatePage"), "AdminCreatePage"),
  },
  {
    path: "admins/:adminId/edit",
    lazy: lazyPage(() => import("@/features/admins/pages/AdminEditPage"), "AdminEditPage"),
  },
  {
    path: "contact",
    lazy: lazyPage(
      () => import("@/features/contact/pages/ContactSubmissionsPage"),
      "ContactSubmissionsPage",
    ),
  },
  {
    path: "payments",
    lazy: lazyPage(() => import("@/features/payments/pages/PaymentsPage"), "PaymentsPage"),
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
        Component: RequireAuth,
        children: [
          { Component: AppLayout, ErrorBoundary: RouteErrorBoundary, children: appRoutes },
        ],
      },
    ],
  },
]);
