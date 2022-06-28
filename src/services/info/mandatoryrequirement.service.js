import ApiService from "../api.service";
const MandatoryRequirementService = {
  GetList(data) {
    return ApiService.post("/mandatoryRequirement/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/mandatoryRequirement/Get");
    } else {
      return ApiService.get(`/mandatoryRequirement/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/mandatoryRequirement/Create`, data);
    } else {
      return ApiService.post(`/mandatoryRequirement/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/mandatoryRequirement/Delete/${id}`);
  },
  GetAsSelectList(data) {
    return ApiService.post(`/mandatoryRequirement/GetAsSelectList`, data);
  },
};
export default MandatoryRequirementService;
