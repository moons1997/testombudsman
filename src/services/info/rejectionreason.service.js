import ApiService from "../api.service";
const RejectionReasonService = {
  GetList(data) {
    return ApiService.post("/rejectionreason/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/rejectionreason/Get");
    } else {
      return ApiService.get(`/rejectionreason/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/rejectionreason/Create`, data);
    } else {
      return ApiService.post(`/rejectionreason/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/rejectionreason/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/rejectionreason/GetAsSelectList`);
  },
};
export default RejectionReasonService;
