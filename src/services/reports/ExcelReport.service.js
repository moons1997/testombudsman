import ApiService from "../api.service";
const ExcelReportService = {
  GetReport1(data) {
    return ApiService.post(`/ExcelReport/GetReport1`, data);
  },
  GetReport2(data) {
    return ApiService.post(`/ExcelReport/GetReport2`, data);
  },
  GetReport3(data) {
    return ApiService.post(`/ExcelReport/GetReport3`, data);
  },
  GetReport4(data) {
    return ApiService.post(`/ExcelReport/GetReport4`, data);
  },
  GetReport5(data) {
    return ApiService.post(`/ExcelReport/GetReport5`, data);
  },
  Report1AsExcel(data) {
    return ApiService.printtemp(`/ExcelReport/Report1AsExcel`, data);
  },
  Report2AsExcel(data) {
    return ApiService.printtemp(`/ExcelReport/Report2AsExcel`, data);
  },
  Report3AsExcel(data) {
    return ApiService.printtemp(`/ExcelReport/Report3AsExcel`, data);
  },
  Report4AsExcel(data) {
    return ApiService.printtemp(`/ExcelReport/Report4AsExcel`, data);
  },
  Report5AsExcel(data) {
    return ApiService.printtemp(`/ExcelReport/Report5AsExcel`, data);
  },
};
export default ExcelReportService;
