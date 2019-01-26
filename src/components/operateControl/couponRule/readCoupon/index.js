import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from './../../../../history';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../../base/home/store';
import { View, Item, Title, Info, OptionWarp } from './../createCoupon/style.js';
import { Form, Select, DatePicker, Row, Col, Input, TreeSelect, Radio, Button, InputNumber, message } from 'antd';
import baseURL from './../../../../common/js/baseURL';
import fatch from './../../../../common/js/fatch';
import uuid from './../../../../common/js/uuid';
import formatDateTime from './../../../../common/js/formatDateTime';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class CreateCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            treeValue: [],
            categories: [],
            type: 0,
            validateTimeStartValue: null,
            validateTimeEndValue: null,
            grantTime: '',
            grantTimeValue: null,
            couponType: 1,
            minConsum: '',
            couponAmount: '',
            discount: '',
            applyType: 0,
            channelCode: '',
            spustr: '',
            phones: '',
            name: '',
            description: '',
            handle: 0,
            within: ''
        }
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['运营管理', '优惠券管理', '优惠券详情']));
        this.getCouponDetail(this.props.location.state.id);
    }
    getCouponDetail = (id) => {
        this.showAndHideLoading(true);
        const url = `${baseURL}market/coupon/detail`;
        fatch(url, 'post', { id }, (err, state) => {
            message.error(err);
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data;
                this.setState({
                    type: result.type,
                    validateTimeStartValue: moment(formatDateTime(result.validateTimeStart), dateFormat),
                    validateTimeEndValue: moment(formatDateTime(result.validateTimeEnd), dateFormat),
                    grantTimeValue: moment(formatDateTime(result.grantTime), dateFormat),
                    within: result.within,
                    minConsum: result.minConsum,
                    couponAmount: result.couponAmount,
                    discount: result.couponAmount,
                    channelCode: result.channelCode,
                    couponType: result.couponType,
                    applyType: result.applyType,
                    phones: result.phones,
                    description: result.description,
                    name: result.name,
                    handle: result.handle
                });
                if (result.applyType === 0) {

                } else if (result.applyType === 1) {
                    this.getTypeList(result.content);
                } else {
                    this.setState({
                        spustr: result.content,
                    });
                }
                this.showAndHideLoading(false);
            } else {
                message.error(res.msg);
                this.showAndHideLoading(false);
            }
        });
    }
    /*****************************获取分类列表************************/
    getTypeList(data) {
        const url = `${baseURL}category/all/list`;
        fatch(url, 'post', {}, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({ treeData: this.handleFormatTypeList(res.data) });
                let str = data.split(',');
                let list = [];
                for (let i = 0; i < str.length; i++) list.push({value: str[i]});
                this.setState({categories: list});
            } else {
                message.error('获取分类id失败：' + res.msg);
            }
        });
    }
    /*****************************格式化分类数据**********************/
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
    handleBackClick = () => {
        history.push({
            pathname: '/operateControl/couponRule',
            query: this.props.location.state
        });
    }
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const {
            treeData,
            couponType,
            type,
            categories,
            validateTimeStartValue,
            validateTimeEndValue,
            grantTimeValue,
            minConsum,
            couponAmount,
            discount,
            applyType,
            channelCode,
            spustr,
            phones,
            name,
            description,
            handle,
            within  
        } = this.state;
        const tProps = {
            treeData,
            value: categories,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '设置分类',
            maxTagCount: 2,
            style: {
                width: '95%',
                top: 0
            },
        }
        const coupoStyle = {
            lineHeight: type === 0 ? '32px' : '45px'
        }
        const couponShowAndHide = (f, n) => {
            return { display: type === 0 ? f : n }
        }
        return (
            <div>
                <Button type='primary' style={{marginLeft: '12px', marginTop: '20px', width: '100px'}} onClick={this.handleBackClick}>返回</Button>
                <Row gutter={{ md: 8, lg: 24, xl: 24 }} style={{marginLeft: 0, marginRight: 0, marginTop: 15}}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                        <View>
                            <Item style={coupoStyle}>
                                <Title>优惠券类型:</Title>
                                <Info id='type'>
                                    <Select
                                        className='select'
                                        style={{ width: '95%' }}
                                        value={type}
                                        disabled
                                        getPopupContainer={() => document.getElementById('type')}
                                    >
                                        <Option value={0}>活动优惠券(活动发送)</Option>
                                        <Option value={1}>首单优惠券(系统发送)</Option>
                                        <Option value={2}>注册优惠券(系统发送)</Option>
                                    </Select>
                                </Info>
                            </Item>
                            <Item style={couponShowAndHide('flex', 'none')}>
                                <Title>优惠券有效期:</Title>
                                <Info id='cpuponTime'>
                                    <DatePicker
                                        style={{ width: '47.5%' }}
                                        format={dateFormat}
                                        showTime
                                        placeholder='选择开始日期'
                                        value={validateTimeStartValue}
                                        disabled
                                        getCalendarContainer={() => document.getElementById('cpuponTime')}
                                    />
                                    <DatePicker
                                        style={{ width: '47.5%' }}
                                        format={dateFormat}
                                        showTime
                                        value={validateTimeEndValue}
                                        placeholder='选择结束日期'
                                        disabled
                                        getCalendarContainer={() => document.getElementById('cpuponTime')}
                                    />
                                </Info>
                            </Item>
                            <Item style={couponShowAndHide('flex', 'none')}>
                                <Title>发放时间:</Title>
                                <Info id='sendTime'>
                                    <DatePicker
                                        style={{ width: '95%' }}
                                        format={dateFormat}
                                        showTime
                                        value={grantTimeValue}
                                        placeholder='选择发送时间'
                                        disabled
                                        getCalendarContainer={() => document.getElementById('sendTime')}
                                    />
                                </Info>
                            </Item>
                            <Item style={couponShowAndHide('none', 'flex')}>
                                <Title>优惠券有效期(天):</Title>
                                <Info>
                                    <Input
                                        style={{ width: '95%' }}
                                        placeholder='优惠券有效期'
                                        value={within}
                                        disabled
                                    />
                                </Info>
                            </Item>
                            <Item style={coupoStyle}>
                                <Title>*使用次数:</Title>
                                <Info>
                                    <div style={{ width: '95%' }}>
                                        支持多个用户，但每个用户且仅能用1次
                                    </div>
                                </Info>
                            </Item>
                        </View>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                        <View>
                            <Item>
                                <Title>优惠形式:</Title>
                                <Info id='youhuiType'>
                                    <Select
                                        className='select'
                                        style={{ width: '95%' }}
                                        value={couponType}
                                        disabled
                                        getPopupContainer={() => document.getElementById('youhuiType')}
                                    >
                                        <Option value={1}>现金优惠</Option>
                                        <Option value={0}>折扣优惠</Option>
                                    </Select>
                                </Info>
                            </Item>
                            <Item>
                                <Title>*最低消费(元):</Title>
                                <Info>
                                    <InputNumber
                                        style={{width: '95%'}}
                                        placeholder='请输入最低消费金额'
                                        min={0}
                                        value={minConsum}
                                        disabled
                                    />
                                </Info>
                            </Item>
                            <Item style={{display: couponType === 1 ? 'flex' : 'none'}}>
                                <Title>*优惠券金额(元):</Title>
                                <Info>
                                    <InputNumber
                                        style={{width: '95%'}}
                                        placeholder='请输入优惠券金额'
                                        min={0}
                                        value={couponAmount}
                                        disabled
                                    />
                                </Info>
                            </Item>
                            <Item style={{display: couponType === 0 ? 'flex' : 'none'}}>
                                <Title>*折扣:</Title>
                                <Info>
                                    <InputNumber
                                        style={{width: '95%'}}
                                        placeholder='请输入折扣'
                                        min={0}
                                        value={discount}
                                        disabled
                                    />
                                </Info>
                            </Item>
                            <Item>
                                <Title>渠道:</Title>
                                <Info id='channel'>
                                    <Select
                                        className='select'
                                        style={{ width: '95%' }}
                                        value={channelCode}
                                        disabled
                                        getPopupContainer={() => document.getElementById('channel')}
                                    >
                                        <Option value=''>全部</Option>
                                        <Option value='1'>京东</Option>
                                    </Select>
                                </Info>
                            </Item>
                        </View>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                        <View>
                            <Item>
                                <Title>适用范围:</Title>
                                <Info id='range'>
                                    <Select
                                        className='select'
                                        style={{ width: '95%' }}
                                        value={applyType}
                                        disabled
                                        getPopupContainer={() => document.getElementById('range')}
                                    >
                                        <Option value={0}>全部商品</Option>
                                        <Option value={1}>分类</Option>
                                        <Option value={2}>单个/多个商品</Option>
                                    </Select>
                                </Info>
                            </Item>
                            <Item className='treeSelect'>
                                <Title>分类:</Title>
                                <Info id='fenlei'>
                                    <TreeSelect
                                        treeCheckStrictly={true}
                                        {...tProps}
                                        getPopupContainer={() => document.getElementById('fenlei')}
                                    />
                                </Info>
                            </Item>
                            <Item>
                                <Title>spu:</Title>
                                <Info>
                                    <TextArea
                                        style={{width: '95%', height: '70px', resize: 'none'}}
                                        placeholder='必填项，多个之间用","分格。'
                                        disabled={true}
                                        value={spustr}
                                    />
                                </Info>
                            </Item>
                        </View>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 24 }} style={{marginLeft: 0, marginRight: 0, marginTop: 15}}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                        <View>
                            <Item>
                                <Title>用户手机号:</Title>
                                <Info>
                                    <TextArea
                                        style={{width: '95%', height: '75px', resize: 'none'}}
                                        placeholder='选填项，不填默认为全部。'
                                        value={phones}
                                        disabled
                                    />
                                </Info>
                            </Item>
                            <Item>
                                <Title>规则名称:</Title>
                                <Info>
                                    <TextArea
                                        style={{width: '95%', height: '75px', resize: 'none'}}
                                        placeholder='必填项（仅方便后台查看统计）。'
                                        value={name}
                                        disabled
                                    />
                                </Info>
                            </Item>
                        </View>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                        <View>
                            <Item>
                                <Title>描述:</Title>
                                <Info>
                                    <TextArea
                                        style={{width: '95%', height: '70px', resize: 'none'}}
                                        placeholder='必填项（展示在前台）。'
                                        value={description}
                                        disabled
                                    />
                                </Info>
                            </Item>
                            <Item>
                                <Title>是否手动领取:</Title>
                                <Info>
                                    <RadioGroup value={handle} disabled>
                                        <Radio value={0}>自动获得</Radio>
                                        <Radio value={1}>手动领取</Radio>
                                    </RadioGroup>
                                </Info>
                            </Item>
                        </View>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(null, null)(Form.create({})(CreateCoupon));