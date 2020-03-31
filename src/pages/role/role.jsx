import React, {Component} from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'

//角色路由
export default class Role extends Component{
    state = {
        roles: [], //所有角色的列表
        role:{},//选中的role
        isShowAdd:false, //是否显示添加页面
        isShowAuth:false, //是否显示设置权限界面
    }
    constructor (props){
        super(props)
        this.auth = React.createRef()
    }
    initColumn = ()=>{
        this.columns=[
            {
                title:'角色名称',
                dataIndex: 'name'
            },
            {
                title:'创建时间',
                dataIndex: 'create_time',
                render:formateDate
            },
            {
                title:'授权时间',
                dataIndex: 'auth_time',
                render:formateDate //render  是一个函数 接收dataIndex为参数
            },
            {
                title:'授权人',
                dataIndex: 'auth_name'
            },
        ]
    }
    getRoles = async ()=>{
        const result = await reqRoles()
        if(result.status === 0){
            const roles = result.data
            this.setState({
                roles
            })
        }
    }
    onRow = (role)=>{
        return {
            onClick: event => {
                //点击行
                console.log('role_onClick()',role)
                //alert('点击行')
                this.setState({
                    role 
                })
            }
        }

    }
    //添加角色
    addRole = ()=>{
        //最先进行表单验证 只有通过了才向下
        this.form.validateFields( async (error,values)=>{
            if(!error){
                //隐藏确认框
                this.setState({
                    isShowAdd:false
                })
                //收集数据 
                const {roleName} = values
                this.form.resetFields()
                //发请求添加
                const result = await reqAddRole(roleName)
                //根据结果更新提示
                if(result.status===0){
                    message.success('添加角色成功')
                    // this.getRoles()
                    //新产生的角色
                    const role = result.data
                    //更新roles状态
                    // const roles= [...this.state.roles]
                    // roles.push(role)
                    // this.setState({
                    //     roles
                    // })
                    //更新roles状态是基于原本的状态数据进行更新
                    this.setState(state=>({
                        roles: [...state.roles,role]
                    }))



                }else{
                    message.error('添加角色失败')
                }

            }
        })
        
    }
    //更新角色
    updateRole = async ()=>{
        const role = this.state.role
        const menus  = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        //隐藏确认框
        this.setState({
            isShowAuth :false
        })
        //请求更新
        const result = await reqUpdateRole(role)
        debugger
        if(result.status===0){
            
            //this.getRoles()
            //如果当前更新的是自己角色的权限 强制退出
            if(role._id===memoryUtils.user.role_id){
                memoryUtils.user={}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限修改了，重新登录')
            }else{
                message.success('更新角色权限成功')
                this.setState({
                    roles:[...this.state.roles]
                })
            }
            
        }
    }
    componentWillMount(){
        this.initColumn()
    }
    componentDidMount(){
        this.getRoles()
    }

    render(){
        const {roles,role,isShowAdd,isShowAuth} =this.state
        const title=(
            <span>
                <Button type="primary" onClick = {()=>this.setState({isShowAdd:true})}>创建角色</Button>&nbsp;&nbsp;
                <Button disabled={!role._id} onClick = {()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table 
                    rowSelection={{
                        type:'radio',
                        selectedRowKeys:[role._id],
                        onSelect:(role)=>{ //选择某个radio后糊掉
                            this.setState({
                                role
                            })
                        }
                    }}
                    bordered
                    rowKey='_id'
                    dataSource={roles} 
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}} 
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=>{
                        this.setState({
                            isShowAdd:false
                        })
                        this.form.resetFields()
                    }}
                    >
                    <AddForm 
                    setForm = {(form)=>{this.form=form}}
                    ></AddForm>
                    
                    </Modal>

                    <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={()=>{
                        this.setState({
                            isShowAuth:false
                        })
                        // this.form.resetFields()
                    }}
                    >
                    <AuthForm role={role} ref={this.auth}></AuthForm>
                    
                    </Modal>
                
            </Card>
        )
    }
}