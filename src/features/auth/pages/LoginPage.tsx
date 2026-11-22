import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Flex, Form, Input, Typography } from "antd";
import { Link, Navigate, useLocation, type Location } from "react-router";
import logo from "@/assets/logo-480.png";
import { paths } from "@/routes/paths";
import { getErrorCode, getErrorMessage, getErrorStatus } from "@/utils/errors";
import { useAuth } from "../AuthContext";
import { useLandingPath } from "../useLandingPath";
import type { SignInValues } from "../types";

interface LoginLocationState {
  from?: Location;
}

export function LoginPage() {
  const { status, signIn } = useAuth();
  const landingPath = useLandingPath();
  const location = useLocation();
  const signInMutation = useMutation({ mutationFn: signIn });

  if (status === "signed-in") {
    // Return to the page that sent the admin here, else the first page their role can open.
    const from = (location.state as LoginLocationState | null)?.from;
    return <Navigate to={from ?? landingPath} replace />;
  }

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <img
          src={logo}
          alt="Vacation Rental Hotline"
          width={240}
          height={90}
          className="auth-logo"
        />
        <div className="auth-heading">
          <Typography.Title level={1} className="auth-heading__title">
            Welcome back
          </Typography.Title>
          <Typography.Text type="secondary">Sign in to the admin panel</Typography.Text>
        </div>
        <Form<SignInValues>
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => signInMutation.mutate(values)}
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
          {signInMutation.isError && (
            <Alert
              type="error"
              showIcon
              title={getSignInErrorMessage(signInMutation.error)}
              className="auth-alert"
            />
          )}
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={signInMutation.isPending}
          >
            Sign in
          </Button>
          <Flex justify="center" className="auth-footer">
            <Link to={paths.forgotPassword}>Forgot password?</Link>
          </Flex>
        </Form>
      </Card>
    </main>
  );
}

function getSignInErrorMessage(error: unknown): string {
  // One message for unknown emails and wrong passwords, so the form does not reveal which exist.
  if (getErrorCode(error) === "INVALID_EMAIL_OR_PASSWORD") return "Incorrect email or password.";
  // Only said once the password is right. Customers have their own sign-in, on the website.
  if (getErrorCode(error) === "CUSTOMER_ACCOUNT") {
    return "This is a customer account. Customers sign in on the website, not here.";
  }
  if (getErrorStatus(error) === 429) {
    return "Too many attempts. Wait a few seconds and try again.";
  }
  return getErrorMessage(error, "Could not sign in. Please try again.");
}
