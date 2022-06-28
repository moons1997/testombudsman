import ApiService from "../api.service";
const UserService = {
  GetList(data) {
    return ApiService.post("/user/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/user/Get");
    } else {
      return ApiService.get(`/user/Get/${id}`);
    }
  },
  GetUserInfo() {
    return ApiService.get(`/account/GetUserInfo`);
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/user/CreateByEmployee`, data);
    } else {
      return ApiService.post(`/user/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/user/Delete/${id}`);
  },
  GetAsSelectList(countryId) {
    return ApiService.get(`/user/GetAsSelectList/${countryId}`);
  },
  GetByPassportData(Seria, Number, DateOfBirth) {
    return ApiService.get(
      `/user/GetByPassportData/${Seria}&${Number}&${DateOfBirth}`
    );
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/User/SaveAsExecel`, data);
  },
  CheckUserName(data) {
    return ApiService.post(`/User/CheckUserName`, data);
  },
};
export default UserService;
