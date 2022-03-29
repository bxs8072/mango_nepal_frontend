import React from "react";
import { Modal, Input, Form } from "antd";
import { execResetPasswordInit } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";

export default function ModalForgetPassword(props) {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  const onEdit = async (val) => {
    setLoading(true);
    try {
      const res = await execResetPasswordInit(val);
      setLoading(false);
      notifySuccess(res.message);
      props.onCancel();
    } catch (err) {
      setLoading(false);
      notifyError(err.message);
    }
  };

  return (
    <div>
      <Modal
        title="Forget your password?"
        visible={props.visible}
        maskClosable={false}
        centered
        onCancel={() => {
          props.onCancel();
        }}
        onOk={() => {
          form.submit();
        }}
        okButtonProps={{ loading: loading }}
        cancelButtonProps={{}}
      >
        <Form form={form} onFinish={onEdit}>
          <Form.Item
            className="full"
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: "Email address is required",
              },
            ]}
          >
            <Input placeholder="eg. john@gmail.com" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
