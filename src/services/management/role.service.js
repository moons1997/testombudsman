import ApiService from "../api.service";
const RoleService = {
  GetList(data) {
    return ApiService.post(`/Role/GetList`, data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/Role/Get`);
    } else {
      return ApiService.get(`/Role/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/Role/Create`, data);
    } else {
      return ApiService.post("/Role/Update", data);
    }
  },
  Delete(id) {
    return ApiService.post(`/Role/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/Role/GetAsSelectList`);
  },
};
export default RoleService;
