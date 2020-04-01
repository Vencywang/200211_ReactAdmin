//包含n个用来创建actions的工厂函数（action creators)

import { INCREMENT, DECREMENT} from './action-types'

//增加的action
export const increment = number =>({type:INCREMENT,data: number})

//减少的action
export const decrement = number =>({type:DECREMENT,data: number}) 

// //异步增加的action : 返回的是函数
export const incrementAsync = number=>{
    //异步返回新的函数
    return dispatch =>{
        //执行异步（定时器，ajax请求，promise）
        setTimeout(()=>{
            //当异步任务执行完成时 分发一个同步action  最后的最后必须分发同步action
            dispatch(increment(number))
        },1000)
    }
}