import React from "react";
import { Modal, Input, Form, Select } from "antd";
import { execUpdateProfile } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";
import ageRange from "../utils/ageRange";
import TextArea from "antd/lib/input/TextArea";

export default function EditGeneralDetails(props) {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();
  const onEdit = async (val) => {
    console.log(val);
    setLoading(true);
    try {
      const res = await execUpdateProfile(val);
      setLoading(false);
      notifySuccess(res.message);
      form.resetFields();
      props.onCancel(true);
    } catch (err) {
      setLoading(false);
      notifyError(err.message);
    }
  };

  React.useEffect(() => {
    if (!props.data) return;
    form.setFieldsValue({ ...props.data });
  }, [props.data]);

  return (
    <div>
      <Modal
        title="Edit General Details"
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
            label="Age Range"
            name="age_range"
            rules={[
              {
                required: true,
                message: "Age range is required",
              },
            ]}
          >
            <Select placeholder="eg: 21-25">
              {ageRange.map((item) => (
                <Select.Option key={item.key} value={item.value}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="full" label="Phone Number" name="phone_number">
            <Input placeholder="eg. 9805311900" />
          </Form.Item>
          <Form.Item className="full" label="Short Bio" name="short_bio">
            <TextArea placeholder="eg. I am professor" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
