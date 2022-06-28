import ApiService from './api.service'

const AccountService = {
    async Login(data){
        return await ApiService.token('account/Login',data)
    },
    GetUserInfo(){
        return ApiService.get(`/account/GetUserInfo`)
    },
    ChangePassword(data){
        return ApiService.post(`/account/ChangePassword`,data)
    },
    ChangeLanguage(data){
        return ApiService.post(`/account/ChangeLanguage`,data)
    }

}
export default AccountService