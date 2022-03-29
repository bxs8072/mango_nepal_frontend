import React from "react";
import { Modal, Input, Form } from "antd";
import { execLogin, execGoogleLogin } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";
import ModifiedButton from "../components/ModifiedButton";
import Link from "next/link";
import { useGoogleLogin } from "react-google-login";

export default function LoginModal(props) {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  const clientId = "622915614418-hromd1et35upqosn6f47d3pmpogk8uk2.apps.googleusercontent.com";
  const { signIn, loaded } = useGoogleLogin({
    clientId,
    onSuccess: (data) => {
      const payload = { token: data.tokenId };
      onGoogleLogin(payload);
    },
    onFailure: (err) => {
      setLoading(false);
    },
  });

  const onGoogleLogin = async (payload) => {
    setLoading(true);
    try {
      const res = await execGoogleLogin(payload);
      props.login(res.token, res.data);
      notifySuccess(res.message);
      setLoading(false);
      props.onCancel(true);
    } catch (err) {
      if (err.message) notifyError(err.message);
      setLoading(false);
    }
  };

  const onEdit = async (val) => {
    setLoading(true);
    try {
      const res = await execLogin(val);
      props.login(res.token, res.data);
      notifySuccess(res.message);
      setLoading(false);
      props.onCancel(true);
    } catch (err) {
      if (err.message) notifyError(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal
        title="Sign In"
        visible={props.visible}
        maskClosable={false}
        centered
        onCancel={() => {
          props.onCancel();
        }}
        footer={false}
      >
        <Form form={form} onFinish={onEdit}>
          <Form.Item
            className="full"
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Email address must be valid",
              },
            ]}
          >
            <Input placeholder="eg. john@gmail.com" />
          </Form.Item>
          <Form.Item
            className="full"
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Password is required",
              },
            ]}
          >
            <Input.Password placeholder="eg. abcd1234" />
          </Form.Item>
          <br />
          <ModifiedButton block loading={loading} htmlType="submit" text="Sign In" type="primary" />
          <br />
          <br />
          <ModifiedButton
            block
            icon={googleIcon}
            loading={!loaded || loading}
            onClick={() => {
              setLoading(true);
              signIn();
            }}
            className="flex ci jcc"
            text="Continue With Google"
            type="primary"
          />
          <div style={{ marginTop: 10 }} className="link text center">
            <Link href="/register">
              <a style={{ color: "#8f068d", fontSize: 13, fontWeight: 700 }}>Create a new account</a>
            </Link>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
const googleIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" fill="#fff" style={{ marginRight: 5, marginTop: 0 }} viewBox="0 0 488 512">
    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
  </svg>
);
