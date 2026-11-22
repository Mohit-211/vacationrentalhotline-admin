import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Flex, Form, Input, Result, Typography } from "antd";
import { Link } from "react-router";
import logo from "@/assets/logo-480.png";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { requestPasswordReset } from "../api";

export function ForgotPasswordPage() {
  const resetMutation = useMutation({
    // The emailed link opens this panel's reset page, which reads ?token= from the URL.
    mutationFn: (email: string) =>
      requestPasswordReset(email, `${window.location.origin}${paths.resetPassword}`),
  });

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
        {resetMutation.isSuccess ? (
          <Result
            status="success"
            title={
              <Typography.Title level={1} className="result-title">
                Check your email
              </Typography.Title>
            }
            subTitle="If an account uses that address, we've sent it a link to choose a new password."
            extra={<Link to={paths.login}>Back to sign in</Link>}
          />
        ) : (
          <>
            <div className="auth-heading">
              <Typography.Title level={1} className="auth-heading__title">
                Forgot your password?
              </Typography.Title>
              <Typography.Text type="secondary">
                Enter your email and we'll send you a link to choose a new one.
              </Typography.Text>
            </div>
            <Form<{ email: string }>
              layout="vertical"
              requiredMark={false}
              onFinish={({ email }) => resetMutation.mutate(email)}
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
              {resetMutation.isError && (
                <Alert
                  type="error"
                  showIcon
                  title={getErrorMessage(
                    resetMutation.error,
                    "Could not send the link. Please try again.",
                  )}
                  className="auth-alert"
                />
              )}
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={resetMutation.isPending}
              >
                Send reset link
              </Button>
              <Flex justify="center" className="auth-footer">
                <Link to={paths.login}>Back to sign in</Link>
              </Flex>
            </Form>
          </>
        )}
      </Card>
    </main>
  );
}
