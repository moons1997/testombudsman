import ApiService from "../api.service";
const OrderTypeService = {
  GetList(data) {
    return ApiService.post(`/OrderType/GetList`, data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/OrderType/Get`);
    } else {
      return ApiService.get(`/OrderType/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/OrderType/Create`, data);
    } else {
      return ApiService.post(`/OrderType/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/OrderType/Delete/${id}`);
  },
};
export default OrderTypeService;
