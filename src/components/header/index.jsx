import React, {Component} from 'react'
import './index.less'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import {reqWeather} from '../../api/index'
import {withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Modal } from 'antd';
import LinkButton from '../link-button'

//左侧导航组件
class Header extends Component{
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl:'',//天气图片
        weather:''//天气文本
    }
    getTime = () => {
        this.intervalId =setInterval(()=>{
            const currentTime =formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getWeather = async () =>{
        //调用接口请求函数获取数据
        const {dayPictureUrl, weather} =  await reqWeather('北京')
        //更新状态
        this.setState({dayPictureUrl, weather})
    }
    getTitle = () =>{
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach( item =>{
            if(item.key === path){//如果当前item对象的key与path一样 item的title就是当前需要展示的title
                title = item.title
            }else if(item.children){
                //在所有的子item中查找匹配的 
                const cItem =item.children.find(cItem => path.indexOf(cItem.key)===0)
                //如果有值 说明有匹配
                if(cItem){
                    //取出它的title
                    title = cItem.title
                }
            }
        })
        return title
    }
    logout =()=> {
        Modal.confirm({
            // title: 'Do you Want to delete these items?',
            content: '确定退出吗？',
            //箭头函数改用外部的this
            onOk: ()=> {
            //   console.log('OK',this);
            //删除保存的user数据
            storageUtils.removeUser()
            memoryUtils.user = {}
            //跳转到登录页面
            this.props.history.replace('/login')
            }
          })

    }
    //第一次render()之后执行一次
    //一般在此执行异步操作：发ajax请求 、 启动定时器
    componentDidMount(){
        //获取当前的时间
        this.getTime()
        this.getWeather()
    }
    //当前组件卸载之前
    componentWillUnmount(){
    //清除定时器
        clearInterval(this.intervalId)
    }
    render(){
        // console.log('render()')  一直渲染
        const username = memoryUtils.user.username
        const {currentTime, dayPictureUrl, weather} = this.state
        //得到当前需要显示的title
        const title = this.getTitle()
        return (
            <div className= "header">
                <div className= "header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton  onClick= {this.logout}>退出</LinkButton>
                </div>
                <div className= "header-bottom">
                    <div className= "header-bottom-left">{title}</div>
                    <div className= "header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)