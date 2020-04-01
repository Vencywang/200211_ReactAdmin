import React, { Component } from "react";
import './login.less';
import logo from '../../assets/images/logo.png';
import { 
    Form,
    Icon, 
    Input, 
    Button, 
    message
    } from 'antd';
// import {reqLogin} from '../../api'
// import memoryUtils from  '../../utils/memoryUtils'
// import storeUtils from '../../utils/storageUtils'
import { Redirect } from "react-router-dom"
import {connect} from 'react-redux'
import {login} from '../../redux/actions'

//登录的路由组件
class Login extends Component{
    handleSubmit = ( event ) => {
        // 阻止事件的默认行为
        event.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            //校验成功
            if (!err) {
            //   console.log('提交登录的ajax请求 ', values);
            const {username,password} = values
            //调用分发异步action的函数 => 发登录异步请求，有了结果后更新状态
            this.props.login(username,password)
            // const response = await reqLogin(username,password)
            
            // // console.log('请求成功', response.data)
            // // const result = response.data
            // if(response.status===0){
            //     //提示登录成功
            //     message.success('登录成功')
            //     //保存user
            //     // const user = response.data
            //     // debugger 
            //     // memoryUtils.user = user //存储user在内存中
            //     // storeUtils.saveUser(user) //保存到本地Local 
            //     // //跳转到后台管理界面
            //     //  this.props.history.replace('/home')
            // }else{//登陆失败
            //     //提示错误信息
            //     message.error(response.msg)
            // }
            }else{
                console.log('校验失败！')
            }
          });
        // 得到form对象
        //const form = this.props.form
        // 获取表单项的输入数据
        //const values = form.getFieldsValue()
        //console.log('handleSubmit()',values)
    }
    // 对密码进行自定义验证
    validatePwd = (rule, value, callback) => {
        console.log('validatePwd',rule,value)
        if(!value){
            callback('密码必须输入')
        }else if(value.length < 4){
            callback('密码长度不能小于4位')
        }else if(value.length>12){
            callback('密码长度不能超过12位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文、数字或下划线组成')
        }else{
            callback() //验证通过
        }
    }
    render () {
        //如果用户已经登录 跳转到管理界面
        // const user = memoryUtils.user
        const user = this.props.user
        if(user._id){
            return <Redirect to ='/home' />
        }

        const errorMsg = this.props.user.errorMsg
        //得到强大的form对象
        const form = this.props.form
        const { getFieldDecorator } = form
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"></img>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <div>{errorMsg}</div>
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {//配置对象：属性名是特定名称
                                //声明式验证：直接使用别人定义好的验证规则进行验证
                                rules: [{ required: true,whitespace:true, message: '请输入用户名' },
                                        { min: 4, message: '最短输入4位' },
                                        { max: 12, message: '最长输入12位' },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线' }    
                            ],
                                
                            })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>                       
                           {getFieldDecorator('password', {
                                rules: [{ 
                                    validator: this.validatePwd//自定义规则  
                                 }],
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                                />,
                            )}                 
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }

}
//1. 高阶函数xxx()()
//      一类特别的函数：
        // 接收函数的参数
        // 返回值是函数
//      常见
        // 定时器：setTimeout setInterval
        // Promise: Promise() then( value={}, reson={})
        // 数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
        // 函数对象的bind()
        // Form.create()() / getFieldDecorator()()
//      更新动态，更加具有扩展性 

// 2. 高阶组件
    // 本质是函数
    // 接收一个组件（被包装组件） 返回一个新的组件（包装组件），？父传子 包装组件向被包装组件传入特定属性
    // 作用：扩展组件的功能
    // 也是高阶函数 ： 接收组件函数 返回新的组件函数

// 包装Form组件生成一个新的组件：Form(Login)
// 新组件会向Form组件传递一个强大的对象属性: form
const WrapLogin = Form.create()(Login)
export default connect(
    state =>({user:state.user}),
    {login}
)(WrapLogin)

    // 前台表单验证
    // 搜集表单输入数据

// async await
// 作用:
//   简化promise对象的使用 不用再使用.then來制定成功、失败的回调函数 更像同步编码
//   以同步编码（没有回调函数了）方式实现异步流程
// 哪里写await?
// 在返回promise的表达式左侧写：不想要promise 想要promise异步执行成功的value数据
//哪里写async
// await所在函数（最近的）定义的左侧写async
