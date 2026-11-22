import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Flex, Form, Input, Result, Typography } from "antd";
import { Link, useSearchParams } from "react-router";
import logo from "@/assets/logo-480.png";
import { paths } from "@/routes/paths";
import { getErrorCode, getErrorMessage } from "@/utils/errors";
import { resetPassword } from "../api";
import { confirmPasswordRules, newPasswordRules } from "../passwordRules";
import type { ResetPasswordValues } from "../types";

/** Opened from the emailed link: `?token=…`, or `?error=INVALID_TOKEN` for a used or old link. */
export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const linkError = searchParams.get("error");
  const resetMutation = useMutation({
    mutationFn: (values: ResetPasswordValues) => resetPassword(token ?? "", values.newPassword),
  });

  const invalidLink =
    !token || linkError !== null || getErrorCode(resetMutation.error) === "INVALID_TOKEN";

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
                Password changed
              </Typography.Title>
            }
            subTitle="Sign in with your new password."
            extra={
              <Link to={paths.login}>
                <Button type="primary">Sign in</Button>
              </Link>
            }
          />
        ) : invalidLink ? (
          <Result
            status="warning"
            title={
              <Typography.Title level={1} className="result-title">
                This link has expired
              </Typography.Title>
            }
            subTitle="Reset links work once and for a limited time. Ask for a new one."
            extra={
              <Link to={paths.forgotPassword}>
                <Button type="primary">Send a new link</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="auth-heading">
              <Typography.Title level={1} className="auth-heading__title">
                Choose a new password
              </Typography.Title>
              <Typography.Text type="secondary">
                At least 8 characters, with a letter and a number.
              </Typography.Text>
            </div>
            <Form<ResetPasswordValues>
              layout="vertical"
              requiredMark={false}
              onFinish={(values) => resetMutation.mutate(values)}
            >
              <Form.Item label="New password" name="newPassword" rules={newPasswordRules}>
                <Input.Password size="large" autoComplete="new-password" autoFocus />
              </Form.Item>
              <Form.Item
                label="Confirm new password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={confirmPasswordRules("newPassword")}
              >
                <Input.Password size="large" autoComplete="new-password" />
              </Form.Item>
              {resetMutation.isError && (
                <Alert
                  type="error"
                  showIcon
                  title={getErrorMessage(resetMutation.error, "Could not change the password.")}
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
                Change password
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
