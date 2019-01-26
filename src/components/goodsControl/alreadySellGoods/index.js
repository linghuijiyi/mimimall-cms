import React, { Component } from 'react';
import { 
    Warp, 
    OperationWarp, 
    Name, 
    CreateItem, 
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
import pagination from './../../../common/js/pagination';
import formatDateTime from './../../../common/js/formatDateTime';
import baseURL from './../../../common/js/baseURL';
import getTypeList from './../../../common/js/getTypeList';
import Storage from './../../../common/js/storage';
import { regEn, regCn, ERR_CODE } from './../../../common/js/regExp';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const FormItem = Form.Item;

class AlreadySellGoods extends Component {
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
                title: '上架时间',
                dataIndex: 'shelfTime',
                align: 'center',
                render: (text, record) => (<div>{formatDateTime(record.shelfTime)}</div>)
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
                render: (text, record) => (<div>{record.jdPrice}元</div>)
            },
            {
                title: '销售价',
                dataIndex: 'price',
                align: 'center',
                render: (text, record) => (<div>{record.price}元</div>)
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
                render: (text, record) => (<Tag color="#87d068">上架</Tag>)
            },
            {
                title: '审核结果',
                dataIndex: 'sysStat1e',
                align: 'center',
                render: (text, record) => (<Tag color="#87d068">审核成功</Tag>)
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                width: 280,
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
                                    下架
                                </Button>
                            </Options>
                        ) : null
                    );
                },
            }
        ];

        this.state = {
            expandForm: false,
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
            caseaderValue: [],
            shelfStartTime: '',
            shelfEndTime: '',
            shelStartValue: null,
            shelEndValue: null,
            options: [],
            queryButtonLoading: false,
            dataSource: [],
            loading: false,
            // 审核
            offshelfVisible: false,
            offshelfConfirmLoading: false,
            offshelfText: '',
            offshelfSysSKu: [],
            // 清空表格选中的数据
            selectedRowKeys: [],
            // 页面权限
            batchOnsale: false,
            list: false,
            button: false
        };
        this.params = { page: 1 };
    }
    componentWillMount() {
        getTypeList().then((options) => (this.setState({ options })));
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '已上架商品']));
        let data = this.props.location.query;
        if (data !== undefined) {
            const {
                page,
                channelCode,
                state,
                createStartTime,
                createEndTime,
                shelfStartTime,
                shelfEndTime,
                selectType,
                inputContent,
                price
            } = data;
            this.params.page = page;
            if (price !== '') this.handleFormatPriceChange(price);
            this.setState({
                channelCode,
                state,
                createStartTime,
                createEndTime,
                shelfStartTime,
                shelfEndTime,
                selectType,
                inputContent,
                startValue: createStartTime ? moment(createStartTime, dateFormat) : null,
                endValue: createEndTime ? moment(createEndTime, dateFormat) : null,
                shelStartValue: shelfStartTime ? moment(shelfStartTime, dateFormat) : null,
                shelEndValue: shelfEndTime ? moment(shelfEndTime, dateFormat) : null,
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
                        if (data[i].name === '批量下架商品') {
                            this.setState({batchOnsale: true});
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
        const url =  `${baseURL}goods/onsale/list`;
        const { 
            channelCode, 
            state, 
            inputContent, 
            selectType,
            maxPrice,
            minPrice,
            createStartTime,
            createEndTime,
            category,
            shelfStartTime,
            shelfEndTime
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
            category,
            shelfStartTime,
            shelfEndTime
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
    handleShelCreateChange = (value, dateString) => {
        this.setState({shelfStartTime: dateString});
        this.timeChange('shelStartValue', value);
    }
    handleShelEndChange = (value, dateString) => {
        this.setState({shelfEndTime: dateString});
        this.timeChange('shelEndValue', value);
    }
    timeChange = (field, value) => {
        this.setState({[field]: value});
    }
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }
    disabledShelEndDate = (endValue) => {
        const shelStartValue = this.state.shelStartValue;
        if (!endValue || !shelStartValue) return false;
        return endValue.valueOf() <= shelStartValue.valueOf();
    }
    /**********************下架商品***********************/
    handleOffshelfClick = () => {
        const { offshelfSysSKu } = this.state;
        if (offshelfSysSKu.length === 0) this.setState({offshelfText: '请选择需要下架的数据后进行下架操作。'});
        else this.setState({offshelfText: '下架后商品不会在前台展示，确认下架操作？'});
        this.setState({offshelfVisible: true});
    }
    handleOffshelfOk = () => {
        const { offshelfSysSKu } = this.state;
        if (offshelfSysSKu.length === 0) {
            this.setState({offshelfVisible: false});
        } else {
            this.setState({offshelfConfirmLoading: true});
            const url = `${baseURL}goods/onsale/offshelf`;
            fatch(url, 'post', {sysSkus: offshelfSysSKu}, (err, state) => {
                message.info(err);
                this.setState({offshelfConfirmLoading: state});
            }).then((res) => {
                if (res.code === ERR_CODE) {
                    this.setState({
                        offshelfVisible: false,
                        offshelfConfirmLoading: false,
                        offshelfSysSKu: [],
                        selectedRowKeys: [],
                    }, () => {
                        message.info(res.msg);
                        this.requestList();
                    });
                } else {
                    message.info(res.msg);
                    this.setState({offshelfConfirmLoading: false});
                }
            });
        }
    }
    handleOffshelfCancel = () => {
        this.setState({offshelfVisible: false});
    }
    /**********************查看详情***********************/
    handleSeeClick(record) {
        this.gotoPage('/goodsControl/lookGoods', record);
    }
    /*********************下架商品***********************/
    handleApplyAudit(record) {
        this.gotoPage('/goodsControl/alreadySellGoods/offshelf', record);
    }
    gotoPage = (path, record) => {
        const page = this.params.page;
        const paterPath = '/goodsControl/alreadySellGoods';
        const breadcrumb = ['商品管理', '已上架商品'];
        const { 
            channelCode,
            state,
            price,
            createStartTime,
            createEndTime,
            shelfStartTime,
            shelfEndTime,
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
            shelfStartTime,
            shelfEndTime,
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
            shelStartValue,
            shelEndValue,
            options,
            caseaderValue
        } = this.state;
        return (
            <Form className="ant-advanced-search-form" >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
                                    <div id='qdspzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={state}
                                            onChange={(value) => {this.setState({state: value})}}
                                            getPopupContainer={() => document.getElementById('qdspzt')}
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
                                    <div id='qdspfl' style={{position: 'relative' }}>
                                        <Cascader
                                            style={{width: '100%'}}
                                            value={caseaderValue}
                                            placeholder='选择渠道商品分类'
                                            options={options}
                                            onChange={this.handleCascaderChange}
                                            getPopupContainer={() => document.getElementById('qdspfl')}
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
                                            getCalendarContainer={() => document.getElementById('jhj')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            disabledDate={this.disabledEndDate}
                                            onChange={this.handleDatePickerEndChange}
                                            placeholder='选择结束日期'
                                            value={endValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('jhj')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='上架时间'>
                            {getFieldDecorator('上架时间')(
                                <div>
                                    <div id='sjsj' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            onChange={this.handleShelCreateChange}
                                            placeholder='选择开始日期'
                                            value={shelStartValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('sjsj')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            disabledDate={this.disabledShelEndDate}
                                            onChange={this.handleShelEndChange}
                                            placeholder='选择结束日期'
                                            value={shelEndValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('sjsj')}
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
                                            style={{width: '100%'}}
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
                                    <div id='mqdshpzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={state}
                                            onChange={(value) => {this.setState({state: value})}}
                                            getPopupContainer={() => document.getElementById('mqdshpzt')}
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
                                    <div id='mqdshafl' style={{position: 'relative' }}>
                                        <Cascader
                                            style={{width: '100%'}}
                                            value={caseaderValue}
                                            placeholder='选择渠道商品分类'
                                            options={options}
                                            onChange={this.handleCascaderChange}
                                            getPopupContainer={() => document.getElementById('mqdshafl')}
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
            caseaderValue: [],
            shelfStartTime: '',
            shelfEndTime: '',
            shelStartValue: null,
            shelEndValue: null,
        });
    }
    render() {
        const { 
            dataSource, 
            offshelfVisible,
            offshelfConfirmLoading,
            offshelfText,
            pagination,
            selectedRowKeys,
            list,
            button,
            batchOnsale
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
        })
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                const { offshelfSysSKu } = this.state;
                if (selectedRows.length !== 0) {
                    let selectedIdList = [];
                    selectedRows.map((item) => (selectedIdList.push(item.sysSku)));
                    this.setState({offshelfSysSKu: selectedIdList, selectedRowKeys: selectedRowKeys});
                } else {
                    this.setState({offshelfSysSKu: [], selectedRowKeys: []});
                }
            }
        }
        return (
            <Warp style={{display: list && button ? 'block' : 'none'}}>
                <Card bordered={false}>
                    {this.renderForm()}
                    <OperationWarp>
                        <Button
                            type='primary'
                            style={{display: batchOnsale ? 'block' : 'none'}}
                            onClick={this.handleOffshelfClick}
                        >
                            批量下架商品
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
                {/*下架商品*/}
                <Modal
                    title='下架商品'
                    width={600}
                    closable={false}
                    visible={offshelfVisible}
                    confirmLoading={offshelfConfirmLoading}
                    onOk={this.handleOffshelfOk}
                    onCancel={this.handleOffshelfCancel}
                >
                    {offshelfText}
                </Modal>
            </Warp>
        );
    }
}
export default connect(null, null)(Form.create({})(AlreadySellGoods));