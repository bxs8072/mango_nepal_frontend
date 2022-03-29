import Head from "next/head";
import { Form, Input, Select, Checkbox } from "antd";
import Link from "next/link";
import ModifiedButton from "../components/ModifiedButton";
import { useGoogleLogin } from "react-google-login";
import { execRegister } from "../api/apis";
import { notifyError, notifySuccess } from "../utils/notification";
import { useRouter } from "next/router";
import ageRange from "../utils/ageRange";

export default function register({ login }) {
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [googleLoaded, setGoogleLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const clientId = "622915614418-hromd1et35upqosn6f47d3pmpogk8uk2.apps.googleusercontent.com";
  const { signIn, loaded } = useGoogleLogin({
    clientId,
    onSuccess: (data) => {
      console.log(data.profileObj);
      const uP = data.profileObj;
      form.setFieldsValue({
        email: uP.email,
        first_name: uP.givenName,
        last_name: uP.familyName,
        image: uP.imageUrl,
        google: uP.googleId,
      });
      setGoogleLoading(false);
      setGoogleLoaded(true);
    },
    onFailure: (err) => {
      console.log(err);
      setGoogleLoading(false);
    },
  });

  const onOk = async (val) => {
    console.log(val);
    setLoading(true);
    try {
      const res = await execRegister(val);
      setLoading(false);
      notifySuccess(res.message);
      router.push("/login");
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
            <h1 className="section-title text center bold">Create a new account</h1>
          </header>
          <br />
          <Form onFinish={onOk} form={form}>
            <div className="form-field-wrapper">
              <Form.Item
                className="full"
                label="First Name"
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "First name is required",
                  },
                ]}
              >
                <Input placeholder="eg. John" />
              </Form.Item>

              <Form.Item
                className="full"
                label="Last Name"
                name="last_name"
                rules={[
                  {
                    required: true,
                    message: "Last name is required",
                  },
                ]}
              >
                <Input placeholder="eg. Doe" />
              </Form.Item>

              <Form.Item name="image" style={{ display: "none" }}>
                <Input type="hidden" />
              </Form.Item>

              <Form.Item name="google" style={{ display: "none" }}>
                <Input type="hidden" />
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
              <Form.Item
                className="full"
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Password is required",
                  },
                  () => ({
                    validator(_, value) {
                      if (value && value.length > 5) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Password must be of atleast 6 digit");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="eg. abcd1234" />
              </Form.Item>
              <Form.Item
                className="full"
                label="Gender"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Gender is required",
                  },
                ]}
              >
                <Select placeholder="Select Gender">
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                  <Select.Option value="Non-binary">Non-binary</Select.Option>
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
            </div>
            <br />
            <Checkbox checked={agreeTerms} onChange={(val) => setAgreeTerms(val.target.checked)}>
              Agree our
            </Checkbox>
            <a href="/terms_and_conditions" target="_blank">
              Terms & Conditions
            </a>
            <br />
            {!googleLoaded && (
              <React.Fragment>
                <br />
                <ModifiedButton
                  block
                  icon={googleIcon}
                  loading={googleLoading || !loaded}
                  onClick={() => {
                    setGoogleLoading(true);
                    signIn();
                  }}
                  className="flex ci jcc"
                  text="Continue With Google"
                  type="primary"
                />
              </React.Fragment>
            )}
            <br />

            <ModifiedButton disabled={!agreeTerms} block htmlType="submit" text="Register" type="primary" loading={loading} />

            <div className="link text center">
              <Link href="/login">
                <a>Already have an account?</a>
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
