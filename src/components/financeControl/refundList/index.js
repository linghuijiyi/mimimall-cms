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
import getTypeList from './../../../common/js/getTypeList';
import Storage from './../../../common/js/storage';
import { regEn, regCn, ERR_CODE } from './../../../common/js/regExp';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const FormItem = Form.Item;
let userTitle = '';

class RefundList extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '售后申请时间',
                dataIndex: 'applyTime',
                align: 'center',
                render: (text, record) => {
                    return <div>{formatDateTime(record.applyTime)}</div>;
                }
            },
            {
                title: '下单时间',
                dataIndex: 'orderTime',
                align: 'center',
                render: (text, record) => {
                    return <div>{formatDateTime(record.orderTime)}</div>;
                }
            },
            {   
                title: '付款时间',
                dataIndex: 'payFinishTime',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.payFinishTime === undefined ? '' : formatDateTime(record.payFinishTime)}</div>;
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
                title: '退款金额（元）',
                dataIndex: 'refundAmount',
                align: 'center',
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
                title: '收货人姓名/收货人手机号/账户手机号',
                dataIndex: 'sysState',
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
                title: '售后服务单号',
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
                        return <div>换货  </div>;
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
                    const state = record.afterSaleState;
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
                width: 280,
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
                                    onClick={() => this.handleSeeClick(record, 2)}
                                    style={{background: 'rgb(255, 183, 82)', border: '1px solid rgb(255, 183, 82)'}}
                                >
                                    <Icon><i className='iconfont icon-shenqingshenhe'></i></Icon>
                                    退款
                                </Button>
                            </Options>
                        ) : null
                    );
                },
            }
        ];

        this.state = {
            expandForm: false,
            dataSource: [],
            orderTimeStart: '',
            orderTimeStartValue: null,
            orderTimeEnd: '',
            orderTimeEndValue: null,
            channelCode: '',
            afterSaleState: '',
            type: '',
            orderId: '',
            payType: '',
            payState: '',
            selectType: 'userPhone',
            inputContent: '',
            // 清空表格选中的数据
            selectedRowKeys: [],
            afterSaleOrderIList: [],
            confirmRefundLoading: false,
            confirmRefundVisible: false,
            confirmRefundNum: '',
            confirmRefundPrice: ''
        };
        this.params = { page: 1 };
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['财务管理', '财务退款列表']));
        this.requestList();
    }
    /*********************获取数据列表********************/
    requestList = (queryButtonLoading) => {
        const url = `${baseURL}order/refund/list`;
        const {
            orderTimeStart,
            orderTimeEnd,
            channelCode,
            afterSaleState,
            type,
            orderId,
            payType,
            payState,
            selectType,
            inputContent,
        } = this.state;
        const params = {
            pageNo: this.params.page,
            orderTimeStart,
            orderTimeEnd,
            channelCode,
            afterSaleState,
            type,
            orderId,
            payType,
            payState,
            selectType,
            inputContent,
        }
        this.showAndHideLoading(true);
        fatch(url, 'post', params, (err) => {
            this.showAndHideLoading(false);
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.orders;
                userTitle = res.data.selectType;
                if (result !== null && result.length) {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        dataSource: result,
                        pagination: pagination(res.data.page, (current) => {
                            _this.params.page = current;
                            this.requestList();
                        })
                    });
                } else {
                    this.setState({dataSource: []});
                }
                this.showAndHideLoading(false);
            } else {
                this.showAndHideLoading(false);
                message.success(res.msg);
            }
            if (queryButtonLoading) {
                this.showAndHideLoading(false);
                message.success(res.msg);
            }
        });
    }
    handleSearchClick = () => {
        this.requestList(true);
    }
    /**********************获取选择日期的值*************************/
    handleDatePickerClick = (value, dateString, dateStr, dateValue) => {
        this.setState({
            [dateStr]: dateString,
            [dateValue]: value
        });
    }
    handleSeeClick = (record, showBtn) => {
        const path = '/orderControl/goodsInfo';
        const paterPath = '/financeControl/refundList';
        const breadcrumb = ['订单管理', '订单列表'];
        const page = this.params.page;
        const {
            orderTimeStart,
            orderTimeEnd,
            channelCode,
            afterSaleState,
            type,
            orderId,
            payType,
            payState,
            selectType,
            inputContent,
        } = this.state;
        history.push(path, { 
            record,
            breadcrumb,
            paterPath,
            page,
            orderTimeStart,
            orderTimeEnd,
            channelCode,
            afterSaleState,
            type,
            orderId,
            payType,
            payState,
            selectType,
            inputContent,
            showBtn
        });
    }
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
            channelCode,
            afterSaleState,
            type,
            payState,
            orderId,
            payType,
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
                                            onChange={(value, dateString) => this.handleDatePickerClick(value, dateString, 'orderTimeStart', 'orderTimeStartValue')}
                                            format={dateFormat}
                                            value={orderTimeStartValue}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择结束日期'
                                            format={dateFormat}
                                            onChange={(value, dateString) => this.handleDatePickerClick(value, dateString, 'orderTimeEnd', 'orderTimeEndValue')}
                                            value={orderTimeEndValue}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
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
                                            onChange={(value) => this.setState({channelCode: value})}
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
                        <FormItem label='售后类型'>
                            {getFieldDecorator('售后类型')(
                                <div>
                                    <div id='shouhouleixing' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={type}
                                            onChange={(value) => this.setState({type: value})}
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
                        <FormItem label='订单编号'>
                            {getFieldDecorator('订单编号')(
                                <div>
                                    <div id='zhifufangshi' style={{position: 'relative' }}>
                                        <Input
                                            placeholder="支持模糊查询"
                                            style={{ width: '100%' }}
                                            className='input'
                                            value={orderId}
                                            onChange={(e) => this.setState({orderId: e.target.value})}
                                        />
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
                                            onChange={(value) => this.setState({payType: value})}
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
                        <FormItem label='关键词'>
                            {getFieldDecorator('关键词')(
                                <div>
                                    <div id='gjc' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '50%' }}
                                            value={selectType}
                                            onChange={(value) => this.setState({selectType: value})}
                                            getPopupContainer={() => document.getElementById('gjc')}
                                        >
                                            <Option value='userPhone'>收货人手机号</Option>
                                            <Option value='userName'>收货人姓名</Option>
                                            <Option value='phone'>账户手机号</Option>
                                            <Option value='afterSaleOrderId'>售后服务单号</Option>
                                        </Select>
                                        <Input
                                            placeholder="支持模糊查询"
                                            style={{ width: '50%' }}
                                            className='input'
                                            value={inputContent}
                                            onChange={(e) => this.setState({inputContent: e.target.value})}
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
            channelCode,
            afterSaleState
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
                                            onChange={(value, dateString) => this.handleDatePickerClick(value, dateString, 'orderTimeStart', 'orderTimeStartValue')}
                                            placeholder='选择开始日期'
                                            format={dateFormat}
                                            value={orderTimeStartValue}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            onChange={(value, dateString) => this.handleDatePickerClick(value, dateString, 'orderTimeEnd', 'orderTimeEndValue')}
                                            placeholder='选择结束日期'
                                            format={dateFormat}
                                            value={orderTimeEndValue}
                                            getCalendarContainer={() => document.getElementById('xiadanshijian')}
                                        />
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
                                            onChange={(value) => this.setState({channelCode: value})}
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
    handleConfirmRefundPrickClick = () => {
        const { afterSaleOrderIList } = this.state;
        if (!afterSaleOrderIList.length) {
            message.info('请选择要退款的商品单号！');
            return;
        }
        this.setState({confirmRefundLoading: true});
        let afterSaleOrderIds = [];
        for (let i = 0; i < afterSaleOrderIList.length; i++) afterSaleOrderIds.push(afterSaleOrderIList[i].afterSaleOrderId);
        const url = `${baseURL}order/refund/batchrefund`;
        fatch(url, 'post', {afterSaleOrderIds}, (err) => {
            this.setState({confirmRefundLoading: false});
            message.success(err);
        }).then((res) => {
            if (res.code === '0') {
                message.success(res.msg);
                this.setState({
                    afterSaleOrderIList: [],
                    selectedRowKeys: [],
                    confirmRefundLoading: false,
                    confirmRefundVisible: false
                });
                this.requestList();
            } else {
                message.error(res.msg);
            }
            this.setState({confirmRefundLoading: false});
        });
    }
    handleBatchrefundClick = () => {
        const { afterSaleOrderIList, confirmRefundNum, confirmRefundPrice } = this.state;
        let price = 0;
        if (!afterSaleOrderIList.length) {
            message.info('请选择要退款的商品单号！');
            return;
        }
        for (let i = 0; i < afterSaleOrderIList.length; i++) price += ((afterSaleOrderIList[i].refundAmount) * 10000) / 10000;
        this.setState({
            confirmRefundNum: afterSaleOrderIList.length,
            confirmRefundPrice: price,
            confirmRefundVisible: true
        });
    }
    render() {
        const { 
            dataSource, 
            pagination,
            selectedRowKeys,
            confirmRefundLoading,
            confirmRefundVisible,
            confirmRefundNum,
            confirmRefundPrice
        } = this.state;
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                }),
            };
        });
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                const { afterSaleOrderIList } = this.state;
                if (selectedRows.length !== 0) {
                    let selectedIdList = [];
                    selectedRows.map((item) => (selectedIdList.push(item)));
                    this.setState({afterSaleOrderIList: selectedIdList, selectedRowKeys: selectedRowKeys});
                } else {
                    this.setState({afterSaleOrderIList: [], selectedRowKeys: []});
                }
            },
            getCheckboxProps: (record) => {
                return {
                    disabled: record.payAfterSaleState === 1,
                    payAfterSaleState: record.payAfterSaleState,
                }
            }
        }
        let user = this.columns[this.columns.length - 6];
        if (userTitle === 'userName') user.title = '收货人姓名';
        else if (userTitle == 'phone') user.title = '帐号手机号';
        else if (userTitle === 'userPhone' || userTitle === '' || userTitle === undefined) user.title = '收货人手机号';
        return (
            <Warp>
                <Card bordered={false}>
                    {this.renderForm()}
                    <OperationWarp>
                        <Button type='primary' onClick={this.handleBatchrefundClick}>
                            一键退款
                        </Button>
                    </OperationWarp>
                    <Table
                        bordered
                        pagination={dataSource.length > 0 ? pagination : false}
                        dataSource={dataSource}
                        rowSelection={rowSelection}
                        columns={columns}
                        style={{'overflowX': 'auto'}}
                    />
                </Card>
                <Modal
                    title='确认退款'
                    confirmLoading={confirmRefundLoading}
                    visible={confirmRefundVisible}
                    onOk={this.handleConfirmRefundPrickClick}
                    width={400}
                    onCancel={() => this.setState({confirmRefundVisible: false})}
                >
                    <div style={{display: 'flex', height: '37px', lineHeight: '37px', fontSize: '18px'}}>
                        <span style={{marginRight: '10px'}}>支付方式:</span>
                        <span>易宝支付</span>
                    </div>
                    <div style={{display: 'flex', height: '37px', lineHeight: '37px', fontSize: '18px'}}>
                        <span style={{marginRight: '10px'}}>共&nbsp;&nbsp; <span style={{color: 'red'}}>{ confirmRefundNum }</span> &nbsp;条:</span>
                        <span>
                            退款总金额: <span style={{color: 'red'}}>{confirmRefundPrice}</span>元
                        </span>
                    </div>
                </Modal>
            </Warp>
        );
    }
}
export default connect(null, null)(Form.create({})(RefundList));