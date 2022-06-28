import ApiService from "../api.service";
const AttestationService = {
  GetList(data) {
    return ApiService.post("/Attestation/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/Attestation/Get");
    } else {
      return ApiService.get(`/Attestation/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/Attestation/Create`, data);
    } else {
      return ApiService.post(`/Attestation/Update`, data);
    }
  },
  GetAsSelectList() {
    return ApiService.get(`/Attestation/GetAsSelectList`);
  },
  DownloadFile(fileId) {
    return ApiService.get(`/Attestation/DownloadFile/${fileId}`);
  },
  UploadFile(data) {
    return ApiService.post("/Attestation/UploadFile", data);
  },
  DeleteFile(id) {
    return ApiService.post(`/Attestation/DeleteFile/fileId=${id}`);
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/Attestation/SaveAsExecel`, data);
  },
  Send(data) {
    return ApiService.post(`/Attestation/Send`, data);
  },
  Held(data) {
    return ApiService.post(`/Attestation/Held`, data);
  },
  CancelHeld(data) {
    return ApiService.post(`/Attestation/CancelHeld`, data);
  },
  Reject(data) {
    return ApiService.post(`/Attestation/Reject`, data);
  },
  Print(id) {
    return ApiService.printtemp(`/Attestation/GetCreatePageAsExcel?id=${id}`);
  },
  GetHistoryList(data, id) {
    return ApiService.post(`/Attestation/GetHistoryList/${id}`, data);
  },
  // SaveAsExecel(data) {
  //   return ApiService.printtemp(`/Attestation/GetCreatePageAsExcel`, data);
  // },
};
export default AttestationService;
