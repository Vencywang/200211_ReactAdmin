import React, {Component} from 'react'
import {
    Form,
    Select,
    Input
} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option
//条件分类的form组件
class AddForm extends Component{
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        
    }
    componentWillMount(){
        this.props.setForm(this.props.form) //传递子组件的form给父组件 函数的形式
    }
    render(){
        const { getFieldDecorator} = this.props.form
        const {categorys,parentId} = this.props
         //指定Item布局的配置对象
         const formItemLayout = {
            labelCol: { span: 4 },//左侧label的宽度
            wrapperCol: { span: 15 }, //右侧包裹的宽度
          }
        return(
            <Form>
                <Item label='角色名称' {...formItemLayout}>
                    {getFieldDecorator('roleName',
                    {
                        initialValue:'',
                        rules:[
                            {required: true,message:'角色名称必须输入'}
                        ]    
                    })(
                        <Input placeholder="请输入角色名称"/> 
                    )}
                </Item>
                
            </Form>
        )
    }
}
export default Form.create()(AddForm)