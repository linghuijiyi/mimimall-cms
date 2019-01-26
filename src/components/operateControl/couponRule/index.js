import React, { Component } from 'react';
import { Warp, OperationWarp } from './style';
import { Select, Button, Input, Table, DatePicker, Icon, Tag, message, Row, Col, Card, Form, Popconfirm, Tooltip } from 'antd';
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
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const FormItem = Form.Item;
class CouponRule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '序号',
                    dataIndex: 'id',
                    key: 'id',
                    align: 'center',
                    sorter: (a, b) => a.id - b.id,
                },
                {   
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center',
                    render: (text, record) => {
                        return <div>{formatDateTime(record.createTime)}</div>;
                    }
                },
                {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                    align: 'center',
                    render: (text, record) => {
                        return <div>{formatDateTime(record.updateTime)}</div>;
                    }
                },
                {
                    title: '规则名称',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center',
                    width: 200,
                    render: (text, record) => {
                        return <div style={{maxHeight: '70px', overflowY: 'auto'}}>{record.name}</div>
                    }
                },
                {
                    title: '渠道',
                    dataIndex: 'channel',
                    key: 'channel',
                    align: 'center',
                    render: (text, record) => {
                        if (record.channelCode === '1') {
                            return <div>京东</div>;
                        } else if (record.channelCode === '') {
                            return <div>全部</div>;
                        }
                    }
                },
                {
                    title: '优惠券类型',
                    dataIndex: 'couponType',
                    key: 'couponType',
                    align: 'center',
                    render: (text, record) => {
                        if (record.type === 0) {
                            return <div>活动优惠券</div>;
                        } else if (record.type === 1) {
                            return <div>首单优惠券</div>;
                        } else if (record.type === 2) {
                            return <div>注册优惠券</div>;
                        }
                    }
                },
                {
                    title: '优惠形式',
                    dataIndex: 'discount',
                    key: 'discount',
                    align: 'center',
                    render: (text, record) => {
                        if (record.couponType === 0) {
                            return <div>折扣优惠</div>;
                        } else {
                            return <div>现金优惠</div>;
                        }
                    }
                },
                {
                    title: '优惠金额/折扣',
                    dataIndex: 'couponAmount',
                    key: 'couponAmount',
                    align: 'center',
                    render: (text, record) => {
                        if (record.couponType === 0) {
                            return <div>{record.couponAmount}折</div>;
                        } else {
                            return <div>{record.couponAmount}元</div>;
                        }
                    }
                },
                {
                    title: '发放状态',
                    dataIndex: 'grantState',
                    key: 'grantState',
                    align: 'center',
                    render: (text, record) => {
                        if (record.grantState === 0) {
                            return <div>未发放</div>;
                        } else {
                            return <div>已发放</div>;
                        }
                    }
                },
                {
                    title: '发放条数',
                    dataIndex: 'count',
                    key: 'count',
                    align: 'center',
                },
                {
                    title: '状态',    
                    dataIndex: 'state',
                    key: 'state',
                    align: 'center',
                    render: (text, record) => {
                        if (record.state === 1) {
                            return <Tag style={{background: 'rgb(135, 208, 104)', border: '1px solid rgb(135, 208, 104)', color: '#fff'}}>已开启</Tag>;
                        } else if (record.state === 0) {
                            return <Tag style={{background: 'red', border: '1px solid red', color: '#fff'}}>已关闭</Tag>;
                        }
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    align: 'center',
                    width: 320,
                    render: (text, record) => {
                        const btnStyle = {
                            minWidth: '85px',
                            margin: '0 5px 0 5px',
                        }
                        const editBtnStyle = {
                            minWidth: '85px',
                            margin: '0 5px 0 5px',
                            background: 'rgb(255, 183, 82)',
                            border: '1px solid rgb(255, 183, 82)'
                        }
                        const openBtnStyle = {
                            minWidth: '85px', margin: '0 5px 0 5px', display: record.state === 1 ? 'none' : 'block',
                            background: 'rgb(135, 208, 104)',
                            border: 'rgb(135, 208, 104)'
                        }
                        const closeBtnStyle = {
                            minWidth: '85px', margin: '0 5px 0 5px', display: record.state === 0 ? 'none' : 'block',
                            background: 'red',
                            border: 'red'
                        }
                        let disabled = false;
                        if (record.grantTime !== null && record.grantTime !== '' && record.grantTime !== undefined) {
                            if (record.type !== null && record.type !== '' && record.type !== undefined && record.type === 0) {
                                if (record.grantTime < new Date().getTime() && record.grantState !== 0) {
                                    disabled = true;
                                }
                            }
                        }
                        return (
                            <div style={{ display: 'flex' }}>
                                <Button
                                    type='primary'
                                    style={btnStyle}
                                    icon='eye'
                                    onClick={() => this.handleReadClick('/operateControl/couponRule/readCoupon', record.id)}
                                >
                                    查看
                                </Button>
                                {
                                    !disabled ? (
                                        <Button
                                            type='primary'  
                                            style={editBtnStyle}
                                            icon='book'
                                            onClick={() => this.handleReadClick('/operateControl/couponRule/updateCoupon', record.id)}
                                        >
                                            编辑
                                        </Button>
                                    ) : (
                                        <Tooltip placement='top' title='发送时间小于当前时间，不可编辑'>
                                            <Button
                                                type='primary'  
                                                style={editBtnStyle}
                                                icon='book'
                                                disabled={disabled}
                                            >
                                                编辑
                                            </Button>
                                        </Tooltip>
                                    )
                                }
                                
                                <Button
                                    type='primary'
                                    style={openBtnStyle}
                                    icon='unlock'
                                    onClick={() => this.handleToggleStateClick(record.id, 'market/coupon/validate')}
                                >
                                    开启
                                </Button>
                                <Popconfirm
                                    title='确认要关闭吗？'
                                    onConfirm={() => this.handleToggleStateClick(record.id, 'market/coupon/invalidate')}
                                    onCancel={() => {}}
                                >
                                    <Button
                                        type='primary'
                                        style={closeBtnStyle}
                                        icon='lock'
                                    >
                                        关闭
                                    </Button>
                                </Popconfirm> 
                            </div>
                        )
                    }
                }
            ],
            dataSource: [],
            createTimeStart: '',
            createTimeEnd: '',
            updateTimeStart: '',
            updateTimeEnd: '',
            createStartValue: null,
            createEndValue: null,
            updateStartValue: null,
            updateEndValue: null,
            channelCode: '',
            type: '',
            couponType: '',
            grantState: '',
            state: '',
            selectType: 'name',
            inputContent: '',
            loading: false
        }
        this.params = { page: 1 };
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['运营管理', '优惠券管理']));
        let data = this.props.location.query;
        if (data !== undefined) {
            const {
                page,
                createTimeStart,
                createTimeEnd,
                updateTimeStart,
                updateTimeEnd,
                channelCode,
                type,
                couponType,
                grantState,
                state,
                selectType,
                inputContent,
                expandForm
            } = data;
            this.params.page = page;
            this.setState({
                channelCode,
                type,
                couponType,
                grantState,
                state,
                selectType,
                inputContent,
                createTimeStart,
                createTimeEnd,
                updateTimeStart,
                updateTimeEnd,
                createStartValue: createTimeStart ? moment(createTimeStart, dateFormat) : null,
                createEndValue: createTimeEnd ? moment(createTimeEnd, dateFormat) : null,
                updateStartValue: updateTimeStart ? moment(updateTimeStart, dateFormat) : null,
                updateEndValue: updateTimeEnd ? moment(updateTimeEnd, dateFormat) : null,
                expandForm
            }, () => {
                this.requestCouponList();
            });
        } else {
            this.requestCouponList();
        }
    }
    /***********************获取优惠券列表********************/
    requestCouponList = (loading) => {
        const url = `${baseURL}market/coupon/list`;
        this.showAndHideLoading(true);
        if (loading) {
            this.params.page = 1;
            this.setState({ loading });
        }
        let _this = this;
        const {
            channelCode,
            type,
            couponType,
            grantState,
            state,
            createTimeStart,
            createTimeEnd,
            updateTimeStart,
            updateTimeEnd,
            selectType,
            inputContent
        } = this.state;
        const params = {
            pageNo: this.params.page,
            channelCode,
            type,
            couponType,
            grantState,
            state,
            createTimeStart,
            createTimeEnd,
            updateTimeStart,
            updateTimeEnd,
            selectType,
            inputContent
        }
        fatch(url, 'post', params, (err, state) => {
            message.error(err);
            this.showAndHideLoading(state);
            this.setState({loading: state});
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.page.result;
                if (result === null) {
                    this.setState({dataSource: []});
                    if (loading) {
                        this.setState({loading: !loading});
                        message.success(res.msg);
                    }
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        dataSource: result,
                        pagination: pagination(res.data.page, (current) => {
                            _this.params.page = current;
                            this.requestCouponList();
                        })
                    });
                    if (loading) {
                        message.success(res.msg);
                        this.setState({loading: !loading});
                    }
                }
                this.showAndHideLoading(false);
            } else {
                if (loading) this.setState({loading: !loading});
                message.success(res.msg);
                this.showAndHideLoading(false);
            }
        })
    }
    queryCouponList = (loading) => {
        this.requestCouponList(true);
    }
    /**********************设置时间值*************************/
    datePickerChange = (date, dateStr, timeName, timeValue) => {
        this.setState({[timeName]: dateStr, [timeValue]: date});
    }
    /************************关闭*****************************/
    handleToggleStateClick = (id, api) => {
        const url = `${baseURL}${api}`;
        fatch(url, 'post', { id }, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                message.success(res.msg);
                this.requestCouponList();
            } else {
                message.error(res.msg);
            }
        });
    }
    /************************新建*****************************/
    handleCreateClick = () => {
        this.gotoPath('/operateControl/couponRule/createCoupon');
    }
    /************************查看*****************************/
    handleReadClick = (path, id) => {
        this.gotoPath(path, id);
    }
    gotoPath = (path, id = undefined) => {
        const page = this.params.page;
        const {
            createTimeStart,
            createTimeEnd,
            updateTimeStart,
            updateTimeEnd,
            channelCode,
            type,
            couponType,
            grantState,
            state,
            selectType,
            inputContent,
            expandForm
        } = this.state;
        history.push(path, {
            page,
            id,
            createTimeStart,
            createTimeEnd,
            updateTimeStart,
            updateTimeEnd,
            channelCode,
            type,
            couponType,
            grantState,
            state,
            selectType,
            inputContent,
            expandForm
        });
    }
    renderAdvancedForm = () => {
        const { getFieldDecorator } = this.props.form;
        const {
            createStartValue,
            createEndValue,
            updateStartValue,
            updateEndValue,
            channelCode,
            type,
            couponType,
            grantState,
            state,
            selectType,
            inputContent,
            loading
        } = this.state;
        return (
            <Form className="ant-advanced-search-form">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道'>
                            {getFieldDecorator('渠道')(
                                <div>
                                    <div id='mgjc' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={channelCode}
                                            onChange={(value) => {this.setState({channelCode: value})}}
                                            getPopupContainer={() => document.getElementById('mgjc')}
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
                        <FormItem label='优惠券类型'>
                            {getFieldDecorator('优惠券类型')(
                                <div>
                                    <div id='mqdsp' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={type}
                                            onChange={(value) => {this.setState({type: value})}}
                                            getPopupContainer={() => document.getElementById('mqdsp')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={2}>注册优惠券</Option>
                                            <Option value={0}>活动优惠券</Option>
                                            <Option value={1}>首单优惠券</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='优惠形式'>
                            {getFieldDecorator('优惠形式')(
                                <div>
                                    <div id='mqdsp' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={couponType}
                                            onChange={(value) => {this.setState({couponType: value})}}
                                            getPopupContainer={() => document.getElementById('mqdsp')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={1}>现金优惠</Option>
                                            <Option value={0}>折扣优惠</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='发放状态'>
                            {getFieldDecorator('发放状态')(
                                <div>
                                    <div id='shzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={grantState}
                                            onChange={(value) => {this.setState({grantState: value})}}
                                            getPopupContainer={() => document.getElementById('shzt')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={1}>已发放</Option>
                                            <Option value={0}>未发放</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='状态'>
                            {getFieldDecorator('状态')(
                                <div>
                                    <div id='state_' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={state}
                                            onChange={(value) => {this.setState({state: value})}}
                                            getPopupContainer={() => document.getElementById('state_')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={1}>已启用</Option>
                                            <Option value={0}>已关闭</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='创建时间'>
                            {getFieldDecorator('创建时间')(
                                <div>
                                    <div id='sjtbsj' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择开始日期'
                                            showToday={false}
                                            value={createStartValue}
                                            format={dateFormat}
                                            onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'createTimeStart', 'createStartValue')}}
                                            getCalendarContainer={() => document.getElementById('sjtbsj')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择结束日期'
                                            showToday={false}
                                            value={createEndValue}
                                            format={dateFormat}
                                            onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'createTimeEnd', 'createEndValue')}}
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
                                    <div id='updateTime' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择开始日期'
                                            showToday={false}
                                            value={updateStartValue}
                                            format={dateFormat}
                                            onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'updateTimeStart', 'updateStartValue')}}
                                            getCalendarContainer={() => document.getElementById('updateTime')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            placeholder='选择结束日期'
                                            showToday={false}
                                            value={updateEndValue}
                                            format={dateFormat}
                                            onChange={(date, dateStrings) => {this.datePickerChange(date, dateStrings, 'updateTimeEnd', 'updateEndValue')}}
                                            getCalendarContainer={() => document.getElementById('updateTime')}
                                        />
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
                                            getPopupContainer={() => document.getElementById('gjc')}
                                        >
                                            <Option value='name'>规则名称</Option>
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
                                        icon='search'
                                        loading={loading}
                                        onClick={this.queryCouponList}
                                    >
                                        查询
                                    </Button>
                                    <Button
                                        className='btn'
                                        type='primary'
                                        icon='reload'
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
        const { channelCode, type, couponType, loading } = this.state;
        return (
            <Form className="ant-advanced-search-form" >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道'>
                            {getFieldDecorator('渠道')(
                                <div>
                                    <div id='mgjc' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={channelCode}
                                            onChange={(value) => {this.setState({channelCode: value})}}
                                            getPopupContainer={() => document.getElementById('mgjc')}
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
                        <FormItem label='优惠券类型'>
                            {getFieldDecorator('优惠券类型')(
                                <div>
                                    <div id='mqdsp' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={type}
                                            onChange={(value) => {this.setState({type: value})}}
                                            getPopupContainer={() => document.getElementById('mqdsp')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={2}>注册优惠券</Option>
                                            <Option value={0}>活动优惠券</Option>
                                            <Option value={1}>首单优惠券</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='优惠形式'>
                            {getFieldDecorator('优惠形式')(
                                <div>
                                    <div id='mqdsp' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={couponType}
                                            onChange={(value) => {this.setState({couponType: value})}}
                                            getPopupContainer={() => document.getElementById('mqdsp')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value={1}>现金优惠</Option>
                                            <Option value={0}>折扣优惠</Option>
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
                                        icon='search'
                                        loading={loading}
                                        onClick={this.queryCouponList}
                                    >
                                        查询
                                    </Button>
                                    <Button
                                        className='btn'
                                        type='primary'
                                        icon='reload'
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
    renderForm = () => {
        const { expandForm } = this.state;
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({ expandForm: !expandForm });
    }
    handleFormReset = () => {
        this.setState({
            createTimeStart: '',
            createTimeEnd: '',
            updateTimeStart: '',
            updateTimeEnd: '',
            createStartValue: null,
            createEndValue: null,
            updateStartValue: null,
            updateEndValue: null,
            channelCode: '',
            type: '',
            couponType: '',
            grantState: '',
            state: '',
            selectType: 'name',
            inputContent: '',
        });
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { dataSource, columns, pagination } = this.state;
        return (
            <Warp>
                <Card bordered={false}>
                    {this.renderForm()}
                    <OperationWarp>
                        <Button
                            type='primary'
                            icon='plus'
                            onClick={this.handleCreateClick}
                        >
                            新增规则设置
                        </Button>
                    </OperationWarp>
                    <Table
                        bordered
                        dataSource={dataSource}
                        pagination={dataSource.length > 0 ? pagination : false}
                        columns={columns}
                        style={{'overflowX': 'auto'}}
                    />
                </Card>
            </Warp>
        );
    }
}
export default connect(null, null)(Form.create({})(CouponRule));