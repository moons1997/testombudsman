import ApiService from "../api.service";
const BankService = {
    GetList(data){
        return ApiService.post('/Bank/GetList',data)
    },
    Get(id){
        if(id == 0 || id === null || id === undefined){
            return ApiService.get('/Bank/Get')
        }
        else{
            return ApiService.get(`/Bank/Get/${id}`)
        }
    },
    Update(data){
        if(data.id == 0){
            return ApiService.post(`/Bank/Create`,data)
        }
        else{
            return ApiService.post(`/Bank/Update`,data)
        }
        
    },
    Delete(id){
        return ApiService.post(`/Bank/Delete/${id}`)
    },
    GetAsSelectList(){
        return ApiService.get(`/Bank/GetAsSelectList`)
    }
}
export default BankService