import React from "react";
import { Modal, Input, Form, Select, AutoComplete, Checkbox } from "antd";
import universityList from "../utils/universityList";
import majorList from "../utils/majorList";
import { notifySuccess, notifyError } from "../utils/notification";
import { execUpdateProfile } from "../api/apis";

export default function EditEducation(props) {
  const [loading, setLoading] = React.useState(false);
  const [graduated, setGraduated] = React.useState(false);
  const [needMentoring, setNeedMentoring] = React.useState(false);
  const [becomeMentor, setBecomeMentor] = React.useState(false);
  const [form] = Form.useForm();

  const onEdit = async (val) => {
    const payload = {
      education: val,
    };
    console.log(payload);
    setLoading(true);
    try {
      const res = await execUpdateProfile(payload);
      setLoading(false);
      notifySuccess(res.message);
      props.onCancel(true);
    } catch (err) {
      setLoading(false);
      notifyError(err.message);
    }
  };

  React.useEffect(() => {
    if (!props.data || !props.data.education) return;
    form.setFieldsValue({ ...props.data.education });

    if (props.data.education.graduated) {
      setGraduated(true);
    }
    if (props.data.education.need_mentoring) {
      setNeedMentoring(true);
    }
    if (props.data.education.become_mentor) {
      setBecomeMentor(true);
    }
  }, [props.data]);

  return (
    <div>
      <Modal
        title="Edit Education"
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
            label="University"
            name="university"
            rules={[
              {
                required: true,
                message: "University is required",
              },
            ]}
          >
            <AutoComplete placeholder="Select University" filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}>
              {universityList.map((item, index) => (
                <AutoComplete.Option key={index} value={item}>
                  {item}
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          </Form.Item>
          <Form.Item
            className="full"
            label="Level"
            name="level"
            rules={[
              {
                required: true,
                message: "Level is required",
              },
            ]}
          >
            <Select placeholder="Select Level">
              {["Associates", "Bachelor", "Masters", "PHd", "Others"].map((item, index) => (
                <Select.Option key={index} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="full"
            label="Major"
            name="major"
            rules={[
              {
                required: true,
                message: "Major is required",
              },
            ]}
          >
            <AutoComplete placeholder="Select Major" filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}>
              {majorList.map((item, index) => (
                <AutoComplete.Option key={index} value={item}>
                  {item}
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          </Form.Item>
          <Form.Item className="full" label="Concentrations" name="concentrations">
            <Input placeholder="eg. this that" />
          </Form.Item>
          <div className="form-field-wrapper" style={{ marginTop: "7px" }}>
            <Form.Item className="full" label="Are You" name="graduated">
              <Checkbox
                checked={graduated}
                onChange={(e) => {
                  const value = e.target.checked;
                  setGraduated(value);
                  form.setFieldsValue({ graduated: value });
                }}
              >
                Graduated
              </Checkbox>
            </Form.Item>
            {graduated && (
              <Form.Item className="full" label="Graduation Year" name="graduation_year">
                <Input placeholder="eg. 2020" />
              </Form.Item>
            )}
          </div>

          <br />
          <div className="form-field-wrapper">
            <Form.Item className="full" name="need_mentoring">
              <Checkbox
                checked={needMentoring}
                onChange={(e) => {
                  const value = e.target.checked;
                  setNeedMentoring(value);
                  form.setFieldsValue({ need_mentoring: value });
                }}
              >
                Need Mentoring
              </Checkbox>
            </Form.Item>
            <Form.Item className="full" name="become_mentor">
              <Checkbox
                checked={becomeMentor}
                onChange={(e) => {
                  const value = e.target.checked;
                  setBecomeMentor(value);
                  form.setFieldsValue({ become_mentor: value });
                }}
              >
                Become Mentor
              </Checkbox>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
