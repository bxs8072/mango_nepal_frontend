import Head from "next/head";
import { Form, Input } from "antd";
import Link from "next/link";
import ModifiedButton from "../components/ModifiedButton";
import { execLogin, execGoogleLogin } from "../api/apis";
import { notifyError, notifySuccess } from "../utils/notification";
import { useRouter } from "next/router";
import ModalForgetPassword from "../modal/ModalForgetPassword";
import { useGoogleLogin } from "react-google-login";

export default function log({ login }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showReset, setShowReset] = React.useState(false);

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
      login(res.token, res.data);
      notifySuccess(res.message);
      setLoading(false);
      if (res.first_log) router.push("/education_details");
      else router.push("/");
    } catch (err) {
      if (err.message) notifyError(err.message);
      setLoading(false);
    }
  };

  const onLogin = async (values) => {
    setLoading(true);
    try {
      const res = await execLogin(values);
      login(res.token, res.data);
      notifySuccess(res.message);
      setLoading(false);
      if (res.first_log) router.push("/education_details");
      else router.push("/");
    } catch (err) {
      if (err.message) notifyError(err.message);
      setLoading(false);
    }
  };

  return (
    <section id="auth">
      <Head>
        <meta name="description" content="Data camp login page" />
      </Head>
      <ModalForgetPassword visible={showReset} onCancel={() => setShowReset(false)} />
      <main>
        <div className="auth-wrapper">
          <header>
            <h1 className="section-title text center bold">Sign In</h1>
          </header>
          <br />
          <Form onFinish={onLogin}>
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
            <div className="link text right">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowReset(true);
                }}
              >
                Forget Password ?
              </a>
            </div>
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

            <div className="link text center">
              <Link href="/register">
                <a>Create a new account</a>
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </section>
  );
}

const googleIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" fill="#fff" style={{ marginRight: 5, marginTop: 0 }} viewBox="0 0 488 512">
    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
  </svg>
);
