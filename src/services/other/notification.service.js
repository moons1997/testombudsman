import ApiService from "../api.service";
const NotificationService = {
  GetList(data) {
    return ApiService.post(`/notification/GetList`, data);
  },
  MarkAllAsRead(){
    return ApiService.get(`/notification/MarkAllAsRead`)
  },
  MarkAsRead(id){
    return ApiService.get(`/notification/MarkAsRead/${id}`)
  }
};
export default NotificationService;
