import { Form, Input } from "antd";
import ModifiedButton from "../components/ModifiedButton";
import Link from "next/link";
import { useRouter } from "next/router";
import { execResetPassword } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";

export default function reset_password({ query }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({ ...query });
  }, []);

  const onLogin = async (values) => {
    setLoading(true);
    try {
      const res = await execResetPassword(values);
      notifySuccess(res.message);
      setLoading(false);
      router.push("/login");
    } catch (err) {
      if (err.message) notifyError(err.message);
      setLoading(false);
    }
  };

  return (
    <section id="auth">
      <main>
        <div className="auth-wrapper">
          <header>
            <h1 className="section-title text center bold">Reset Your Password</h1>
          </header>
          <br />
          <Form form={form} onFinish={onLogin}>
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
              <Input disabled />
            </Form.Item>

            <Form.Item
              className="full"
              label="Reset Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Reset code is required",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              className="full"
              label="New Password"
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
            <ModifiedButton block loading={loading} htmlType="submit" text="Reset Password" type="primary" />

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

reset_password.getInitialProps = ({ query }) => {
  const email = query.email || "";
  const code = query.code || "";
  return { query };
};
