import React, {Component} from 'react'
import logo from '../../assets/images/logo.png'
import {Link,withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Menu, Icon } from 'antd'
import memoryUtils from '../../utils/memoryUtils' 
import {connect} from 'react-redux'
import {setHeadTitle} from '../../redux/actions'
// import {
//     MailOutlined,
//   AppstoreOutlined,
//   MenuUnfoldOutlined,
//   MenuFoldOutlined,
//   PieChartOutlined,
//   DesktopOutlined,
//   InboxOutlined,
// } from '@ant-design/icons';
import './index.less'

const { SubMenu } = Menu;
//左侧导航组件
 class LeftNav extends Component{
    //判断当前登录用户对item是否有权限
    hasAuth = (item)=>{
        const {isPublic,key} = item
        const menus = this.props.user.role.menus

        //如果当前用户是admin
        const  username = this.props.user.username
        //如果当前item是公开的
        //当前用户有此item的权限 看key有没有在menus中
        if(username === 'admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        }else if(item.children){ //当前用户有子item的权限
            return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
        }
    }

    //根据menu的数据数组生成对应的标签数组
    //使用map加递归调用
    //使用reduce加递归调用
    getMenuNodes_map = (menuList) =>{
        return menuList.map(item=>{
            //{title: '首页', // 菜单标题名称    
            //key: '/home', // 对应的 path
            //icon: 'home', // 图标名称
            //children:[{}] } // 可能有 也可能没有
            //<Menu.item />
            //<subMenu />
            if (!item.children){
                return(
                    <Menu.Item key= {item.key}>
                            <Link to= {item.key} >
                            <Icon type = {item.icon}  />
                            <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                )
            }else{
                return(
                    <SubMenu
                            key={item.key}
                            title={
                            <span>
                                <Icon type = {item.icon}  />
                            <span>{item.title}</span>
                            </span>
                            }
                        >
                            {
                                this.getMenuNodes(item.children)
                            }

                        </SubMenu> 
                )
            }
        })
    }
    getMenuNodes= (menuList) =>{
        const path= this.props.location.pathname
        return menuList.reduce((pre,item)=>{
            //如果当前用户有item对应的权限才需要显示对应的菜单项
            if(this.hasAuth(item)){
                //向pre中添加<Menu.item/>
                //向pre中添加<SubMenu>
                if(!item.children){
                    //判断item是否是当前item
                    if (item.key===path||path.indexOf(item.key)===0){
                        //更新redux中headerTitle状态
                        this.props.setHeadTitle(item.title)
                    }
                    pre.push((
                        <Menu.Item key= {item.key}>
                        <Link to= {item.key} onClick={()=>this.props.setHeadTitle(item.title)}>
                        <Icon type = {item.icon}  />
                        <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                    ))
                }else{
                    //查找一个与当前请求路径匹配的子Item
                    const cItem= item.children.find(cItem=>path.indexOf(cItem.key)===0)

                    if (cItem){
                        this.openKey = item.key
                    } 
                    
                    pre.push(
                        (
                            <SubMenu
                            key={item.key}
                            title={
                            <span>
                                <Icon type = {item.icon}  />
                            <span>{item.title}</span>
                            </span>
                            }
                        >
                            {
                                this.getMenuNodes(item.children)
                            }

                        </SubMenu> 
                        )
                    )
                }
            }
            

            return pre
        },[])
    }


    //在第一次render()之前执行一次
    //为第一次render()准备数据（必须是同步的）
    componentWillMount(){
        this.menuCodes = this.getMenuNodes(menuList)
    }
    render(){
        
    //获得当前请求的路由路径
    //当前组件没有this.props.loaction 其为undefined 当前组件不是路由组件
    let path= this.props.location.pathname
    if(path.indexOf('/product')===0){ //当前请求的是商品或商品子路由
        path = '/product'
    }
    // const menuCodes = this.getMenuNodes(menuList)

    //得到需要打开菜单项的key
    const openKey = this.openKey
    console.log('render()',openKey)
        return (
            <div className="left-nav">
                <Link to= '/' className= "left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    >
                        {
                            this.menuCodes
                        }
                        {/* <Menu.Item key="home">
                            <Link to= '/home'>
                            <Icon type = 'pie-chart'  />
                            <span>首页</span>
                            </Link>
                        </Menu.Item> */}
                       
                        {/* <SubMenu
                            key="sub1"
                            title={
                            <span>
                                <Icon type = 'mail'  />
                                <span>商品</span>
                            </span>
                            }
                        >
                            <Menu.Item key="category">
                                <Link to= '/category'>
                                <Icon type = 'mail'  />
                                <span>品类管理</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="product">
                                <Link to= '/product'>
                                <Icon type = 'mail'  />
                                <span>商品管理</span>
                                </Link>
                            </Menu.Item>

                        </SubMenu> */}
                        {/* <Menu.Item key="user">
                            <Link to= '/user'>
                            <Icon type = 'pie-chart'  />
                            <span>用户管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="role">
                            <Link to= '/role'>
                            <Icon type = 'pie-chart'  />
                            <span>角色管理</span>
                            </Link>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={
                            <span>
                                <Icon type = 'mail'  />
                                <span>图形图表</span>
                            </span>
                            }
                        >
                            <Menu.Item key="bar">
                                <Link to= '/bar'>
                                <Icon type = 'mail'  />
                                <span>柱形图</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="line">
                                <Link to= '/line'>
                                <Icon type = 'mail'  />
                                <span>折线图</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="pie">
                                <Link to= '/pie'>
                                <Icon type = 'mail'  />
                                <span>饼图</span>
                                </Link>
                            </Menu.Item>

                        </SubMenu> */}
                       
                    </Menu>
            </div>
        )
    }
}
//withRouter高阶组件：
//包装非路由组件 返回一个新的组件
//新的组件向非路由组件传递3个属性： history/location/match
export default connect(
    state => ({user:state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))