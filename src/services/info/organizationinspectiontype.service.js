import ApiService from "../api.service";
const OrganizationInspectionTypeService = {
  GetList(data) {
    return ApiService.post(`/OrganizationInspectionType/GetList`, data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/OrganizationInspectionType/Get`);
    } else {
      return ApiService.get(`/OrganizationInspectionType/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/OrganizationInspectionType/Create`, data);
    } else {
      return ApiService.post(`/OrganizationInspectionType/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/OrganizationInspectionType/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/OrganizationInspectionType/GetAsSelectList`);
  },
};
export default OrganizationInspectionTypeService;
