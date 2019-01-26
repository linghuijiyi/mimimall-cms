import React, { Component } from 'react';
import { 
    Warp,
    OperationWarp,
    Name,
    Options,
    SynchroView,
    Text,
    View
} from './style';
import { TreeSelect, Select, Button, Input, Table, Modal, Checkbox, DatePicker, Icon, Tag, Cascader, message, Spin, Radio, Row, Col, Card, Form } from 'antd';
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
import uuid from './../../../common/js/uuid';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
class Stages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '序号',
                    dataIndex: 'id',
                    align: 'center',
                    width: 50
                },
                {
                    title: '创建时间',
                    dataIndex: 'startTime',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        return <div style={{width: '110px'}}>{formatDateTime(record.createTime)}</div>;
                    }
                },
                {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        return <div style={{width: '110px'}}>{formatDateTime(record.updateTime)}</div>;
                    }
                },
                {   
                    title: '渠道',
                    dataIndex: 'channelName',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        if (record.channelCode === '1') {
                            return <div>京东</div>;
                        } else if (record.channelCode === '') {
                            return <div>全部</div>;
                        }
                    }
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    align: 'center',
                    width: 120,
                    render: (text, record) => {
                        if (record.type === 0) {
                            return <div>分类</div>;
                        } else if (record.type === 1) {
                            return <div>单个/多个商品</div>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '分类',
                    dataIndex: 'categoriesStr',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        return <div style={{width: '110px', height: '65px', overflowY: 'auto'}}>{record.categoriesStr}</div>;
                    }
                },
                {
                    title: '包含的spu',
                    dataIndex: 'brandName',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        if (record.type === 1) {
                            return <div style={{width: '110px', height: '65px', overflowY: 'auto'}}>{ record.content }</div>;
                        }
                    }
                },
                {
                    title: '排除的spu',
                    dataIndex: 'jdPrice',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        if (record.type === 0) {
                            return <div style={{width: '110px', height: '65px', overflowY: 'auto'}}>{ record.content }</div>;
                        }
                    }
                },
                {
                    title: '首付',
                    dataIndex: 'downPayment',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '分期',
                    dataIndex: 'instalmentStr',
                    width: 150,
                    align: 'center',
                    render: (text, record) => {
                        return <div style={{width: '110px', height: '65px', overflowY: 'auto'}}>{ record.instalmentStr }</div>;
                    }
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        return <div style={{width: '110px', height: '65px', overflowY: 'auto'}}>
                            {record.remark}
                        </div>;
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'state',
                    align: 'center',
                    render: (text, record) => {
                        if (record.state === 0) {
                            return <Tag color="#FF0000">不可用</Tag>;
                        } else if (record.state === 1) {
                            return <Tag color="#87d068">可用</Tag>;
                        } else {
                            return <div></div>;
                        }
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    width: 100,
                    render: (text, record) => {
                        return (
                            this.state.dataSource.length
                            ? (
                                <Options>
                                    <Button
                                        type='primary'
                                        icon='eye'
                                        style={{minWidth: '80px'}}
                                        onClick={this.handleReadClick.bind(this, record)}
                                    >
                                        查看
                                    </Button>
                                    <Button
                                        type='primary'
                                        icon='edit'
                                        style={{minWidth: '80px', background: 'rgb(255, 183, 82)', border: '1px solid rgb(255, 183, 82)'}}
                                        onClick={this.handleUqdateClick.bind(this, record)}
                                    >
                                        编辑
                                    </Button>
                                    <Button
                                        type='primary'
                                        icon='unlock'
                                        style={{minWidth: '80px', background: '#87d068', border: '1px solid #87d068', display: record.state === 0 ? 'block' : 'none'}}
                                        onClick={this.handleInvalidClick.bind(this, record, 'goods/instalment/validate')}
                                    >
                                        开启
                                    </Button>
                                    <Button
                                        type='primary'
                                        icon='lock'
                                        style={{minWidth: '80px', background: '#FF0000', border: '1px solid #FF0000', display: record.state === 1 ? 'block' : 'none'}}
                                        onClick={this.handleInvalidClick.bind(this, record, 'goods/instalment/invalid')}
                                    >
                                        关闭
                                    </Button>
                                </Options>
                            ) : null
                        );
                    },
                }
            ],
            expandForm: false,
            dataSource: [],
            // 查询
            startValue: null,
            endValue: null,
            startTime: '',
            endTime: '',
            updateEndTime: '',
            updateStartTime: '',
            updateStartValue: null,
            updateEndValue: null,
            treeData: [],
            treeValue: [],
            channelCode: '',
            type: '',
            categories: [],
            state: '',
            selectType: '',
            inputContent: '',
            queryButtonLoading: false
        };
        this.params = { page: 1 };
    }
    componentWillMount() {
        this.getTypeList();
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '分期管理']));
        let data = this.props.location.query;
        if (data !== undefined) {
            const {
                page,
                channelCode,
                type,
                state,
                startTime,
                endTime,
                selectType,
                inputContent,
                updateStartTime,
                updateEndTime
            } = data;
            this.params.page = page;
            this.setState({
                channelCode,
                type,
                state,
                startTime: startTime === undefined ? '' : startTime,
                endTime: endTime === undefined ? '' : endTime,
                updateStartTime: updateStartTime === undefined ? '' : updateStartTime,
                updateEndTime: updateEndTime === undefined ? '' : updateEndTime,
                selectType,
                inputContent,
                startValue: startTime ? moment(startTime, dateFormat) : null,
                endValue: endTime ? moment(endTime, dateFormat) : null,
                updateStartValue: updateStartTime ? moment(updateStartTime, dateFormat) : null,
                updateEndValue: updateEndTime ? moment(updateEndTime, dateFormat) : null,
            }, () => {
                this.requestList();
            });
        } else {
            this.requestList();
        }
    }
    /*********************获取数据列表********************/
    requestList = (queryButtonLoading) => {
        if (queryButtonLoading) {
            this.params.page = 1;
            this.setState({ queryButtonLoading: true });
        }
        const url = `${baseURL}goods/instalment/list`;
        const {
            channelCode, type, categories, state, selectType, inputContent, startTime, endTime, updateStartTime, updateEndTime
        } = this.state;
        let categoriesString = [];
        if (type === 0 || type === '') {
            categoriesString = categories;
        }
        const params = {
            pageNo: this.params.page,
            categories: categoriesString,
            channelCode, type, state, selectType, inputContent, startTime, endTime, updateStartTime, updateEndTime
        }
        this.showAndHideLoading(true);
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.error(err);
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.result;
                if (result === null) {
                    if (queryButtonLoading) {
                        this.setState({ queryButtonLoading: false })
                    }
                    this.setState({
                        dataSource: [],
                    });
                    message.success(res.msg);
                    this.showAndHideLoading(false);
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        dataSource: result,
                        pagination: pagination(res.data.page, (current) => {
                            _this.params.page = current;
                            this.requestList();
                        })
                    });
                    if (queryButtonLoading) {
                        message.success(res.msg);
                        this.setState({ queryButtonLoading: false })
                    }
                    this.showAndHideLoading(false);
                }
            } else {
                if (queryButtonLoading) {
                    message.error(res.msg);
                    this.setState({ queryButtonLoading: false })
                }
                this.showAndHideLoading(false);
            }
        });
    }
    handleQueryClick = () => {
        if (this.state.type === '') {
            this.setState({
                selectType: '',
                inputContent: '',
            });
        }
        this.requestList(true);
    }
    /*****************************获取分类列表************************/
    getTypeList() {
        const url = `${baseURL}category/all/list`;
        fatch(url, 'post', {}, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    treeData: this.handleFormatTypeList(res.data)
                });
            } else {
                message.error('获取分类id失败：' + res.msg);
            }
        });
    }
    /*****************************格式化分类数据**********************/
    handleFormatTypeList(data) {
        return data.map((item, index) => {
            item.value = item.categoryId.toString();
            item.title = item.name;
            item.key = uuid();
            item.children = item.thirdCategoryList;
            if (item.thirdCategoryList !== null) this.handleFormatTypeList(item.thirdCategoryList);
            return item;
        });
    }
    terrChange = (treeValue, label, extra) => {
        let data = extra.allCheckedNodes;
        let categories = [];
        for (let i = 0; i < data.length; i++) {
            categories.push(data[i].props.categoryId);
        }
        this.setState({ categories })
        this.setState({ treeValue });
    }
    /**********************获取选择日期的值*************************/
    handleDatePickerCreateChange = (value, dateString) => {
        this.setState({startTime: dateString});
        this.timeChange('startValue', value);
    }
    handleDatePickerEndChange = (value, dateString) => {
        this.setState({endTime: dateString});
        this.timeChange('endValue', value);
    }
    timeChange = (field, value) => {
        this.setState({[field]: value});
    }
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }
    handleDatePickerUpdateChange = (value, dateString) => {
        this.setState({updateStartTime: dateString});
        this.timeChange('updateStartValue', value);
    }
    handleDatePickerUpdateEndChange = (value, dateString) => {
        this.setState({updateEndTime: dateString});
        this.timeChange('updateEndValue', value);
    }
    updateDisabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }
    /************************切换状态****************************/
    handleInvalidClick(record, api) {
        const url = `${baseURL}${api}`;
        fatch(url, 'post', { id: record.id }, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                message.success(res.msg);
                this.requestList();
            } else {
                message.error(res.msg);
            }
        });
    }
    createStages = () => {
        this.gotoPage('/goodsControl/stages/createStages', {});
    }
    handleReadClick(record) {
        this.gotoPage('/goodsControl/stages/readStages', record);
    }
    handleUqdateClick(record) {
        this.gotoPage('/goodsControl/stages/updateStages', record);
    }
    gotoPage = (path, record) => {
        const page = this.params.page;
        const paterPath = '/goodsControl/stages';
        const {
            channelCode,
            type,
            state,
            selectType,
            inputContent,
            startTime,
            endTime,
            updateStartTime,
            updateEndTime
        } = this.state;
        history.push(path, {
            record,
            paterPath,
            page,
            channelCode,
            type,
            state,
            selectType,
            inputContent,
            startTime,
            endTime,
            updateStartTime,
            updateEndTime
        });
    }
    renderAdvancedForm = () => {
        const { getFieldDecorator } = this.props.form;
        const { channelCode, type, state, startValue, endValue, selectType, inputContent, treeData, treeValue, queryButtonLoading, updateStartValue, updateEndValue } = this.state;
        const tProps = {
            treeData,
            value: treeValue,
            onChange: this.terrChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            maxTagCount: 3,
            searchPlaceholder: '全部分类',
            style: {
                width: '100%',
            },
        }
        return (
            <Form className="ant-advanced-search-form" >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道'>
                            {getFieldDecorator('渠道')(
                                <div >
                                    <div id='admc' style={{position: 'relative' }}>
                                            <Select
                                                style={{ width: '100%' }}
                                                value={channelCode}
                                                onChange={(value) => {this.setState({channelCode: value})}}
                                                getPopupContainer={() => document.getElementById('admc')}
                                            >
                                            <Option value=''>全部</Option>
                                            <Option value={1}>京东商城</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='类型'>
                            {getFieldDecorator('类型')(
                                <div>
                                    <div id='qdsp' style={{position: 'relative' }}>
                                            <Select
                                                className='select'
                                                value={type}
                                                style={{ width: '100%' }}
                                                onChange={(value) => {
                                                    this.setState({
                                                        type: value,
                                                    });
                                                    if (value === 1) {
                                                        this.setState({
                                                            selectType: 'containSkus'
                                                        })
                                                    } else if (value === 0) {
                                                        this.setState({
                                                            selectType: 'exceptSkus'
                                                        })
                                                    } else {
                                                        this.setState({
                                                            selectType: ''
                                                        })
                                                    }
                                                }}
                                                getPopupContainer={() => document.getElementById('qdsp')}
                                            >
                                            <Option value=''>全部</Option>
                                            <Option value={0}>分类</Option>
                                            <Option value={1}>单个/多个商品</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='分类'>
                            {getFieldDecorator('分类')(
                                <div>
                                    <div id='qsspfl' style={{position: 'relative' }}>
                                        <TreeSelect
                                            treeCheckStrictly={true}
                                            {...tProps}
                                            disabled={type === 1 ? true : false}
                                            getPopupContainer={() => document.getElementById('qsspfl')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='状态'>
                            {getFieldDecorator('状态')(
                                <div>
                                    <div id='zhuangtai' style={{position: 'relative' }}>
                                            <Select
                                                className='select'
                                                value={state}
                                                style={{ width: '100%' }}
                                                onChange={(value) => {this.setState({state: value})}}
                                                getPopupContainer={() => document.getElementById('zhuangtai')}
                                            >
                                            <Option value=''>全部</Option>
                                            <Option value={1}>已开启</Option>
                                            <Option value={0}>已关闭</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='设置时间'>
                            {getFieldDecorator('设置时间')(
                                <div>
                                    <div id='sjtbsj' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            onChange={this.handleDatePickerCreateChange}
                                            placeholder='选择开始日期'
                                            value={startValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('sjtbsj')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            disabledDate={this.disabledEndDate}
                                            onChange={this.handleDatePickerEndChange}
                                            placeholder='选择结束日期'
                                            value={endValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('sjtbsj')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='更新时间'>
                            {getFieldDecorator('更新时间')(
                                <div>
                                    <div id='sjtbsj' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            onChange={this.handleDatePickerUpdateChange}
                                            placeholder='选择开始日期'
                                            value={updateStartValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('sjtbsj')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            disabledDate={this.updateDisabledEndDate}
                                            onChange={this.handleDatePickerUpdateEndChange}
                                            placeholder='选择结束日期'
                                            value={updateEndValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('sjtbsj')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8} style={{display: type !== '' ? 'block' : 'none'}}>
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
                                            <Option style={{display: type === 1 || type === '' ? 'block' : 'none'}} value='containSkus'>包含spu</Option>
                                            <Option style={{display: type === 0 || type === '' ? 'block' : 'none'}} value='exceptSkus'>不包含spu</Option>
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
                                        icon='search'
                                        className='btn'
                                        onClick={this.handleQueryClick}
                                        loading={queryButtonLoading}
                                    >
                                        查询
                                    </Button>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { 
            dataSource,
            pagination
        } = this.state;
        const columns = this.state.columns.map((col) => {
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
        })
        
        return (
            <Warp >
                <Card bordered={false}>
                    {this.renderAdvancedForm()}
                    <OperationWarp>
                        <Button icon='plus' type='primary' onClick={this.createStages}>新增设置</Button>
                    </OperationWarp>
                    <Table
                        bordered
                        pagination={dataSource.length > 0 ? pagination : false}
                        dataSource={dataSource}
                        columns={columns}
                        style={{'overflowX': 'auto'}}
                    />
                </Card>
            </Warp>
        );
    }
}
export default connect(null, null)(Form.create({})(Stages));