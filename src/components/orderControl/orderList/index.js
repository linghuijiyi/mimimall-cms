import React, { Component } from 'react';
import {
    Warp,
    QueryBox,
    QueryInput,
    QueryItem,
    QyeryTitle,
    QueryButton,
    Keyword,
    OperationWarp,
    Name,
    CreateItem,
    Options,
    SynchroView,
    Text,
    View
} from './style';
import { Select, Button, Input, Table, Modal, Checkbox, DatePicker, Icon, Cascader, message, Spin, Radio, Row, Col, Card, Form } from 'antd';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import history from './../../../history';
import moment from 'moment';
import fatch from './../../../common/js/fatch';
import pagination from './../../../common/js/pagination';
import formatDateTime from './../../../common/js/formatDateTime';
import baseURL from './../../../common/js/baseURL';
import { regEn, regCn } from './../../../common/js/regExp';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
let userTitle = '';

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '订单ID',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '下单时间',
                dataIndex: 'createTime',
                align: 'center',
                render: (text, record) => (<div>{formatDateTime(record.createTime)}</div>)
            },
            {
                title: '付款时间',
                dataIndex: 'finishTime',
                align: 'center',
                render: (text, record) => {
                    if (record.transationRecord !== null && record.transationRecord !== undefined) {
                        return <div>{formatDateTime(record.transationRecord.finishTime)}</div>;
                    }
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
                render: (text, record) => {
                    return <div>{record.goodsTotalPrice}元</div>;
                }
            },
            {
                title: '运费（元）',
                dataIndex: 'freight',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.freight}元</div>;
                }
            },
            {
                title: '订单总金额（元）',
                dataIndex: 'orderPrice',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.orderPrice}元</div>;
                }
            },
            {
                title: '订单状态',
                dataIndex: 'orderState',
                align: 'center',
                render: (text, record) => {
                    if (record.orderState === null || record.orderState === undefined) {
                        return <div>查询失败</div>;
                    } else if (record.orderState === 0) {
                        return <div>待支付</div>;
                    } else if (record.orderState === 1) {
                        return <div>已支付</div>;
                    } else if (record.orderState === 2) {
                        return <div>已取消</div>;
                    } else if (record.orderState === 3) {
                        return <div>已发货</div>;
                    } else if (record.orderState === 4) {
                        return <div>已签收</div>;
                    } else if (record.orderState === 5) {
                        return <div>已拒收</div>;
                    } else if (record.orderState === 6) {
                        return <div>已完成(确认收货)</div>;
                    }
                }
            },
            {
                title: '支付方式',
                dataIndex: 'payType',
                align: 'center',
                render: (text, record) => {
                    if (record.transationRecord !== null && record.transationRecord !== undefined) {
                        if (record.transationRecord.payType === 0) {
                            return <div>支付宝</div>;
                        } else if (record.transationRecord.payType === 1) {
                            return <div>易宝支付</div>;
                        } else if (record.transationRecord.payType === 2) {
                            return <div>京东支付</div>;
                        } else if (record.transationRecord.payType === 3) {
                            return <div>微信支付</div>;
                        }
                    }
                }
            },
            {
                title: '渠道名称',
                dataIndex: 'channelCode',
                align: 'center',
                render: (text, record) => {
                    if (record.channelCode === '1') {
                        return <div>京东</div>;
                    } else {
                        return <div>查询失败</div>;
                    }
                }
            },
            {
                title: '收货人手机号',
                dataIndex: 'shr',
                align: 'center',
                render: (text, record) => {
                    if (record.userAddress !== null && record.userAddress !== undefined) {
                        if (userTitle === 'userName') {
                            return <div>{record.userAddress.userName}</div>;
                        } else if (userTitle === 'phone') {
                            return <div>{record.userInfo.phone}</div>;
                        } else if (userTitle === 'userPhone' || userTitle === '') {
                            return <div>{record.userAddress.userPhone}</div>;
                        }
                    } else {
                        return <div></div>;
                    }
                }
            },
            {
                title: '售后',
                dataIndex: 'ifAFS',
                align: 'center',
                render: (text, record) => {
                    if (record.ifAFS === null || record.ifAFS === 'null') {
                        return <div>无</div>;
                    } else {
                        return <div>有</div>;
                    }
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
                                    查看
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
            loading: false,
            // 查询数据
            startTime: '',
            endTime: '',
            startValue: null,
            endValue: null,
            queryButtonLoading: false,
            state: '',
            channel: '全部',
            orderId: '',
            payType: '',
            selectType: '',
            options: '',
            caseaderValue: [],
            category: '',
            inputContent: '',
            ifafs: ''
        };
        this.params = { page: 1 };
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['订单管理', '订单列表']));
        let data = this.props.location.query;
        if (data !== undefined) {
            const {
                page,
                startTime,
                endTime,
                state,
                orderId,
                payType,
                category,
                selectType, 
                inputContent,
                defaultValue,
                ifafs
            } = data;
            this.params.page = page;
            this.setState({
                startTime,
                endTime,
                state,
                orderId,
                payType,
                category,
                selectType, 
                inputContent,
                defaultValue,
                ifafs,
                startValue: startTime ? moment(startTime, dateFormat) : null,
                endValue: startTime ? moment(endTime, dateFormat) : null,
            }, () => {
                this.getTypeList();
                this.requestList();
            });
        } else {
            this.getTypeList();
            this.requestList();
        }
    }
    /*********************获取数据列表********************/
    requestList = (queryButtonLoading) => {
        if (queryButtonLoading) {
            this.setState({queryButtonLoading: true});
            this.params.page = 1;
        }
        this.showAndHideLoading(true);
        const url = `${baseURL}order/info/list`;
        const { startTime, endTime, state, orderId, payType, category, selectType, inputContent, ifafs } = this.state;
        const params = {
            pageNo: this.params.page,
            startTime,
            endTime,
            state,
            orderId,
            payType,
            category,
            selectType, 
            inputContent,
            ifafs
        }
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.warning(err);
            this.setState({queryButtonLoading: state});
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.orders;
                if (result === null) {
                    this.showAndHideLoading(false);
                    this.setState({dataSource: []});
                    if (queryButtonLoading) {
                        this.setState({queryButtonLoading: false});
                        this.showAndHideLoading(false);
                        message.info(res.msg);
                    }
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        dataSource: result,
                        pagination: pagination(res.data.page, (current) => {
                            _this.params.page = current;
                            this.requestList();
                        })
                    });
                    userTitle = res.data.condition.selectType;
                    this.showAndHideLoading(false);
                    if (queryButtonLoading) {
                        this.setState({queryButtonLoading: false});
                        message.success(res.msg);
                    }
                }
            } else {
                this.showAndHideLoading(false);
                this.setState({queryButtonLoading: false});
                message.info(res.msg);
            }
        });
    }
    /***********************查询*************************/
    handleQueryClick = () => {
        this.requestList(true);
    }
    /*********************获取分类列表********************/
    getTypeList = () => {
        const url =  `${baseURL}category/all/list`;
        fatch(url, 'post', {}, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                let result = this.handleFormatTypeList(res.data);
                this.setState({options: result});
            } else {
                message.info(res.msg);
            }
        });
    }
    /**********************格式化分类数据**********************/
    handleFormatTypeList = (data) => {
        return data.map((item) => {
            item.value = item.name;
            item.label = item.name;
            item.children = item.thirdCategoryList;
            if (item.thirdCategoryList !== null) this.handleFormatTypeList(item.thirdCategoryList);
            return item;
        });
    }
    /*************************获取分类ID***************************/
    handleCascaderChange = (value, selectedOptions) => {
        if (selectedOptions.length === 0) this.setState({category: '', caseaderValue: []});
        else this.setState({category: selectedOptions[selectedOptions.length - 1].categoryId, caseaderValue: value});
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
    timeChange = (field, value) => this.setState({[field]: value});
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }
    /**********************查看详情***********************/
    handleSeeClick(record) {
        const path = '/orderControl/goodsInfo';
        const paterPath = '/orderControl/orderList';
        const breadcrumb = ['订单管理', '订单列表'];
        const page = this.params.page;
        const { 
            startTime, 
            endTime, 
            state, 
            orderId, 
            payType, 
            category, 
            selectType, 
            inputContent,
            defaultValue,
            ifafs
        } = this.state;
        history.push(path, { 
            record, 
            page,
            paterPath, 
            startTime, 
            endTime, 
            state, 
            orderId, 
            payType, 
            category, 
            selectType, 
            inputContent,
            defaultValue,
            breadcrumb,
            ifafs
        });
    }/******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    /*******************************导出表格*************************/
    handleExportTable = () => {
        const { startTime, endTime, state, orderId, payType, category, selectType, inputContent } = this.state;
        window.location = `
            ${baseURL}order/info/exportorders?pageNo=${this.params.page}&startTime=${startTime}&endTime=${endTime}&state=${state}&orderId=${orderId}&payType=${payType}&category=${category}&selectType=${selectType}&inputContent=${inputContent}
        `;
    }
    renderAdvancedForm = () => {
        const { getFieldDecorator } = this.props.form;
        const {
            startValue,
            endValue,
            state,
            channel,
            orderId,
            payType,
            selectType,
            options,
            caseaderValue,
            inputContent,
            ifafs
        } = this.state;
        return (
            <Form className="ant-advanced-search-form">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='下单时间'>
                            {getFieldDecorator('下单时间')(
                                <div>
                                    <div id='xdsj' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            onChange={this.handleDatePickerCreateChange}
                                            placeholder='选择开始日期'
                                            value={startValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xdsj')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            disabledDate={this.disabledEndDate}
                                            onChange={this.handleDatePickerEndChange}
                                            placeholder='选择结束日期'
                                            value={endValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xdsj')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='订单状态'>
                            {getFieldDecorator('订单状态')(
                                <div>
                                    <div id='ddzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={state}
                                            onChange={(value) => {this.setState({state: value})}}
                                            getPopupContainer={() => document.getElementById('ddzt')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='0'>待支付</Option>
                                            <Option value='1'>已支付</Option>
                                            <Option value='2'>已取消</Option>
                                            <Option value='3'>已发货</Option>
                                            <Option value='4'>已签收</Option>
                                            <Option value='5'>已拒收</Option>
                                            <Option value='6'>已完成(确认收货)</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道筛选'>
                            {getFieldDecorator('渠道筛选')(
                                <div>
                                    <div id='qdsx' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={channel}
                                            onChange={(value) => {this.setState({channel: value})}}
                                            getPopupContainer={() => document.getElementById('qdsx')}
                                        >
                                            <Option value='全部'>全部</Option>
                                            <Option value='京东'>京东</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='是否售后'>
                            {getFieldDecorator('是否售后')(
                                <div>
                                    <div id='ifafs' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={ifafs}
                                            onChange={(value) => {this.setState({ifafs: value})}}
                                            getPopupContainer={() => document.getElementById('ifafs')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>是</Option>
                                            <Option value='0'>否</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='支付方式'>
                            {getFieldDecorator('支付方式')(
                                <div>
                                    <div id='zffs' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={payType}
                                            onChange={(value) => {this.setState({payType: value})}}
                                            getPopupContainer={() => document.getElementById('zffs')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>易宝支付</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='商品类别'>
                            {getFieldDecorator('商品类别')(
                                <div>
                                    <div id='splb' style={{position: 'relative' }}>
                                        <Cascader
                                            style={{width: '100%'}}
                                            placeholder='选择渠道商品分类'
                                            value={caseaderValue}
                                            options={options}
                                            onChange={this.handleCascaderChange}
                                            getPopupContainer={() => document.getElementById('splb')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='订单编号'>
                            {getFieldDecorator('订单编号')(
                                <div>
                                    <div>
                                        <Input
                                            style={{ width: '100%' }}
                                            placeholder='请输入订单编号'
                                            value={orderId} 
                                            onChange={(e) => {this.setState({orderId: e.target.value})}} 
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
                                            onChange={(value) => {this.setState({selectType: value})}}
                                            getPopupContainer={() => document.getElementById('gjc')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='userPhone'>收货人手机号</Option>
                                            <Option value='userName'>收货人姓名</Option>
                                            <Option value='phone'>帐号手机号</Option>
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
                                        onClick={this.handleQueryClick}
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
            startValue,
            endValue,
            state,
            channel,
        } = this.state;
        return (
            <Form className="ant-advanced-search-form">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='下单时间'>
                            {getFieldDecorator('下单时间')(
                                <div>
                                    <div id='xdsj' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            onChange={this.handleDatePickerCreateChange}
                                            placeholder='选择开始日期'
                                            value={startValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xdsj')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            disabledDate={this.disabledEndDate}
                                            onChange={this.handleDatePickerEndChange}
                                            placeholder='选择结束日期'
                                            value={endValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('xdsj')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='订单状态'>
                            {getFieldDecorator('订单状态')(
                                <div>
                                    <div id='ddzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={state}
                                            onChange={(value) => {this.setState({state: value})}}
                                            getPopupContainer={() => document.getElementById('ddzt')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='0'>待支付</Option>
                                            <Option value='1'>已支付</Option>
                                            <Option value='2'>已取消</Option>
                                            <Option value='3'>已发货</Option>
                                            <Option value='4'>已签收</Option>
                                            <Option value='5'>已拒收</Option>
                                            <Option value='6'>已完成(确认收货)</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道筛选'>
                            {getFieldDecorator('渠道筛选')(
                                <div>
                                    <div id='qdsx' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={channel}
                                            onChange={(value) => {this.setState({channel: value})}}
                                            getPopupContainer={() => document.getElementById('qdsx')}
                                        >
                                            <Option value='全部'>全部</Option>
                                            <Option value='京东'>京东</Option>
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
                                        onClick={this.handleQueryClick}
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
        this.setState({
            startTime: '',
            endTime: '',
            startValue: null,
            endValue: null,
            state: '',
            channel: '全部',
            orderId: '',
            payType: '',
            selectType: '',
            category: '',
            caseaderValue: [],
            inputContent: '',
        })
    }
    renderForm = () => {
        const { expandForm } = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({expandForm: !expandForm});
    }
    render() {
        const {
            dataSource,
            pagination,
        } = this.state;
        let user = this.columns[this.columns.length - 3];
        if (userTitle === 'userName') {
            user.title = '收货人姓名';
        } else if (userTitle == 'phone') {
            user.title = '帐号手机号';
        } else if (userTitle === 'userPhone' || userTitle === '') {
            user.title = '收货人手机号';
        }
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => {
                    return {
                        record,
                        editable: col.editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                    }
                },
            }
        })
        return (
            <Warp>
                <Card bordered={false}>
                    {this.renderForm()}
                    <OperationWarp>
                        <Button type='primary' onClick={this.handleExportTable}>导出Excel</Button>
                    </OperationWarp>
                    <Spin size='large' spinning={false}>
                        <Table
                            bordered
                            pagination={dataSource.length > 0 ? pagination : false}
                            dataSource={dataSource}
                            columns={dataSource.length > 0 ? columns : null}
                            style={{'overflowX': 'auto'}}
                        />
                    </Spin>
                </Card>
            </Warp>
        );
    }
}
export default connect(null, null)(Form.create({})(OrderList));