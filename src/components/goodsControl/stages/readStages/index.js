import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import { CreateStagesContainer, CreateItem, Name, InputWarp } from './../createStages/style';
import { Select, Col, Row, TreeSelect, Radio, InputNumber, Input, Button, Card, Form, Popconfirm } from 'antd';
import history from './../../../../history';
import baseURL from './../../../../common/js/baseURL';
import fatch from './../../../../common/js/fatch';
import uuid from './../../../../common/js/uuid';
import formatDateTime from './../../../../common/js/formatDateTime';
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
let stagesData = null;

class ReadStages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            categoriesStr: [],
            channelCode: '',
            type: 0,
            downPayment: '',
            terms: [],
            excludeSpu: '',
            spu: '',
            cover: '',
            remark: '',
            createTime: ''
        }
    }
    componentWillMount() {
        stagesData = this.props.location.state;
        this.getTypeList(stagesData.record.categoriesStr);
        this.getStagesData(stagesData.record.id);
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '分期管理', '查看']));
    }
    getStagesData = (id) => {
        const url = `${baseURL}goods/instalment/detail`;
        fatch(url, 'post', { id }, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                if (data.type === 0) {
                    this.setState({ excludeSpu: data.content });
                } else {
                    this.setState({ spu: data.content });
                }
                this.setState({
                    channelCode: data.channelCode,
                    type: data.type,
                    downPayment: data.downPayment,
                    terms: data.terms,
                    cover: data.cover,
                    remark: data.remark,
                    createTime: formatDateTime(data.createTime)
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    getTypeList(data) {
        const url = `${baseURL}category/all/list`;
        fatch(url, 'post', {}, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    treeData: this.handleFormatTypeList(res.data)
                }, () => {
                    if (data !== null) {
                        let categoriesStr = data.split(',');
                        let list = [];
                        for (let i = 0; i < categoriesStr.length; i++) {
                            list.push({value: categoriesStr[i]});
                        }
                        this.setState({ categoriesStr: list });
                    }
                });
            } else {
                message.error('获取分类id失败：' + res.msg);
            }
        });
    }
    handleFormatTypeList(data) {
        return data.map((item, index) => {
            item.value = item.categoryId.toString();
            item.title = item.name;
            item.key = uuid();
            item.children = item.thirdCategoryList;
            if (item.thirdCategoryList !== null) this.handleFormatTypeList(item.thirdCategoryList);
            return item;
        });
    }
    handleBack = () => {
        history.push({pathname: '/goodsControl/stages', query: stagesData});
    }
    render() {
        const { treeData, categoriesStr, createTime, channelCode, type, downPayment, terms, excludeSpu, spu, cover, remark } = this.state;
        const tProps = {
            treeData,
            value: categoriesStr,
            onChange: this.onChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '全部分类',
            maxTagCount: 3,
            style: {
                width: 500,
            },
        }
        return (
            <div>
                <Button
                    type='primary'
                    icon='left'
                    style={{ width: 80, margin: '15px 0px 0px 15px' }}
                    onClick={this.handleBack}
                >  
                    返回
                </Button>
                <CreateStagesContainer>
                    <CreateItem>
                        <Name>创建日期:</Name>
                        <InputWarp id='admc' style={{position: 'relative' }}>
                            <Input disabled value={createTime} style={{ width: '500px' }} />
                        </InputWarp>
                    </CreateItem>
                    <CreateItem>
                        <Name>渠道:</Name>
                        <InputWarp id='admc' style={{position: 'relative' }}>
                            <Select
                                style={{ width: '500px' }}
                                value={channelCode}
                                disabled
                                getPopupContainer={() => document.getElementById('admc')}
                            >
                                <Option value=''>全部</Option>
                                <Option value='1'>京东商城</Option>
                            </Select>
                        </InputWarp>
                    </CreateItem>
                    <CreateItem>
                        <Name>类型:</Name>
                        <InputWarp id='leixing' style={{position: 'relative' }}>
                            <Select
                                style={{ width: '500px' }}
                                value={type}
                                disabled
                                getPopupContainer={() => document.getElementById('leixing')}
                            >
                                <Option value={0}>分类</Option>
                                <Option value={1}>多个/单个商品</Option>
                            </Select>
                        </InputWarp>
                    </CreateItem>
                    <CreateItem style={{height: type === 0 ? 40 : 0}}>
                        <Name style={{display: type === 0 ? 'block' : 'none'}}>分类:</Name>
                        <InputWarp id='fenlei' style={{position: 'relative', display: type === 0 ? 'block' : 'none' }}>
                            <TreeSelect treeCheckStrictly={true} {...tProps} getPopupContainer={() => document.getElementById('fenlei')} />
                        </InputWarp>
                    </CreateItem>
                    <CreateItem>
                        <Name>首付:</Name>
                        <InputWarp>
                            <RadioGroup
                                style={{ width: 500 }}
                                value={downPayment}
                                disabled
                            >
                                <Radio value={0}>零首付</Radio>
                                <Radio value={10}>10%</Radio>
                                <Radio value={20}>20%</Radio>
                                <Radio value={30}>30%</Radio>
                                <Radio value={40}>40%</Radio>
                                <Radio value={50}>50%</Radio>
                            </RadioGroup>
                        </InputWarp>
                    </CreateItem>
                    <div style={{ position: 'relative' }}>
                        <Name style={{ display: 'inline-block' }}>分期设置:</Name>
                        <Name style={{ width: 'auto', display: 'inline-block' }}>期数:（<span style={{ color: 'red' }}>整数</span>）利率:（<span style={{ color: 'red' }}>支持小数点后2位</span>）%</Name>
                        
                        {
                            terms.map((item, index) => {
                                return (
                                    <CreateItem className='qishu' key={index}>
                                        <InputWarp>
                                            <Input
                                                placeholder='期数'
                                                style={{width: 250}}
                                                value={item.terms}
                                                disabled
                                            />
                                            <InputNumber
                                                placeholder='利率'
                                                style={{width: 250}}
                                                value={item.rate}
                                                disabled
                                            />
                                        </InputWarp>
                                    </CreateItem>
                                )
                            })
                        }
                    </div>
                    <CreateItem className='textarea'>
                        <Name>{ type === 0 ? '排除的spu' : 'spu' }:</Name>
                        <InputWarp>
                            <TextArea
                                style={{ width: 500, height: '100px', resize: 'none', display: type === 0 ? 'block' : 'none' }} 
                                placeholder='多个之间用"/"分隔，选填项' 
                                value={excludeSpu}
                                disabled
                            />
                            <TextArea 
                                style={{ width: 500, height: '100px', resize: 'none', display: type !== 0 ? 'block' : 'none' }}
                                placeholder='多个之间用"/"分隔，不添即为全部spu'
                                value={spu}
                                disabled
                            />
                        </InputWarp>
                    </CreateItem>
                    <CreateItem>
                        <Name className='repeat'>存在重复设置是否覆盖:</Name>
                        <InputWarp>
                            <RadioGroup
                                style={{ width: 500 }}
                                value={cover}
                                disabled
                            >
                                <Radio value={0}>不覆盖</Radio>
                                <Radio value={1}>覆盖</Radio>
                            </RadioGroup>
                        </InputWarp>
                    </CreateItem>
                    <CreateItem className='textarea'>
                        <Name>备注:</Name>
                        <InputWarp>
                            <TextArea
                                style={{ width: 500, height: '100px', resize: 'none' }}
                                placeholder='选填项'
                                value={remark}
                                disabled
                            />
                        </InputWarp>
                    </CreateItem>
                </CreateStagesContainer>
            </div>
        );
    }
}
export default connect(null, null)(Form.create({})(ReadStages));