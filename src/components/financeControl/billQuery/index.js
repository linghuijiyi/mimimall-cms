import React, { Component } from 'react';
import { DatePicker, Input, Select, Button, Table, message, Spin } from 'antd';
import { Warp, QueryListWarp, QueryItem, Search, List } from './style';
import { connect } from 'react-redux';
import fatch from './../../../common/js/fatch';
import baseURL from './../../../common/js/baseURL';
import formatDateTime from './../../../common/js/formatDateTime';
import pagination from './../../../common/js/pagination';
import { regEn, regCn } from './../../../common/js/regExp';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import 'moment/locale/zh-cn';
import moment from 'moment';
import history from './../../../history';
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const Option = Select.Option;
class BillQuery extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '支付时间',
                dataIndex: 'createTime',
                key: 'createTime',
                align: 'center',
                render: (text, record) => {
                    if (record.createTime === null || record.createTime === undefined) {
                        return <div></div>;
                    } else {
                        return <div>{formatDateTime(record.createTime)}</div>
                    }
                }
            }, 
            {
                title: '收货人手机号',
                dataIndex: 'userPhone',
                key: 'userPhone',
                align: 'center',
                render: (text, record) => {
                    if (record.userAddress !== null) return <div>{record.userAddress.userPhone}</div>;
                    else return <div></div>;
                }    
            },
            {
                title: '收货人',  
                dataIndex: 'userName',
                key: 'userName',
                align: 'center',
                render: (text, record) => {
                    if (record.userAddress !== null) return <div>{record.userAddress.userName}</div>;
                    else return <div></div>;
                }  
            },
            {
                title: '订单号',
                dataIndex: 'orderId',
                key: 'orderId',
                align: 'center',
            },
            {
                title: '进账账户',
                dataIndex: 'payTypeName',
                key: 'payTypeName',
                align: 'center',
            },
            {
                title: '交易流水号',
                dataIndex: 'transId',
                key: 'transId',
                align: 'center',
            },
            {
                title: '应支付金额',
                dataIndex: 'transMoney',
                key: 'transMoney1',
                align: 'center',
            },
            {
                title: '实际支付金额',
                dataIndex: 'transMoney',
                key: 'transMoney2',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'option',
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            <Button icon='eye' type='primary' onClick={this.handleOrderDetail.bind(this, record)}>订单明细</Button>
                        </div>
                    );
                }
            }
        ];
        this.state = {
            dataSource: [],
            payTypes: '',
            payTypesList: '',
            // 查询
            queryStartValue: null,
            querySendValue: null,
            queryLoading: false,
            payType: '',
            startTimeStr: '',
            endTimeStr: '',
            selectType: '',
            inputContent: ''
        };
        this.params = { page: 1 };
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['财务管理', '单据查询']));
        let data = this.props.location.query;
        if (data !== undefined) {
            const { page, payType, inputContent, selectType, startTimeStr, endTimeStr } = data;
            this.params.page = page;
            this.setState({
                payType,
                inputContent,
                selectType,
                startTimeStr,
                endTimeStr,
                queryStartValue: startTimeStr ? moment(startTimeStr, dateFormat) : null,
                querySendValue: endTimeStr ? moment(endTimeStr, dateFormat) : null,
            }, () => {
                this.requestList();
            });
        } else {
            this.requestList();
        }
    }
    /***********************获取列表数据****************************/
    requestList(queryLoading) {
        if (queryLoading) {
            this.setState({queryLoading: true});
            this.params.page = 1;
        }
        this.showAndHideLoading(true);
        const url = `${baseURL}finance/transactionRecord/list`;
        const { payType, startTimeStr, endTimeStr, selectType, inputContent } = this.state;
        const params = {
            pageNo: this.params.page,
            payType,
            startTimeStr,
            endTimeStr,
            selectType,
            inputContent
        }
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({queryLoading: state});
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.page.result;
                const payTypes = res.data.payTypes;
                result.map((item, index) => (item.key = index));
                this.setState({
                    payTypesList: payTypes,
                    dataSource: result,
                    pagination: pagination(res.data.page, (current) => {
                        _this.params.page = current;
                        this.requestList();
                    })
                });
                this.showAndHideLoading(false);
                this.reanderPayTypesOpt(payTypes);
                if (queryLoading) {
                    this.setState({queryLoading: false});
                    message.info(res.msg);
                }
            } else {
                this.setState({queryLoading: false});
                this.showAndHideLoading(false);
                message.info(res.msg);
            }
        });
    }
    handleQueryList = () => {
        const { inputContent } = this.state;
        if (regEn.test(inputContent) || regCn.test(inputContent)) {
            message.info('关键词中不能包含特殊字符');
            return;
        }
        this.requestList(true);
    }
    reanderPayTypesOpt = (data) => {
        data.unshift({code: '', name: '全部', state: 1});
        const list = data.map((item) => (<Option style={{color: item.state === 0 ? 'red' : ''}} value={item.code} key={item.code}>{item.name}</Option>));
        this.setState({payTypes: list});
    }
    selectCol = (id) => {
        const { payTypesList } = this.state;
        if (id !== '' && payTypesList.length) {
            let flag = false;
            payTypesList.map((item) => {
                if (item.code === id && item.state === 0) flag = true;
            });
            return flag;
        }
    }
    /**********************获取选择日期的值*************************/
    handleStartTimeChange = (value, dateString) => {
        this.setState({startTimeStr: dateString});
        this.timeChange('queryStartValue', value);
    }
    handleEndTimeChange = (value, dateString) => {
        this.setState({endTimeStr: dateString});
        this.timeChange('querySendValue', value);
    }
    timeChange = (field, value) => this.setState({[field]: value});
    disabledEndDate = (querySendValue) => {
        const queryStartValue = this.state.queryStartValue;
        if (!querySendValue || !queryStartValue) return false;
        return querySendValue.valueOf() <= queryStartValue.valueOf();
    }
    handleExportTable = () => {
        const { payType, startTimeStr, endTimeStr, selectType, inputContent } = this.state;
        window.location = `
            ${baseURL}finance/transactionRecord/downExcel?pageNo=${this.params.page}&payType=${payType}&startTimeStr=${startTimeStr}&endTimeStr=${endTimeStr}&selectType=${selectType}&inputContent=${inputContent}`
        ;
    }
    handleOrderDetail(record) {
        const page = this.params.page;
        const paterPath = '/financeControl/billQuery';
        const path = '/orderControl/goodsInfo';
        const breadcrumb = ['财务管理', '单据查询'];
        const { payType, inputContent, selectType, startTimeStr, endTimeStr } = this.state;
        history.push(path, {
            page,
            record,
            paterPath,
            payType,
            inputContent,
            selectType,
            startTimeStr,
            endTimeStr,
            breadcrumb
        });
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const {
            pagination,
            queryStartValue, 
            querySendValue,
            dataSource,
            queryLoading,
            payTypes,
            payType,
            selectType,
            inputContent
        } = this.state;
        return (
            <Warp>
                <QueryListWarp>
                    <QueryItem id='jzzh' style={{position: 'relative' }}>
                        <span className='name'>进账帐户:</span>
                        <Select
                            style={{ width: 300, color: this.selectCol(payType) ? 'red' : '' }}
                            value={payType}
                            onChange={(value) => {this.setState({payType: value})}}
                            getPopupContainer={() => document.getElementById('jzzh')}
                        >
                            {payTypes}
                        </Select>
                    </QueryItem>
                    <QueryItem id='jjsj' style={{position: 'relative' }}>
                        <span className='name'>交易时段:</span>
                        <DatePicker
                            showToday={false}
                            onChange={this.handleStartTimeChange}
                            placeholder='选择开始日期'
                            value={queryStartValue}
                            format={dateFormat}
                            getCalendarContainer={() => document.getElementById('jjsj')}
                        />
                        &nbsp;&nbsp;到&nbsp;&nbsp;
                        <DatePicker
                            showToday={false}
                            disabledDate={this.disabledEndDate}
                            onChange={this.handleEndTimeChange}
                            placeholder='选择开始日期'
                            value={querySendValue}
                            format={dateFormat}
                            getCalendarContainer={() => document.getElementById('jjsj')}
                        />
                    </QueryItem>
                    <QueryItem id='gjc' style={{position: 'relative' }}>
                        <span className='name'>关键词:</span>
                        <Select
                            style={{ width: 100 }}
                            value={selectType}
                            onChange={(value) => {this.setState({selectType: value})}}
                            getPopupContainer={() => document.getElementById('gjc')}
                        >
                            <Option value=''>全部</Option>
                            <Option value='userPhone'>手机号码</Option>
                            <Option value='userName'>用户姓名</Option>
                            <Option value='userId'>用户ID</Option>
                            <Option value='transId'>支付流水号</Option>
                            <Option value='orderId'>订单号</Option>
                        </Select>
                        &nbsp;&nbsp;
                        <Input
                            placeholder='手机号码/用户姓名/用户ID/支付流水号/订单号'
                            style={{ width: 320 }}
                            value={inputContent}
                            onChange={(e) => {this.setState({inputContent: e.target.value})}}
                        />
                    </QueryItem>
                    <Search>
                        <Button type='primary' loading={queryLoading} onClick={this.handleQueryList}>查询</Button>
                    </Search>
                </QueryListWarp>
                <Button type='primary' style={{marginBottom: 15}} onClick={this.handleExportTable}>导出excel</Button>
                <Table 
                    bordered
                    pagination={dataSource.length > 0 ? pagination : false}
                    dataSource={dataSource}
                    columns={this.columns}
                />
            </Warp>
        );
    }
}

export default connect(null, null)(BillQuery);