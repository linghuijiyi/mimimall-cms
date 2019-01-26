import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { Select, Button, Input, Table, Modal, DatePicker, Icon, Tabs, Radio, message } from 'antd';
import history from './../../../history';
import {
    Wrap,
    Options,
} from './style';
import fatch from './../../../common/js/fatch';
import pagination from './../../../common/js/pagination';
import baseURL from './../../../common/js/baseURL';
import formatDateTime from './../../../common/js/formatDateTime';
import moment from 'moment';
const dateFormat = 'YYYY/MM/DD';
const TabPane = Tabs.TabPane;
class UserDetail extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '订单编号',
                dataIndex: 'orderId',
                align: 'center',
                render: (text, record) => (<div>{record.orderId}</div>)
            },
            {
                title: '提交时间',
                dataIndex: 'createTime',
                align: 'center',
                render: (text, record) => (<div>{formatDateTime(record.createTime)}</div>)
            },
            {
                title: '用户手机号',
                dataIndex: 'userPhone',
                align: 'center',
                render: (text, record) => (<div>{record.userPhone}</div>)
            },
            {
                title: '订单金额',
                dataIndex: 'orderPrice',
                align: 'center',
                width: 200,
                render: (text, record) => (<div>{record.orderPrice}</div>)
            },
            {
                title: '支付方式',
                dataIndex: 'payType',
                align: 'center',
                render: (text, record) => {
                    if (record.orderState === 1) return <div>易宝</div>;
                }
            },
            {
                title: '订单状态',
                dataIndex: 'orderState',
                align: 'center',
                render: (text, record) => {
                    if (record.orderState === 0) return <div>待支付</div>;
                    else if (record.orderState == 1) return <div>待收货</div>;
                    else if (record.orderState == 2) return <div>已取消</div>;
                    else if (record.orderState == 3) return <div>已发货</div>;
                    else if (record.orderState == 4) return <div>已签收</div>;
                    else if (record.orderState == 5) return <div>拒收</div>;
                    else if (record.orderState == 6) return <div>已完成</div>;
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
                                    onClick={this.handleSeeClick.bind(this, record)}
                                >
                                    <Icon><i className='iconfont icon-chakan'></i></Icon>
                                    查看订单
                                </Button>
                            </Options>
                        ) : null
                    );
                },
            }
        ];
        this.columnsAddress = [
            {
                title: '姓名',
                dataIndex: 'userName',
                align: 'center',
                render: (text, record) => (<div>{record.userName}</div>)
            },
            {
                title: '手机号码',
                dataIndex: 'userPhone',
                align: 'center',
                render: (text, record) => (<div>{record.userPhone}</div>)
            },
            {
                title: '详细地址',
                dataIndex: 'address',
                align: 'center',
                render: (text, record) => (<div>{record.address}</div>)
            },
            {
                title: '默认地址',
                dataIndex: 'isDefault',
                align: 'center',
                width: 200,
                render: (text, record) => {
                    if(record.isDefault==0){
                        return <div>否</div>
                    }else if(record.isDefault==1){
                        return <div>是</div>
                    }
                }
            }
        ];
        this.columnsLog = [
            {
                title: '时间',
                dataIndex: 'createTime',
                align: 'center',
                render: (text, record) => (<div>{formatDateTime(record.createTime)}</div>)
            },
            {
                title: 'IP',
                dataIndex: 'ip',
                align: 'center',
                render: (text, record) => (<div>{record.ip}</div>)
            },
            {
                title: '登录版本',
                dataIndex: 'appVersion',
                align: 'center',
                width: 200,
                render: (text, record) => (<div>{record.appVersion}</div>)
            },
            {
                title: '手机品牌',
                dataIndex: 'phoneBrand',
                align: 'center',
                render: (text, record) => (<div>{record.phoneBrand}</div>)
            },
        ];
        this.state = {
          userInfo:{},
          nowId:"",
          registTime:"",
          userInfoData:{},
          dataSource: [],
          dataAddress:[],
          dataLog: [],
        };
        this.params={
            page:1,
            logPage:1,
        };
     }

    handleModeChange = (e) => {
        const mode = e.target.value;
    }
    handleSeeClick(record) {
        let state = this.props.location.state;
        const paterPath = '/customerServiceControl/userDetail';
        const breadcrumb = ['客服管理', '用户列表', '用户详情'];
        history.push('/orderControl/goodsInfo', {record, paterPath, state, breadcrumb});
    }
    refreshOrder=(value)=>{
        const url = `${baseURL}sys/userInfo/orders`;
        const {
            dataSource,
        } = this.state;
        const params = {
            pageNo:this.params.page,
            userId:value,
        };
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({loading: state});
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.result;
                if (result === null) {
                    this.setState({
                        dataSource: [],
                    });
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        dataSource: result,
                        pagination: pagination(res.data, (current) => {
                            _this.params.page = current;
                            this.refreshOrder(value);
                        })
                    })
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    componentWillMount() {
        this.props.handleChangeBreadcrumb(['客服管理', '用户列表', '用户详情']);
        let state = this.props.location.state;
        this.setState({'nowId':this.props.location.state});
        this.refresh(state);
        this.refreshOrder(state);
    }
    refresh=(value)=>{
        const url = `${baseURL}sys/userInfo/info`;
        const {
            userInfoData,
            userInfo,
            dataAddress,
            dataLog,
        } = this.state;
        const params = {
            userId:value,
        };
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({loading: state});
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data;
                if (result === null) {
                    this.setState({
                        dataSource: [],
                        userInfo: {},
                    });
                } else {
                    res.data.userAddresses.map((item, index) => (item.key = index));
                    this.setState({
                        userInfo:res.data.userInfo,
                        userInfoData:res.data.userInfoData,
                        dataAddress:res.data.userAddresses,
                        registTime:res.data.userInfo.user.registTime,
                        credit: res.data.userInfo.user.credit,
                    })
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    onTabChange=(activeKey)=>{
        if(activeKey==2){
            this.refreshLog(this.state.nowId);
        }else if(activeKey==1){
            this.refreshOrder(this.state.nowId);
        }
    }
    refreshLog=(value)=>{
        const url = `${baseURL}sys/userInfo/loginLog`;
        const {
            dataLog,
        } = this.state;
        const params = {
            pageNo:this.params.logPage,
            userId:value,
        };
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.result;
                if (result === null) {
                    this.setState({
                        dataLog: [],
                    });
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        dataLog: result,
                        pagination: pagination(res.data, (current) => {
                            _this.params.logPage = current;
                            this.refreshLog(value);
                        })
                    })
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    render() {
        const {
            dataSource,
            pagination,
            dataAddress,
            dataLog,
            userInfoData,
            userInfo,
            registTime,
            credit
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
         const columnsAddress = this.columnsAddress.map((col) => {
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
         const columnsLog = this.columnsLog.map((col) => {
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
        return (
            <Wrap>
                 <div className="tabWrap">
                     <Tabs
                      onChange={this.onTabChange}
                      defaultActiveKey="1"
                     >
                         <TabPane tab="用户详情" key="1">
                            <div className="user_detail_title">基本信息</div>
                            <div className="user_detail_content">
                                <li>
                                    <span>用户ID</span><p>{userInfo.userId}</p>
                                </li>
                                <li>
                                    <span>用户手机号</span><p>{userInfo.phone}</p>
                                </li>
                                <li>
                                    <span>用户姓名</span><p>{userInfo.name}</p>
                                </li>
                                <li>
                                    <span></span><p></p>
                                </li>
                                <li>
                                    <span>注册时间</span><p>{formatDateTime(registTime)}</p>
                                </li>
                                <li>
                                    <span>注册设备</span><p>{userInfo.phoneBrand}-{userInfo.phoneModel}</p>
                                </li>
                                <li>
                                    <span>最后登陆时间</span><p>{formatDateTime(userInfo.lastLoginTime)}</p>
                                </li>
                                <li>
                                    <span>最后登陆设备</span><p>{userInfo.lastLoginDevice}</p>
                                </li>
                            </div>
                            <div className="user_detail_title">统计信息</div>
                            <div className="user_detail_content">
                                <li>
                                    <span>消费金额</span><p>{userInfoData.paidMoney}</p>
                                </li>
                                <li>
                                    <span>订单总数量</span><p>{userInfoData.orderNum}</p>
                                </li>
                                <li>
                                    <span>待支付订单数量</span><p>{userInfoData.toBePaidNum}</p>
                                </li>
                                <li>
                                    <span>已支付订单数量</span><p>{userInfoData.paidNum}</p>
                                </li>
                                <li>
                                    <span>已完成订单数量</span><p>{userInfoData.completedNum}</p>
                                </li>
                                <li>
                                    <span>无效订单数量</span><p>{userInfoData.invalidNum}</p>
                                </li>
                                <li>
                                    <span>登录次数</span><p>{userInfoData.loginNum}</p>
                                </li>
                                <li>
                                    <span>已获积分</span><p>{credit}</p>
                                </li>
                            </div>
                            <div className="user_detail_title">收货地址</div>
                            <Table
                                style={{marginBottom:16,width:1100}}
                                bordered
                                dataSource={dataAddress}
                                pagination={false}
                                columns={columnsAddress}
                            />
                            <div className="user_detail_title">订单记录</div>
                            <Table
                                bordered
                                pagination={dataSource.length > 0 ? pagination : false}
                                dataSource={dataSource}
                                columns={columns}
                            />
                         </TabPane>
                         <TabPane tab="登录日志" key="2">
                             <Table
                                 bordered
                                 pagination={dataLog.length > 0 ? pagination : false}
                                 dataSource={dataLog}
                                 columns={columnsLog}
                             />
                         </TabPane>
                     </Tabs>
                 </div>
            </Wrap>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleChangeBreadcrumb(list) {
            dispatch(actionCreators.changeBreadcrumb(list));
        }
    }
}

export default connect(null, mapDispatchToProps)(UserDetail);