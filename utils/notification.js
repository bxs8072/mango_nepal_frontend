import { notification } from "antd";

export const notifyError = (msg, placement = "bottomRight") => {
  notification.error({
    message: msg,
    placement: placement,
    duration: 4,
  });
};

export const notifySuccess = (msg, placement = "bottomRight") => {
  notification.success({
    message: msg,
    placement: placement,
    duration: 4,
  });
};
