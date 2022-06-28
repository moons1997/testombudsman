import { Notification, Translate } from "./";
const { customErrorToast } = Notification;
const { t2 } = Translate;

const CheckValidation = {
  check(arr, intl) {
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (element.type === "string") {
        if (
          element.data === null ||
          element.data === 0 ||
          element.data === "" ||
          element.data === undefined
        ) {
          customErrorToast(t2(element.message, intl));
          return false;
          break;
        }
      }
      if (element.type === "array") {
        if (
          element.data === null ||
          element.data === 0 ||
          element.data === "" ||
          element.data === undefined ||
          element.data.length === 0
        ) {
          customErrorToast(t2(element.message, intl));
          return false;
          break;
        }
      }
    }
    return true;
  },
  checkFilePdf20mb(file, intl) {
    if (file.size > 20971520 || file.type !== "application/pdf") {
      customErrorToast(t2("checkFilePdf20mb", intl));
      return false;
    }
    return true;
  },
};
export default CheckValidation;
