import { axiosInstanceSSR } from "../api/ssrInterceptor";
import { baseUrl } from "../api/apis";
import Link from "next/link";
import { LikeOutlined } from "@ant-design/icons";
import { Pagination, Input } from "antd";
import { useRouter } from "next/router";

export default function blogs({ data, error }) {
  const router = useRouter();

  return (
    <div className="blogs">
      <div className="wrap">
        <br />
        <div className="flex jcsb ci">
          <h2>
            <b>Blogs</b>
          </h2>
          {/* {data.total_page} */}
          {data && (
            <Pagination
              onChange={(val) => {
                router.push("/blogs?page=" + val + "&per_page=" + data.per_page);
              }}
              total={data.total}
              current={data.page}
              showSizeChanger
              pageSize={data.per_page}
              onShowSizeChange={(val, perPage) => {
                router.push("/blogs?page=" + val + "&per_page=" + perPage);
              }}
            />
          )}
        </div>
        <br />
        <div className="res-search">
          <Input.Search
            placeholder="Search Blogs"
            onSearch={(val) => {
              if (data) router.push("/blogs?page=" + data.page + "&per_page=" + data.per_page + "&q=" + val);
              else router.push("/blogs?q=" + val);
            }}
            allowClear
            onChange={(e) => {
              if (!e.target.value) {
                if (data) router.push("/blogs?page=" + data.page + "&per_page=" + data.per_page + "&q=");
                else router.push("/blogs?q=");
              }
            }}
          ></Input.Search>
        </div>
        <br />
        <div className="latest-write blog-page-items">
          {error && <p className="text red">{error.message}</p>}
          {data &&
            data.blogs.map((item) => (
              <Link key={item._id} href="/blog/[slug]" as={"/blog/" + item.slug}>
                <a>
                  <div key={item._id} className="content">
                    <div className="like">
                      <div className="flex ci">
                        <LikeOutlined />
                        <p>{item.like_count}</p>
                      </div>
                    </div>
                    <img src={item.cover_photo} alt="" />

                    <header>
                      <p className="text dim">{item.created_at}</p>
                      <h1 className="article-title">{item.title}</h1>
                      <p className="text dim">
                        {item.user && item.user.first_name} {item.user && item.user.last_name}
                      </p>
                    </header>
                  </div>
                </a>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

blogs.getInitialProps = async ({ query }) => {
  const page = (query && query.page) || 1;
  const per_page = (query && query.per_page) || 20;
  const q = (query && query.q) || "";

  try {
    const res = await axiosInstanceSSR.get(baseUrl + "/blog_user?page=" + page + "&per_page=" + per_page + "&q=" + q);
    // console.log(res);
    return { data: res };
  } catch (err) {
    return { error: err };
  }
};
