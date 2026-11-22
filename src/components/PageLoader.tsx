import { Flex, Spin } from "antd";

export function PageLoader() {
  return (
    <Flex align="center" justify="center" style={{ minHeight: 240, height: "100%" }}>
      <Spin size="large" />
    </Flex>
  );
}
