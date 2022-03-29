import React from "react";
// import "../css/_quill.scss";
import { Input, Form, Spin } from "antd";
import { execFileUpload, execAddBlog, baseUrl } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";
import ModifiedButton from "../components/ModifiedButton";
import { useRouter } from "next/router";
import CkEditorNoSSR from "../components/CkEditorNoSSR";

export default function AddEvents() {
  const [fileChange, setFileChange] = React.useState(null);
  const [fileUploaded, setFileUploaded] = React.useState({});
  const [fileUploadLoading, setFileUploadLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [body, setBody] = React.useState("");
  const fileRef = React.createRef();
  const router = useRouter();
  const [form] = Form.useForm();

  const addFile = () => {
    const data = new FormData();
    data.append("file", fileChange);
    data.append("file_for", "BLOG_COVER");
    setFileUploadLoading(true);
    execFileUpload(data)
      .then((res) => {
        setFileUploaded({ id: res.id, url: res.url });
        setFileUploadLoading(false);
        notifySuccess(res.message);
      })
      .catch((err) => {
        setFileUploadLoading(false);
        notifyError(err.message);
      });
  };

  React.useEffect(() => {
    if (fileChange !== null) {
      addFile();
    }
    //eslint-disable-next-line
  }, [fileChange]);

  const addEvent = async (value) => {
    let payload;
    if (!fileUploaded || !fileUploaded.id) {
      payload = { ...value, body };
    } else {
      payload = { ...value, body, cover_photo: fileUploaded.id };
    }
    setLoading(true);
    try {
      const res = await execAddBlog(payload);
      notifySuccess(res.message);
      router.push("/");
    } catch (err) {
      notifyError(err.message);
    }
  };

  React.useEffect(() => {
    router.prefetch("/");
  });

  return (
    <section id="contents" className="wrap">
      <br />
      <h1 className="title">
        <b>Write Blog</b>
      </h1>
      <input
        type="file"
        onChange={(e) => {
          setFileChange(e.target.files[0]);
        }}
        ref={fileRef}
        style={{ display: "none" }}
      />

      <br />

      <div className="inputs">
        <Form form={form} onFinish={addEvent}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gridGap: 15,
            }}
          >
            <aside>
              <div
                className="cover"
                style={{
                  background: "#fff",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  height: 150,
                  boxShadow: "var(--shadow)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                {fileUploaded.id && (
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={fileUploaded.url}
                    alt=""
                  />
                )}
              </div>
            </aside>
            <aside>
              <Form.Item
                label="Title"
                name="title"
                className="full"
                rules={[
                  {
                    required: true,
                    message: "Title is required",
                  },
                ]}
              >
                <Input placeholder="eg. this is a blog" />
              </Form.Item>
              <br />
              <ModifiedButton
                type="primary"
                loading={fileUploadLoading}
                onClick={() => {
                  fileRef.current.click();
                }}
                text="Upload Cover Photo"
              />
              <p style={{ marginTop: 10, fontSize: 12 }}>
                <b>Note:</b> Max file size 10MB
              </p>
            </aside>
          </div>
          <br />
        </Form>
        <br />
      </div>
      <div className="add-editor">
        <CkEditorNoSSR setBody={setBody} />
      </div>
      <div style={{ textAlign: "center" }}>
        <ModifiedButton text="Post Blog" onClick={() => form.submit()} loading={loading} type="primary" />
        <p style={{ marginTop: 10, fontSize: 12 }}>
          <b>Note:</b> After submission, your blog will reviewed before posting by MangoNepal.
        </p>
      </div>
    </section>
  );
}
