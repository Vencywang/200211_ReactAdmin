//reducer函数模块：根据当前state 和 指定的 action 返回新的state
import { INCREMENT, DECREMENT} from './action-types'

//管理count状态数据的reducer
export default function count(state=1,action){
    console.log('count()',state,action)
    switch (action.type){
        case INCREMENT:
            return state + action.data
        case DECREMENT:
            return state - action.data
        default:
            return state
    }
}