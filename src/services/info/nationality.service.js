import ApiService from "../api.service";
const NationalityService = {
    GetList(data){
        return ApiService.post('/nationality/GetList',data)
    },
    Get(id){
        if(id == 0 || id === null || id === undefined){
            return ApiService.get('/nationality/Get')
        }
        else{
            return ApiService.get(`/nationality/Get/${id}`)
        }
    },
    Update(data){
        if(data.id == 0){
            return ApiService.post(`/nationality/Create`,data)
        }
        else{
            return ApiService.post(`/nationality/Update`,data)
        }
        
    },
    Delete(id){
        return ApiService.post(`/nationality/Delete/${id}`)
    }
}
export default NationalityService