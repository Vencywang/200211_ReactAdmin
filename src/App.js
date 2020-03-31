import React, { Component } from "react";
import {BrowserRouter, Route, Switch } from 'react-router-dom';
// React 必须引入 是从react得到的
import Login from './pages/login/login';
import Admin from './pages/admin/admin';

// 应用的根组件
// 有无状态--> 函数 与 类
export default class App extends Component{

    render () {
        return(
            <BrowserRouter>
                <Switch>
                    {/* 只匹配其中一个路由，一个匹配上了其他都不需要匹配了 */}
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>   
                </Switch>             
            </BrowserRouter>
        )
    }
}