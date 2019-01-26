import React, { Component } from 'react';
import { Warp, OperationWarp, UsercouponDetail } from './style';
import { Select, Button, Input, Table, DatePicker, Icon, Tag, message, Row, Col, Card, Form, Drawer } from 'antd';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import history from './../../../history';
import moment from 'moment';
import fatch from './../../../common/js/fatch';
import pagination from './../../../common/js/pagination';
import formatDateTime from './../../../common/js/formatDateTime';
import Storage from './../../../common/js/storage';
import baseURL from './../../../common/js/baseURL';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const FormItem = Form.Item;
class CouponList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '序号',
                    dataIndex: 'id',
                    key: 'id',
                    align: 'center',
                    sorter: (a, b) => a.id - b.id,
                },
                {
                    title: '优惠码',
                    dataIndex: 'couponCode',
                    key: 'couponCode',
                    align: 'center',
                },
                {   
                    title: '规则名称',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '优惠券类型',
                    dataIndex: 'type',
                    key: 'type',
                    align: 'center',
                    render: (text, record) => {
                        if (record.type === 0) {
                            return <div>活动优惠券</div>;
                        } else if (record.type === 1) {
                            return <div>首单优惠券</div>;
                        } else if (record.type === 2) {
                            return <div>注册优惠券</div>;
                        } else if (record.type === '') {
                            return <div>全部</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '优惠形式',
                    dataIndex: 'couponType',
                    key: 'couponType',
                    align: 'center',
                    render: (text, record) => {
                        if (record.couponType === 0) {
                            return <div>折扣优惠</div>;
                        } else if (record.couponType === 1) {
                            return <div>现金优惠</div>;
                        } else if (record.couponType === '') {
                            return <div>全部</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '优惠券金额/折扣',
                    dataIndex: 'couponAmount',
                    key: 'couponAmount',
                    align: 'center',
                },
                {
                    title: '发放时间',
                    dataIndex: 'grantTime',
                    key: 'grantTime',
                    align: 'center',
                    render: (text, record) => {
                        return <div>{formatDateTime(record.grantTime)}</div>;
                    }
                },
                {
                    title: '开始时间',
                    dataIndex: 'validateTimeStart',
                    key: 'validateTimeStart',
                    align: 'center',
                    render: (text, record) => {
                        if (record.validateTimeStart !== null) {
                            return <div>{formatDateTime(record.validateTimeStart)}</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '结束时间',    
                    dataIndex: 'validateTimeEnd',
                    key: 'validateTimeEnd',
                    align: 'center',
                    render: (text, record) => {
                        if (record.validateTimeEnd !== null) {
                            return <div>{formatDateTime(record.validateTimeEnd)}</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '使用时间',    
                    dataIndex: 'useTime',
                    key: 'useTime',
                    align: 'center',
                    render: (text, record) => {
                        if (record.useTime !== null) {
                            return <div>{formatDateTime(record.useTime)}</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '状态',    
                    dataIndex: 'state',
                    key: 'state',
                    align: 'center',
                    render: (text, record) => {
                        if (record.state === '') {
                            return <div>全部</div>; 
                        } else if (record.state === 0) {
                            return <div>未开始</div>;
                        } else if (record.state === 1) {
                            return <div>未使用</div>;
                        } else if (record.state === 2) {
                            return <div>已使用</div>;
                        } else if (record.state === 3) {
                            return <div>已过期</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '用户手机号',    
                    dataIndex: 'phone',
                    key: 'phone',
                    align: 'center',
                    render: (text, record) => {
                        if (record.user !== null && record.user !== undefined) {
                            return <div>{record.user.phone}</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    align: 'center',
                    render: (text, record) => {
                        const btnStyle = {
                            minWidth: '85px',
                            margin: '0 5px 0 5px',
                        }
                        return (
                            <div style={{ display: 'flex' }}>
                                <Button
                                    type='primary'
                                    style={btnStyle}
                                    icon='eye'
                                    onClick={() => this.handleShowDrawerClick(record.id)}
                                >
                                    查看
                                </Button>
                            </div>
                        )
                    }
                }
            ],
            dataSource: [],
            grantTimeStart: '',
            grantTimeEnd: '',
            useTimeStart: '',
            useTimeEnd: '',
            grantTimeStartValue: null,
            grantTimeEndValue: null,
            useTimeStartValue: null,
            useTimeEndValue: null,
            drawerVisible: false,
            channelCode: '0',
            type: '',
            couponType: '',
            state: '',
            selectType: 'name',
            inputContent: '',
            detail: {}
        }
        this.params = { page: 1 };
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['运营管理', '优惠券列表']));
        this.requestCouponList();
    }
    requestCouponList = (loading) => {
        const url = `${baseURL}market/usercoupon/list`;
        this.showAndHideLoading(true);
        const {
            channelCode,
            type,
            couponType,
            state,
            grantTimeStart,
            grantTimeEnd,
            useTimeStart,
            useTimeEnd,
            selectType,
            inputContent,
        } = this.state;
        let _this = this;
        if (loading) this.params.page = 1;
        const params = {
            pageNo: this.params.page,
            channelCode,
            type,
            couponType,
            state,
            grantTimeStart,
            grantTimeEnd,
            useTimeStart,
            useTimeEnd,
            selectType,
            inputContent,
        }
        fatch(url, 'post', params, (err, state) => {
            message.error(err);
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.page.result;
                if (result === null) {
                    this.setState({dataSource: []});
                    if (loading) {
                        message.success(res.msg);
                    }
                    this.showAndHideLoading(false);
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        dataSource: result,
                        pagination: pagination(res.data.page, (current) => {
                            _this.params.page = current;
                            this.requestCouponList();
                        })
                    });
                    if (loading) {
                        message.success(res.msg);
                    }
                    this.showAndHideLoading(false);
                }
            } else {
                message.error(res.msg);
                this.showAndHideLoading(false);
            }
        });
    }
    queryList = () => {
        this.requestCouponList(true);
    }
    /**********************设置时间值*************************/
    datePickerChange = (date, dateStr, timeName, timeValue) => {
        this.setState({[timeName]: dateStr, [timeValue]: date});
    }
    handleExportTable = () => {
        const { 
            channelCode,
            type,
            couponType,
            state,
            grantTimeStart,
            grantTimeEnd,
            useTimeStart,
            useTimeEnd,
            selectType,
            inputContent,
        } = this.state;
        window.location = `
            ${baseURL}market/usercoupon/exportexcel?pageNo=${this.params.page}&channelCode=${channelCode}&type=${type}&couponType=${couponType}&state=${state}&grantTimeStart=${grantTimeStart}&grantTimeEnd=${grantTimeEnd}&useTimeStart=${useTimeStart}&useTimeEnd=${useTimeEnd}&selectType=${selectType}&inputContent=${inputContent}
        `;
    }
    renderAdvancedForm = () => {
        const { getFieldDecorator } = this.props.form;
        const {
            grantTimeStartValue,
            grantTimeEndValue,
            useTimeStartValue,
            useTimeEndValue,
            channelCode,
            type,
            state,
            couponType,
            selectType,
            inputContent
        } = this.state;
        return (
            <Form className="ant-advanced-search-form">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道'>
                            {getFieldDecorator('渠道')(
                                <div>
                                    <div id='mgjc' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={channelCode}
                                            onChange={(value) => {this.setState({channelCode: value})}}
                                            getPopupContainer={() => document.getElementById('mgjc')}
                                        >
                                            <Option value='0'>全部</Option>
                                            <Option value='1'>京东商城</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='优惠券类型'>
                            {getFieldDecorator('优惠券类型')(
                                <div>
                                    <div id='mqdsp' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={type}
                                            onChange={(value) => {this.setState({type: value})}}
                                            getPopupContainer={() => document.getElementById('mqdsp')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={2}>注册优惠券</Option>
                                            <Option value={0}>活动优惠券</Option>
                                            <Option value={1}>首单优惠券</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='优惠形式'>
                            {getFieldDecorator('优惠形式')(
                                <div>
                                    <div id='mqdsp' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={couponType}
                                            onChange={(value) => {this.setState({couponType: value})}}
                                            getPopupContainer={() => document.getElementById('mqdsp')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={1}>现金优惠</Option>
                                            <Option value={0}>折扣优惠</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='状态'>
                            {getFieldDecorator('状态')(
                                <div>
                                    <div id='shzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={state}
                                            onChange={(value) => {this.setState({state: value})}}
                                            getPopupContainer={() => document.getElementById('shzt')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={1}>未使用</Option>
                                            <Option value={2}>已使用</Option>
                                            <Option value={3}>已过期</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='发放时间'>
                            {getFieldDecorator('发放时间')(
                                <div>
                                    <div id='sjtbsj' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择开始日期'
                                            showToday={false}
                                            value={grantTimeStartValue}
                                            format={dateFormat}
                                            onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'grantTimeStart', 'grantTimeStartValue')}}
                                            
                                            getCalendarContainer={() => document.getElementById('sjtbsj')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择结束日期'
                                            showToday={false}
                                            value={grantTimeEndValue}
                                            format={dateFormat}
                                            onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'grantTimeEnd', 'grantTimeEndValue')}}
                                            getCalendarContainer={() => document.getElementById('sjtbsj')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                     <Col md={12} sm={24} lg={8}>
                        <FormItem label='使用时间'>
                            {getFieldDecorator('使用时间')(
                                <div>
                                    <div id='updateTime' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择开始日期'
                                            showToday={false}
                                            value={useTimeStartValue}
                                            format={dateFormat}
                                            onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'useTimeStart', 'useTimeStartValue')}}
                                            getCalendarContainer={() => document.getElementById('updateTime')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择结束日期'
                                            showToday={false}
                                            value={useTimeEndValue}
                                            format={dateFormat}
                                            onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'useTimeEnd', 'useTimeEndValue')}}
                                            getCalendarContainer={() => document.getElementById('updateTime')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='关键词'>
                            {getFieldDecorator('关键词')(
                                <div>
                                    <div id='gjc' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '50%' }}
                                            value={selectType}
                                            onChange={(value) => {this.setState({selectType: value})}}
                                            getPopupContainer={() => document.getElementById('gjc')}
                                        >
                                            <Option value='name'>规则名称</Option>
                                            <Option value='id'>优惠码</Option>
                                            <Option value='phone'>手机号</Option>
                                        </Select>
                                        <Input
                                            placeholder="支持模糊查询"
                                            style={{ width: '50%' }}
                                            className='input'
                                            value={inputContent}
                                            onChange={(e) => {this.setState({inputContent: e.target.value})}}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <FormItem>
                            {getFieldDecorator('1')(
                                <div>
                                    <Button
                                        type='primary'
                                        className='btn'
                                        icon='search'
                                        onClick={this.queryList}
                                    >
                                        查询
                                    </Button>
                                    <Button
                                        className='btn'
                                        type='primary'
                                        icon='reload'
                                        style={{marginLeft: 8}}
                                        onClick={this.handleFormReset}
                                    >
                                        重置
                                    </Button>
                                    <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                        收起 <Icon type="up" />
                                    </a>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
    renderSimpleForm = () => {
        const { getFieldDecorator } = this.props.form;
        const {
            channelCode,
            type,
            couponType
        } = this.state;
        return (
            <Form className="ant-advanced-search-form" >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道'>
                            {getFieldDecorator('渠道')(
                                <div>
                                    <div id='mgjc' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={channelCode}
                                            onChange={(value) => {this.setState({channelCode: value})}}
                                            getPopupContainer={() => document.getElementById('mgjc')}
                                        >
                                            <Option value='0'>全部</Option>
                                            <Option value='1'>京东商城</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='优惠券类型'>
                            {getFieldDecorator('优惠券类型')(
                                <div>
                                    <div id='mqdsp' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={type}
                                            onChange={(value) => {this.setState({type: value})}}
                                            getPopupContainer={() => document.getElementById('mqdsp')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={2}>注册优惠券</Option>
                                            <Option value={0}>活动优惠券</Option>
                                            <Option value={1}>首单优惠券</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='优惠形式'>
                            {getFieldDecorator('优惠形式')(
                                <div>
                                    <div id='mqdsp' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={couponType}
                                            onChange={(value) => {this.setState({couponType: value})}}
                                            getPopupContainer={() => document.getElementById('mqdsp')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={1}>现金优惠</Option>
                                            <Option value={0}>折扣优惠</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <FormItem>
                            {getFieldDecorator('1')(
                                <div>
                                    <Button
                                        type='primary'
                                        className='btn'
                                        icon='search'
                                        onClick={this.queryList}
                                    >
                                        查询
                                    </Button>
                                    <Button
                                        className='btn'
                                        type='primary'
                                        icon='reload'
                                        style={{marginLeft: 8}}
                                        onClick={this.handleFormReset}
                                    >
                                        重置
                                    </Button>
                                    <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                        展开 <Icon type="down" />
                                    </a>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
    /**********************显然筛选条件区域*********************/
    renderForm = () => {
        const { expandForm } = this.state;
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    /**********************切换筛选条件************************/
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({ expandForm: !expandForm });
    }
    /**********************重置查询条件***********************/
    handleFormReset = () => {
        this.setState({
            grantTimeStart: '',
            grantTimeEnd: '',
            useTimeStart: '',
            useTimeEnd: '',
            grantTimeStartValue: null,
            grantTimeEndValue: null,
            useTimeStartValue: null,
            useTimeEndValue: null,
            drawerVisible: false,
            channelCode: '0',
            type: '',
            couponType: '',
            state: '',
            selectType: 'name',
            inputContent: ''
        });
    }
    handleHideDrawerClick = () => {
    /************************隐藏详情*************************/
        this.setState({drawerVisible: false});
    }
    /**********************显示详情**************************/
    handleShowDrawerClick = (id) => {
        const url = `${baseURL}market/usercoupon/detail`;
        fatch(url, 'post', { id }, (err, state) => {

        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    detail: res.data,
                    drawerVisible: true
                });
            } else {

            }
        });
    }
    /***********************loading**************************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { dataSource, columns, drawerVisible, pagination, detail } = this.state;
        return (
            <Warp>
                <Card bordered={false}>
                    {this.renderForm()}
                    <OperationWarp>
                        <Button
                            type='primary'
                            icon='share-alt'
                            onClick={this.handleExportTable}
                        >
                            导出表格
                        </Button>
                    </OperationWarp>
                    <Table
                        bordered
                        dataSource={dataSource}
                        pagination={dataSource.length > 0 ? pagination : false}
                        columns={columns}
                        style={{'overflowX': 'auto'}}
                    />
                </Card>
                <Drawer
                    width={550}
                    title='优惠券信息'
                    placement='right'
                    closable={true}
                    visible={drawerVisible}
                    maskClosable={false}
                    onClose={this.handleHideDrawerClick}
                    style={{
                        height: 'calc(100% - 55px)',
                        overflow: 'auto',
                        paddingBottom: 53,
                    }}
                >
                    <UsercouponDetail>
                        <p>
                            <span>优惠码:</span><span>{detail.couponCode}</span>
                        </p>
                        <p>
                            <span>用户手机号:</span><span>{detail.user !== undefined && detail.user !== null ? detail.user.phone : ''}</span>
                        </p>
                        <p>
                            <span>发放时间:</span><span>{detail.grantTime === null ? '无' : formatDateTime(detail.grantTime)}</span>
                        </p>
                        <p>
                            <span>使用时间:</span><span>{detail.useTime === null ? '无' : formatDateTime(detail.useTime)}</span>
                        </p>
                        <p>
                            <span>状态:</span>
                            <span>
                                {
                                    detail.state === '' ? '全部' : detail.state === 0 ? '未开始' : detail.state === 1 ? '未使用' : detail.state === 2 ? '已使用' : '已过期'
                                }
                            </span>
                        </p>
                        <p>
                            <span>优惠券类型:</span>
                            <span>
                                {
                                    detail.type === '' ? '全部' : detail.type === 0 ? '活动优惠券' : detail.type === 1 ? '首单优惠券' : '注册优惠券'
                                }
                            </span>
                        </p>
                        <p>
                            <span>优惠券有效期:</span>
                            <span>
                                {formatDateTime(detail.validateTimeStart)}—{formatDateTime(detail.validateTimeEnd)}
                            </span>
                        </p>
                        <p>
                            <span>优惠形式:</span>
                            <span>
                                {
                                    detail.couponType === '' ? '全部' : detail.couponType === 1 ? '现金优惠' : '折扣优惠'
                                }
                            </span>
                        </p>
                        <p>
                            <span>最低消费:</span><span>{detail.minConsum}</span>
                        </p>
                        <p>
                            <span>优惠券金额/折扣:</span>
                            <span>
                                {
                                    detail.couponType === 1 ? detail.couponAmount + '元' : detail.couponAmount + '折'
                                }
                            </span>
                        </p>
                        <p>
                            <span>渠道:</span>
                            <span>
                                {detail.channelCode === 0 ? '全部' : detail.channelCode === 1 ? '京东' : ''}
                            </span>
                        </p>
                        <p> 
                            <span>产品范围:</span>
                            <span>
                                {
                                    detail.applyType === 0 ? '全部商品' : detail.applyType === 1 ? '分类' : '单个/多个商品'
                                }
                            </span>
                        </p>
                        {
                            detail.applyType === 1 ? (
                                <p>
                                    <span>分类列表:</span>
                                    <span>
                                        {
                                            detail.applyType === 1 ? detail.categoriesStr : ''
                                        }
                                    </span>
                                </p>
                            ) : detail.applyType === 2 ? (
                                <p>
                                    <span>sku列表:</span>
                                    <span>
                                        {
                                            detail.applyType === 2 ? detail.content : ''
                                        }
                                    </span>
                                </p>
                            ) : null
                        }
                        
                        <p>
                            <span>是否手动领取:</span><span>{detail.handle === 0 ? '自动获得' : '手动领取'}</span>
                        </p>
                        <p>
                            <span>规则名称:</span><span>{detail.name}</span>
                        </p>
                        <p>
                            <span>备注:</span><span>{detail.description}</span>
                        </p>
                    </UsercouponDetail>
                    <div style={{
                            width: '100%',
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            padding: '10px 16px',
                            background: '#fff',
                            borderTop: '1px solid #e8e8e8',
                            borderRadius: '0 0 4px 4px',
                            textAlign: 'center',
                        }}
                    >
                        <Button
                            type='primary'
                            style={{width: '200px'}}
                            onClick={this.handleHideDrawerClick}
                        >
                            关闭
                        </Button>
                    </div>
                </Drawer>
            </Warp>
        );
    }
}
export default connect(null, null)(Form.create({})(CouponList));
/*
    disabledDate={(current) => {
        if (!current) return false;
        return !(current < moment().endOf('day') && current > moment().subtract(3, 'month'));
    }}
*/