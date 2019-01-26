import React, { Component } from 'react';
import { DatePicker, Select, Button, Table, message, Spin, Collapse, Switch } from 'antd';
import { Warp, QueryListWarp, QueryItem, Search, List } from './style';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import fatch from './../../../common/js/fatch';
import baseURL from './../../../common/js/baseURL';
import formatDateTime from './../../../common/js/formatDateTime';
import moment from 'moment';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const Panel = Collapse.Panel;
class ChannelTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '渠道编码',
                dataIndex: 'channelCode',
                key: 'channelCode',
                width: '20%',
                align: 'center',
            },
            {
                title: '渠道',
                dataIndex: 'channelName',
                key: 'channelName',
                width: '20%',
                align: 'center',
            },
            {
                title: '注册数',
                dataIndex: 'registNum',
                key: 'registNum',
                width: '20%',
                align: 'center',
            },
            {
                title: '渠道uv数',
                dataIndex: 'channelUVCount',
                key: 'channelUVCount',
                width: '20%',
                align: 'center',
            },
            {
                title: '注册后登陆数',
                dataIndex: 'loginAfterRegistNum',
                key: 'loginAfterRegistNum',
                width: '20%',
                align: 'center',
            }
        ];
        this.state = {
            source: [],
            // 查询
            queryValue: '全部',
            code: '',
            startTimeStr: '',
            endTimeStr: '',
            startValue: null,
            endValue: null,
            queryLoading: false,
            // 渠道下拉选列表
            channelList: ''
        };
        this.params = { page: 1 };
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(this.props.location.state));
        this.getChannelList();
        this.requestList();
    }
    /***********************获取列表数据****************************/
    requestList(queryLoading) {
        if (queryLoading) this.setState({queryLoading: true});
        this.showAndHideLoading(true);
        const url = `${baseURL}market/channelData/list`;
        const { code, startTimeStr, endTimeStr } = this.state;
        const params = {
            code,
            startTimeStr,
            endTimeStr
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(false);
            this.setState({queryLoading: state});
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const { resultArray, startTime, endTime } = res.data;
                this.setState({
                    source: this.panelList(resultArray),
                    startTimeStr: formatDateTime(startTime, true).slice(0, 10),
                    endTimeStr: formatDateTime(endTime, true).slice(0, 10),
                    startValue: moment(formatDateTime(startTime, true), dateFormat),
                    endValue: moment(formatDateTime(endTime, true), dateFormat),
                });
                this.showAndHideLoading(false);
                if (queryLoading) {
                    this.setState({queryLoading: false});
                    message.info(res.msg);
                }
            } else {
                message.info(res.msg);
                this.setState({queryLoading: false});
                this.showAndHideLoading(false);
            }
        });
    }
    /*********************获取渠道下拉选列表**************************/
    getChannelList = () => {
        const url = `${baseURL}market/channelData/channelList`;
        fatch(url, 'post', {}, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                data.unshift({code: '', name: '全部'});
                const list = data.map((item) => (<Option value={item.code} key={item.code}>{item.name}</Option>));
                this.setState({channelList: list});
            } else {
                message.info(res.msg);
            }
        });
    }
    handleQueryList = () => {
        this.requestList(true);
    }
    /*******************************导出表格*************************/
    handleExportTable = () => {
        const { code, startTimeStr, endTimeStr } = this.state;
        window.location = `${baseURL}market/channelData/downExcel?code=${code}&startTimeStr=${startTimeStr}&endTimeStr=${endTimeStr}`;
    }
    /**********************获取选择日期的值*************************/
    handleStartTimeChange = (value, dateString) => {
        if (dateString !== '') {
            this.setState({startTimeStr: dateString});
            this.timeChange('startValue', value);
        } else {
            this.setState({startTimeStr: ''});
            this.timeChange('startValue', null);
        }
    }
    handleEndTimeChange = (value, dateString) => {
        if (dateString !== '') {
            this.setState({endTimeStr: dateString});
            this.timeChange('endValue', value);
        } else {
            this.setState({endTimeStr: ''});
            this.timeChange('endValue', null);
        }
    }
    timeChange = (field, value) => {
        // 重新设置开始时间，必须重新设置结束时间
        if (field === 'startValue') this.setState({endValue: null, endTimeStr: ''});
        this.setState({[field]: value});
    }
    panelList = (data) => {
        if (data.length) {
            return data.map((item, index) => {
                if (item.arrayData.length) {
                    item.arrayData.map((item, index) => item.key = index);
                    return <Panel header={item.time} key={index.toString()}>
                        <Table bordered pagination={false} dataSource={item.arrayData} columns={this.columns} scroll={{ y: 300 }} />
                    </Panel>;
                } else {
                    return <Panel header={item.time} key={index.toString()}>
                        <Table bordered pagination={false} dataSource={item.arrayData} columns={this.columns} />
                    </Panel>;
                }
            });
        } else {
            return <Panel header='没有查询到数据...' key='-1' disabled showArrow={false}></Panel>;
        }
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const {
            startValue,
            endValue,
            queryLoading,
            code,
            source,
            channelList,
            startTimeStr,
            endTimeStr
        } = this.state;
        return (
            <Warp>
                <QueryListWarp>
                    <QueryItem>
                        <span className='name'>时间段:</span>
                        <div id='named' style={{position: 'relative' }}>
                            <DatePicker
                                showToday={false}
                                disabledDate={(current) => {
                                    if (!current) return false;
                                    return !(current < moment().endOf('day') && current > moment().subtract(3, 'month'));
                                }}
                                onChange={this.handleStartTimeChange}
                                placeholder='选择开始日期'
                                value={startValue}
                                format={dateFormat}
                                getCalendarContainer={() => document.getElementById('named')}
                            />
                            &nbsp;&nbsp;到&nbsp;&nbsp;
                            <DatePicker
                                showToday={false}
                                disabledDate={(current) => {
                                    if (!current || !startValue) return false;
                                    return !(current < moment().endOf('day') && current.valueOf() >= startValue.valueOf());
                                }}
                                onChange={this.handleEndTimeChange}
                                placeholder='选择结束日期'
                                value={endValue}
                                format={dateFormat}
                                getCalendarContainer={() => document.getElementById('named')}
                            />
                        </div>
                    </QueryItem>
                    <QueryItem>
                        <span className='name'>渠道:</span>
                        <div id='qd' style={{position: 'relative' }}>
                            <Select
                                showSearch={true}
                                style={{ width: 300 }}
                                placeholder='请选择人员'
                                optionFilterProp='children'
                                notFoundContent='无法找到'
                                value={code}
                                onChange={(value) => {this.setState({code: value})}}
                                getPopupContainer={() => document.getElementById('qd')}
                            >
                                { channelList }
                            </Select>
                        </div>
                    </QueryItem>
                    <Search>
                        <Button type='primary' loading={queryLoading} onClick={this.handleQueryList}>查询</Button>
                    </Search>
                </QueryListWarp>
                <Button type='primary' style={{marginBottom: 15}} onClick={this.handleExportTable}>导出excel</Button>
                <List>
                    <Collapse defaultActiveKey='0'>{ source }</Collapse>
                </List>
            </Warp>
        );
    }
}

export default connect(null, null)(ChannelTable);
