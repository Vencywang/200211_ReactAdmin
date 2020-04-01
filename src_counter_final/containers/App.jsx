import React, { Component } from "react";
import {connect} from 'react-redux'
import {increment,decrement,incrementAsync} from '../redux/actions'
import Counter from '../components/Counter'

// //容器组件：通过connect 包装UI组件产生组件
// //connect()：高阶函数
// //它返回的函数是一个高阶组件 ： 接收一个UI组件，生成容器组件
// //容器组件的责任：向UI组件传入特定的属性


// //用来将redux管理的state数据映射成UI组件的一般属性的函数
// function mapStateToProps(state){
//     return {
//         count:state
//     }
// }
// //用来将包含dispatch代码的函数映射成UI组件的函数属性的函数
//如果是函数 会自动调用得到对象，将对象中的方法包装成一个新的函数并作为函数属性传入UI组件
//const mapDispatchToProps = {increment,decrement}

// function mapDispatchToProps(dispatch){
//     return {
//         increment:(number)=>dispatch(increment(number)),
//         decrement:(number)=>dispatch(decrement(number))
//     }
// }
export default connect(
    state=>({count:state.count}),
    {increment,decrement,incrementAsync}
)(Counter)