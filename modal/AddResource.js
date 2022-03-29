import React from "react";
import { Modal, Input, Form } from "antd";
import { execAddResource } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";

export default function AddResource(props) {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  const onEdit = async (val) => {
    setLoading(true);
    try {
      const res = await execAddResource(val);
      form.resetFields();
      setLoading(false);
      notifySuccess(res.message);
      props.onCancel(true);
    } catch (err) {
      setLoading(false);
      notifyError(err.message);
    }
  };

  return (
    <div>
      <Modal
        title="Add Resource"
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
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Resource title is required",
              },
            ]}
          >
            <Input placeholder="eg. Learn Programming!" />
          </Form.Item>
          <Form.Item
            className="full"
            label="Link"
            name="link"
            rules={[
              {
                required: true,
                message: "Resource link is required",
              },
            ]}
          >
            <Input placeholder="eg. https://youtube.com" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
