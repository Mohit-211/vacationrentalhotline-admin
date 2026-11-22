import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { Navigate, useLocation, type Location } from "react-router";
import logo from "@/assets/logo.png";
import { paths } from "@/routes/paths";
import { getErrorMessage, getErrorStatus } from "@/utils/errors";
import { login, type LoginCredentials } from "../api";
import { useAuth } from "../AuthContext";
import styles from "./LoginPage.module.css";

interface LoginLocationState {
  from?: Location;
}

export function LoginPage() {
  const { isAuthenticated, signIn } = useAuth();
  const location = useLocation();
  const loginMutation = useMutation({ mutationFn: login, onSuccess: signIn });

  if (isAuthenticated) {
    // Return to the page that sent the admin here; Users is the default landing page.
    const from = (location.state as LoginLocationState | null)?.from;
    return <Navigate to={from ?? paths.users} replace />;
  }

  return (
    <main className={styles.page}>
      <Card className={styles.card}>
        <img src={logo} alt="Vacation Rental Hotline" className={styles.logo} />
        <div className={styles.heading}>
          <Typography.Title level={3} style={{ marginBottom: 4 }}>
            Welcome back
          </Typography.Title>
          <Typography.Text type="secondary">Sign in to the admin panel</Typography.Text>
        </div>
        <Form<LoginCredentials>
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => loginMutation.mutate(values)}
        >
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: "Enter your email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input size="large" type="email" autoComplete="email" autoFocus />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password size="large" autoComplete="current-password" />
          </Form.Item>
          {loginMutation.isError && (
            <Alert
              type="error"
              showIcon
              title={getLoginErrorMessage(loginMutation.error)}
              style={{ marginBottom: 24 }}
            />
          )}
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loginMutation.isPending}
          >
            Sign in
          </Button>
        </Form>
      </Card>
    </main>
  );
}

/** One message for unknown emails and wrong passwords, so the form does not reveal which emails exist. */
function getLoginErrorMessage(error: unknown): string {
  const status = getErrorStatus(error);
  if (status !== undefined && status < 500) {
    return "Incorrect email or password.";
  }
  return getErrorMessage(error, "Could not sign in. Please try again.");
}
