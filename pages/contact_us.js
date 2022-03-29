import Head from "next/head";
import { Form, Input } from "antd";
import ModifiedButton from "../components/ModifiedButton";
import { execContactUs } from "../api/apis";
import { notifyError, notifySuccess } from "../utils/notification";
import { useRouter } from "next/router";
import TextArea from "antd/lib/input/TextArea";

export default function register({ login }) {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onOk = async (val) => {
    console.log(val);
    setLoading(true);
    try {
      const res = await execContactUs(val);
      setLoading(false);
      notifySuccess(res.message);
      router.push("/");
    } catch (err) {
      notifyError(err.message);
      setLoading(false);
    }
  };

  return (
    <section id="auth">
      <Head>
        <meta name="description" content="Data camp login page" />
      </Head>
      <main>
        <div className="auth-wrapper">
          <header>
            <h1 className="section-title text center bold">Contact Us</h1>
          </header>
          <br />
          <Form onFinish={onOk} form={form}>
            <div className="form-field-wrapper">
              <Form.Item
                className="full"
                label="Full Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Full name is required",
                  },
                ]}
              >
                <Input placeholder="eg. John" />
              </Form.Item>

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

              <Form.Item className="full" label="Phone Number" name="phone">
                <Input placeholder="eg. +1000000" />
              </Form.Item>

              <Form.Item
                className="full"
                label="Subject"
                name="contact_for"
                rules={[
                  {
                    required: true,
                    message: "Subject is required",
                  },
                ]}
              >
                <Input placeholder="eg. john@gmail.com" />
              </Form.Item>
            </div>
            <Form.Item
              className="full"
              label="Message"
              name="message"
              rules={[
                {
                  required: true,
                  message: "Message is required",
                },
              ]}
            >
              <TextArea placeholder="Detailed reason of contacting us" />
            </Form.Item>
            <br />
            <ModifiedButton block htmlType="submit" text="Submit" type="primary" loading={loading} />
          </Form>
        </div>
      </main>
    </section>
  );
}
