import ApiService from "../api.service";
const DashboardService = {
  GetDashboardData() {
    return ApiService.get(`/Dashboard/GetDashboardData`);
  },
};
export default DashboardService;
