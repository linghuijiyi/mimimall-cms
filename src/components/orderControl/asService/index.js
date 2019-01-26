import React, { Component } from 'react';
import { 
    Warp, 
    OperationWarp, 
    Name, 
    CreateItem, 
    Options,
    SynchroView,
    Text,
    View
} from './style';
import { Select, Button, Input, Table, Modal, Checkbox, DatePicker, Icon, Tag, Cascader, message, Row, Col, Card, Form } from 'antd';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import history from './../../../history';
import moment from 'moment';
import fatch from './../../../common/js/fatch';
import pagination from './../../../common/js/pagination';
import formatDateTime from './../../../common/js/formatDateTime';
import baseURL from './../../../common/js/baseURL';
import Storage from './../../../common/js/storage';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const FormItem = Form.Item;
let userTitle = '';

class RefundList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '下单时间',
                    dataIndex: 'orderTime',
                    align: 'center',
                    render: (text, record) => {
                        return <div>{formatDateTime(record.orderTime)}</div>;
                    }
                },
                {   
                    title: '申请售后时间',
                    dataIndex: 'applyTime',
                    align: 'center',
                    render: (text, record) => {
                        return <div>{formatDateTime(record.applyTime)}</div>;
                    }
                },
                {
                    title: '订单编号',
                    dataIndex: 'orderId',
                    align: 'center',
                },
                {
                    title: '商品合计（元）',
                    dataIndex: 'goodsTotalPrice',
                    align: 'center',
                },
                {
                    title: '运费（元）',
                    dataIndex: 'freight',
                    align: 'center',
                },
                {
                    title: '订单总金额（元）',
                    dataIndex: 'orderPrice',
                    align: 'center',
                },
                {
                    title: '支付方式',
                    dataIndex: 'payType',
                    align: 'center',
                    render: (text, record) => {
                        if (record.payType === 1) {
                            return <div>易宝</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '渠道名称',
                    dataIndex: 'channelCode',
                    align: 'center',
                    render: (text, record) => {
                        if (record.channelCode === '1') {
                            return <div>京东</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '收货人姓名/收货人手机号/账户手机号  ',
                    dataIndex: 'sysStat1e',
                    align: 'center',
                    render: (text, record) => {
                        if (record.user !== null) {
                            if (userTitle === 'userName') {
                            return <div>{record.userName}</div>;
                            } else if (userTitle === 'phone') {
                                return <div>{record.user.phone}</div>;
                            } else if (userTitle === 'userPhone' || userTitle === '' || userTitle === undefined) {
                                return <div>{record.userPhone}</div>;
                            } else {
                                return <div>{record.userPhone}</div>;
                            }
                        }
                    }
                },
                {
                    title: '服务单号',
                    dataIndex: 'afterSaleOrderId',
                    align: 'center', 
                },
                {
                    title: '售后类型',
                    dataIndex: 'type',
                    align: 'center',
                    render: (text, record) => {
                        if (record.type === 10) {
                            return <div>退货</div>;
                        } else if (record.type === 20) {
                            return <div>换货</div>;
                        } else if (record.type === 30) {
                            return <div>维修</div>;
                        } else if (record.type === 40) {
                            return <div>退款</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '售后状态',
                    dataIndex: 'afterSaleState',
                    align: 'center',
                    render: (text, record) => {
                        let state = record.afterSaleState;
                        if (state === 1) {
                            return <div>待审核</div>;
                        } else if (state === 2) {
                            return <div>售后审核失败</div>;
                        } else if (state === 3) {
                            return <div>渠道审核</div>;
                        } else if (state === 4) {
                            return <div>渠道审核失败</div>;
                        } else if (state === 51) {
                            return <div>待上门取件/用户发货</div>;
                        } else if (state === 52) {
                            return <div>取件/发货完成</div>;
                        } else if (state === 6) {
                            return <div>等待渠道退款</div>;
                        } else if (state === 7) {
                            return <div>等待平台退款</div>;
                        } else if (state === 8) {
                            return <div>退款完成</div>;
                        } else if (state === 10) {
                            return <div>售后完成</div>;
                        } else if (state === 60) {
                            return <div>取消</div>;
                        } else {
                            return <div></div>; 
                        }
                    }
                },
                {
                    title: '渠道售后状态',
                    dataIndex: 'channelAfterSaleState',
                    align: 'center',
                    render: (text, record) => {
                        let state = record.channelAfterSaleState;
                        if (state === 10) {
                            return <div>申请阶段</div>;
                        } else if (state === 20) {
                            return <div>审核不通过</div>;
                        } else if (state === 21) {
                            return <div>客服审核</div>;
                        } else if (state === 22) {
                            return <div>商家审核</div>;
                        } else if (state === 31) {
                            return <div>京东收货</div>;
                        } else if (state === 32) {
                            return <div>商家收货</div>;
                        } else if (state === 33) {
                            return <div>京东处理</div>;
                        } else if (state === 34) {
                            return <div>商家处理</div>;
                        } else if (state === 40) {
                            return <div>用户确认</div>;
                        } else if (state === 0) {
                            return <div>完成</div>;
                        } else if (state === 60) {
                            return <div>取消</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '支付售后状态',
                    dataIndex: 'payAfterSaleState',
                    align: 'center',
                    render: (text, record) => {
                        if (record.payAfterSaleState === 0) {
                            return <div>未退款</div>;
                        } else if (record.payAfterSaleState === 1) {
                            return <div>已退款</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    render: (text, record) => {
                        return (
                            this.state.dataSource.length
                            ? (
                                <Options>
                                    <Button
                                        type='primary'
                                        onClick={() => this.handleSeeClick(record, 1)}
                                    >
                                        <Icon><i className='iconfont icon-chakan'></i></Icon>
                                        查看
                                    </Button>
                                    <Button
                                        type='primary'
                                        style={{background: 'rgb(255, 183, 82)', border: '1px solid rgb(255, 183, 82)'}}
                                        onClick={() => this.handleSeeClick(record, 2)}
                                    >
                                        <Icon><i className='iconfont icon-shenqingshenhe'></i></Icon>
                                        审核
                                    </Button>
                                </Options>
                            ) : null
                        );
                    },
                }
            ],
            dataSource: [],
            orderTimeStart: '',
            orderTimeStartValue: null,
            orderTimeEnd: '',
            orderTimeEndValue: null,
            afterSaleState: '',
            channelCode: '1',
            channelAfterSaleState: '',
            payType: '',
            payState: '',
            type: '',
            applyTimeStart: '',
            applyTimeStartValue: null,
            applyTimeEnd: '',
            applyTimeEndValue: null,
            selectType: 'userPhone',
            inputContent: ''
        };
        this.params = { page: 1 };
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['订单管理', '售后订单列表']));
        let data = this.props.location.query;
        if (data !== undefined) {
            const {
                page,
                applyTimeStart,
                applyTimeEnd,
                orderTimeStart,
                orderTimeEnd,
                type,
                afterSaleState,
                payType,
                channelAfterSaleState,
                payState,
                channelCode,
                selectType,
                inputContent
            } = data;
            this.params.page = page;
            this.setState({
                applyTimeStart,
                applyTimeEnd,
                orderTimeStart,
                orderTimeEnd,
                type,
                afterSaleState,
                payType,
                channelAfterSaleState,
                payState,
                channelCode,
                selectType,
                inputContent,
                orderTimeStartValue: orderTimeStart ? moment(orderTimeStart, dateFormat) : null,
                orderTimeEndValue: orderTimeEnd ? moment(orderTimeEnd, dateFormat) : null,
                applyTimeStartValue: applyTimeStart ? moment(applyTimeStart, dateFormat) : null,
                applyTimeEndValue: applyTimeEnd ? moment(applyTimeEnd, dateFormat) : null,
            }, () => {
                this.requestList();
            });
        } else {
            this.requestList();
        }
    }
    /*********************获取数据列表********************/
    requestList = (queryButtonLoading) => {
        const url = `${baseURL}order/aftersale/list`;
        const {
            applyTimeStart,
            applyTimeEnd,
            orderTimeStart,
            orderTimeEnd,
            type,
            afterSaleState,
            payType,
            channelAfterSaleState,
            payState,
            channelCode,
            selectType,
            inputContent
        } = this.state;
        const params = {
            pageNo: this.params.page,
            applyTimeStart,
            applyTimeEnd,
            orderTimeStart,
            orderTimeEnd,
            type,
            afterSaleState,
            payType,
            channelAfterSaleState,
            payState,
            channelCode,
            selectType,
            inputContent
        }
        if (queryButtonLoading) {
            this.params.page = 1;
        }
        this.showAndHideLoading(true);
        fatch(url, 'post', params, (err) => {
            this.showAndHideLoading(false);
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.orders;
                if (result !== null && result.length) {
                    result.map((item, index) => (item.key = index));
                    userTitle = res.data.selectType;
                    this.setState({
                        dataSource: result,
                        pagination: pagination(res.data.page, (current) => {
                            _this.params.page = current;
                            this.requestList();
                        })
                    });
                    this.showAndHideLoading(false);
                } else {
                    this.setState({dataSource: []});
                    this.showAndHideLoading(false);
                }
            } else {
                this.showAndHideLoading(false);
                message.error(res.msg);
            }
            if (queryButtonLoading) {
                this.showAndHideLoading(false);
                message.success(res.msg);
            }
        })
    }
    handleSearchClick = () => {
        this.requestList(true);
    }
    handleSeeClick = (record, showBtn) => {
        const path = '/orderControl/goodsInfo';
        const paterPath = '/orderControl/asService';
        const breadcrumb = ['订单管理', '订单列表'];
        const page = this.params.page;
        const {
            applyTimeStart,
            applyTimeEnd,
            orderTimeStart,
            orderTimeEnd,
            type,
            afterSaleState,
            payType,
            channelAfterSaleState,
            payState,
            channelCode,
            selectType,
            inputContent
        } = this.state;
        history.push(path, { 
            record,
            breadcrumb,
            paterPath,
            applyTimeStart,
            applyTimeEnd,
            orderTimeStart,
            orderTimeEnd,
            type,
            afterSaleState,
            payType,
            channelAfterSaleState,
            payState,
            channelCode,
            selectType,
            inputContent,
            page,
            showBtn
        });
    }
    handleExportOrdersClick = () => {
        const {
            applyTimeStart,
            applyTimeEnd,
            orderTimeStart,
            orderTimeEnd,
            type,
            afterSaleState,
            payType,
            channelAfterSaleState,
            payState,
            channelCode,
            selectType,
            inputContent
        } = this.state;
        const url = `${baseURL}order/aftersale/exportOrders?applyTimeStart=${applyTimeStart}&applyTimeEnd=${applyTimeEnd}&orderTimeStart=${orderTimeStart}&orderTimeEnd=${orderTimeEnd}&type=${type}&afterSaleState=${afterSaleState}&payType=${payType}&channelAfterSaleState=${channelAfterSaleState}&payState=${payState}&channelCode=${channelCode}&selectType=${selectType}&inputContent=${inputContent}`;
        window.location = url;
    }
    /**********************获取选择日期的值*************************/
    handleDatePickerCreateChange = (value, dateString, name, nameValue) => {
        this.setState({[name]: dateString, [nameValue]: value});
    }
    handleDatePickerEndChange = (value, dateString, name, nameValue) => {
        this.setState({[name]: dateString, [nameValue]: value});
    }
    // disabledEndDate = (endValue) => {
    //     const startValue = this.state.startValue;
    //     if (!endValue || !startValue) return false;
    //     return endValue.valueOf() <= startValue.valueOf();
    // }
    // disabledShelEndDate = (endValue) => {
    //     const shelStartValue = this.state.shelStartValue;
    //     if (!endValue || !shelStartValue) return false;
    //     return endValue.valueOf() <= shelStartValue.valueOf();
    // }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    renderForm = () => {
        const { expandForm } = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({expandForm: !expandForm});
    }
    renderAdvancedForm = () => {
        const { getFieldDecorator } = this.props.form;
        const {
            orderTimeStartValue,
            orderTimeEndValue,
            applyTimeStartValue,
            applyTimeEndValue,
            type,
            afterSaleState,
            payType,
            channelAfterSaleState,
            payState,
            channelCode,
            selectType,
            inputContent
        } = this.state;
        return (
            <Form className="ant-advanced-search-form" >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='下单时间'>
                            {getFieldDecorator('下单时间')(
                                <div>
                                    <div id='xiadanshijian' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择开始日期'
                                            onChange={(value, dateString) => {this.handleDatePickerCreateChange(value, dateString, 'orderTimeStart', 'orderTimeStartValue')}}
                                            value={orderTimeStartValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择结束日期'
                                            onChange={(value, dateString) => {this.handleDatePickerCreateChange(value, dateString, 'orderTimeEnd', 'orderTimeEndValue')}}
                                            value={orderTimeEndValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='申请售后时间时间'>
                            {getFieldDecorator('申请售后时间时间')(
                                <div>
                                    <div id='xiadanshijian' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择开始日期'
                                            onChange={(value, dateString) => {this.handleDatePickerCreateChange(value, dateString, 'applyTimeStart', 'applyTimeStartValue')}}
                                            value={applyTimeStartValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择结束日期'
                                            onChange={(value, dateString) => {this.handleDatePickerCreateChange(value, dateString, 'applyTimeEnd', 'applyTimeEndValue')}}
                                            value={applyTimeEndValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='售后类型'>
                            {getFieldDecorator('售后类型')(
                                <div>
                                    <div id='shouhouleixing' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={type}
                                            onChange={(value) => {this.setState({type: value})}}
                                            getPopupContainer={() => document.getElementById('shouhouleixing')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='10'>退货</Option>
                                            <Option value='20'>换货</Option>
                                            <Option value='30'>维修</Option>
                                            <Option value='40'>退款</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='售后状态'>
                            {getFieldDecorator('售后状态')(
                                <div>
                                    <div id='shouhouzhuantai' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={afterSaleState}
                                            onChange={(value) => {this.setState({afterSaleState: value})}}
                                            getPopupContainer={() => document.getElementById('shouhouzhuantai')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>待审核</Option>
                                            <Option value='2'>售后审核失败</Option>
                                            <Option value='3'>渠道审核</Option>
                                            <Option value='4'>渠道审核失败</Option>
                                            <Option value='51'>待上门取件/用户发货</Option>
                                            <Option value='52'>取件/发货完成</Option>
                                            <Option value='6'>等待渠道退款</Option>
                                            <Option value='7'>等待平台退款</Option>
                                            <Option value='8'>退款完成</Option>
                                            <Option value='10'>售后完成</Option>
                                            <Option value='60'>取消</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='支付方式'>
                            {getFieldDecorator('支付方式')(
                                <div>
                                    <div id='zhifufangshi' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={payType}
                                            onChange={(value) => {this.setState({payType: value})}}
                                            getPopupContainer={() => document.getElementById('zhifufangshi')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>易宝</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道售后状态'>
                            {getFieldDecorator('渠道售后状态')(
                                <div>
                                    <div id='zhifuqudaoshouhou' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={channelAfterSaleState}
                                            onChange={(value) => {this.setState({channelAfterSaleState: value})}}
                                            getPopupContainer={() => document.getElementById('zhifuqudaoshouhou')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='10'>申请阶段</Option>
                                            <Option value='20'>审核不通过</Option>
                                            <Option value='21'>客服审核</Option>
                                            <Option value='22'>商家审核</Option>
                                            <Option value='31'>京东收货</Option>
                                            <Option value='32'>商家收货</Option>
                                            <Option value='33'>京东处理</Option>
                                            <Option value='34'>商家处理</Option>
                                            <Option value='40'>用户确认</Option>
                                            <Option value='0'>完成</Option>
                                            <Option value='60'>取消</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='支付售后状态'>
                            {getFieldDecorator('支付售后状态')(
                                <div>
                                    <div id='zhifuqudaoshouhou' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={payState}
                                            onChange={(value) => {this.setState({payState: value})}}
                                            getPopupContainer={() => document.getElementById('zhifuqudaoshouhou')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='0'>未退款</Option>
                                            <Option value='1'>已退款</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道筛选'>
                            {getFieldDecorator('渠道筛选')(
                                <div>
                                    <div id='qudaoshaixuan' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={channelCode}
                                            onChange={(value) => {this.setState({channelCode: value})}}
                                            getPopupContainer={() => document.getElementById('qudaoshaixuan')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>京东</Option>
                                        </Select>
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
                                            <Option value='userPhone'>收货人手机号</Option>
                                            <Option value='userName'>收货人姓名</Option>
                                            <Option value='phone'>账户手机号</Option>
                                            <Option value='afterSaleOrderId'>售后服务单号</Option>
                                            <Option value='orderId'>订单号</Option>
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
                                        onClick={this.handleSearchClick}
                                    >
                                        查询
                                    </Button>
                                    <Button
                                        className='btn'
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
            orderTimeStartValue,
            orderTimeEndValue,
            applyTimeStartValue,
            applyTimeEndValue,
            type
        } = this.state;
        
        return (
            <Form className="ant-advanced-search-form" >
                <Row gutter={{ md: 8, lg: 12, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='下单时间'>
                            {getFieldDecorator('下单时间')(
                                <div>
                                    <div id='xiadanshijian' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择开始日期'
                                            onChange={(value, dateString) => {this.handleDatePickerCreateChange(value, dateString, 'orderTimeStart', 'orderTimeStartValue')}}
                                            value={orderTimeStartValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择结束日期'
                                            onChange={(value, dateString) => {this.handleDatePickerCreateChange(value, dateString, 'orderTimeEnd', 'orderTimeEndValue')}}
                                            value={orderTimeEndValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='申请售后时间时间'>
                            {getFieldDecorator('申请售后时间时间')(
                                <div>
                                    <div id='xiadanshijian' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择开始日期'
                                            onChange={(value, dateString) => {this.handleDatePickerCreateChange(value, dateString, 'applyTimeStart', 'applyTimeStartValue')}}
                                            value={applyTimeStartValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择结束日期'
                                            onChange={(value, dateString) => {this.handleDatePickerCreateChange(value, dateString, 'applyTimeEnd', 'applyTimeEndValue')}}
                                            value={applyTimeEndValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='售后类型'>
                            {getFieldDecorator('售后类型')(
                                <div>
                                    <div id='shouhouleixing' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={type}
                                            onChange={(value) => {this.setState({type: value})}}
                                            getPopupContainer={() => document.getElementById('shouhouleixing')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='10'>退货</Option>
                                            <Option value='20'>换货</Option>
                                            <Option value='30'>维修</Option>
                                            <Option value='40'>退款</Option>
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
                                        onClick={this.handleSearchClick}
                                    >
                                        查询
                                    </Button>
                                    <Button
                                        className='btn'
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
    handleFormReset = () => {
        
    }
    render() {
        const { 
            dataSource, 
            pagination,
            selectedRowKeys,
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                const { offshelfSysSKu } = this.state;
                if (selectedRows.length !== 0) {
                    let selectedIdList = [];
                    selectedRows.map((item) => (selectedIdList.push(item.sysSku)));
                    this.setState({offshelfSysSKu: selectedIdList, selectedRowKeys: selectedRowKeys});
                } else {
                    this.setState({offshelfSysSKu: [], selectedRowKeys: []});
                }
            }
        }
        let user = this.state.columns[this.state.columns.length - 7];
        if (userTitle === 'userName') {
            user.title = '收货人姓名';
        } else if (userTitle == 'phone') {
            user.title = '帐号手机号';
        } else if (userTitle === 'userPhone' || userTitle === '' || userTitle === undefined) {
            user.title = '收货人手机号';
        }
        return (
            <Warp>
                <Card bordered={false}>
                    {this.renderForm()}
                    <OperationWarp>
                        <Button
                            type='primary'
                            onClick={this.handleExportOrdersClick}
                        >
                            导出表格
                        </Button>
                    </OperationWarp>
                    <Table
                        bordered
                        pagination={dataSource.length > 0 ? pagination : false}
                        dataSource={dataSource}
                        columns={this.state.columns}
                        style={{'overflowX': 'auto'}}
                    />
                </Card>
            </Warp>
        );
    }
}
export default connect(null, null)(Form.create({})(RefundList));