import ApiService from "../api.service";
const OrganFunctionService = {
  GetList(data) {
    return ApiService.post(`/OrganFunction/GetList`, data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/OrganFunction/Get`);
    } else {
      return ApiService.get(`/OrganFunction/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/OrganFunction/Create`, data);
    } else {
      return ApiService.post(`/OrganFunction/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/OrganFunction/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/OrganFunction/GetAsSelectList`);
  },
};
export default OrganFunctionService;
