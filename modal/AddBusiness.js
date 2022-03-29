import React from "react";
import { Modal, Input, Form, Select, Upload, Button, message } from "antd";
import { execAddBusiness, baseUrl } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";
import { businessList } from "../utils/helpers";
import TextArea from "antd/lib/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";

export default function AddBusiness(props) {
  const [loading, setLoading] = React.useState(false);
  const [businessLogo, setBusinessLogo] = React.useState(null);
  const [form] = Form.useForm();

  const onEdit = async (val) => {
    setLoading(true);
    try {
      const res = await execAddBusiness({ ...val, logo: businessLogo });
      setLoading(false);
      notifySuccess(res.message);
      props.onCancel(true);
      form.resetFields();
    } catch (err) {
      setLoading(false);
      notifyError(err.message);
    }
  };

  const uploadDatas = {
    name: "file",
    action: baseUrl + "/upload",
    headers: {
      authorization: props.token ? "Bearer " + props.token : "",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        console.log(info.file.response);
        setBusinessLogo(info.file.response.url);
        notifySuccess(info.file.response.message);
      } else if (info.file.status === "error") {
        notifyError("File upload failed, looks like you are not logged in");
      }
    },
  };

  return (
    <div>
      <Modal
        title="Add Organization"
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
        {businessLogo && (
          <div className="flex jcc">
            <img style={{ width: 70, height: 70, borderRadius: 40 }} src={businessLogo} alt="" />
          </div>
        )}
        <br />
        <div className="flex jcc">
          <Upload {...uploadDatas} showUploadList={false}>
            <Button>
              <UploadOutlined /> Click to Upload Organization Logo
            </Button>
          </Upload>
        </div>
        <br />
        <Form form={form} onFinish={onEdit}>
          <div className="form-field-wrapper">
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
              label="Organization Type"
              name="business_type"
              rules={[
                {
                  required: true,
                  message: "Organization Type is required",
                },
              ]}
            >
              <Select placeholder="Select one">
                {businessList.map((item, index) => (
                  <Select.Option key={index} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
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
            <Form.Item
              className="full"
              rules={[
                {
                  required: true,
                  message: "Email address is required",
                },
              ]}
              label="Email Address"
              name="email"
            >
              <Input placeholder="eg. john@gmail.com" />
            </Form.Item>
          </div>
          <Form.Item className="full" label="Phone Number" name="contact">
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
