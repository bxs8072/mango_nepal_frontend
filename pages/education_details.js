import Head from "next/head";
import { Form, Input, Select, Checkbox, AutoComplete } from "antd";
import Link from "next/link";
import ModifiedButton from "../components/ModifiedButton";
import universityList from "../utils/universityList";
import majorList from "../utils/majorList";
import { execStoreEducation } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";
import { useRouter } from "next/router";
import districtList from "../utils/districtList";

export default function EducationDetail() {
  const [graduated, setGraduated] = React.useState(false);
  const [needMentoring, setNeedMentoring] = React.useState(false);
  const [becomeMentor, setBecomeMentor] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onOk = async (val) => {
    setLoading(true);
    try {
      const res = await execStoreEducation(val);
      console.log(res);
      notifySuccess(res.message);
      setLoading(false);
      router.push("/");
    } catch (err) {
      console.log(err);
      notifyError(err.message);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    router.prefetch("/");
  }, []);

  return (
    <section id="auth">
      <Head>
        <meta name="description" content="Data camp login page" />
        <title>Few More Details</title>
      </Head>
      <main>
        <div className="auth-wrapper">
          <header>
            <h1 className="section-title text center bold">Few More Details</h1>
          </header>
          <br />
          <Form onFinish={onOk} form={form}>
            <Form.Item className="full" label="Home Town" name="home_town">
              <AutoComplete placeholder="Select Hometown" filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}>
                {districtList.map((item, index) => (
                  <AutoComplete.Option key={index} value={item}>
                    {item}
                  </AutoComplete.Option>
                ))}
              </AutoComplete>
            </Form.Item>
            <br />
            <h3>
              <b>Highest level of education</b>
            </h3>
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
                {["Associates", "Bachelor", "Masters", "PhD", "Others"].map((item, index) => (
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
                  value="graduated"
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
            <h3>
              <b>Mentorship</b>
            </h3>
            <div className="form-field-wrapper">
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
            <div className="form-field-wrapper">
              <Form.Item className="full" label="Mentor" name="graduated">
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

            <ModifiedButton block htmlType="submit" text="Complete Profile" type="primary" loading={loading} />

            <div className="link text center">
              <Link href="/">
                <a>Skip for now</a>
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </section>
  );
}
