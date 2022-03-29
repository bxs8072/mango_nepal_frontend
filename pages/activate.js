import { useRouter } from "next/router";
import { baseUrl } from "../api/apis";
import { axiosInstanceSSR } from "../api/ssrInterceptor";
import { notifySuccess } from "../utils/notification";

export default function active({ data, error, login }) {
  const router = useRouter();

  React.useEffect(() => {
    if (data) {
      console.log(data);
      notifySuccess(data.message);
      login(data.token, data.data);
      if (data.first_log) router.push("/education_details");
      else router.push("/");
    }
  }, [data]);

  return (
    <div>
      <div className="wrap">
        <br />
        <h1>Activating your account....</h1>
        <br />
        {error && <p className="text red">{error.message}</p>}
      </div>
    </div>
  );
}

active.getInitialProps = async ({ query }) => {
  const email = query.email || "";
  const code = query.code || "";
  try {
    const res = await axiosInstanceSSR.post(baseUrl + "/activate_account", { email, code });
    return { data: res };
  } catch (err) {
    return { error: err };
  }
};
