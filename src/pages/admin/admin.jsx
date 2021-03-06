import React, { Component } from "react"
// import memoryUtils from '../../utils/memoryUtils'
import {connect} from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'


const {  Footer, Sider, Content } = Layout;

//后台管理的路由组件
class Admin extends Component{
    render () {
        // debugger
        const user = this.props.user
        //如果内存中没有存储user 当前没有登录 需要跳转到登录界面
        if(!user || !user._id){
            //自动跳转到登录(在render()中)
            return < Redirect to = '/login' />
        }
        return (
          <Layout style={{minHeight: '100%'}}>
            <Sider>
                <LeftNav/>
            </Sider>
            <Layout>
              <Header>Header</Header>
              <Content style={{margin:20, backgroundColor: '#fff'}}>
                <Switch>
                  <Redirect exact={true} from='/'  to='/home' ></Redirect>
                  <Route path='/home' component= {Home}></Route>
                  <Route path= '/category' component= {Category}></Route>
                  <Route path='/product' component= {Product}></Route>
                  <Route path='/user' component= {User}></Route>
                  <Route path='/role' component= {Role}></Route>
                  <Route path='/charts/bar' component= {Bar}></Route>
                  <Route path='/charts/line' component= {Line}></Route>
                  <Route path='/charts/pie' component= {Pie}></Route>
                  {/* 上面没有一个匹配的直接显示 */}
                  <Route component={NotFound}/>                  
                </Switch>  
              </Content>
              <Footer style={{textAlign: 'center',color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作</Footer>
            </Layout>
          </Layout>        )
    }
}
export default connect(
  state => ({user:state.user}),
  {}
)(Admin)