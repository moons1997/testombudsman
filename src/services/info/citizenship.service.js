import ApiService from "../api.service";
const CitizenshipService = {
    GetList(data){
        return ApiService.post('/citizenship/GetList',data)
    },
    Get(id){
        if(id == 0 || id === null || id === undefined){
            return ApiService.get('/citizenship/Get')
        }
        else{
            return ApiService.get(`/citizenship/Get/${id}`)
        }
    },
    Update(data){
        if(data.id == 0){
            return ApiService.post(`/citizenship/Create`,data)
        }
        else{
            return ApiService.post(`/citizenship/Update`,data)
        }
        
    },
    Delete(id){
        return ApiService.post(`/citizenship/Delete/${id}`)
    }
}
export default CitizenshipService