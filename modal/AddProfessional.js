import React from "react";
import { Modal, Input, Form, Select } from "antd";
import { execAddProfession } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";
import { proList } from "../utils/helpers";
import TextArea from "antd/lib/input/TextArea";

export default function AddProfessional(props) {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  const onEdit = async (val) => {
    setLoading(true);
    try {
      const res = await execAddProfession(val);
      setLoading(false);
      notifySuccess(res.message);
      form.resetFields();
      props.onCancel(true);
    } catch (err) {
      setLoading(false);
      notifyError(err.message);
    }
  };

  return (
    <div>
      <Modal
        title="Add Professional"
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
          <div className="form-field-wrapper">
            <Form.Item
              className="full"
              label="Name Prefix"
              name="prefix"
              rules={[
                {
                  required: true,
                  message: "Name prefix is required",
                },
              ]}
            >
              <Input placeholder="eg. Mr/Mrs/Dr" />
            </Form.Item>
            <Form.Item
              className="full"
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Name is required",
                },
              ]}
            >
              <Input placeholder="eg. John Doe" />
            </Form.Item>
            <Form.Item
              className="full"
              label="Professional Type"
              name="pro_type"
              rules={[
                {
                  required: true,
                  message: "Professional Type is required",
                },
              ]}
            >
              <Select placeholder="Select one">
                {proList.map((item, index) => (
                  <Select.Option key={index} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              className="full"
              label="Specialized"
              rules={[
                {
                  required: true,
                  message: "Specialized is required",
                },
              ]}
              name="specialized"
            >
              <Input placeholder="eg. Surgeon" />
            </Form.Item>
            <Form.Item
              className="full"
              label="City Zip Code"
              name="zip"
              rules={[
                {
                  required: true,
                  message: "Zip Code is required",
                },
                () => ({
                  validator(_, value) {
                    if (value && value.length === 5) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Zip Code must be of exact 5 digit");
                  },
                }),
              ]}
            >
              <Input type="number" placeholder="eg. 00977" />
            </Form.Item>

            <Form.Item className="full" label="Home Town" name="home_town">
              <Input placeholder="eg. Kathmandu" />
            </Form.Item>
          </div>

          <Form.Item className="full" label="Contact" name="contact">
            <Input placeholder="eg. +10000000000" />
          </Form.Item>
          <Form.Item className="full" label="Description" name="description">
            <TextArea placeholder="eg. something about yourself or your profession" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
