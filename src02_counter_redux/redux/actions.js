//包含n个用来创建actions的工厂函数（action creators)

import { INCREMENT, DECREMENT} from './action-types'

//增加的action
export const increment = number =>({type:INCREMENT,data: number})

//增加的action
export const decrement = number =>({type:DECREMENT,data: number}) 
