import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'
/*
后台管理的折线图路由组件
*/
export default class Line extends Component {
    state={
        sales:[5, 20, 36, 10, 10, 20], //销量数组
        stores:[5, 10, 19, 30, 25, 20] //库存数组
    }
    update=()=>{
        this.setState(state=>({
            sales:state.sales.map(sale=>sale+1),
            stores: state.stores.reduce((pre,store)=>{
                pre.push(store+2)
                return pre
            },[])
        }))
    }
//返回折线图的配置对象
getOption=(sales,stores)=>{
    return {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量','库存']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'line',
            data: sales
        },
        {
            name: '库存',
            type: 'line',
            data: stores
        }
    ]
    }
}
    render() {
        const {sales,stores} = this.state
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>
                <Card title='柱状图一'>
                    <ReactEcharts option={this.getOption(sales,stores)} style={{height: 300}}/>
                </Card>
            </div>
            )
        }
    }