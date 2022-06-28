import ApiService from "../api.service";
const InspectionConclusionService = {
  GetList(data) {
    return ApiService.post("/InspectionConclusion/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/InspectionConclusion/Get");
    } else {
      return ApiService.get(`/InspectionConclusion/Get/${id}`);
    }
  },
  GetByRequestId(id) {
    return ApiService.get(`/InspectionConclusion/GetByRequestId/${id}`);
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/InspectionConclusion/Create`, data);
    } else {
      return ApiService.post(`/InspectionConclusion/Update`, data);
    }
  },
  CreateAndSend(data) {
    return ApiService.post(`/InspectionConclusion/CreateAndSend`, data);
  },
  Send(data) {
    return ApiService.post(`/InspectionConclusion/Send`, data);
  },
  GetHistoryList(id, data) {
    return ApiService.post(`/InspectionConclusion/GetHistoryList/${id}`, data);
  },
};
export default InspectionConclusionService;
