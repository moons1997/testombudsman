import ApiService from "../api.service";
const OrganizationBranchService = {
  GetList(data) {
    return ApiService.post(`/OrganizationBranch/GetList`, data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/OrganizationBranch/Get`);
    } else {
      return ApiService.get(`/OrganizationBranch/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/OrganizationBranch/Create`, data);
    } else {
      return ApiService.post("/OrganizationBranch/Update", data);
    }
  },
  Delete(id) {
    return ApiService.post(`/OrganizationBranch/Delete/${id}`);
  },
  GetAsSelectList(organizationId) {
    return ApiService.get(
      `/OrganizationBranch/GetAsSelectList/${organizationId}`
    );
  },
};
export default OrganizationBranchService;
