import React from "react";
import { Button } from "antd";

export default function ModifiedButton(props) {
  return (
    <Button {...props} style={{ background: props.color || "#f73a19", borderColor: props.color || "#f73a19" }}>
      {props.text}
    </Button>
  );
}
