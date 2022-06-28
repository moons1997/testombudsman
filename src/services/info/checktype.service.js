import ApiService from "../api.service";
const CheckTypeService = {
    GetList(data){
        return ApiService.post('/checktype/GetList',data)
    },
    Get(id){
        if(id == 0 || id === null || id === undefined){
            return ApiService.get('/checktype/Get')
        }
        else{
            return ApiService.get(`/checktype/Get/${id}`)
        }
    },
    Update(data){
        if(data.id == 0){
            return ApiService.post(`/checktype/Create`,data)
        }
        else{
            return ApiService.post(`/checktype/Update`,data)
        }
        
    },
    Delete(id){
        return ApiService.post(`/checktype/Delete/${id}`)
    },
    GetAsSelectList(){
        return ApiService.get(`/CheckType/GetAsSelectList`)
    }
}
export default CheckTypeService