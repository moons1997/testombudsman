import ApiService from "../api.service";
const EmployeeService = {
  GetList(data) {
    return ApiService.post("/employee/GetList", data);
  },
  GetListAttestation(data) {
    return ApiService.post("/Employee/GetListWithAttestation", data);
  },
  GetAttestationList(id) {
    return ApiService.get(`/Employee/GetAttestationList/${id}`);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/employee/Get");
    } else {
      return ApiService.get(`/employee/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/employee/Create`, data);
    } else {
      return ApiService.post(`/employee/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/employee/Delete/${id}`);
  },
  GetByPassportData(Seria, Number, DateOfBirth) {
    return ApiService.get(
      `/Employee/GetByPassportData?Seria=${Seria}&Number=${Number}&DateOfBirth=${DateOfBirth}`
    );
  },
  GetAsSelectList(data) {
    return ApiService.post(`/Employee/GetAsSelectList`, data);
  },
  Create(data) {
    if (data.id == 0) {
      return ApiService.post(`/Employee/CreateWithUser`, data);
    } else {
      return ApiService.post(`/Employee/UpdateWithUser`, data);
    }
  },
  // CreateWithUser(data) {
  //   return ApiService.post(`/Employee/CreateWithUser`, data);
  // },
  SaveAsExecel1(data) {
    return ApiService.printtemp(`/Employee/SaveAsExecel`, data);
  },
  SaveAsExecelKadir(data) {
    return ApiService.printtemp(`/Employee/SaveAsExecelKadir`, data);
  },
  MakeHr(id) {
    return ApiService.post(`/Employee/MakeHr/${id}`);
  },
  MakeInspector(id) {
    return ApiService.post(`/Employee/MakeInspector/${id}`);
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/Employee/GetListWithAttestationExcel`, data);
  },
};
export default EmployeeService;
