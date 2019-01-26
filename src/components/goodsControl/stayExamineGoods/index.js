import React, { Component } from 'react';
import { 
    Warp, 
    OperationWarp, 
    Name, 
    Options,
    SynchroView,
    Text,
    View
} from './../nothingSellGoods/style';
import { Select, Button, Input, Table, Modal, Checkbox, DatePicker, Icon, Tag, Cascader, message, Spin, Row, Col, Card, Form } from 'antd';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import history from './../../../history';
import moment from 'moment';
import fatch from './../../../common/js/fatch';
import Storage from './../../../common/js/storage';
import pagination from './../../../common/js/pagination';
import formatDateTime from './../../../common/js/formatDateTime';
import baseURL from './../../../common/js/baseURL';
import { regEn, regCn, ERR_CODE } from './../../../common/js/regExp';
import getTypeList from './../../../common/js/getTypeList';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const FormItem = Form.Item;

class StayExamineGoods extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '数据同步时间',
                dataIndex: 'createTime',
                align: 'center',
                render: (text, record) => (<div>{formatDateTime(record.createTime)}</div>)
            },
            {   
                title: '渠道名称',
                dataIndex: 'channelName',
                align: 'center',
                render: (text, record) => (<div>{record.goodsChannel.channelName}</div>)
            },
            {
                title: 'SKU编码',
                dataIndex: 'sysSku',
                align: 'center',
            },
            {
                title: '商品名称',
                dataIndex: 'name',
                align: 'center',
                width: 200,
            },
            {
                title: '品牌名称',
                dataIndex: 'brandName',
                align: 'center',
                render: (text, record) => (<div>{record.brandName}</div>)
            },
            {
                title: '进货价',
                dataIndex: 'jdPrice',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.jdPrice}元</div>;
                }
            },
            {
                title: '渠道商品状态',
                dataIndex: 'state',
                align: 'center',
                render: (text, record) => {
                    if (record.state === 0) return <Tag color="#FF0000">下架</Tag>;
                    else return <Tag color="#87d068">上架</Tag>;
                }
            },
            {
                title: '商品状态',
                dataIndex: 'sysState',
                align: 'center',
                render: (text, record) => (<Tag color="#f50">未上架</Tag>)
            },
            {
                title: '审核结果',
                dataIndex: 'sysStat1e',
                align: 'center',
                render: (text, record) => (<Tag color="#f50">未审核</Tag>)
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
                                <Button
                                    type='primary'
                                    style={{background: 'rgb(255, 183, 82)', border: '1px solid rgb(255, 183, 82)'}}
                                    onClick={this.handleApplyAudit.bind(this, record)}
                                >
                                    <Icon><i className='iconfont icon-shenqingshenhe'></i></Icon>
                                    审核
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
            // 查询数据
            channelCode: '1',
            state: '',
            inputContent: '',
            selectType: 'sysSku',
            maxPrice: '',
            minPrice: '',
            price: '',
            createStartTime: '',
            createEndTime: '',
            startValue: null,
            endValue: null,
            category: '',
            options: [],
            caseaderValue: [],
            queryButtonLoading: false,
            // 通过审核
            auditsuccessVisible: false,
            auditsuccessText: '',
            auditsuccessSyksu: [],
            auditsuccessConfirmLoading: false,
            // 不通过审核
            auditfailVisible: false,
            auditfailConfirmLoading: false,
            // 清空表格选中的数据
            selectedRowKeys: [],
            // 页面权限
            list: false,
            button: false,
            batchGoods: false
        };
        this.params = { page: 1 };
    }
    componentWillMount() {
        getTypeList().then((options) => (this.setState({ options })));
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '待审核商品']));
        let data = this.props.location.query;
        if (data !== undefined) {
            const {
                page,
                channelCode,
                state,
                price,
                createStartTime,
                createEndTime,
                selectType,
                inputContent
            } = data;
            this.params.page = page;
            if (price !== '') this.handleFormatPriceChange(price);
            this.setState({
                channelCode,
                state,
                createStartTime,
                createEndTime,
                selectType,
                inputContent,
                startValue: createStartTime ? moment(createStartTime, dateFormat) : null,
                endValue: createEndTime ? moment(createEndTime, dateFormat) : null,
            }, () => {
                this.requestList();
            });
        } else {
            this.requestList();
        }
    }
    /*********************获取数据列表********************/
    requestList = (queryButtonLoading) => {
        fatch(`${baseURL}account/getBattenList`, 'post', {managerId: Storage.get('userinfo').id}, (err, state) => {

        }).then((res) => {
            if (res.code === ERR_CODE) {
                const data = res.data;
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].name === '批量审核商品') {
                            this.setState({batchGoods: true});
                        }
                        this.setState({button: true});
                    }
                }
            } else {
                this.setState({button: true});
            }
        });
        if (queryButtonLoading) {
            this.params.page = 1;
            this.setState({queryButtonLoading: true});
        }
        this.showAndHideLoading(true);
        let _this = this;
        const url =  `${baseURL}goods/auditapply/list`;
        const { 
            channelCode, 
            state, 
            inputContent, 
            selectType,
            maxPrice,
            minPrice,
            createStartTime,
            createEndTime,
            category
        } = this.state;
        const params = {
            pageNo: this.params.page,
            channelCode, 
            state,
            inputContent,
            selectType,
            maxPrice,
            minPrice,
            createStartTime,
            createEndTime,
            category
        }
        fatch(url, 'post', params, (err, state) => {
            message.error(err);
            this.setState({queryButtonLoading: state});
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === ERR_CODE) {
                const result = res.data.page.result;
                this.setState({list: true});
                if (result === null) {
                    this.setState({dataSource: []});
                    this.showAndHideLoading(false);
                    if (queryButtonLoading) {
                        this.setState({queryButtonLoading: false});
                        message.success(res.msg);
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
                    this.showAndHideLoading(false);
                    if (queryButtonLoading) {
                        this.setState({queryButtonLoading: false});
                        message.success(res.msg);
                    }
                }
            } else {
                this.setState({queryButtonLoading: false});
                this.showAndHideLoading(false);
                message.error(res.msg);
            }
        });
    }
    /***********************查询*************************/
    handleQueryClick = () => {
        const { inputContent } = this.state;
        if (regEn.test(inputContent) || regCn.test(inputContent)) {
            message.warning('关键字中不能包含特殊字符');
            return;
        }
        this.requestList(true);
    }
    /*********************格式化金额*********************/
    handleFormatPriceChange = (price) => {
        if (price === '') {
            this.setState({
                price,
                minPrice: '',
                maxPrice: ''
            });
        } else {
            let priceList = price.split('-');
            this.setState({
                price,
                minPrice: parseInt(priceList[0]),
                maxPrice: parseInt(priceList[1])
            });
        }
    }
     /*************************获取分类ID***************************/
    handleCascaderChange = (value, selectedOptions) => {
        if (selectedOptions.length === 0) this.setState({category: '', caseaderValue: []});
        else this.setState({category: selectedOptions[selectedOptions.length - 1].categoryId, caseaderValue: value});
    }
    /**********************获取选择日期的值*************************/
    handleDatePickerCreateChange = (value, dateString) => {
        this.setState({createStartTime: dateString});
        this.timeChange('startValue', value);
    }
    handleDatePickerEndChange = (value, dateString) => {
        this.setState({createEndTime: dateString});
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
    /**********************通过审核***********************/
    handleExamineClick = () => {
        const { auditsuccessSyksu } = this.state;
        if (auditsuccessSyksu.length === 0) this.setState({auditsuccessText: '请选择需要审核的数据后申请审核。'});
        else this.setState({auditsuccessText: '是否确认提交审核， 并上架？'});
        this.setState({auditsuccessVisible: true});
    }
    handleAuditsSuccessOk = () => {
        const { auditsuccessSyksu } = this.state;
        if (auditsuccessSyksu.length === 0) {
            this.setState({auditsuccessVisible: false});
        } else {
            this.setState({auditsuccessConfirmLoading: true});
            const url = `${baseURL}goods/auditapply/auditsuccess`;
            fatch(url, 'post', {sysSkus: auditsuccessSyksu}, (err, state) => {
                message.info(err);
                this.setState({auditsuccessConfirmLoading: state});
            }).then((res) => {
                if (res.code === ERR_CODE) {
                    this.setState({
                        auditsuccessVisible: false,
                        auditsuccessConfirmLoading: false,
                        auditsuccessSyksu: [],
                        selectedRowKeys: [],
                    }, () => {
                        message.info(res.msg);
                        this.requestList();
                    });
                } else {
                    message.info(res.msg);
                    this.setState({auditsuccessConfirmLoading: false});
                }
            });
        }
    }
    handleAuditsSuccessCancel = () => {
        this.setState({auditsuccessVisible: false});
    }
    /*************************不通过审核*******************/
    handleAuditfailClick = () => {
        const { auditsuccessSyksu } = this.state;
        if (auditsuccessSyksu.length === 0) this.setState({auditsuccessText: '请选择需要审核的数据后申请审核。'});
        else this.setState({auditsuccessText: '是否确认提交审核？'});
        this.setState({auditfailVisible: true});
    }
    handleAuditfailOk = () => {
        const { auditsuccessSyksu } = this.state;
        if (auditsuccessSyksu.length === 0) {
            this.setState({auditfailVisible: false});
        } else {
            this.setState({auditfailConfirmLoading: true});
            const url = `${baseURL}goods/auditapply/auditfail`;
            fatch(url, 'post', {sysSkus: auditsuccessSyksu}, (err, state) => {
                message.info(err);
                this.setState({auditfailConfirmLoading: state});
            }).then((res) => {
                if (res.code === ERR_CODE) {
                    this.setState({
                        auditfailVisible: false,
                        auditfailConfirmLoading: false,
                        auditsuccessSyksu: [],
                        selectedRowKeys: [],
                    }, () => {
                        message.info(res.msg);
                        this.requestList();
                    });
                } else {
                    message.info(res.msg);
                    this.setState({auditfailConfirmLoading: false});
                }
            });
        }
    }
    handleAuditfailCancel = () => {
        this.setState({auditfailVisible: false});
    }
    /**********************查看详情***********************/
    handleSeeClick(record) {
        this.gotoPage('/goodsControl/lookGoods', record);
    }
    /*********************申请审核***********************/
    handleApplyAudit(record) {
        const page = this.params.page;
        const paterPath = '/goodsControl/stayExamineGoods';
        const path = '/goodsControl/stayExamineGoods/applyAudit';
        const {
            channelCode,
            state,
            price,
            createStartTime,
            createEndTime,
            selectType,
            inputContent
        } = this.state;
        history.push(path, {
            page,
            paterPath,
            record,
            channelCode,
            state,
            price,
            createStartTime,
            createEndTime,
            selectType,
            inputContent,
        });
    }
    gotoPage = (path, record) => {
        const page = this.params.page;
        const paterPath = '/goodsControl/stayExamineGoods';
        const breadcrumb = ['商品管理', '待审核商品'];
        const {
            channelCode,
            state,
            price,
            createStartTime,
            createEndTime,
            selectType,
            inputContent,
        } = this.state;
        history.push(path, {
            record, 
            page,
            paterPath,
            breadcrumb,
            channelCode,
            state,
            price,
            createStartTime,
            createEndTime,
            selectType,
            inputContent,
        });
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    renderForm = () => {
        const { expandForm } = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({expandForm: !expandForm});
    }
    handleFormReset = () => {
        this.setState({
            channelCode: '1',
            state: '',
            inputContent: '',
            selectType: 'sysSku',
            maxPrice: '',
            minPrice: '',
            price: '',
            createStartTime: '',
            createEndTime: '',
            startValue: null,
            endValue: null,
            category: '',
            caseaderValue: []
        });
    }
    renderAdvancedForm = () => {
        const { getFieldDecorator } = this.props.form;
        const { 
            channelCode, 
            state, 
            inputContent, 
            selectType, 
            price,
            startValue,
            endValue,
            options,
            caseaderValue
        } = this.state;
        return (
            <Form className="ant-advanced-search-form" >
                <Row gutter={{ md: 8, lg: 12, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道名称'>
                            {getFieldDecorator('渠道名称')(
                                <div>
                                    <div id='qdmc' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={channelCode}
                                            onChange={(value) => {this.setState({channelCode: value})}}
                                            getPopupContainer={() => document.getElementById('qdmc')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>京东商城</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道商品状态'>
                            {getFieldDecorator('渠道商品状态')(
                                <div>
                                    <div id='qdshpzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={state}
                                            onChange={(value) => {this.setState({state: value})}}
                                            getPopupContainer={() => document.getElementById('qdshpzt')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>上架</Option>
                                            <Option value='0'>下架</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道商品分类'>
                            {getFieldDecorator('渠道商品分类')(
                                <div>
                                    <div id='qdshpfl' style={{position: 'relative' }}>
                                        <Cascader
                                            style={{width: '100%'}}
                                            value={caseaderValue}
                                            placeholder='选择渠道商品分类'
                                            options={options}
                                            onChange={this.handleCascaderChange}
                                            getPopupContainer={() => document.getElementById('qdshpfl')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='进货价范围'>
                            {getFieldDecorator('进货价范围')(
                                <div>
                                    <div id='jhj' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={price}
                                            onChange={(value) => {this.handleFormatPriceChange(value)}}
                                            getPopupContainer={() => document.getElementById('jhj')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1-99'>1-99</Option>
                                            <Option value='100-999'>100-999</Option>
                                            <Option value='1000-9999'>1000-9999</Option>
                                            <Option value='10000-99999'>10000-99999</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='数据同步时间'>
                            {getFieldDecorator('数据同步时间')(
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
                                            <Option value='sysSku'>渠道SKU编码</Option>
                                            <Option value='name'>渠道商品名称</Option>
                                            <Option value='brandName'>品牌</Option>
                                            <Option value='sku'>SKU编码</Option>
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
            channelCode, 
            state, 
            options,
            caseaderValue
        } = this.state;
        return (
            <Form className="ant-advanced-search-form" >
                <Row gutter={{ md: 8, lg: 12, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道名称'>
                            {getFieldDecorator('渠道名称')(
                                <div>
                                    <div id='mqdmc' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={channelCode}
                                            onChange={(value) => {this.setState({channelCode: value})}}
                                            getPopupContainer={() => document.getElementById('mqdmc')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>京东商城</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道商品状态'>
                            {getFieldDecorator('渠道商品状态')(
                                <div>
                                    <div id='mqdspzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={state}
                                            onChange={(value) => {this.setState({state: value})}}
                                            getPopupContainer={() => document.getElementById('mqdspzt')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>上架</Option>
                                            <Option value='0'>下架</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道商品分类'>
                            {getFieldDecorator('渠道商品分类')(
                                <div>
                                    <div id='mqdspfl' style={{position: 'relative' }}>
                                        <Cascader
                                            style={{width: '100%'}}
                                            value={caseaderValue}
                                            placeholder='选择渠道商品分类'
                                            options={options}
                                            onChange={this.handleCascaderChange}
                                            getPopupContainer={() => document.getElementById('mqdspfl')}
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
    render() {
        const { 
            dataSource, 
            auditsuccessVisible,
            pagination,
            auditsuccessText,
            auditsuccessConfirmLoading,
            auditfailVisible,
            auditfailConfirmLoading,
            selectedRowKeys,
            list,
            button,
            batchGoods
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
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                if (selectedRows.length !== 0) {
                    let selectedIdList = [];
                    selectedRows.map((item) => (selectedIdList.push(item.sysSku)));
                    this.setState({auditsuccessSyksu: selectedIdList, selectedRowKeys: selectedRowKeys});
                } else {
                    this.setState({auditsuccessSyksu: [], selectedRowKeys: []});
                }
            }
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Warp style={{display: list && button ? 'block' : 'none'}}>
                <Card bordered={false} style={{height: '100%'}}>
                    {this.renderForm()}
                    <OperationWarp>
                        <Button
                            type='primary'
                            style={{display: batchGoods ? 'block' : 'none'}}
                            onClick={this.handleExamineClick}
                        > 
                            批量审核商品
                        </Button>
                    </OperationWarp>
                    <Table
                        bordered
                        pagination={dataSource.length > 0 ? pagination : false}
                        dataSource={dataSource}
                        rowSelection={rowSelection}
                        columns={columns}
                        style={{'overflowX': 'auto'}}
                    />
                </Card>
                
                {/*通过审核*/}
                <Modal
                    title='通过审核'
                    width={600}
                    closable={false}
                    confirmLoading={auditsuccessConfirmLoading}
                    visible={auditsuccessVisible}
                    onOk={this.handleAuditsSuccessOk}
                    onCancel={this.handleAuditsSuccessCancel}
                >
                    {auditsuccessText}
                </Modal>
                {/*不通过审核*/}
                <Modal
                    title='不通过审核'
                    width={600}
                    closable={false}
                    confirmLoading={auditfailConfirmLoading}
                    visible={auditfailVisible}
                    onOk={this.handleAuditfailOk}
                    onCancel={this.handleAuditfailCancel}
                >
                    {auditsuccessText}
                </Modal>
            </Warp>
        );
    }
}
export default connect(null, null)(Form.create({})(StayExamineGoods));