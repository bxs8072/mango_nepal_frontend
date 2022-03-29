import React from "react";
import { execFileUpload } from "../api/apis";
import { Spin } from "antd";

export default function CkEditorNoSSR(props) {
  const editorRef = React.useRef();
  const [editorLoaded, setEditorLoaded] = React.useState(false);
  const { CKEditor, DecoupledEditor } = editorRef.current || {};

  React.useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react"),
      DecoupledEditor: require("@ckeditor/ckeditor5-build-decoupled-document"),
    };
    setEditorLoaded(true);

    return () => {
      editorRef.current = null;
    };
  }, []);

  return editorLoaded ? (
    <React.Fragment>
      <div id="toolbar-container"></div>
      <CKEditor
        editor={DecoupledEditor}
        data={props.data || "<p>Write Blog here</p>"}
        onInit={(editor) => {
          const toolbarContainer = document.querySelector("#toolbar-container");
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
          window.editor = editor;

          editor.plugins.get("FileRepository").createUploadAdapter = function (loader) {
            return new MyUploadAdapter(loader);
          };
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          props.setBody(data);
        }}
      />
      <br />
    </React.Fragment>
  ) : (
    <div className="flex jcc">
      <br />
      <Spin size="large" />
      <br />
    </div>
  );
}

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
    // this.url = baseUrl + "/upload";
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const data = new FormData();
          data.append("file", file);
          data.append("file_for", "BLOG_BODY");

          execFileUpload(data)
            .then((res) => {
              console.log(res.url);
              resolve({ default: res.url });
            })
            .catch((err) => {
              reject(err.message);
            });
        })
    );
  }

  // Aborts the upload process.
  abort() {
    return "";
  }
}
