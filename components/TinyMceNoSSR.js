import { Spin } from "antd";
import dynamic from "next/dynamic";

const TinyMceNoSSRWrapper = dynamic(import("@ckeditor/ckeditor5-build-classic"), {
  ssr: false,
  loading: () => <Spin />,
});

export default TinyMceNoSSRWrapper;
