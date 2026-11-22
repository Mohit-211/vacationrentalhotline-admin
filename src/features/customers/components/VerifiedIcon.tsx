import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import { Tooltip, Typography } from "antd";

/** Green check for a verified email; amber exclamation when it has not been verified yet. */
export function VerifiedIcon({ verified }: { verified: boolean }) {
  const label = verified ? "Email verified" : "Email not verified";
  return (
    <Tooltip title={label}>
      <Typography.Text type={verified ? "success" : "warning"} role="img" aria-label={label}>
        {verified ? <CheckCircleFilled /> : <ExclamationCircleFilled />}
      </Typography.Text>
    </Tooltip>
  );
}
