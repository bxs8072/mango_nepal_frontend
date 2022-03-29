import { baseUrl } from "../api/apis";
import { axiosInstanceSSR } from "../api/ssrInterceptor";
import Link from "next/link";
import { LikeOutlined } from "@ant-design/icons";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { useMediaQuery } from "react-responsive";

export default function Home({ data }) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1000px)" });
  const [index, setIndex] = React.useState(0);
  const [indexR, setIndexR] = React.useState(0);
  return (
    <div className="container">
      <main>
        <br />
        <div className="wrap homepage-wrapper">
          <div className="whats-hot">
            <header>
              <h1 className="section-title flex ci">
                <img src="svg/hot.svg" alt="" />
                <span style={{ marginLeft: 5 }}>Whats Hot</span>
              </h1>
            </header>
            <Link href="/blog/[slug]" as={"/blog/" + data.pinned_blog.slug}>
              <a>
                <div className="content">
                  <div className="like">
                    <div className="flex ci">
                      <LikeOutlined />
                      <p>{data.pinned_blog.like_count}</p>
                    </div>
                  </div>
                  <img src={data.pinned_blog.cover_photo} alt="" />
                  <header>
                    <p className="text dim">{data.pinned_blog.created_at}</p>
                    <h1 className="article-title">{data.pinned_blog.title}</h1>
                    <p className="text dim">
                      {data && data.pinned_blog && data.pinned_blog.user && data.pinned_blog.user.first_name} {data && data.pinned_blog && data.pinned_blog.user && data.pinned_blog.user.last_name}
                    </p>
                  </header>
                </div>
              </a>
            </Link>
          </div>
          <div className="latest-write">
            <header>
              <h1 className="section-title flex ci">
                <img src="images/lit.svg" alt="" />
                <span style={{ marginLeft: 5 }}>Latest Write</span>
              </h1>
            </header>
            {data.latest_blog.map((item) => (
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

          <div className="suggested">
            <header>
              <h1 className="section-title flex ci">
                <img src="images/award.svg" alt="" />
                <span style={{ marginLeft: 5 }}>Trending</span>
              </h1>
            </header>
            <div className="content-wrap">
              {data.trending_blog.map((item, index) => (
                <Link key={item._id} href="/blog/[slug]" as={"/blog/" + item.slug}>
                  <a>
                    <div key={item._id} className="content flex jcsb ci">
                      <aside className="left">
                        <p className="text dim">{item.created_at}</p>
                        <h1 className="article-title">
                          #{index + 1} {item.title}
                        </h1>
                        <p className="text dim">
                          {item.user && item.user.first_name} {item.user && item.user.last_name}
                        </p>
                      </aside>
                      <aside className="right">
                        <img src={item.cover_photo} alt="" />
                      </aside>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <br /> <br />
        <div className="testimonials-grid">
          {data.testimonial && data.testimonial.dataL && data.testimonial.dataL.length > 0 && (
            <div className="testimonials" style={{ width: isTabletOrMobile ? "100vw" : "40vw" }}>
              <header>
                <h1 className="section-title text center">{data.testimonial.titleL}</h1>
              </header>
              <AutoPlaySwipeableViews
                index={index}
                onChangeIndex={(index) => {
                  setIndex(index);
                }}
                containerStyle={{ width: isTabletOrMobile ? "100vw" : "40vw", boxSizing: "border-box" }}
                interval={10000}
              >
                {data.testimonial.dataL.map((item, cnt) => {
                  return <SlideCard key={cnt} {...item} />;
                })}
              </AutoPlaySwipeableViews>
              <div className="dots">
                {data.testimonial.dataL.map((_, cnt) => {
                  return <div key={cnt} onClick={() => setIndex(cnt)} className={`dot ${index === cnt && "active"}`}></div>;
                })}
              </div>
            </div>
          )}
          {data.testimonial && data.testimonial.dataR && data.testimonial.dataR.length > 0 && (
            <div className="testimonials wrap">
              <header>
                <h1 className="section-title text center">{data.testimonial.titleR}</h1>
              </header>
              <AutoPlaySwipeableViews
                index={indexR}
                onChangeIndex={(index) => {
                  setIndexR(index);
                }}
                interval={11000}
              >
                {data.testimonial.dataR.map((item, cnt) => {
                  return <SlideCard key={cnt} {...item} />;
                })}
              </AutoPlaySwipeableViews>
              <div className="dots">
                {data.testimonial.dataR.map((_, cnt) => {
                  return <div key={cnt} onClick={() => setIndexR(cnt)} className={`dot ${index === cnt && "active"}`}></div>;
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const SlideCard = ({ image, description, name, work_as }) => {
  return (
    <div className="slide-card text center">
      <div className="fig">
        <img src={image} alt="What People Say" />
      </div>
      <main>
        <p>{description}</p>
        <h3>{name}</h3>
        <h4>{work_as} </h4>
      </main>
    </div>
  );
};

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

Home.getInitialProps = async () => {
  try {
    const res = await axiosInstanceSSR.get(baseUrl + "/homepage");
    return { data: res };
  } catch (err) {
    return { error: err };
  }
};
