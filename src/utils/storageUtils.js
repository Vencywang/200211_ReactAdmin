//进行Local 数据存储管理的模块
//针对低版本浏览器也可以
import store from 'store'
const USER_KEY = 'user_key'
export default {
    //保存user
    saveUser(user){
        // localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY,user) 
    },
    //读取user
    gerUser(){
        //以防返回是null
        // return JSON.parse(localStorage.getItem(USER_KEY)||'{}')
        return store.get(USER_KEY)||{}
    },
    //删除user
    removeUser(){
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}