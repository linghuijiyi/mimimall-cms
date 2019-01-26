import React, { Component } from 'react';
import { DatePicker, Select, Button, Table, message, Spin } from 'antd';
import { Warp, QueryListWarp, QueryItem, Search, List } from './style';
import { connect } from 'react-redux';
import fatch from './../../../common/js/fatch';
import baseURL from './../../../common/js/baseURL';
import formatDateTime from './../../../common/js/formatDateTime';
import pagination from './../../../common/js/pagination';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import 'moment/locale/zh-cn';
import moment from 'moment';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
class DailyDataTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '日期',
                dataIndex: 'time',
                key: 'time',
                align: 'center',
                render: (text, record) => (<div>{formatDateTime(record.time).slice(0, 10)}</div>)
            }, 
            {
                title: '已付款订单数',
                dataIndex: 'paidOrderNum',
                key: 'paidOrderNum',
                align: 'center',
            },
            {
                title: '已付款订单总金额（元）',
                dataIndex: 'paidOrderMoney',
                key: 'paidOrderMoney',
                align: 'center',
            },
            {
                title: '订单实总金额（元）',
                dataIndex: 'actualOrderMoney',
                key: 'actualOrderMoney',
                align: 'center',
            },
            {
                title: '应支付给渠道的总金额（元）',
                dataIndex: 'purchaseOrderMoney',
                key: 'purchaseOrderMoney',
                align: 'center',
            },
        ];
        this.state = {
            dataSource: [],
            loading: false,
            // 查询
            startTimeStr: '',
            endTimeStr: '',
            queryStartValue: null,
            queryEndValue: null,
            queryLoading: false
        };
        this.params = { page: 1 };
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(this.props.location.state));
        this.requestList();
    }
    /***********************获取列表数据****************************/
    requestList(queryLoading) {
        if (queryLoading) {
            this.params.page = 1;
            this.setState({queryLoading: true});
        }
        const url = `${baseURL}finance/dataOverview/list`;
        const {startTimeStr, endTimeStr} = this.state;
        const params = {
            pageNo: this.params.page,
            endTimeStr,
            startTimeStr
        }
        let _this = this;
        this.showAndHideLoading(true);
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({queryLoading: state});
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                const result = data.page.result;
                result.map((item, index) => (item.key = index));
                this.setState({
                    dataSource: result,
                    startTimeStr: data.startTime,
                    endTimeStr: data.endTime,
                    queryStartValue: moment(data.startTime, dateFormat),
                    queryEndValue: moment(data.endTime, dateFormat),
                    pagination:  pagination(res.data.page, (current) => {
                        _this.params.page = current;
                        this.requestList();
                    })
                });
                this.showAndHideLoading(false);
                if (queryLoading) {
                    this.setState({queryLoading: false});
                    message.info(res.msg);
                }
            } else {
                this.setState({queryLoading: false});
                this.setState({queryLoading: false});
                message.info(res.msg);
            }
        });
    }
    handleQueryList = () => {
        this.requestList(true);
    }
    /**********************获取选择日期的值*************************/
    handleStartTimeChange = (value, dateString) => {
        this.setState({startTimeStr: dateString});
        this.timeChange('queryStartValue', value);
    }
    handleEndTimeChange = (value, dateString) => {
        this.setState({endTimeStr: dateString});
        this.timeChange('queryEndValue', value);
    }
    timeChange = (field, value) => this.setState({[field]: value});
    disabledEndDate = (queryEndValue) => {
        const queryStartValue = this.state.queryStartValue;
        if (!queryEndValue || !queryStartValue) return false;
        return queryEndValue.valueOf() <= queryStartValue.valueOf();
    }
    /*******************************导出表格*************************/
    handleExportTable = () => {
        const { startTimeStr, endTimeStr } = this.state;
        window.location = `${baseURL}finance/dataOverview/downExcel?pageNo=${this.params.page}&startTimeStr=${startTimeStr}&endTimeStr=${endTimeStr}`;
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const {
            queryStartValue, 
            queryEndValue,
            dataSource,
            queryLoading,
            pagination
        } = this.state;
        return (
            <Warp>
                <QueryListWarp>
                    <QueryItem id='time' style={{position: 'relative' }}>
                        <span className='name'>时间段:</span>
                        <DatePicker
                            showToday={false}
                            onChange={this.handleStartTimeChange}
                            placeholder='选择开始日期'
                            value={queryStartValue}
                            format={dateFormat}
                            getCalendarContainer={() => document.getElementById('time')}
                        />
                        &nbsp;&nbsp;到&nbsp;&nbsp;
                        <DatePicker
                            showToday={false}
                            disabledDate={this.disabledEndDate}
                            onChange={this.handleEndTimeChange}
                            placeholder='选择结束日期'
                            value={queryEndValue}
                            format={dateFormat}
                            getCalendarContainer={() => document.getElementById('time')}
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

export default connect(null, null)(DailyDataTable);