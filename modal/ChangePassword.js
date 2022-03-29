import React from "react";
import { Modal, Input, Form } from "antd";
import { execChangePassword } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";

export default function ModalChangePassword(props) {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  const onEdit = async (val) => {
    setLoading(true);
    try {
      const res = await execChangePassword(val);
      setLoading(false);
      notifySuccess(res.message);
      props.onCancel();
      form.resetFields();
    } catch (err) {
      setLoading(false);
      notifyError(err.message);
    }
  };

  return (
    <div>
      <Modal
        title="Change Password"
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
            label="Old Password"
            name="old_password"
            rules={[
              {
                required: true,
                message: "Old password is required",
              },
            ]}
          >
            <Input.Password placeholder="eg. abcd1234" />
          </Form.Item>

          <Form.Item
            className="full"
            label="New Password"
            name="new_password"
            rules={[
              {
                required: true,
                message: "New password is required",
              },
            ]}
          >
            <Input.Password placeholder="eg. abcd1234" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
