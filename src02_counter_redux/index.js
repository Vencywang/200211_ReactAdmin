// 应用入口js
// 渲染app标签
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from './redux/store'
//读取local中保存user，保存到内存中

// 将App标签渲染到index页面的div上
ReactDOM.render(<App store={store} />,document.getElementById('root'))

//给store绑定状态更新的监听 
store.subscribe(()=>{ //store内部的状态数据发生改变时回调
    //重新渲染App组件标签
    ReactDOM.render(<App store={store} />,document.getElementById('root'))
})