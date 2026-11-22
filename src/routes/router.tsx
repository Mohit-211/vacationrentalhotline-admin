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
  ["editUser/:userId", "/users/:userId/edit"],
  ["role-list", paths.roles],
  ["addRole", paths.newRole],
  ["editRole/:roleId", "/roles/:roleId/edit"],
  ["addService", paths.newService],
  ["viewService/:serviceId", "/services/:serviceId"],
  ["editService/:serviceId", "/services/:serviceId/edit"],
  ["banner", paths.banners],
  ["addBanner", paths.newBanner],
  ["editBanner/:bannerId", "/banners/:bannerId/edit"],
  ["termsAndConditions", paths.terms],
  ["editTermsAndConditions", paths.editTerms],
  ["aboutUs", paths.about],
  ["editAboutUs", paths.editAbout],
  ["support", paths.contact],
  ["viewProperty/:propertyId", "/properties/:propertyId"],
  ["viewPropertyDetails/:propertyId", "/properties/:propertyId"],
  ["loginLogs", paths.loginActivity],
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

  { path: "users", lazy: lazyPage(() => import("@/features/users/pages/UsersPage"), "UsersPage") },
  {
    path: "users/new",
    lazy: lazyPage(() => import("@/features/users/pages/UserCreatePage"), "UserCreatePage"),
  },
  {
    path: "users/:userId",
    lazy: lazyPage(() => import("@/features/users/pages/UserDetailsPage"), "UserDetailsPage"),
  },
  {
    path: "users/:userId/edit",
    lazy: lazyPage(() => import("@/features/users/pages/UserEditPage"), "UserEditPage"),
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

  { path: "roles", lazy: lazyPage(() => import("@/features/roles/pages/RolesPage"), "RolesPage") },
  {
    path: "roles/new",
    lazy: lazyPage(() => import("@/features/roles/pages/RoleCreatePage"), "RoleCreatePage"),
  },
  {
    path: "roles/:roleId/edit",
    lazy: lazyPage(() => import("@/features/roles/pages/RoleEditPage"), "RoleEditPage"),
  },

  {
    path: "services",
    lazy: lazyPage(() => import("@/features/services/pages/ServicesPage"), "ServicesPage"),
  },
  {
    path: "services/new",
    lazy: lazyPage(
      () => import("@/features/services/pages/ServiceCreatePage"),
      "ServiceCreatePage",
    ),
  },
  {
    path: "services/:serviceId",
    lazy: lazyPage(
      () => import("@/features/services/pages/ServiceDetailsPage"),
      "ServiceDetailsPage",
    ),
  },
  {
    path: "services/:serviceId/edit",
    lazy: lazyPage(() => import("@/features/services/pages/ServiceEditPage"), "ServiceEditPage"),
  },

  {
    path: "banners",
    lazy: lazyPage(() => import("@/features/banners/pages/BannersPage"), "BannersPage"),
  },
  {
    path: "banners/new",
    lazy: lazyPage(() => import("@/features/banners/pages/BannerCreatePage"), "BannerCreatePage"),
  },
  {
    path: "banners/:bannerId/edit",
    lazy: lazyPage(() => import("@/features/banners/pages/BannerEditPage"), "BannerEditPage"),
  },

  {
    path: "content/terms",
    lazy: lazyPage(() => import("@/features/content/pages/TermsPage"), "TermsPage"),
  },
  {
    path: "content/terms/edit",
    lazy: lazyPage(() => import("@/features/content/pages/TermsEditPage"), "TermsEditPage"),
  },
  {
    path: "content/about",
    lazy: lazyPage(() => import("@/features/content/pages/AboutPage"), "AboutPage"),
  },
  {
    path: "content/about/edit",
    lazy: lazyPage(() => import("@/features/content/pages/AboutEditPage"), "AboutEditPage"),
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
  {
    path: "login-activity",
    lazy: lazyPage(
      () => import("@/features/login-activity/pages/LoginActivityPage"),
      "LoginActivityPage",
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
