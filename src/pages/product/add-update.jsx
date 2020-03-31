import React, {Component} from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Button,
    Icon,
    message
} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api/index'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const {TextArea} = Input


//商品添加和修改子路由
 class ProductAddUpdate extends Component{
    state = {
        options: [],
      }

      constructor (props){
          super(props)
          //创建用来保存ref标识的标签对象的容器
          this.pw = React.createRef()
          this.editor = React.createRef()
      }

    //接收categorys
    initOptions=(categorys)=>{
//根据categorys生成options数组 使用map方法
//返回对象要加上小括号？？？
        const options = categorys.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false,//不是叶子
        }))
        //更新options状态
        this.setState({
            options
        })
    }
    //异步获取一级或者二级分类列表
    //async函数的返回值是一个新的promise对象 其结果和值由async决定
    getCategorys= async (parentId) =>{
        const result = await reqCategorys(parentId) //对象 {status:0,data:categorys} 
        if(result.status===0){
            const categorys =  result.data
            //如果是一级分类列表
            if(parentId=== '0'){
                this.initOptions(categorys)
            }else{
                return categorys //返回二级列表 当前async返回的promise就会成功且value为categorys
            }
        }
    }


    //验证价格的函数
    validatePrice=(rule,value,callback)=>{
        console.log(value,typeof(value)) //string类型
        if(value*1>0){
            callback() //验证通过
        }else{
            callback('价格必须大于0')//验证不通过
        }
        
        
    }
     submit = ()=>{
         //进行表单验证 如果通过才发送请求
         this.props.form.validateFields( async (error,values)=>{
            if(!error){
                console.log(values)
                //1、收集数据 并封装成product对象
                const {name, desc,price,categoryIds} = values
                let pCategoryId,categoryId
                if(categoryIds.length===1){
                    pCategoryId= '0'
                    categoryId=categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId=categoryIds[1]
                }
                const imgs= this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product ={name,desc,price,imgs,detail,pCategoryId,categoryId}
                //如果是更新 需要添加_id
                if(this.isUpdate){
                    product._id = this.product._id
                }

                //2.调用接口请求函数 去添加或者更新
                const result = await reqAddOrUpdateProduct(product)

                //3.根据结果提示
                if(result.status===0){
                    message.success(`${this.isUpdate?'更新':'添加'}商品成功！`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate?'更新':'添加'}商品失败！`)
                }
            }
         })
     }
     //用于加载下一级列表的回调函数
     loadData = async selectedOptions => {
         //得到选择 的option对象
        const targetOption = selectedOptions[0]
        //显示loading的效果
        targetOption.loading = true

        //根据选中的分类，请求获取二级分类
        const subCategorys=  await this.getCategorys(targetOption.value)
        //隐藏loading
        targetOption.loading = false
        //二级分类列表有值
        if(subCategorys&&subCategorys.length>0){
            //生成一个二级列表的options
            const childOptions=subCategorys.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true,//不是叶子
            }))
            //关联到当前option上
            targetOption.children =childOptions
        }else{
            //当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
    
          //更新options状态
          this.setState({
            options: [...this.state.options],
          })
        
      }

    componentWillMount(){
        //取出携带的state
        const product = this.props.location.state //如果是添加时没值
        //保存是否是更新的标识
        this.isUpdate = !!product //强制转换布尔类型
        //保存商品（如果没有 保存空对象 避免报错）
        this.product = product || {}
    }
    componentDidMount(){
        this.getCategorys('0')
    }
    render(){
        const { isUpdate,product } = this
        const { pCategoryId,categoryId,imgs,detail} = product
        //用来接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate){
            //商品是一级分类的商品
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{
                //商品是二级级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)          
            }
        }

        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },//左侧label的宽度
            wrapperCol: { span: 8 }, //右侧包裹的宽度
          }
        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left'  style={{fontSize:20}}/>
                </LinkButton>
                <span>{ isUpdate ? '修改商品':'添加商品'}</span>
            </span>
        )
        const {getFieldDecorator} = this.props.form
        return (
            <Card title={title}> 
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {getFieldDecorator('name',{
                            initialValue:product.name,
                            rules:[
                                {required:true,message:'必须输入商品名称'}
                            ]
                        })(<Input placeholder='请输入商品名称'></Input>)}
                        
                    </Item>
                    <Item label="商品描述">
                        {getFieldDecorator('desc',{
                            initialValue:product.desc,
                            rules:[
                                {required:true,message:'必须输入商品描述'}
                            ]
                        })(<TextArea placeholder='请输入商品描述' autoSize={{miniRows:2,maxRows:6}} />)}
                        
                    </Item>
                    <Item label="商品价格">
                        {getFieldDecorator('price',{
                                initialValue:product.price,
                                rules:[
                                    {required:true,message:'必须输入商品描述'},
                                    {validator:this.validatePrice}
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'></Input>)}
                        
                    </Item>
                    <Item label="商品分类">
                        {getFieldDecorator('categoryIds',{
                                    initialValue:categoryIds,
                                    rules:[
                                        {required:true,message:'必须指定商品分类'},
                                        //{validator:this.validatePrice}
                                    ]
                                })(
                                    <Cascader
                                        options={this.state.options}//需要显示的列表数据数组
                                        loadData={this.loadData} //当选择某个列表项 加载下一级列表的监听回调
                                    />
                                )}
                        
                        </Item>
                    <Item label="商品图片">
                        <PicturesWall  ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:20}}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item >
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)

/*
1.子组件调用父组件的方法：
将父组件的方法易函数属性的形式传递给子组件，子组件就可以调用

2.父组件调用子组件的方法：
在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法

1)创建ref容器 this.pw= React.createRef()
2)将ref容器交给需要获取的标签元素  <  ref={this.pw} /> //自动将标签对象添加为pw对象的current属性
3)通过ref容器读取标签元素： this.pw.current
*/