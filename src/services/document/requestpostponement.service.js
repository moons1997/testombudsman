import ApiService from "../api.service";
const RequestPostponementService = {
  GetList(data) {
    return ApiService.post("/RequestPostponement/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/RequestPostponement/Get");
    } else {
      return ApiService.get(`/RequestPostponement/Get/${id}`);
    }
  },
  GetByRequestId(id) {
    return ApiService.get(`/RequestPostponement/GetByRequestId/${id}`);
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/RequestPostponement/Create`, data);
    } else {
      return ApiService.post(`/RequestPostponement/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/RequestPostponement/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/RequestPostponement/GetAsSelectList`);
  },
  UploadFile(data) {
    return ApiService.post("/RequestPostponement/UploadFile", data);
  },
  DeleteFile(id) {
    return ApiService.post(`/RequestPostponement/DeleteFile/fileId=${id}`);
  },
  Send(data) {
    return ApiService.post(`/RequestPostponement/Send`, data);
  },
  ToAgree(data) {
    return ApiService.post(`/RequestPostponement/ToAgree`, data);
  },
  Revoke(data) {
    return ApiService.post(`/RequestPostponement/Revoke`, data);
  },
  Receive(data) {
    return ApiService.post(`/RequestPostponement/Receive`, data);
  },
  RefuseByModerator(data) {
    return ApiService.post(`/RequestPostponement/RefuseByModerator`, data);
  },
  ToApprove(data) {
    return ApiService.post(`/RequestPostponement/ToApprove`, data);
  },
  ReturnToModerator(data) {
    return ApiService.post(`/RequestPostponement/ReturnToModerator`, data);
  },
  Reject(data) {
    return ApiService.post(`/RequestPostponement/Reject`, data);
  },
  ToReject(data) {
    return ApiService.post(`/RequestPostponement/ToReject`, data);
  },
  Agree(data) {
    return ApiService.post(`/RequestPostponement/Agree`, data);
  },
  CancelAgreement(data) {
    return ApiService.post(`/RequestPostponement/CancelAgreement`, data);
  },
  Archive(data) {
    return ApiService.post(`/RequestPostponement/Archive`, data);
  },
  GetHistoryList(data, id) {
    return ApiService.post(`/RequestPostponement/GetHistoryList/${id}`, data);
  },
  DownloadFile(id) {
    return ApiService.print(`/RequestPostponement/DownloadFile/${id}`);
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/RequestPostponement/SaveAsExecel`, data);
  },
  GetToAgreeLetterContent(data) {
    return ApiService.post(
      `/RequestPostponement/GetToAgreeLetterContent`,
      data
    );
  },
  GetToRejectLetterContent(data) {
    return ApiService.post(
      `/RequestPostponement/GetToRejectLetterContent`,
      data
    );
  },
  PrewToAgreeLetter(data) {
    return ApiService.post(`/RequestPostponement/PrewToAgreeLetter`, data);
  },
  PrewToRejectLetter(data) {
    return ApiService.post(`/RequestPostponement/PrewToRejectLetter`, data);
  },
};
export default RequestPostponementService;
