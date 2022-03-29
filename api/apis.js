import { axiosInstance } from "./interceptor";
import Axios from "axios";

// export const baseUrl = "https://mangonepal.com/v1";
export const baseUrl = "http://localhost:6001/v1";

export const execFetchConversation = async () => {
  return axiosInstance.get(baseUrl + "/fetch/conversation")
}

export const execFetchUser = async (id) => {
  const response = await Axios.post(baseUrl + "/userdata", { id })
  return response.data
}

export const execSendMessage = ({ reciever, message, chatId }) => {
  return axiosInstance.post(baseUrl + "/chat/send", { reciever, message, chatid: chatId });
};

export const execFetchMessages = ({ reciever }) => {
  return axiosInstance.post(baseUrl + "/chat/get", { reciever });
};

export const execContactUs = (payload) => {
  return axiosInstance.post(baseUrl + "/contact_us", payload);
};

export const execLogin = (payload) => {
  return axiosInstance.post(baseUrl + "/login", payload);
};
export const execGoogleLogin = (payload) => {
  return axiosInstance.post(baseUrl + "/login/google", payload);
};

export const execResetPassword = (payload) => {
  return axiosInstance.post(baseUrl + "/reset_password", payload);
};
export const execChangePassword = (payload) => {
  return axiosInstance.post(baseUrl + "/change_password", payload);
};
export const execResetPasswordInit = (payload) => {
  return axiosInstance.post(baseUrl + "/init_reset_password", payload);
};

export const execRegister = (payload) => {
  return axiosInstance.post(baseUrl + "/register", payload);
};

export const execDeleteMyself = () => {
  return axiosInstance.delete(baseUrl + "/myself");
};

export const execStoreEducation = (payload) => {
  return axiosInstance.post(baseUrl + "/education", payload);
};

export const execGetEducation = (level = "All", q = "", page = "1", per_page = "20") => {
  return axiosInstance.get(baseUrl + "/education?level=" + level + "&q=" + q + "&page=" + page + "&per_page=" + per_page);
};
export const execGetMentors = (q = "", page = "1", per_page = "20") => {
  return axiosInstance.get(baseUrl + "/education/mentor?q=" + q + "&page=" + page + "&per_page=" + per_page);
};
export const execGetMentee = (q = "", page = "1", per_page = "20") => {
  return axiosInstance.get(baseUrl + "/education/mentee?q=" + q + "&page=" + page + "&per_page=" + per_page);
};
export const execGetComment = (slug) => {
  return axiosInstance.get(baseUrl + "/comment/" + slug);
};
export const execAddComment = (slug, payload) => {
  return axiosInstance.post(baseUrl + "/comment/" + slug, payload);
};

export const execDeleteComment = (id) => {
  return axiosInstance.delete(baseUrl + "/comment/" + id);
};

export const execDoLike = (slug) => {
  return axiosInstance.post(baseUrl + "/like/" + slug);
};

export const execGetUserProfile = (uId) => {
  return axiosInstance.post(baseUrl + "/user_profile/" + uId);
};

export const execGetLevelStats = () => {
  return axiosInstance.get(baseUrl + "/stats/level");
};

export const execGetAgeStats = () => {
  return axiosInstance.get(baseUrl + "/stats/age");
};
export const execGetStateStats = () => {
  return axiosInstance.get(baseUrl + "/stats/state");
};
export const execGetStateHometown = () => {
  return axiosInstance.get(baseUrl + "/stats/hometown");
};
export const execGetMyProfile = () => {
  return axiosInstance.get(baseUrl + "/profile");
};

export const execUpdateProfile = (payload) => {
  return axiosInstance.patch(baseUrl + "/profile", payload);
};

export const execFileUpload = (payload) => {
  return axiosInstance.post(baseUrl + "/upload", payload);
};

export const execAddBlog = (payload) => {
  return axiosInstance.post(baseUrl + "/blog", payload);
};
export const execGetMyBlog = () => {
  return axiosInstance.get(baseUrl + "/my/blog");
};

export const execDeleteMyBlog = (bId) => {
  return axiosInstance.delete(baseUrl + "/my_blog/" + bId);
};

export const execUpdateMyBlog = (id, payload) => {
  return axiosInstance.patch(baseUrl + "/my/blog/" + id, payload);
};

export const execAddProfession = (payload) => {
  return axiosInstance.post(baseUrl + "/professional", payload);
};
export const execGetProfession = (type, q = "") => {
  return axiosInstance.get(baseUrl + "/professional?type=" + type + "&q=" + q);
};

export const execAddBusiness = (payload) => {
  return axiosInstance.post(baseUrl + "/business", payload);
};
export const execGetBusiness = (type, q = "") => {
  return axiosInstance.get(baseUrl + "/business?type=" + type + "&q=" + q);
};

export const execAddResource = (payload) => {
  return axiosInstance.post(baseUrl + "/resource", payload);
};
export const execGetResource = (q = "") => {
  return axiosInstance.get(baseUrl + "/resource?q=" + q);
};
export const execDeleteResource = (rId) => {
  return axiosInstance.delete(baseUrl + "/resource/" + rId);
};
