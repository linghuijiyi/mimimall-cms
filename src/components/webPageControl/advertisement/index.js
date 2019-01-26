import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DatePicker, Select, Tag, Button, Table, Modal, Input, message, Spin, Icon } from 'antd';
import { Warp, QueryListWarp, CreateTimeItem, Search, Operation, Item } from './style';
import fatch from './../../../common/js/fatch';
import pagination from './../../../common/js/pagination';
import baseURL from './../../../common/js/baseURL';
import formatDateTime from './../../../common/js/formatDateTime';
import history from './../../../history';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import moment from 'moment';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

class Advertisement extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '广告编号',
                dataIndex: 'id',
                align: 'center',
            }, 
            {
                title: '广告名称',
                dataIndex: 'name',
                align: 'center',
            }, 
            {
                title: '广告公司',
                dataIndex: 'company',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center',
                render: (text, record) => <div>{formatDateTime(record.createTime)}</div>,
            },
            {
                title: '开始时间',
                dataIndex: 'startTime',
                align: 'center',
                render: (text, record) => <div>{formatDateTime(record.startTime)}</div>,
            },
            {
                title: '结束时间',
                dataIndex: 'endTime',
                align: 'center',
                render: (text, record) => <div>{formatDateTime(record.endTime)}</div>,
            },
            {
                title: '(uv)访问量',
                dataIndex: 'userSessions',
                align: 'center',
            },
            {
                title: '当前状态',
                dataIndex: 'stages',
                align: 'center',
                render: (text, record) => {
                    if (record.status === '1') return <Tag color="#87d068">进行中</Tag>;
                    else if (record.status === '2') return <Tag color="#f50">未开始</Tag>;
                    else if (record.status === '3') return <Tag color="red">已结束</Tag>;
                }
            },
            {
                title: '使用状态',
                dataIndex: 'state',
                align: 'center',
                render: (text, record) => {
                    if (record.state === '0') return <Tag color="#2db7f5">停止</Tag>;
                    else if (record.state === '1') return <Tag color="#87d068">发布</Tag>;
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                render: (text, record) => {
                    return (
                        this.state.roleDataSource.length
                        ? (
                            <Operation>
                                <Item style={{display: (record.status === '1' || record.status === '2') && record.state === '0' ? 'block' : 'none'}}>
                                    <Button 
                                        type='primary'  
                                        onClick={this.handleUpdateClick.bind(this, record)}
                                    >
                                        <Icon type='file-text' />
                                        编辑
                                    </Button>
                                </Item>
                                <Item style={{display: (record.status !== '2' && record.state === '1') || (record.status === '3' && record.state === '0') ? 'block' : 'none'}}>
                                    <Button 
                                        type='primary'
                                        style={{background: 'rgb(135, 208, 104)', border: '1px solid rgb(135, 208, 104)'}}
                                        onClick={this.handleReadClick.bind(this, record)}
                                    >
                                        <Icon type='eye' />
                                        查看
                                    </Button>
                                </Item>
                                <Item style={{display: record.state === '0' && record.status !== '3' ? 'block' : 'none'}}>
                                    <Button
                                        type='primary'
                                        style={{background: '#e90', border: '1px solid #e90'}}
                                        onClick={this.handleOpenStopClick.bind(this, record, true)}
                                    >
                                        <Icon type='tag' />
                                        发布
                                    </Button>
                                </Item>
                                <Item style={{display: record.state === '1' ? 'block' : 'none'}}>
                                    <Button
                                        type='primary'
                                        style={{background: 'red', border: '1px solid red'}}
                                        onClick={this.handleOpenStopClick.bind(this, record, false)}
                                    >
                                        <Icon type='lock' />
                                        停止
                                    </Button>
                                </Item>
                            </Operation>
                        ) : null
                    );
                }
            }
        ];
        this.state = {
            roleDataSource: [], // 表格数据
            // 查询参数
            startTime: '',
            endTime: '',
            startValue: null,
            endValue: null,
            company: '',
            name: '',
            status: '',
            state: '',
            queryLoading: false,
            //禁用和发布
            openAntStopVisible: false,
            openAntStopConfirmLoading: false,
            openAntStopId: '',
            openAntStopText: ''
        };
        this.params = { page: 1 };
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['前端页面管理', '广告管理']));
        // 判断从详情页面回来显示的数据
        let data = this.props.location.query;
        if (data !== undefined) {
            let { page, status, state, company, name, startTime, endTime } = data;
            this.params.page = page;
            this.setState({
                status, 
                state, 
                company, 
                name, 
                startTime,
                endTime,
                startValue: startTime ? moment(startTime, dateFormat) : null,
                endValue: endTime ? moment(endTime, dateFormat) : null
            }, () => {
                this.requestList();
            });
        } else {
            this.requestList();
        }
    }
    /*******************获取数据列表*********************************/
    requestList = (queryLoading) => {
        if (queryLoading) {
            this.setState({queryLoading: true});
            this.params.page = 1;
        }
        const url = `${baseURL}webPage/advert/list`;
        this.showAndHideLoading(true);
        const { company, name, status, state, startTime, endTime } = this.state;
        const params = {company, name, status, state, startTime, endTime, pageNo: this.params.page};
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({ queryLoading: state });
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.result;
                result.map((item, index) => (item.key = index));
                this.setState({
                    roleDataSource: result,
                    pagination: pagination(res.data, (current) => {
                        _this.params.page = current;
                        this.requestList();
                    })
                });
                this.showAndHideLoading(false);
                if (queryLoading) {
                    this.setState({queryLoading: false});
                    setTimeout(() => {message.info(res.msg)}, 300);
                }
            } else {
                message.info(res.msg);
                this.setState({ queryLoading: false });
                this.showAndHideLoading(false);
            }
        });
    }
    /************************查找数据********************************/
    handleQueryClick = () => {
        const { company, name, status, state } = this.state;
        if (regEn.test(company) || regCn.test(company)) {
            message.info('广告公司不能包含特殊字符');
            return;
        }
        if (/\s+/g.test(company)) {
            message.info('广告公司不能包含空格');
            return;
        }
        if (regEn.test(name) || regCn.test(name)) {
            message.info('广告名称不能包含特殊字符');
            return;
        }
        if (/\s+/g.test(name)) {
            message.info('广告名称不能包含空格');
            return;
        }
        this.requestList(true);
    }
    /***************************创建********************************/
    handleCreateClick = () => this.goToPage('/webPageControl/advertisement/createAtm');
    /**********************获取选择日期的值*************************/
    handleDatePickerCreateChange = (value, dateString) => {
        this.setState({startTime: dateString});
        this.timeChange('startValue', value);
    }
    handleDatePickerEndChange = (value, dateString) => {
        this.setState({endTime: dateString});
        this.timeChange('endValue', value);
    }
    timeChange = (field, value) => this.setState({[field]: value});
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }
    /**************************查看*********************************/
    handleReadClick(record) {
        this.goToPage('/webPageControl/advertisement/readAtm', record);
    }
    /**************************编辑*********************************/
    handleUpdateClick(record) {
        this.goToPage('/webPageControl/advertisement/updateAtm', record);
    }
    goToPage(path, record = {}) {
        const page = this.params.page;
        const { company, name, status, state, startTime, endTime } = this.state;
        history.push(path, {page, company, name, status, state, startTime, endTime, record});
    }
    /**************************停止和发布广告*********************************/
    handleStopClick(record) {
        this.setState({ stopVisible: true, stopId: record.id });
    }
    handleStopOk = () => {
        this.setState({stopConfirmLoading: true});
        const url = `${baseURL}webPage/advert/stopAdvert`;
        fatch(url, 'post', {id: this.state.stopId}, (err, state) => {
            message.info(err);
            this.setState({stopConfirmLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    stopVisible: false,
                    stopConfirmLoading: false,
                    stopId: ''
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestList();
                }, 300);
            } else {
                this.setState({stopConfirmLoading: false});
                message.info(res.msg);
            }
        });
    }
    handleStopCancel = () => this.setState({stopVisible: false});
    /**************************发布*********************************/
    handleOpenStopClick(record, open) {
        this.setState({
            openAntStopVisible: true,
            openAntStopId: record.id,
            openAntStopText: open ? true : false,
        });
    }
    handleOpenStopOk = () => {
        this.setState({openAntStopConfirmLoading: true});
        const { openAntStopText, openAntStopId } = this.state;
        let path = '';
        openAntStopText ? (path = 'publishAdvert') : (path = 'stopAdvert');
        let url = url = `${baseURL}webPage/advert/${path}`;
        fatch(url, 'post', {id: openAntStopId}, (err, state) => {
            message.info(err);
            this.setState({openAntStopConfirmLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    openAntStopVisible: false,
                    openAntStopConfirmLoading: false,
                    openAntStopId: ''
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestList();
                }, 300);
            } else {
                this.setState({openAntStopConfirmLoading: false});
                message.info(res.msg);
            }
        });
    }
    handleOpenStopCancel = () => this.setState({openAntStopVisible: false});
    /***********************广告位管理******************************/
    handleAtmControl = () => this.goToPage('/webPageControl/advertisement/atmControl');
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { 
            roleDataSource,
            startValue, 
            endValue,
            company,
            name,
            status,
            state,
            pagination,
            queryLoading,
            openAntStopVisible,
            opoenAntStopConfirmLoading,
            openAntStopId,
            openAntStopText
        } = this.state;
        const columns = this.columns.map((col) => {
            if (!col.editable) return col;
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
            <Warp>
                <QueryListWarp>
                    <CreateTimeItem>
                        <span>广&nbsp;&nbsp; 告&nbsp;&nbsp;公&nbsp;&nbsp;司:</span>
                        <Input
                            placeholder='请输入广告公司'
                            style={{ width: 300 }}
                            value={company}
                            onChange={(e) => {this.setState({company: e.target.value})}}
                        />
                    </CreateTimeItem>
                    <CreateTimeItem>
                        <span>广&nbsp;&nbsp; 告&nbsp;&nbsp;名&nbsp;&nbsp;称:</span>
                        <Input
                            placeholder='请输入广告名称'
                            style={{ width: 300 }}
                            value={name}
                            onChange={(e) => {this.setState({name: e.target.value})}}
                        />
                    </CreateTimeItem>
                    <CreateTimeItem id='dqzt' style={{position: 'relative' }}>
                        <span>当&nbsp;&nbsp; 前&nbsp;&nbsp;状&nbsp;&nbsp;态:</span>
                        <Select
                            value='0'
                            style={{ width: 300 }}
                            value={status}
                            onChange={(value) => {this.setState({status: value})}}
                            getPopupContainer={() => document.getElementById('dqzt')}
                        >
                            <Option value=''>全部</Option>
                            <Option value='1'>进行中</Option>
                            <Option value='2'>未开始</Option>
                            <Option value='3'>已结束</Option>
                        </Select>
                    </CreateTimeItem>
                    <CreateTimeItem id='syzt' style={{position: 'relative' }}>
                        <span>使&nbsp;&nbsp; 用&nbsp;&nbsp;状&nbsp;&nbsp;态:</span>
                        <Select
                            value='0'
                            style={{width: 300}}
                            value={state}
                            onChange={(value) => {this.setState({state: value})}}
                            getPopupContainer={() => document.getElementById('syzt')}
                        >
                            <Option value=''>全部</Option>
                            <Option value='1'>发布</Option>
                            <Option value='0'>停止</Option>
                        </Select>
                    </CreateTimeItem>
                    <CreateTimeItem id='ggsj' style={{position: 'relative' }}>
                        <span>广告开始时间:</span>
                        <DatePicker
                            showToday={false}
                            onChange={this.handleDatePickerCreateChange}
                            placeholder='选择开始日期'
                            value={startValue}
                            format={dateFormat}
                            getCalendarContainer={() => document.getElementById('ggsj')}
                        />
                        <span>到</span>
                        <DatePicker
                            showToday={false}
                            disabledDate={this.disabledEndDate}
                            onChange={this.handleDatePickerEndChange}
                            placeholder='选择结束日期'
                            value={endValue}
                            format={dateFormat}
                            getCalendarContainer={() => document.getElementById('ggsj')}
                        />
                    </CreateTimeItem>
                    <Search>
                        <Button type='primary' loading={queryLoading} onClick={this.handleQueryClick}>查询</Button>
                    </Search>
                </QueryListWarp>
                <Button type='primary' style={{marginBottom: 15}} onClick={this.handleCreateClick}>添加广告</Button>
                <Button type='primary' style={{marginLeft: 30}} onClick={this.handleAtmControl}>广告位管理</Button>
                <Table bordered pagination={pagination} dataSource={roleDataSource} columns={columns} />
                <Modal
                    width={300}
                    closable={false}
                    visible={openAntStopVisible}
                    confirmLoading={opoenAntStopConfirmLoading}
                    onOk={this.handleOpenStopOk}
                    onCancel={this.handleOpenStopCancel}
                >
                    {openAntStopText ? '确认发布此条广告' : '确认停止此条广告'}
                </Modal>
            </Warp>
        );
    }
}

export default connect(null, null)(Advertisement);