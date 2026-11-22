import { QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
import { RouterProvider } from "react-router/dom";
import { queryClient } from "@/api/queryClient";
import { theme } from "@/styles/theme";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { router } from "@/routes/router";

export function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
