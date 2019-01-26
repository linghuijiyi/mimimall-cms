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

class UpdateCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            treeValue: [],
            categories: [],
            type: 0,
            validateTimeStart: '',
            validateTimeEnd: '',
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
        this.getCouponDetail(this.props.location.state.id);
        this.props.dispatch(actionCreators.changeBreadcrumb(['运营管理', '优惠券管理', '修改优惠券']));
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
                if (result.couponType === 1) {
                    this.setState({couponAmount: result.couponAmount});
                } else {
                    this.setState({discount: result.couponAmount});
                }
                this.setState({
                    type: result.type,
                    validateTimeStartValue: moment(formatDateTime(result.validateTimeStart), dateFormat),
                    validateTimeEndValue: moment(formatDateTime(result.validateTimeEnd), dateFormat),
                    grantTimeValue: moment(formatDateTime(result.grantTime), dateFormat),
                    validateTimeStart: formatDateTime(result.validateTimeStart),
                    validateTimeEnd: formatDateTime(result.validateTimeEnd),
                    grantTime: formatDateTime(result.grantTime),
                    within: result.within,
                    minConsum: result.minConsum,
                    channelCode: result.channelCode,
                    couponType: result.couponType,
                    applyType: result.applyType,
                    phones: result.phones === null ? '' : result.phones,
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
                if (data) {
                    this.setState({ treeData: this.handleFormatTypeList(res.data) });
                    let str = data.split(',');
                    let list = [];
                    for (let i = 0; i < str.length; i++) list.push({value: str[i]});
                    this.setState({categories: list});
                } else {
                    this.setState({ treeData: this.handleFormatTypeList(res.data) });
                }
                
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
    /*****************************获取分类id**************************/
    terrChange = (treeValue, label, extra) => {
        let data = extra.allCheckedNodes;
        let categories = [];
        for (let i = 0; i < data.length; i++) {
            categories.push({value: data[i].props.categoryId.toString()});
        }
        this.setState({ categories });
    }
    /*****************************保存优惠数据************************/
    handleSaveClick = () => {
        const {
            type,
            validateTimeStart,
            validateTimeEnd,
            grantTime,
            couponType,
            minConsum,
            couponAmount,
            discount,
            channelCode,
            applyType,
            categories,
            spustr,
            phones,
            name,
            description,
            handle,
            within
        } = this.state;
        let params = {};
        params.id = this.props.location.state.id;
        params.type = type;
        params.couponType = couponType;
        params.minConsum = minConsum;
        params.channelCode = channelCode;
        params.applyType = applyType;
        params.name = name;
        params.description = description;
        params.handle = handle;
        if (params.type === 0) {
            params.validateTimeStart = validateTimeStart;
            params.validateTimeEnd = validateTimeEnd;
            params.grantTime = grantTime;
        } else {
            params.within = within;
        }
        if (params.couponType === 1) {
            params.couponAmount = couponAmount;
        } else {
             params.couponAmount = discount;
        }
        if (params.applyType === 1) {
            let str = [];
            for (let i = 0; i < categories.length; i++) str.push(categories[i].value);
            if (!str.length) {
                message.info('请设置分类列表。');
                return;
            }
            params.content = str;
        } else if (applyType === 2) {
            if (spustr.length > 0) {
                params.content = spustr.split(',');
            } else {
                message.info('spu为必填项。');
                return;
            }
        }
        if (params.type === 0) {
            if (params.validateTimeStart === '' || params.validateTimeStart === null) {
                message.info('优惠券开始有效期不能为空。');
                return;
            }
            if (params.validateTimeEnd === '' || params.validateTimeEnd === null) {
                message.info('优惠券结束有效期不能为空。');
                return;
            }
            if (params.grantTime === '' || params.grantTime === null) {
                message.info('发放时间不能为空。');
                return;
            }
            if (new Date(params.grantTime).getTime() < new Date(new Date().getTime() + 1000 * 60 * 60 * 1)) {
                message.info('优惠券发放时间必须大于当前时间一个小时。');
                return;
            }
            if (new Date(params.validateTimeStart).getTime() < new Date(params.grantTime).getTime()) {
                message.info('优惠券开始有效期不能小于发放时间。');
                return;
            }
            if (new Date(params.validateTimeEnd).getTime() < new Date(params.validateTimeStart).getTime() || new Date(params.validateTimeEnd).getTime() === new Date(params.validateTimeStart).getTime()) {
                message.info('优惠券结束有效期不能小于等于开始效期日期');
                return;
            }
        } else {
            if (params.within === '' || params.within === undefined || params.within === 0 || params.within === '0') {
                message.info('优惠券有效期不能为空,并且不能为0');
                return;
            }
            if (params.within > 180) {
                message.info('优惠券有效期不能大于180天。');
                return;
            }
        }
        if (params.minConsum === '' || params.minConsum === undefined ||  params.minConsum === 0) {
            message.info('最低消费不能为空，并且不能为0。');
            return;
        }
        if (params.couponType === 1) {
            if (params.couponAmount === '' || params.couponAmount === undefined || params.couponAmount === 0) {
                message.info('优惠券金额不能为空，并且不能为0。');
                return;
            }
            if (params.couponAmount > params.minConsum || params.couponAmount === params.minConsum) {
                message.info('优惠券金额不能大于等于最低消费金额。');
                return;
            }
        } else {
            if (params.couponAmount === '' || params.couponAmount === undefined || params.couponAmount === 0) {
                message.info('折扣金额不能为空，并且不能为0。');
                return;
            }
            if (params.couponAmount < 5 || params.couponAmount >= 10) {
                message.info('折扣金额不能小于5或者大于等于10。');
                return;
            }
        }
        if (params.type === 0) {
            params.phones = phones;
            if (params.phones.length > 0) {
                let phones = params.phones.split(',');
                for (let i = 0; i < phones.length; i++) {
                    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(phones[i])) {
                        message.info('手机号格式不正确');
                        return;
                    }
                }
            }
        }
        if (params.name === '' || params.name === null) {
            message.info('规则名称不能为空。');
            return;
        }
        if (params.name.lengt > 140) {
            message.info('规则名称不能超过140个字符。');
            return;
        }
        if (params.description === '' || params.description === null) {
            message.info('描述不能为空。');
            return;
        }
        if (params.description.length > 140) {
            message.info('描述不能超过140个字符。');
            return;
        }
        this.showAndHideLoading(true);
        const url = `${baseURL}market/coupon/update`;
        fatch(url, 'post', params, (err, state) => {
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                this.showAndHideLoading(false);
                this.handleBackClick();
            } else {
                message.error(res.msg);
                this.showAndHideLoading(false);
            }
        });
    }
    /**************************设置时间值****************************/
    datePickerChange = (date, dateStr, timeName, timeValue) => {
        if (timeName === 'grantTime') {
            this.setState({
                validateTimeStart: '',
                validateTimeStartValue: null,
                validateTimeEnd: '',
                validateTimeEndValue: null
            });
        } else if (timeName === 'validateTimeStart') {
            this.setState({
                validateTimeEnd: '',
                validateTimeEndValue: null
            });
        }
        this.setState({[timeName]: dateStr, [timeValue]: date});
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
            treeValue,
            categories,
            couponType,
            type,
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
            onChange: this.terrChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '设置分类',
            maxTagCount: 2,
            style: {
                width: '95%',
                top: 0
            },
        }
        const limitDecimals = (value: string | number): string => {
            const reg = /^(\-)*(\d+)\.(\d\d).*$/;
            if(typeof value === 'string') return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
            else if (typeof value === 'number') return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
            else return '';
        }
        const coupoStyle = {
            lineHeight: type === 0 ? '32px' : '45px'
        }
        const couponShowAndHide = (f, n) => {
            return { display: type === 0 ? f : n }
        }
        return (
            <div>
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
                                        onChange={(value) => {this.setState({type: value})}}
                                        getPopupContainer={() => document.getElementById('type')}
                                    >
                                        <Option value={0}>活动优惠券(活动发送)</Option>
                                        <Option value={1}>首单优惠券(系统发送)</Option>
                                        <Option value={2}>注册优惠券(系统发送)</Option>
                                    </Select>
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
                                        onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'grantTime', 'grantTimeValue')}}
                                        showToday={false}
                                        placeholder='选择发送时间'
                                        getCalendarContainer={() => document.getElementById('sendTime')}
                                    />
                                </Info>
                            </Item>
                            <Item style={couponShowAndHide('flex', 'none')}>
                                <Title>优惠券有效期:</Title>
                                <Info id='cpuponTime'>
                                    <DatePicker
                                        style={{ width: '47.5%' }}
                                        format={dateFormat}
                                        showTime
                                        showToday={false}
                                        placeholder='选择开始日期'
                                        value={validateTimeStartValue}
                                        onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'validateTimeStart', 'validateTimeStartValue')}}
                                        getCalendarContainer={() => document.getElementById('cpuponTime')}
                                    />
                                    <DatePicker
                                        style={{ width: '47.5%' }}
                                        format={dateFormat}
                                        showTime
                                        value={validateTimeEndValue}
                                        showToday={false}
                                        onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'validateTimeEnd', 'validateTimeEndValue')}}
                                        placeholder='选择结束日期'
                                        getCalendarContainer={() => document.getElementById('cpuponTime')}
                                    />
                                </Info>
                            </Item>
                            <Item style={couponShowAndHide('none', 'flex')}>
                                <Title>优惠券有效期(天):</Title>
                                <Info>
                                    <Input
                                        style={{width: '95%'}}
                                        placeholder='请设置优惠券有效期'
                                        min={0}
                                        value={within}
                                        onChange={(e) => {
                                            let num = e.target.value;
                                            if (num) {
                                                num = num.replace(/\D/g, '')
                                            } else {

                                            }
                                            this.setState({within: num})
                                        }}
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
                                        onChange={(value) => {this.setState({couponType: value})}}
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
                                        formatter={limitDecimals}
                                        parser={limitDecimals}
                                        onChange={(value) => {this.setState({minConsum: value})}}
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
                                        formatter={limitDecimals} 
                                        parser={limitDecimals}
                                        onChange={(value) => {this.setState({couponAmount: value})}}
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
                                        onChange={(value) => {this.setState({discount: value})}}
                                        formatter={limitDecimals} 
                                        parser={limitDecimals} 
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
                                        onChange={(value) => {this.setState({channelCode: value})}}
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
                                        onChange={(value) => {
                                            if (value === 1) this.getTypeList()
                                            this.setState({applyType: value})
                                        }}
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
                                        disabled={applyType === 0 || applyType === 2 ? true : false}
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
                                        disabled={applyType === 0 || applyType === 1 ? true : false}
                                        value={spustr}
                                        onChange={(e) => {this.setState({spustr: e.target.value.replace(/[^0-9A-Z,]/g,'')})}}
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
                                        placeholder='选填项,多个之间用","分格,不填默认为全部。'
                                        value={phones}
                                        disabled={type === 0 ? false : true}
                                        onChange={(e) => {this.setState({phones: e.target.value.replace(/[^0-9,]/g,'')})}}
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
                                        onChange={(e) => {this.setState({name: e.target.value})}}
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
                                        onChange={(e) => {this.setState({description: e.target.value})}}
                                    />
                                </Info>
                            </Item>
                            <Item>
                                <Title>是否手动领取:</Title>
                                <Info>
                                    <RadioGroup value={handle} onChange={(e) => {this.setState({handle: e.target.value})}}>
                                        <Radio value={0}>自动获得</Radio>
                                        <Radio value={1}>手动领取</Radio>
                                    </RadioGroup>
                                </Info>
                            </Item>
                        </View>
                    </Col>
                </Row>
                <OptionWarp>
                    <Button type='primary' onClick={this.handleBackClick}>取消</Button>
                    <Button type='primary' onClick={this.handleSaveClick}>保存</Button>
                </OptionWarp>
            </div>
        );
    }
}

export default connect(null, null)(Form.create({})(UpdateCoupon));