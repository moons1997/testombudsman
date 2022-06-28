import ApiService from "../api.service";
const HtmlReportService = {
  DownloadRequestPdf(agreementid, __lang) {
    return ApiService.get(
      `/report/DownloadRequestPdf/${agreementid}?__lang=${__lang}`
    );
  },
  GetRequestAsHtml(id, __lang) {
    return ApiService.get(`/report/GetRequestAsHtml/${id}?__lang=${__lang}`);
  },
  DownloadRequestPostponementPdf(agreementid, __lang) {
    return ApiService.get(
      `/report/DownloadRequestPostponementPdf/${agreementid}?__lang=${__lang}`
    );
  },
  GetRequestPostponementAsHtml(id, __lang) {
    return ApiService.get(
      `/report/GetRequestPostponementAsHtml/${id}?__lang=${__lang}`
    );
  },
  GetRequestLetterEditableContent(id) {
    return ApiService.get(`/report/GetRequestLetterEditableContent/${id}`);
  },
};
export default HtmlReportService;
