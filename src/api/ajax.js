//第一层封装

// 能发送异步ajax请求的模块
// 封装axios库
// 函数返回值是Promise对象
// 1,优化：统一处理请求异常
//    在外层包一个自己创建的Promise对象
//    请求出错时，不reject（error） 而是显示错误提示
// 2，优化：异步得到不是response，而是response.data
//     在请求成功resolve时，resolve(response.data)

import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={}, type='GET'){
    return new Promise((resolve, reject)=>{
        let promise
        if(type==='GET'){
            // 发get请求
            promise = axios.get(url, {//配置对象
                params: data //指定请求参数
            })
        }else{
            // 发post请求
            promise = axios.post(url, data)
        }

        promise.then( response=>{
            resolve(response.data)
        }).catch(error=>{
            message.error(`请求出错了： ${error.message}`)
        })
        //执行异步ajax请求
        //如果成功了调用resolve(value)
        //如果失败了，不调用reject(reason)，而是提示异常信息
    })
    

}



