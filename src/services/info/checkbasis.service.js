import ApiService from "../api.service";
const CheckBasisService = {
  GetList(data) {
    return ApiService.post("/CheckBasis/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/CheckBasis/Get");
    } else {
      return ApiService.get(`/CheckBasis/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/CheckBasis/Create`, data);
    } else {
      return ApiService.post(`/CheckBasis/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/CheckBasis/Delete/${id}`);
  },
  GetAsSelectList(checkTypeId) {
    return ApiService.get(
      `/CheckBasis/GetAsSelectList?checkTypeId=${checkTypeId}`
    );
  },
};
export default CheckBasisService;
