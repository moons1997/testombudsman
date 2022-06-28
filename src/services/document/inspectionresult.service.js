import ApiService from "../api.service";
const InspectionResultService = {
  GetList(data) {
    return ApiService.post("/InspectionResult/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/InspectionResult/Get");
    } else {
      return ApiService.get(`/InspectionResult/Get/${id}`);
    }
  },
  GetByRequestId(id) {
    return ApiService.get(`/InspectionResult/GetByRequestId/${id}`);
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/InspectionResult/Create`, data);
    } else {
      return ApiService.post(`/InspectionResult/Update`, data);
    }
  },
  UpdateAfterSent(data) {
    return ApiService.post(`/InspectionResult/UpdateAfterSent`, data);
  },
  Delete(id) {
    return ApiService.post(`/InspectionResult/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/InspectionResult/GetAsSelectList`);
  },
  UploadActFile(data) {
    return ApiService.post("/InspectionResult/UploadActFile", data);
  },
  DownloadActFile(fileId) {
    return ApiService.get(`/InspectionResult/DownloadActFile/${fileId}`);
  },
  UploadMeasuresOfInfluenceFile(data) {
    return ApiService.post(
      `/InspectionResult/UploadMeasuresOfInfluenceFile`,
      data
    );
  },
  DownloadMeasuresOfInfluenceFile(fileId) {
    return ApiService.get(
      `/InspectionResult/DownloadMeasuresOfInfluenceFile/${fileId}`
    );
  },
  UploadMeasuresResultFiles(data) {
    return ApiService.post(`/InspectionResult/UploadMeasuresResultFiles`, data);
  },
  DownloadMeasuresResultFile(fileId) {
    return ApiService.get(
      `/InspectionResult/DownloadMeasuresResultFile/${fileId}`
    );
  },
  UploadCancelledMeasuresFiles(data) {
    return ApiService.post(
      `/InspectionResult/UploadCancelledMeasuresFiles`,
      data
    );
  },
  DownloadCancelledMeasuresFile(fileId) {
    return ApiService.get(
      `/InspectionResult/DownloadCancelledMeasuresFile/${fileId}`
    );
  },
  Send(data) {
    return ApiService.post(`/InspectionResult/Send`, data);
  },
  GetHistoryList(data, id) {
    return ApiService.post(`/InspectionResult/GetHistoryList/${id}`, data);
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/InspectionResult/SaveAsExecel`, data);
  },
};
export default InspectionResultService;
