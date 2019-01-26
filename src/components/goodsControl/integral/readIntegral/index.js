import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../../base/home/store';
import { CreateStagesContainer, CreateItem, Name, InputWarp } from './../createIntegral/style';
import { message, Select, Col, Row, TreeSelect, Radio, InputNumber, Input, Button, Card, Form, Popconfirm } from 'antd';
import history from './../../../../history';
import fatch from './../../../../common/js/fatch';
import baseURL from './../../../../common/js/baseURL';
import uuid from './../../../../common/js/uuid';
import formatDateTime from './../../../../common/js/formatDateTime';
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
class ReadIntegral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            channelCode: 1,
            type: 0,
            categoriesStr: [],
            creditType: 0,
            number: '',
            percentage: undefined,
            cover: 0,
            content: '',
            remark: '',
            excludeSpu: '',
            spu: '',
            showWarp: false,
            createTime: ''
        }
    }
    componentWillMount() {
        let data = this.props.location.state;
        this.getTypeList(data.record.categoriesStr);
        this.getIntegralData(data.record.id);
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '积分管理', '查看']));
    }
    getIntegralData = (id) => {
        this.showAndHideLoading(true);
        const url = `${baseURL}goods/credit/detail`;
        fatch(url, 'post', { id }, (err, state) => {
            message.error(err);
            this.showAndHideLoading(false);
        }).then((res) => {
            if (res.code === '0') {
                if (res.data.creditType === 0) {
                    this.setState({
                        number: res.data.credit
                    })
                } else {
                    this.setState({
                        percentage: res.data.credit
                    })
                }
                if (res.data.type === 0) {
                    this.setState({
                        excludeSpu: res.data.content
                    })
                } else {
                    this.setState({
                        spu: res.data.content
                    })
                }
                this.setState({
                    showWarp: true,
                    channelCode: res.data.channelCode,
                    type: res.data.type,
                    creditType: res.data.creditType,
                    cover: res.data.cover,
                    remark: res.data.remark,
                    createTime: formatDateTime(res.data.createTime)
                })
            } else {
                message.error(res.msg);
                this.showAndHideLoading(false);
            }
            this.showAndHideLoading(false);
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
                })
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
    handleStagesChange = (type, e) => {
        if (type === 1) {
            this.setState({ number: e.target.value.replace(/\D/g, '') });
        } else {
            this.setState({ percentage: e })
        }
    }
    handleBack = () => {
        history.push({pathname: '/goodsControl/integral', query: this.props.location.state});
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { treeData, categoriesStr, createTime, channelCode, type, treeValue, creditType, number, percentage, cover, excludeSpu, spu, remark } = this.state;
        const tProps = {
            treeData,
            value: categoriesStr,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,   
            searchPlaceholder: '设置分类列表',
            maxTagCount: 3,
            style: {
                width: 500,
            }
        }
        const limitDecimals = (value: string | number): string => {
            const reg = /^(\-)*(\d+)\.(\d\d).*$/;
            if(typeof value === 'string') return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
            else if (typeof value === 'number') return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
            else return '';
        };
        return (
            <div>
                <div style={{ display: this.state.showWarp ? 'block' : 'none' }}>
                    <Button
                        type='primary'
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
                                    <Option value='1'>京东商城</Option>
                                    <Option value=''>全部</Option>
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
                            <InputWarp id='fenlei' style={{position: 'relative', display: type === 0 ? 'block' : 'none'}}>
                                <TreeSelect treeCheckStrictly={true} {...tProps} getPopupContainer={() => document.getElementById('fenlei')} />
                            </InputWarp>
                        </CreateItem>
                        <CreateItem>
                            <Name>积分类型:</Name>
                            <InputWarp id='jifenleixing' style={{position: 'relative' }}>
                                <Select
                                    style={{ width: '500px' }}
                                    value={creditType}
                                    disabled
                                    getPopupContainer={() => document.getElementById('jifenleixing')}
                                >
                                    <Option value={1}>销售价格百分比</Option>
                                    <Option value={0}>按数值</Option>
                                </Select>
                            </InputWarp>
                        </CreateItem>
                        <CreateItem>
                            <Name>积分:</Name>
                            <InputWarp>
                                <Input
                                    style={{width: 500, display: creditType === 0 ? 'block' : 'none' }}
                                    placeholder='请输入积分'
                                    value={number}
                                    disabled
                                />
                                <InputNumber
                                    min={0}
                                    formatter={limitDecimals} 
                                    parser={limitDecimals}
                                    value={percentage}
                                    disabled
                                    style={{width: 480, display: creditType !== 0 ? 'inline-block' : 'none' }}
                                />
                                <span style={{width: 20, display: creditType !== 0 ? 'inline-block' : 'none' }}>%</span>
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
            </div>
        );
    }
}
export default connect(null, null)(Form.create({})(ReadIntegral));