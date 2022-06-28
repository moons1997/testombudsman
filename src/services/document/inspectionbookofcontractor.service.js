import ApiService from "../api.service";
const InspectionBookOfContractorService = {
  GetList(data) {
    return ApiService.post("/InspectionBookOfContractor/GetList", data);
  },
  Get(id) {
    return ApiService.get(`/InspectionBookOfContractor/Get/${id}`);
  },
  GetByRequestId(id) {
    return ApiService.get(`/InspectionBookOfContractor/GetByRequestId/${id}`);
  },
  GetHistoryList(data, id) {
    return ApiService.post(
      `/InspectionBookOfContractor/GetHistoryList/${id}`,
      data
    );
  },
};
export default InspectionBookOfContractorService;
