// 应用入口js
// 渲染app标签
import React from 'react'
import ReactDOM from 'react-dom'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

import App from './App'
//读取local中保存user，保存到内存中
const user = storageUtils.gerUser()
memoryUtils.user = user
// 将App标签渲染到index页面的div上
ReactDOM.render(<App />,document.getElementById('root'))