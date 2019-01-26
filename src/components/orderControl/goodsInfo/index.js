import React, { Component, Fragment } from 'react';
import { Table, List, Icon, Button, message, Tabs, Card, Upload, Modal, Checkbox, Drawer, Tag, Collapse, Input, Radio, Select, Popconfirm, InputNumber} from 'antd';
import { Steps } from 'zent';
import { Container, StepsContainer, GoodsImg, AfterSale } from './style.js';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import baseURL from './../../../common/js/baseURL';
import fatch from './../../../common/js/fatch';
import formatDateTime from './../../../common/js/formatDateTime';
import pagination from './../../../common/js/pagination';
import history from './../../../history';
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const PATH = '/financeControl/refundList';
let propsLocationState = null;

class GoodsInfo extends Component {
    constructor(props) {
        super(props);
        this.basiceColumns = [
            {
                title: '订单编号',
                dataIndex: 'orderId',
                key: 'orderId',
                align: 'center',
            }, 
            {
                title: '订单状态',
                dataIndex: 'orderState',
                key: 'orderState',
                align: 'center',
                render: (text, record) => {
                    switch(record.orderState) {
                        case 0: return <div>提交订单</div>;
                        case 1: return <div>已支付</div>;
                        case 2: return <div>已取消</div>;
                        case 3: return <div>已发货</div>;
                        case 4: return <div>已签收</div>;
                        case 5: return <div>已拒收</div>;
                        case 6: return <div>已完成</div>;
                        default: return <div></div>;
                    }
                }
            }, 
            {
                title: '用户账号',
                dataIndex: 'description',
                key: 'description',
                align: 'center',
                render: (text, record) => {
                    if (record.userInfo !== undefined && record.userInfo !== null) {
                        return <div>{record.userInfo.phone}</div>;
                    } else {
                        return <div>无</div>;
                    }
                }
            },
            {
                title: '下单时间',
                dataIndex: 'createTime',
                key: 'createTime',
                align: 'center',
                render: (text, record) => {
                    return <div>{formatDateTime(record.createTime)}</div>;
                }
            },
            {
                title: '支付时间',
                dataIndex: 'finishTime',
                key: 'finishTime',
                align: 'center',
                render: (text, record) => {
                    if (record.finishTime === null) {
                        return <div>无</div>;
                    } else {
                        return <div>{formatDateTime(record.finishTime)}</div>;
                    }
                }
            },
            {
                title: '支付方式',
                dataIndex: 'payType',
                key: 'payType',
                align: 'center',
                render: (text, record) => {
                    if (record.payType === 1) {
                        return <div>易宝</div>;
                    } else {
                        return <div>无</div>;
                    }
                }
            },
            {
                title: '渠道订单编号',
                dataIndex: 'channelOrderId',
                key: 'channelOrderId',
                align: 'center',
            },
            {
                title: '渠道',
                dataIndex: 'channelCode',
                key: 'channelCode',
                align: 'center',
                render: (text, record) => {
                    if (record.channelCode === '1') {
                        return <div>京东</div>;
                    } else if (record.channelCode === null) {
                        return <div>无</div>;
                    }
                }
            }
        ];
        this.transportColumns = [
            {
                title: '发货时间',
                dataIndex: 'msgTime',
                key: 'msgTime',
                align: 'center',
                render: (text, record) => {
                    return <div>{formatDateTime(record.msgTime)}</div>;
                }
            }, 
            {
                title: '快递公司',
                dataIndex: 'express',
                key: 'express',
                align: 'center',
            }, 
            {
                title: '快递单号',
                dataIndex: 'trackNo',
                key: 'trackNo',
                align: 'center',
            }
        ];
        this.userColumns = [
            {
                title: '收货人',
                dataIndex: 'userName',
                key: 'userName',
                align: 'center',
            }, 
            {
                title: '手机号码',
                dataIndex: 'userPhone',
                key: 'userPhone',
                align: 'center',
            }, 
            {
                title: '收货地址',
                dataIndex: 'address',
                key: 'address',
                align: 'center',
                render: (text, record) => {
                    return <div>{`${record.province}/${record.city}/${record.county}/${record.address}`}</div>;
                }
            }
        ];
        this.goodsColumns = [
            {
                title: '商品图片',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                width: 200,
                render: (text, record) => {
                    const imagePath = record.imagePath;
                    const path = `http://img13.360buyimg.com/n0/`;
                    let imgUrl = '';
                    record.imageSource !== 0 ? imgUrl = `${path}${imagePath}` : imgUrl = imagePath;
                    return (
                        <GoodsImg style={{width: '100%'}}>
                            <img
                                style={{height: '90px', zIndex: '999999'}}
                                className='img'
                                src={imgUrl}
                            />
                            <div className='cneg'>
                                <Icon className='eye' type='eye' onClick={() => {this.handleEyeClick(imgUrl)}} />
                            </div>
                        </GoodsImg>
                    );
                }
            },
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
            }, 
            {
                title: '渠道商品价格',
                dataIndex: 'jdPrice',
                key: 'jdPrice',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.jdPrice === null ? 0 : record.jdPrice}元</div>;
                }
            },
            {
                title: '价格/货号',
                dataIndex: 'creatTime',
                key: 'creatTime',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.goodsPrice}元/{record.sysSku}</div>;
                }
            },
            {
                title: '规格',
                dataIndex: 'attributes',
                key: 'attributes',
                align: 'center',
                render: (text, record) => {
                    if (record.attributes === '') {
                        return <div>无</div>;
                    } else {
                        return <div>{record.attributes}</div>;
                    }
                }
            },
            {
                title: '数量',
                dataIndex: 'num',
                key: 'num',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.num}个</div>;
                }
            },
            {
                title: '积分',
                dataIndex: 'credit',
                key: 'credit',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.credit === null ? 0 : record.credit}</div>;
                }
            },
            {
                title: '小计',
                dataIndex: 'goodsPrice',
                key: 'goodsPrice',
                align: 'center',
                render: (text, record) => {
                    return <div>{parseInt(record.goodsPrice * record.num * 10000) / 10000}元</div>;
                }
            }
        ];
        this.costColumns = [
            {
                title: '商品合计',
                dataIndex: 'goodsTotalPrice',
                key: 'goodsTotalPrice',
                align: 'center',
                render: (text, record) => {
                    let num = 0;
                    let price = 0;
                    let totalPrice = 0;
                    for (let i = 0; i < record.orderGoodsList.length; i++) {
                        num  = record.orderGoodsList[i].num;
                        price = record.orderGoodsList[i].goodsPrice;
                        totalPrice += parseInt(price * num * 10000) / 10000
                    }
                    return <div>{totalPrice}元</div>;
                }
            },
            {
                title: '优惠券',
                dataIndex: 'couponAmount',
                key: 'couponAmount',
                align: 'center',
                width: 500,
                render: (text, record) => {
                    let str = '';
                    let coupon_name = '';
                    if (record.couponType === 0) {
                        str = '折';
                        coupon_name = '折扣：';
                    } else {
                        str = '元';
                        coupon_name = '优惠券金额：';
                    }
                    return <div>
                        优惠券编码：{record.couponCode === null || record.couponCode === '' || record.couponCode === undefined ? '无' : record.couponCode}
                        &nbsp;&nbsp;&nbsp;
                        {coupon_name}{record.couponAmount === null || record.couponAmount === '' || record.couponAmount === undefined ? '无' : record.couponAmount + str}
                    </div>
                }
            },
            {
                title: '运费',
                dataIndex: 'freight',
                key: 'freight',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.freight}元</div>
                }
            }, 
            {
                title: '订单总金额',
                dataIndex: 'orderPrice',
                key: 'orderPrice',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.orderPrice}元</div>
                }
            }
        ];
        this.aftersaleList = [
            {
                title: '售后服务单',
                dataIndex: 'afterSaleOrderId',
                key: 'afterSaleOrderId',
                align: 'center',
            },
            {
                title: '退款方式',
                dataIndex: 'payType',
                key: 'payType',
                align: 'center',
                render: (text, record) => {
                    if (record.payType === 1) return <div>易宝</div>;
                    else return <div></div>;
                }
            },
            {
                title: '退款金额(元)',
                dataIndex: 'refundAmount',
                key: 'refundAmount',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                width: 280,
                render: (text, record) => {
                    const paterPath = propsLocationState.paterPath;
                    return (
                        <div>
                            {
                                propsLocationState.showBtn === 2 ? null : (
                                    <Button
                                        type='primary'
                                        style={{margin: '0 5px'}}
                                        onClick={() => this.handleAftersaleInfo(record.afterSaleOrderId, 1)}
                                    >
                                        <Icon><i className='iconfont icon-chakan'></i></Icon>
                                        查看
                                    </Button>
                                )
                            }
                            {
                                paterPath == '/orderControl/orderList' ? null : (
                                    paterPath === PATH ? (
                                        propsLocationState.showBtn === 1 ? null : (
                                            <Button
                                                type='primary'
                                                style={{background: 'rgb(255, 183, 82)', border: '1px solid rgb(255, 183, 82)', margin: '0 5px'}}
                                                onClick={() => this.handleAftersaleInfo(record.afterSaleOrderId, 1, 'refund')}
                                            >
                                                <Icon><i className='iconfont icon-shenqingshenhe'></i></Icon>
                                                退款
                                            </Button>
                                        )
                                    ) : (
                                        propsLocationState.showBtn === 1 ? null : (
                                            <Button
                                                type='primary'
                                                style={{width: '100px', margin: '0 5px'}}
                                                onClick={() => this.handleAftersaleInfo(record.afterSaleOrderId, 2)}
                                            >
                                                审核
                                            </Button>
                                        )
                                    )
                                )
                            }
                        </div>
                    );
                },
            }
        ]
        this.state = {
            basicsSource: [],
            userSource: [],
            goodsSource: [],
            costSource: [],
            tracklist: [],
            jdPrice: 0,
            wjyPrice: 0,
            credit: 0,
            orderSteps: 0,
            orderCancel: true,
            isShwo: false,
            noGoods: true,
            pageHome: true,
            sysVisible: false,
            aftersale: false,
            aftersaleList: [],
            afterSaleOrder: {},
            pickWare: {},
            orderGoods: {},
            chlLogs: [],
            payLogs: [],
            afsLogs: [],
            refundVisible: false,
            AfterSaleType: 1,
            Auditing: 1,
            reason: '',
            refundAmount: 0,
            remark: '',
            AuditingClickLoading: false,
            refundState: false,
            financeRemark: '',
            handleRefundLoading: false,
            imgs: [],
            afterSaleOrderIList: [],
            checked: false,
            selectedRowKeys: [],
            confirmRefundVisible: false,
            confirmRefundNum: '',
            confirmRefundPrice: '',
            confirmRefundLoading: false
        }
    }
    componentWillMount() {
        propsLocationState = this.props.location.state;
        if (propsLocationState !== undefined) {
            this.props.dispatch(actionCreators.changeBreadcrumb([...propsLocationState.breadcrumb, '订单详情']));
            if (propsLocationState.record.orderId) {
                this.getGoodsDetail(propsLocationState.record.orderId);
            } else {
                this.setState({pageHome: false});
                this.showAndHideLoading(false);
            }
        } else {
            this.setState({pageHome: false});
            this.showAndHideLoading(false);
        }
    }
    getGoodsDetail(orderId) {
        this.showAndHideLoading(true);
        const url = `${baseURL}order/info/detail`;
        fatch(url, 'post', { orderId }, (err, state) => {
            message.error(err);
            this.setState({noGoods: state});
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                let basicsSource = [];
                let userSource = [];
                let goodsSource = [];
                let tracklist = [];
                let credit = 0;
                let wjyPrice = 0;
                let jdPrice = 0;
                const ORDER = data.order;
                const CONUPON = data.userCoupon;
                const CHILD_ORDER_GOODS_LIST = data.childOrderGoodsList;
                const GOODS_LIST =ORDER.orderGoodsList;
                const TRANSATION_RECORD = data.transationRecord;
                let aftersaleList = data.afterSaleOrderIds;
                /*********************商品状态***********************/
                switch(ORDER.orderState) {
                    case 0: this.setState({orderSteps: 1});
                        break;
                    case 1: this.setState({orderSteps: 2});
                        break;
                    case 2: this.setState({orderSteps: 2, orderCancel: false});
                        break;
                    case 3: this.setState({orderSteps: 3});
                        break;
                    case 4: this.setState({orderSteps: 4});
                        break;
                    case 5: this.setState({orderSteps: 5});
                        break;
                    case 6: this.setState({orderSteps: 6});
                        break;
                    default: this.setState({orderSteps: 0});
                }
                /*******************基本信息***************************/
                if (TRANSATION_RECORD !== undefined && TRANSATION_RECORD !== null) {
                    ORDER.finishTime = TRANSATION_RECORD.finishTime;
                    ORDER.payType = TRANSATION_RECORD.payType;
                } else {
                    ORDER.finishTime = null;
                    ORDER.payType = '无结果';
                }
                /**********************优惠券信息**********************/
                if (CONUPON !== null && CONUPON !== undefined) {
                    ORDER.couponCode = CONUPON.couponCode;
                    ORDER.couponAmount = CONUPON.couponAmount;
                    ORDER.couponType = CONUPON.couponType;
                }
                basicsSource.push(ORDER);
                basicsSource.map((item, index) => (item.key = index));
                /******************商品信息**********************/
                if (GOODS_LIST !== undefined && GOODS_LIST !== null && GOODS_LIST.length) {
                    GOODS_LIST.map((item, index) => {
                        let GOODS = item.goods;
                        const NUM = item.num;
                        const GOODS_PRICE = item.goodsPrice;
                        const JD_PRICE = GOODS.jdPrice;
                        const CREDIT = GOODS.credit;
                        GOODS.num = NUM;
                        GOODS.key = index;
                        GOODS.goodsPrice = GOODS_PRICE === null || GOODS_PRICE === undefined || GOODS_PRICE === '' ? 0 : GOODS_PRICE;
                        goodsSource.push(GOODS);
                        jdPrice += parseInt(
                                (NUM === undefined || NUM === null || NUM === '' ? 0 : NUM) * 
                                (JD_PRICE === undefined || JD_PRICE === null || JD_PRICE === '' ? 0 : JD_PRICE) * 10000
                            ) / 10000;
                        wjyPrice += parseInt(
                            (NUM === null || NUM === undefined || NUM === '' ? 0 : NUM) *
                            (GOODS_PRICE === null || GOODS_PRICE === undefined || GOODS_PRICE === '' ? 0 : GOODS_PRICE) * 10000
                        ) / 10000;
                        credit += CREDIT === null || CREDIT === undefined || CREDIT === '' ? 0 : CREDIT;
                    });
                }
                /********************物流信息***************************/
                if (CHILD_ORDER_GOODS_LIST !== undefined && CHILD_ORDER_GOODS_LIST !== null && CHILD_ORDER_GOODS_LIST.length) {
                    CHILD_ORDER_GOODS_LIST.map((item, inex) => {
                        const ORDER_TRACK = item.orderTrack;
                        if (ORDER_TRACK !== null && ORDER_TRACK.length) {
                            ORDER_TRACK[0].name = ORDER_TRACK[0].express;
                            ORDER_TRACK[0].trackNo = ORDER_TRACK[0].trackNo;
                            tracklist.push(ORDER_TRACK);
                        }
                    });
                }
                /*******************收货人信息*************************/
                userSource.push(data.addressMap);
                userSource.map((item, index) => (item.key = index));
                if (aftersaleList.length > 0) aftersaleList.map((item, index) => (item.key = index));
                this.setState({
                    tracklist,
                    basicsSource,
                    userSource,
                    goodsSource,
                    jdPrice,
                    wjyPrice,
                    credit,
                    aftersaleList,
                    isShwo: true
                });
                this.showAndHideLoading(false);
            } else {
                this.showAndHideLoading(false);
                this.setState({noGoods: false});
                message.error(res.msg);
            }
        });
    }
    handleAftersaleInfo = (afterSaleOrderId, type, refund) => {
        if (refund) this.setState({refundState: true});
        else this.setState({refundState: false});
        const url = `${baseURL}order/aftersale/info`;
        fatch(url, 'post', { afterSaleOrderId }, (err) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                const refundAmount = data.afterSaleOrder.refundAmount;
                this.setState({
                    aftersale: true,
                    afterSaleOrder: data.afterSaleOrder,
                    pickWare: data.pickWare,
                    orderGoods: data.orderGoods,
                    chlLogs: data.chlLogs,
                    payLogs: data.payLogs,
                    afsLogs: data.afsLogs,
                    AfterSaleType: type,
                    imgs: data.imgs,
                    refundAmount: refundAmount === null ? 0 : refundAmount,
                    refundAmountValue: refundAmount === null ? 0 : refundAmount,
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    handleAuditingClick = (afterSaleOrderId) => {
        const url = `${baseURL}order/aftersale/audit`;
        this.setState({AuditingClickLoading: true});
        const {
            Auditing,
            reason,
            refundAmount,
            remark
        } = this.state;
        const params = {
            afterSaleOrderId,
            auditResult: Auditing,
            refundAmount,
            remark
        }
        if (this.state.Auditing !== 1) {
            if (reason.length === 0) {
                message.info('请输入不通过原因！');
                this.setState({AuditingClickLoading: false});
                return;
            }
            params.reason = reason;
        }
        fatch(url, 'post', params, (err) => {
            this.setState({AuditingClickLoading: false});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    aftersale: false,
                    AuditingClickLoading: false,
                    remark: '',
                    reason: ''
                });
                message.success(res.msg);
            } else {
                message.error(res.msg);
                this.setState({AuditingClickLoading: false});
            }
        });
    }
    handleRefundClick = (afterSaleOrderId, financeRemark) => {
        const url = `${baseURL}order/refund/refund`;
        this.setState({handleRefundLoading: true});
        fatch(url, 'post', {
            afterSaleOrderId, financeRemark
        }, (err) => {
            message.error(err);
            this.setState({handleRefundLoading: false});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({aftersale: false, financeRemark: ''});
                message.error(res.msg);
            } else {
                message.error(res.msg);
            }
            this.setState({handleRefundLoading: false});
        });
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
    handleRefundPrickClick = () => {
        const { refundAmount } = this.state;
        this.setState({
            refundAmountValue: refundAmount,
            refundVisible: false
        });
    }
    handleBackClick = () => history.push({pathname: propsLocationState.paterPath, state: propsLocationState.state, query: propsLocationState});
    /********************************loading***********************************/
    showAndHideLoading = (state) => this.props.dispatch(HomeActionCreators.changeLoading(state));
    handleEyeClick = (sysImgPath) => {
        this.setState({
            sysVisible: true,
            sysImgPath
        });
    }
    render() {
        const { 
            basicsSource, 
            userSource, 
            goodsSource, 
            costSource, 
            jdPrice,
            wjyPrice,
            orderSteps,
            orderCancel,
            isShwo,
            noGoods,
            pageHome,
            sysVisible,
            sysImgPath,
            credit,
            tracklist,
            aftersaleList,
            aftersale,
            afterSaleOrder,
            pickWare,
            orderGoods,
            chlLogs,
            payLogs,
            afsLogs,
            refundVisible,
            AfterSaleType,
            Auditing,
            reason,
            refundAmount,
            refundAmountValue,
            remark,
            AuditingClickLoading,
            refundState,
            financeRemark,
            handleRefundLoading,
            imgs,
            afterSaleOrderIListLoading,
            selectedRowKeys,
            confirmRefundVisible,
            confirmRefundNum,
            confirmRefundPrice,
            confirmRefundLoading
        } = this.state;
        const ASO = afterSaleOrder;
        let paterPath = propsLocationState.paterPath;
        const limitDecimals = (value: string | number): string => {
            const reg = /^(\-)*(\d+)\.(\d\d).*$/;
            if(typeof value === 'string') return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
            else if (typeof value === 'number') return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
            else return '';
        };
        const rowSelection = {
            selectedRowKeys,
            hideDefaultSelections: false,
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
        };
        return (
            <div>
                <div style={{display: noGoods ? 'none' : 'block'}}>
                    <Button type='primary' style={{margin: '20px 0 0 15px'}} onClick={this.handleBackClick}>
                        <Icon type='rollback' />
                        返回
                    </Button>
                    <div>没有数据...</div>
                </div>
                <div style={{display: pageHome ? 'none' : 'block'}}>
                    <Button type='primary' style={{margin: '20px 0 0 15px'}} onClick={() => {history.push({pathname: '/'})}}>
                        <Icon type='rollback' />
                        返回首页
                    </Button>
                    <div>数据丢失,请返回首页从新加载数据...</div>
                </div>
                <div style={{background: '#fff', borderTop: '1px solid #eff3f6', display: isShwo ? 'block' : 'none'}}>
                    <div style={{marginBottom: 10, borderBottom: '1px solid #eff3f6'}}>
                        <Button type='primary' style={{margin: '20px 0 0 15px'}} onClick={this.handleBackClick}>
                            <Icon type='rollback' />
                            返回
                        </Button>
                    </div>
                    <StepsContainer style={{display: orderCancel && orderSteps !== 5 ? 'block' : 'none'}}>
                        <Steps current={orderSteps} status='finish'>
                            <Steps.Step title='提交订单' />
                            <Steps.Step title='已支付' />
                            <Steps.Step title='已发货' />
                            <Steps.Step title='已签收' />
                            <Steps.Step title='已完成' />
                        </Steps>
                    </StepsContainer>
                    <StepsContainer style={{display: orderCancel && orderSteps === 5 ? 'block' : 'none'}}>
                        <Steps current={orderSteps} status='finish'>
                            <Steps.Step title='提交订单' />
                            <Steps.Step title='已支付' />
                            <Steps.Step title='已发货' />
                            <Steps.Step title='已拒收' />
                        </Steps>
                    </StepsContainer>
                    <StepsContainer style={{display: orderCancel ? 'none' : 'block'}}>
                        <Steps current={orderSteps} status='finish'>
                            <Steps.Step title='提交订单' />
                            <Steps.Step title='已取消' />
                        </Steps>
                    </StepsContainer>
                    {/**********基本信息**********/}
                    <Container>
                        <Table 
                            bordered
                            title={() => '基本信息'}
                            pagination={false}
                            dataSource={basicsSource}
                            columns={this.basiceColumns} 
                        />
                    </Container>
                    {/**********物流信息**********/}
                    <Container style={{display: orderCancel && orderSteps !== 5 ? 'block' : 'none'}}>
                        <Card
                            style={{ width: '100%', padding: '0' }}
                            title="配送进度"
                        >
                            {
                                tracklist.length ? (
                                    <Tabs>
                                        {
                                            tracklist.map((item, index) => {
                                                return <TabPane tab={`包裹${index + 1}`} key={index}>
                                                    <div style={{height: 300, overflow: 'hidden'}}>
                                                        <div style={{height: 300, width: 'calc(100% + 17px)', overflowY: 'auto'}}>
                                                            <div style={{padding: '12px 24px', border: '1px solid #e8e8e8'}}>
                                                                快递公司：{item[0].name}  快递单号：{item[0].channelOrderId}
                                                            </div>
                                                            <List
                                                                bordered
                                                                dataSource={item}
                                                                renderItem={item => (<List.Item>{formatDateTime(item.msgTime)}  {item.content}</List.Item>)}
                                                            />
                                                        </div>
                                                    </div>
                                                </TabPane>
                                            })
                                        }
                                    </Tabs>
                                ) : <div style={{ textAlign: 'center', padding: '12px 24px', color: '#666', fontSize: '14px' }}>暂无数据</div>
                            }
                        </Card>
                    </Container>
                    {/**********收货人信息**********/}
                    <Container>
                        <Table 
                            bordered
                            title={() => '收货人信息'}
                            pagination={false}
                            dataSource={userSource}
                            columns={this.userColumns} 
                        />
                    </Container>
                    {/**********商品信息**********/}
                    <Container>
                        <Table 
                            bordered
                            title={() => '商品信息'}
                            footer={() => `渠道商品价格合计:¥${jdPrice}元 / 商品合计:¥${wjyPrice}元 / 可获积分:${credit}`}
                            pagination={false}
                            dataSource={goodsSource}
                            columns={this.goodsColumns} 
                        />
                    </Container>
                    {/**********费用信息**********/}
                    <Container>
                        <Table 
                            bordered
                            title={() => '费用信息'}
                            footer={() => '实付金额=商品合计+运费'}
                            pagination={false}
                            dataSource={basicsSource}
                            columns={this.costColumns}
                        />
                    </Container>
                    <Container style={{display: aftersaleList.length ? 'block' : 'none'}}>
                        <Table 
                            bordered
                            title={() => '售后服务'}
                            pagination={false}
                            dataSource={aftersaleList}
                            rowSelection={paterPath !== PATH || propsLocationState.showBtn === 1 ? null : rowSelection}
                            columns={this.aftersaleList} 
                        />
                    </Container>
                    <Button
                        type='primary'
                        style={{margin: '30px auto', display: paterPath !== PATH || propsLocationState.showBtn === 1 ? 'none' : 'block', width: '250px', height: '40px', lineHeight: '40px'}}
                        onClick={this.handleBatchrefundClick}
                        loading={afterSaleOrderIListLoading}
                    >
                        一键退款
                    </Button>
                    <Drawer
                        title='订单详情'
                        placement="right"
                        closable={false}
                        visible={aftersale}
                        width={600}
                    >
                        <AfterSale className='AfterSale'>
                            <div className='serviceNumber saleItem'>
                                <span className='name'>售后服务单:</span>
                                <span className='description'>{ASO.afterSaleOrderId}</span>
                            </div>
                            <div className='serviceNumber saleItem'>
                                <span className='name'>售后申请时间:</span>
                                <span className='description'>{formatDateTime(ASO.applyTime)}</span>
                            </div>
                            <div className='serviceNumber saleItem'>
                                <span className='name'>售后类型:</span>
                                <span className='description'>
                                    {
                                        ASO.type === 10 ? '退货' : ASO.type === 20 ? '换货' : ASO.type === 30 ? '维修' : ASO.type === 40 ? '退款' : ''
                                    }
                                </span>
                            </div>
                            <div className='serviceNumber saleItem'>
                                <span className='name'>退回方式:</span>
                                <span className='description'>
                                    {
                                        ASO.returnJDType === 4 ? '上门取件' : ASO.returnJDType === 40 ? '客户发货' : ASO.returnJDType === 7 ? '客户送货' : '' 
                                    }
                                </span>
                            </div>
                            <div className='serviceNumber saleItem'>
                                <span className='name'>换货收货地址:</span>
                                <span className='description'>
                                    {pickWare.province === undefined ? '' : `${pickWare.province}/`}
                                    {pickWare.city === undefined ? '' : `${pickWare.city}/`}
                                    {pickWare.county === undefined ? '' : `${pickWare.county}/`}
                                    {pickWare.address === undefined ? '' : `${pickWare.address}`}
                                </span>
                            </div>
                            <Collapse>
                                <Panel header="售后商品列表" key="1">
                                    <div className='goodsInfo'>
                                        <div className='serviceNumber saleItem'>
                                            <span className='name'>商品名称:</span>
                                            <span className='description'>苹果64G移动通讯手机</span>
                                        </div>
                                        <div className='serviceNumber saleItem'>
                                            <span className='name'>商品数量:</span>
                                            <span className='description'>{orderGoods.num}</span>
                                        </div>
                                        <div className='serviceNumber saleItem'>
                                            <span className='name'>商品价格:</span>
                                            <span className='description'>单价：¥{orderGoods.goodsPrice}  合计：¥{ASO.goodsTotalPrice}  优惠金额：{orderGoods.discount}  应退金额：{afterSaleOrder.refundAmount === null ? 0 : afterSaleOrder.refundAmount}</span>
                                        </div>
                                        <div className='serviceNumber saleItem'>
                                            <span className='name'>售后图片:</span>
                                            <span className='description goodsImg'>
                                                {imgs.length ? imgs.map((item, index) => (<img key={index} src={item} />)) : null}
                                            </span>
                                        </div>
                                    </div>
                                </Panel>
                            </Collapse>
                            <Tabs style={{borderBottom: '1px solid #ccc',}}>
                                <TabPane tab="售后状态流转" key="1">
                                    <div style={{height: 250,  overflowY: 'auto'}}>
                                        {
                                            afsLogs.map((item, index) => {
                                                return <div style={{lineHeight: '30px', fontSize: '16px'}} key={index}>
                                                    创建时间: {formatDateTime(item.createTime)}
                                                    状态：{item.content}
                                                </div>
                                            })
                                        }
                                    </div>
                                </TabPane>
                                <TabPane tab="渠道售后状态流转" key="2">
                                    <div style={{height: 250,  overflowY: 'auto'}}>
                                        {
                                            chlLogs.map((item, index) => {
                                                return <div style={{lineHeight: '30px', fontSize: '16px'}} key={index}>
                                                    创建时间: {formatDateTime(item.createTime)}
                                                    状态：{item.content}
                                                </div>
                                            })
                                        }
                                    </div>
                                </TabPane>
                                <TabPane tab="支付售后状态流转" key="3">
                                    <div style={{height: 250,  overflowY: 'auto'}}>
                                        {
                                            payLogs.map((item, index) => {
                                                return <div style={{lineHeight: '30px', fontSize: '16px'}} key={index}>
                                                    创建时间: {formatDateTime(item.createTime)}
                                                    状态：{item.content}
                                                </div>
                                            })
                                        }
                                    </div>
                                </TabPane>
                            </Tabs>
                            <div style={{display: AfterSaleType === 1 ? 'block' : 'none'}}>
                                <div className='serviceNumber saleItem'>
                                    <span className='name'>审核操作:</span>
                                    <span className='description'>{ASO.afterSaleState !== 2 ? '通过' : '不通过'}  {ASO.auditResult === null ? '' : `原因：${ASO.auditResult}`}</span>
                                </div>
                                <div className='serviceNumber saleItem'>
                                    <span className='name'>申请退款:</span>
                                    <span className='description'>易宝支付  退款金额{ASO.refundAmount === null ? 0 : ASO.refundAmount}</span>
                                </div>
                                <div className='serviceNumber saleItem' style={{borderBottom: paterPath !== PATH ? 'none' : '1px solid #ccc'}}>
                                    <span className='name'>备注:</span>
                                    <span className='description'>{ASO.remark}</span>
                                </div>
                                <div  className='serviceNumber saleItem' style={{display: paterPath === PATH ? 'flex' : 'none', borderBottom: 'none'}}>
                                    <span className='name'>财务备注:</span>
                                    {
                                        refundState ?　(
                                            <span>
                                                <TextArea 
                                                    style={{height: '50px', width: '400px', marginTop: '8px'}}
                                                    maxLength='140'
                                                    value={financeRemark}
                                                    onChange={(e) => this.setState({financeRemark: e.target.value})}
                                                />
                                            </span>
                                        ) : (
                                            <span className='description'>{ASO.financeRemark}</span>
                                        )
                                    }
                                </div>
                                {
                                    refundState ? (
                                        <div className='close' style={{display: 'flex'}}>
                                            <Button type='primary' style={{width: 200}} onClick={() => {this.setState({aftersale: false, financeRemark: ''})}}>取消</Button>
                                            <Button
                                                type='primary'
                                                loading={handleRefundLoading}
                                                style={{width: 200, background: 'rgba(255, 0, 0, 1)', border: '1px solid rgba(255, 0, 0, 1)'}}
                                                onClick={() => this.handleRefundClick(ASO.afterSaleOrderId, financeRemark)}
                                            >
                                                退款
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className='close'>
                                            <Button type='primary' onClick={() => {this.setState({aftersale: false})}}>关闭</Button>
                                        </div>
                                    )
                                }
                            </div>
                            <div style={{display: AfterSaleType === 2 ? 'block' : 'none'}}>
                                <div className='serviceNumber saleItem' style={{borderBottom: 'none'}}>
                                    <span className='name'>审核操作:</span>
                                    <span className='description' style={{display: 'flex'}}>
                                        <RadioGroup value={Auditing} onChange={(e) => {this.setState({Auditing: e.target.value})}}>
                                            <Radio value={1}>通过</Radio>
                                            <Radio value={0}>不通过驳回申请</Radio>
                                        </RadioGroup>
                                        <TextArea maxLength='140' style={{width: '194px', height: '30px', marginTop: '8px'}} value={reason} onChange={(e) => this.setState({reason: e.target.value})} />
                                    </span>
                                </div>
                                <div className='serviceNumber saleItem' style={{borderBottom: 'none'}}>
                                    <span className='name'>申请退款:</span>
                                    <span className='description'>易宝支付 退款金额{refundAmountValue}</span>
                                    <span className='description'>
                                        <Button
                                            type='primary'
                                            style={{background: 'rgba(255, 0, 0, 1)', border: '1px solid rgba(255, 0, 0, 1)'}}
                                            onClick={() => this.setState({refundVisible: true})}
                                        >
                                            修改金额
                                        </Button>
                                    </span>
                                </div>
                                <div className='serviceNumber saleItem' style={{borderBottom: 'none'}}>
                                    <span className='name'>备注:</span>
                                    <span className='description'>
                                        <TextArea maxLength='140' value={remark} onChange={(e) => this.setState({remark: e.target.value})} />
                                    </span>
                                </div>
                                <div className='close' style={{display: 'flex'}}>
                                    <Button
                                        type='primary'
                                        style={{width: 200}}
                                        onClick={() => {this.setState({aftersale: false, remark: '', reason: ''})}}>取消</Button>
                                    <Button
                                        type='primary'
                                        style={{width: 200, background: 'rgba(255, 0, 0, 1)', border: '1px solid rgba(255, 0, 0, 1)'}}
                                        onClick={() => this.handleAuditingClick(ASO.afterSaleOrderId)}
                                        loading={AuditingClickLoading}
                                    >
                                        保存
                                    </Button>
                                </div>
                            </div>
                        </AfterSale>
                    </Drawer>
                    <Modal
                        bodyStyle={{padding: 0, height: 350}}
                        width={500}
                        title='查看图片'
                        footer={null}
                        visible={sysVisible}
                        onCancel={() => {this.setState({sysVisible: false})}}
                    >
                        <img style={{width: '100%', height: '100%'}} src={sysImgPath} />
                    </Modal>
                    <Modal
                        title='修改退款金额'
                        visible={refundVisible}
                        width={300}
                        onOk={this.handleRefundPrickClick}
                        onCancel={() => this.setState({refundVisible: false})}
                    >
                        <div style={{display: 'flex', height: '37px', lineHeight: '37px', fontSize: '18px'}}>
                            <span style={{marginRight: '10px'}}>支付方式:</span>
                            <span>易宝支付</span>
                        </div>
                        <div style={{display: 'flex', height: '37px', lineHeight: '37px', fontSize: '18px'}}>
                            <span style={{marginRight: '10px'}}>退款金额:</span>
                            <span>
                                <InputNumber
                                    style={{width: '150px'}}
                                    value={refundAmount}
                                    formatter={limitDecimals} 
                                    parser={limitDecimals} 
                                    onChange={(value) => {this.setState({refundAmount: value})}}
                                />
                            </span>
                        </div>
                    </Modal>
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
                </div>
            </div>
        );
    }
}

export default connect(null, null)(GoodsInfo);