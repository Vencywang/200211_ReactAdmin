// 应用入口js
// 渲染app标签
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './containers/App'
import store from './redux/store'

//读取local中保存user，保存到内存中

// 将App标签渲染到index页面的div上
ReactDOM.render((
    <Provider store={store}>
        <App></App>
    </Provider>
),document.getElementById('root'))

