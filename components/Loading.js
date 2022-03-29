import { Spin } from "antd";

export default function Loading() {
  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <div style={{ transform: "scale(3)", display: "inline-block" }}>
        <Spin size="large" />
      </div>
    </div>
  );
}

export function SmallLoading() {
  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <div style={{ transform: "scale(3)", display: "inline-block" }}>
        <Spin size="small" />
      </div>
    </div>
  );
}

