import React from "react";
import { Modal, Input, Form, Checkbox } from "antd";
import { notifySuccess, notifyError } from "../utils/notification";
import { execUpdateProfile } from "../api/apis";

export default function EditMentoring(props) {
  const [loading, setLoading] = React.useState(false);
  const [needMentoring, setNeedMentoring] = React.useState(false);
  const [becomeMentor, setBecomeMentor] = React.useState(false);
  const [form] = Form.useForm();

  const onEdit = async (val) => {
    const payload = {
      education: val,
    };
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
        title="Edit Mentorship"
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
          <div className="form-field-wrapper" style={{ marginTop: "7px" }}>
            <Form.Item className="full" label="Mentor" name="become_mentor">
              <Checkbox
                checked={becomeMentor}
                onChange={(e) => {
                  const value = e.target.checked;
                  setBecomeMentor(value);
                  form.setFieldsValue({ become_mentor: value });
                }}
              >
                Available
              </Checkbox>
            </Form.Item>
            {becomeMentor && (
              <Form.Item className="full" label="Mentoring In" name="mentoring_in">
                <Input placeholder="eg. Research paper writing" />
              </Form.Item>
            )}
          </div>
          <br />
          <div className="form-field-wrapper" style={{ marginTop: "7px" }}>
            <Form.Item className="full" label="Mentee" name="need_mentoring">
              <Checkbox
                checked={needMentoring}
                onChange={(e) => {
                  const value = e.target.checked;
                  setNeedMentoring(value);
                  form.setFieldsValue({ need_mentoring: value });
                }}
              >
                Needed
              </Checkbox>
            </Form.Item>
            {needMentoring && (
              <Form.Item className="full" label="Need Mentoring In" name="need_mentoring_in">
                <Input placeholder="eg. Research paper writing" />
              </Form.Item>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
}
