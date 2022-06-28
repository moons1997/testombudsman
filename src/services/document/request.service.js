import ApiService from "../api.service";
const RequestService = {
  GetList(data) {
    return ApiService.post("/Request/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/Request/Get");
    } else {
      return ApiService.get(`/Request/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/Request/Create`, data);
    } else {
      return ApiService.post(`/Request/Update`, data);
    }
  },
  AttachOrder(data) {
    return ApiService.post(`/Request/AttachOrder`, data);
  },
  GetAttachOrder(requestId) {
    return ApiService.get(`/Request/GetAttachOrder/${requestId}`);
  },
  Delete(id) {
    return ApiService.post(`/Request/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/Request/GetAsSelectList`);
  },
  UploadBasicFile(data) {
    return ApiService.post("/Request/UploadBasicFile", data);
  },
  UploadOrderFile(data) {
    return ApiService.post("/Request/UploadOrderFile", data);
  },
  DownloadFile(id, field) {
    if (field == "basic") {
      return ApiService.print(`/Request/DownloadBasicFile/${id}`);
    } else if (field == "order") {
      return ApiService.print(`/Request/DownloadOrderFile/${id}`);
    } else if (field == "history") {
      return ApiService.print(`/Request/DownloadHistoryFile/${id}`);
    }
  },

  // DownloadOrderFile(id) {},
  DeleteBasicFile(id) {
    return ApiService.post(`/Request/DeleteBasicFile/fileId=${id}`);
  },
  DeleteOrderFile(id) {
    return ApiService.post(`/Request/DeleteOrderFile/fileId=${id}`);
  },
  Send(data) {
    return ApiService.post(`/Request/Send`, data);
  },
  MakeNotified(data) {
    return ApiService.post(`/Request/MakeNotified`, data);
  },
  ToReject(data) {
    return ApiService.post(`/Request/ToReject`, data);
  },
  ToAgree(data) {
    return ApiService.post(`/Request/ToAgree`, data);
  },
  Revoke(data) {
    return ApiService.post(`/Request/Revoke`, data);
  },
  Receive(data) {
    return ApiService.post(`/Request/Receive`, data);
  },
  RefuseByModerator(data) {
    return ApiService.post(`/Request/RefuseByModerator`, data);
  },
  ToApprove(data) {
    return ApiService.post(`/Request/ToApprove`, data);
  },
  ReturnToModerator(data) {
    return ApiService.post(`/Request/ReturnToModerator`, data);
  },
  Reject(data) {
    return ApiService.post(`/Request/Reject`, data);
  },
  Agree(data) {
    return ApiService.post(`/Request/Agree`, data);
  },
  Redirect(data) {
    return ApiService.post(`/Request/Redirect`, data);
  },
  CancelAgreement(data) {
    return ApiService.post(`/Request/CancelAgreement`, data);
  },
  MakeNotAgreed(data) {
    return ApiService.post(`/Request/MakeNotAgreed`, data);
  },
  Archive(data) {
    return ApiService.post(`/Request/Archive`, data);
  },
  GetHistoryList(data, id) {
    return ApiService.post(`/Request/GetHistoryList/${id}`, data);
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/Request/SaveAsExecel`, data);
  },
  GetToAgreeLetterContent(data) {
    return ApiService.post(`/Request/GetToAgreeLetterContent`, data);
  },
  GetToRejectLetterContent(data) {
    return ApiService.post(`/Request/GetToRejectLetterContent`, data);
  },
  PrewToAgreeLetter(data) {
    return ApiService.post(`/Request/PrewToAgreeLetter`, data);
  },
  PrewToRejectLetter(data) {
    return ApiService.post(`/Request/PrewToRejectLetter`, data);
  },
  ResetLetterContent(data) {
    return ApiService.post(`/Request/ResetLetterContent`, data);
  },
};
export default RequestService;
