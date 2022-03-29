import React from "react";
import { Modal, Input, Form, Select, AutoComplete } from "antd";
import { execUpdateProfile } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";
import districtList from "../utils/districtList";

export default function EditLocation(props) {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();
  const onEdit = async (val) => {
    const payload = {
      home_town: val.home_town,
      location: {
        zip: val.zip,
        city: val.city,
        state: val.state,
      },
    };
    setLoading(true);
    try {
      const res = await execUpdateProfile(payload);
      setLoading(false);
      notifySuccess(res.message);
      props.onCancel(true);
      form.resetFields();
    } catch (err) {
      setLoading(false);
      notifyError(err.message);
    }
  };

  React.useEffect(() => {
    if (!props.data) return;
    form.setFieldsValue({ ...props.data, ...props.data.location });
  }, [props.data]);

  return (
    <div>
      <Modal
        title="Edit Location"
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
          <Form.Item className="full" label="Home Town" name="home_town">
            <AutoComplete placeholder="Select Hometown" filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}>
              {districtList.map((item, index) => (
                <AutoComplete.Option key={index} value={item}>
                  {item}
                </AutoComplete.Option>
              ))}
            </AutoComplete>
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
        </Form>
      </Modal>
    </div>
  );
}
