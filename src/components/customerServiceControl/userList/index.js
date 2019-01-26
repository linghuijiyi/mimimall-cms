import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Wrap,
    QueryBox,
    QueryInput,
    QyeryTitle,
    QueryItem,
    Options,
} from './style';
import { Select, Button, Input, Table, Modal, DatePicker, Icon, Spin, Radio, message } from 'antd';
import history from './../../../history';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import fatch from './../../../common/js/fatch';
import pagination from './../../../common/js/pagination';
import baseURL from './../../../common/js/baseURL';
import formatDateTime from './../../../common/js/formatDateTime';
import moment from 'moment';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
class UserList extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '用户ID',
                dataIndex: 'userId',
                align: 'center',
                render: (text, record) => (<div>{record.userId}</div>)
            },
            {
                title: '用户手机号',
                dataIndex: 'userPhone',
                align: 'center',
                render: (text, record) => (<div>{record.userPhone}</div>)
            },
            {
                title: '注册时间',
                dataIndex: 'userRegistTime',
                align: 'center',
                render: (text, record) => (<div>{record.userRegistTime}</div>)
            },
            {
                title: '待支付订单',
                dataIndex: 'toBePaidNum',
                align: 'center',
                width: 200,
                render: (text, record) => (<div>{record.toBePaidNum}</div>)
            },
            {
                title: '已获积分',
                dataIndex: 'credit',
                align: 'center',
                width: 200,
                render: (text, record) => (<div>{record.credit}</div>)
            },
            {
                title: '已支付订单',
                dataIndex: 'paidNum',
                align: 'center',
                render: (text, record) => (<div>{record.paidNum}</div>)
            },
            {
                title: '已消费金额',
                dataIndex: 'paidMoney',
                align: 'center',
                render: (text, record) => (<div>{record.paidMoney}</div>)
            },
            {
                title: '最后登录时间',
                dataIndex: 'userLastLoginTime',
                align: 'center',
                render: (text, record) => (<div>{record.userLastLoginTime}</div>)
            },
            {
                title: '邀请人手机号',
                dataIndex: 'inviteUserPhone',
                align: 'center',
                render: (text, record) => (<div>{record.inviteUserPhone}</div>)
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
                                    onClick={this.handleSeeClick.bind(this,record.userId)}
                                >
                                    <Icon><i className='iconfont icon-chakan'></i></Icon>
                                    查看
                                </Button>
                            </Options>
                        ) : null
                    );
                },
            }
        ];
        this.state = {
            inputContent: '',
            queryButtonLoading: false,
            dataSource: [],
            startValue:null,
            loginStartTime:null,
            loginEndTime:null,
            endValue:null,
            startValue_t:"",
            loginStartTime_t:"",
            loginEndTime_t:"",
            endValue_t:"",
            loading: false,
            selectType:"",
            // 清空表格选中的数据
            selectedRowKeys: []
        };
        this.params = { page: 1 };
    }
    componentWillMount() {
        this.props.handleChangeBreadcrumb(this.props.location.state);
        this.requestList();
    }
    handleSeeClick =(record)=>{
        this.goToPage('/customerServiceControl/userDetail',record);
    }
    goToPage(path, record = {}) {
        const page = this.params.page;
        history.push(path, record);
    }
    exportData = () => {
        const { inputContent, startValue_t, endValue_t, loginStartTime_t, loginEndTime_t, selectType } = this.state;
        window.location = `${baseURL}sys/userInfo/downExcel?inputContent=${inputContent}&registTimeStaStr=${startValue_t}&registTimeEndStr=${endValue_t}&lastLoginTimeStaStr=${loginStartTime_t}&lastLoginTimeEndStr=${loginEndTime_t}&selectType=${selectType}`;
    }
    handleQueryClick=(e)=>{
        const { inputContent } = this.state;
        const regEn = /[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/im;
        const regCn = /[！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (regEn.test(inputContent) || regCn.test(inputContent)) {
            message.info('用户账号中不能包含特殊字符');
            return;
        }
        this.requestList(true);
    }
    handleSelect=(value)=>{
        this.setState({selectType:value});
    }
    registerTime=(value, dateString)=>{
        this.setState({startValue_t:dateString})
        this.timeChange('startValue', value);
    }
    registerEndTime=(value, dateString)=>{
        this.setState({endValue_t:dateString})
        this.timeChange('endValue', value);
    }
    lastLoginTime=(value, dateString)=>{
        this.setState({loginStartTime_t:dateString})
        this.timeChange('loginStartTime', value);
    }
    lastLoginEndTime=(value, dateString)=>{
        this.setState({loginEndTime_t:dateString})
        this.timeChange('loginEndTime', value);
    }
    timeChange = (field, value) => {
        this.setState({[field]: value});
    }
    requestList = (queryButtonLoading) => {
        this.setState({loading: true});
        const url = `${baseURL}sys/userInfo/list`;
        const {
            inputContent,
            startValue,
            startValue_t,
            endValue,
            endValue_t,
            loginStartTime,
            loginStartTime_t,
            loginEndTime,
            loginEndTime_t,
        } = this.state;
        const params = {
            pageNo:this.params.page,
            selectType:this.state.selectType,
            inputContent:inputContent,
            lastLoginTimeEndStr:loginEndTime_t,
            lastLoginTimeStaStr:loginStartTime_t,
            registTimeEndStr:endValue_t,
            registTimeStaStr:startValue_t,
        };
        if (queryButtonLoading) {
            this.setState({loading: true});
            this.params.page = 1;
        }
        if(startValue===null||startValue===""){
        }else{
            params.registTimeStaStr = startValue_t;
        }
        if(endValue===null||endValue===""){
        }else{
            params.registTimeEndStr = endValue_t;
        }
        if(loginStartTime===null||loginStartTime===""){
        }else{
            params.lastLoginTimeStaStr = loginStartTime_t;
        }
        if(loginEndTime===null||loginEndTime===""){
        }else{
            params.lastLoginTimeEndStr = loginEndTime_t;
        }
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
                        loading: false
                    });
                    if (queryButtonLoading) {
                        this.setState({loading: false});
                        message.info(res.msg);
                    }
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        loading: false,
                        dataSource: result,
                        pagination: pagination(res.data, (current) => {
                            _this.params.page = current;
                            this.requestList();
                        })
                    })
                    if (queryButtonLoading) {
                        this.setState({loading: false});
                        message.info(res.msg);
                    }
                }
            } else {
                this.setState({loading: false});
                message.info(res.msg);
            }
        });
    }
    render() {
        const {
            dataSource,
            inputContent,
            startValue,
            endValue,
            queryButtonLoading,
            loginStartTime,
            loginEndTime,
            loading,
            selectedRowKeys,
            pagination,
            selectType,
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
            };        });
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                const { examineSysSkus } = this.state;
                if (selectedRows.length !== 0) {
                    let selectedIdList = [];
                    selectedRows.map((item) => (selectedIdList.push(item.sysSku)));
                    this.setState({examineSysSkus: selectedIdList, selectedRowKeys: selectedRowKeys});
                } else {
                    this.setState({examineSysSkus: [], selectedRowKeys: []});
                }
            }
        };

        return (
            <Wrap>
                <QueryBox>
                    <QueryItem id='zh' style={{position: 'relative' }}>
                        <QyeryTitle>用户账号:</QyeryTitle>
                        <Select
                            style={{ width: 120,marginRight:12 }}
                            defaultValue=""
                            onChange={this.handleSelect}
                            getPopupContainer={() => document.getElementById('zh')}
                        >
                            <Option value=''>全部</Option>
                            <Option value='userId'>用户ID</Option>
                            <Option value='userPhone'>用户手机号</Option>
                        </Select>
                        <Input
                            placeholder="用户ID/用户手机号"
                            style={{ width: 240 }}
                            className='input'
                            value={inputContent}
                            onChange={(e) => {this.setState({inputContent: e.target.value})}}
                        />
                    </QueryItem>
                    <QueryItem id='zcsj' style={{position: 'relative' }}>
                        <QyeryTitle>注册时间:</QyeryTitle>
                        <DatePicker
                            style={{ width: 240,marginRight:'12px' }}
                            onChange={this.registerTime}
                            disabledDate={current => {
                                return (current > moment(Date.now()).add(0, 'd'))
                            }}
                            placeholder='选择开始日期'
                            value={startValue}
                            format={dateFormat}
                            getCalendarContainer={() => document.getElementById('zcsj')}
                        />
                        <DatePicker
                            style={{ width: 240 }}
                            disabledDate={current => {
                                return (current > moment(Date.now()).add(0, 'd'))
                            }}
                            onChange={this.registerEndTime}
                            placeholder='选择结束日期'
                            value={endValue}
                            format={dateFormat}
                            getCalendarContainer={() => document.getElementById('zcsj')}
                        />
                    </QueryItem>
                    <QueryItem id='dlsj' style={{position: 'relative' }}>
                        <QyeryTitle>最后登录时间:</QyeryTitle>
                        <DatePicker
                            style={{ width: 240,marginRight:'10px' }}
                            onChange={this.lastLoginTime}
                            placeholder='选择开始日期'
                            disabledDate={current => {
                                return (current > moment(Date.now()).add(0, 'd'))
                            }}
                            value={loginStartTime}
                            format={dateFormat}
                            getCalendarContainer={() => document.getElementById('dlsj')}
                        />
                        <DatePicker
                            style={{ width: 240 }}
                            disabledDate={this.disabledEndDate}
                            onChange={this.lastLoginEndTime}
                            placeholder='选择结束日期'
                            disabledDate={current => {
                                return (current > moment(Date.now()).add(0, 'd'))
                            }}
                            value={loginEndTime}
                            format={dateFormat}
                            getCalendarContainer={() => document.getElementById('dlsj')}
                        />
                    </QueryItem>
                    <QueryItem>
                        <Button
                            type='primary'
                            className='btn'
                            onClick={this.handleQueryClick}
                            loading={queryButtonLoading}
                        >
                            查询
                        </Button>
                    </QueryItem>
                </QueryBox>
                <Spin size='large' spinning={loading}>
                    <Button type='primary' style={{marginBottom:'12px'}} onClick={this.exportData}>导出数据</Button>
                    <Table
                        bordered
                        pagination={dataSource.length > 0 ? pagination : false}
                        dataSource={dataSource}
                        columns={columns}
                    />
                </Spin>
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

export default connect(null, mapDispatchToProps)(UserList);
