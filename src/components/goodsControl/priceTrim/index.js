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
import { Select, Button, Input, Table, Modal, Checkbox, DatePicker, Icon, Tag, Cascader, message, Spin, Radio, Row, Col, Card, Form } from 'antd';
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
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class PriceTrim extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '价格变动时间',
                dataIndex: 'pushTime',
                align: 'center',
                render: (text, record) => {
                    return <div>{formatDateTime(record.pushTime)}</div>;
                }
            },
            {   
                title: '数据同步时间',
                dataIndex: 'createTime',
                align: 'center',
                render: (text, record) => {
                    return <div>{formatDateTime(record.createTime)}</div>;
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
                        return <div>无</div>;
                    }
                }
            },
            {
                title: 'SKU编码',
                dataIndex: 'sysSku',
                align: 'center',
            },
            {
                title: '规格',
                dataIndex: 'attributes',
                align: 'center',
            },
            {
                title: '商品名称',
                dataIndex: 'name',
                align: 'center',
                
            },
            {
                title: '原进货价',
                dataIndex: 'price',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.price}元</div>;
                }
            },
            {
                title: '调整后的进货价',
                dataIndex: 'updatePrice',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.updatePrice}元</div>;
                }
            },
            {
                title: '销售价',
                dataIndex: 'salePrice',
                align: 'center',
                render: (text, record) => {
                    return <div>{record.salePrice}元</div>;
                }
            },
            {
                title: '渠道商品状态',
                dataIndex: 'quStat1e',
                align: 'center',
                render: (text, record) => {
                    if (record.channelState === 1) {
                        return <Tag color="#87d068">已上架</Tag>;
                    } else {
                        return <Tag color="#FF0000">已下架</Tag>;
                    }
                }
            },
            {
                title: '商品状态',
                dataIndex: 'spStat1e',
                align: 'center',
                render: (text, record) => {
                    if (record.sysState === 1) {
                        return <Tag color="#FF0000">未上架</Tag>;
                    } else if (record.sysState === 2) {
                        return <Tag color="#FF0000">审核中</Tag>;
                    } else if (record.sysState === 3) {
                        return <Tag color="#87d068">已上架</Tag>;
                    } else if (record.sysState === 4) {
                        return <Tag color="#FF0000">审核失败</Tag>;
                    } else if (record.sysState === 5) {
                        return <Tag color="#FF0000">已下架</Tag>;
                    }
                }
            },
            {
                title: '处理状态',
                dataIndex: 'clStat1e',
                align: 'center',
                render: (text, record) => {
                    if (record.state === 0) {
                        return <Tag color="#FF0000">未处理</Tag>;
                    } else {
                        return <Tag color="#87d068">已处理</Tag>;
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
                                <Button
                                    type='primary'
                                    style={{display: record.state === 0 ? 'block' : 'none'}}
                                    onClick={this.handleDisposeClick.bind(this, record)}
                                >
                                    <Icon><i className='iconfont icon-chakan'></i></Icon>
                                    编辑
                                </Button>
                                <Button
                                    type='primary'
                                    style={{background: 'rgb(255, 183, 82)', border: '1px solid rgb(255, 183, 82)', display: record.state === 0 ? 'block' : 'none'}}
                                    onClick={this.handleSingledealClick.bind(this, record)}
                                >
                                    <Icon><i className='iconfont icon-shenqingshenhe'></i></Icon>
                                    标记已处理
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
            dealState: '',
            state: '',
            sysState: '',
            inputContent: '',
            selectType: 'sysSku',
            maxPrice: '',
            minPrice: '',
            price: '',
            importStartTime: '',
            importEndTime: '',
            updateStartTime: '',
            updateEndTime: '',
            updateStartValue: null,
            updateEndValue: null,
            startValue: null,
            endValue: null,
            category: '',
            options: [],
            caseaderValue: [],
            queryButtonLoading: false,

            dataSource: [],
            // 单个标记
            singledealVisible: false,
            singledealConfirmLoading: false,
            // 批量标记
            singledealListVisible: false,
            singledealListConfirmLoading: false,
            singledealList: [],
            singledealText: '',
            // 清空表格选中的数据
            selectedRowKeys: [],
            // 页面权限
            list: false,
            button: false,
            batchPrice: false
        };
        this.params = { page: 1 };
    }
    componentWillMount() {
        getTypeList().then((options) => (this.setState({ options })));
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '渠道商品价格调整列表']));
        let data = this.props.location.query;
        if (data !== undefined) {
            const {
                page,
                price,
                channelCode,
                category,
                dealState,
                importEndTime,
                importStartTime,
                inputContent,
                selectType,
                state,
                sysState,
                updateEndTime,
                updateStartTime
            } = data;
            this.params.page = page;
            if (price !== '') this.handleFormatPriceChange(price);
            this.setState({
                channelCode,
                category,
                dealState,
                importEndTime,
                importStartTime,
                inputContent,
                selectType,
                state,
                sysState,
                updateEndTime,
                updateStartTime,
                startValue: importStartTime ? moment(importStartTime, dateFormat) : null,
                endValue: importEndTime ? moment(importEndTime, dateFormat) : null,
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
        fatch(`${baseURL}account/getBattenList`, 'post', {managerId: Storage.get('userinfo').id}, (err, state) => {

        }).then((res) => {
            if (res.code === ERR_CODE) {
                const data = res.data;
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].name === '批量标记价格调整信息') {
                            this.setState({batchPrice: true});
                        }
                        this.setState({button: true});
                    }
                }
            } else {
                this.setState({button: true});
            }
        });
        const url = `${baseURL}goods/update/list`;
        const {
            channelCode,
            category,
            dealState,
            importEndTime,
            importStartTime,
            inputContent,
            maxPrice,
            minPrice,
            selectType,
            state,
            sysState,
            updateEndTime,
            updateStartTime
        } = this.state;
        const params = {
            channelCode,
            category,
            dealState,
            importEndTime,
            importStartTime,
            inputContent,
            maxPrice,
            minPrice,
            selectType,
            state,
            sysState,
            updateEndTime,
            updateStartTime
        }
        let _this = this;
        this.showAndHideLoading(true);
        fatch(url, 'post', params, (err, state) => {
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === ERR_CODE) {
                const result = res.data.list;
                this.setState({list: true});
                if (result === null) {
                    this.setState({dataSource: []})
                    this.showAndHideLoading(false);
                    if (queryButtonLoading) {
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
                        message.success(res.msg);
                    }
                }
            } else {
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
        this.setState({importStartTime: dateString});
        this.timeChange('startValue', value);
    }
    handleDatePickerEndChange = (value, dateString) => {
        this.setState({importEndTime: dateString});
        this.timeChange('endValue', value);
    }
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }
    handleDatePickerUpdateStartChange = (value, dateString) => {
        this.setState({updateStartTime: dateString});
        this.timeChange('updateStartValue', value);
    }
    handleDatePickerUpdateEndChage = (value, dateString) => {
        this.setState({updateEndTime: dateString});
        this.timeChange('updateEndValue', value);
    }
    updateDisabledEndDate = (updateEndValue) => {
        const updateStartValue = this.state.updateStartValue;
        if (!updateEndValue || !updateStartValue) return false;
        return updateEndValue.valueOf() <= updateStartValue.valueOf();
    }
    timeChange = (field, value) => {
        this.setState({[field]: value});
    }
    /**********************单个标记***********************/
    handleSingledealClick(record) {
        this.setState({
            singledealVisible: true,
            singledealId: record.id
        });
    }
    handleSingledealOk = () => {
        this.setState({singledealConfirmLoading: true});
        const id = this.state.singledealId;
        const url = `${baseURL}goods/update/singledeal`;
        fatch(url, 'post', { id }, (err, state) => {
            message.error(err);
            this.setState({singledealConfirmLoading: false});
        }).then((res) => {
            if (res.code === ERR_CODE) {
                this.setState({singledealVisible: false, singledealConfirmLoading: false});
                this.requestList();
                message.success(res.msg);
            } else {
                this.setState({singledealConfirmLoading: false});
                message.error(res.msg);
            }
        });
    }
    handleSingledealCancel = () => {
        this.setState({
            singledealVisible: false
        });
    }
    /***********************批量处理****************************/
    handleBatchDeal = () => {
        const { singledealList } = this.state;
        if (singledealList.length === 0) {
            this.setState({singledealText: '请选择需要处理的数据后进行操作。'});
        } else {
            this.setState({singledealText: '所选项确认为已处理状态？'});
        }
        this.setState({singledealListVisible: true});
    }
    handleSingledealListOk = () => {
        const { singledealList } = this.state;
        if (singledealList.length === 0) {
            this.setState({singledealListVisible: false});
        } else {
            this.setState({singledealListConfirmLoading: true});
            const url = `${baseURL}goods/update/deal`;
            fatch(url, 'post', { ids: singledealList }, (err, state) => {
                this.setState({singledealListConfirmLoading: false});
                message.err(err);
            }).then((res) => {
                if (res.code === ERR_CODE) {
                    this.setState({
                        singledealListVisible: false,
                        singledealListConfirmLoading: false,
                        singledealList: [],
                        selectedRowKeys: []
                    }, () => {
                        message.info(res.msg);
                        this.requestList();
                    });
                } else {
                    this.setState({singledealListConfirmLoading: false});
                    message.err(res.msg);
                }
            });
        }
    }
    handleSingledealListCancel = () => {
        this.setState({singledealListVisible: false});
    }
    /**********************查看详情***********************/
    handleSeeClick(record) {
        this.gotoPage('/goodsControl/lookGoods', record);
    }
    handleDisposeClick(record) {
        let path = '';
        if (record.sysState === 1 || record.sysState === 4) {
            path = '/goodsControl/nothingSellGoods/applyAudit';
        } else if (record.sysState === 2) {
            path = '/goodsControl/stayExamineGoods/applyAudit';
        } else if (record.sysState === 3) {
            path = '/goodsControl/alreadySellGoods/offshelf';
        } else if (record.sysState === 5) {
            path = '/goodsControl/stopGoods/onshelf';
        }
        this.gotoPage(path, record);
    }
    gotoPage = (path, record) => {
        const page = this.params.page;
        const paterPath = '/goodsControl/priceTrim';
        const breadcrumb = ['商品管理', '渠道商品价格调整列表'];
        const { 
            channelCode,
            category,
            dealState,
            importEndTime,
            importStartTime,
            inputContent,
            maxPrice,
            minPrice,
            selectType,
            state,
            sysState,
            updateEndTime,
            updateStartTime,
            price
        } = this.state;
        history.push(path, {
            record,
            page, 
            price,
            breadcrumb,
            paterPath,
            channelCode,
            category,
            dealState,
            importEndTime,
            importStartTime,
            inputContent,
            maxPrice,
            minPrice,
            selectType,
            state,
            sysState,
            updateEndTime,
            updateStartTime,
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
            dataSource, 
            pagination,
            channelCode, 
            state, 
            sysState, 
            inputContent, 
            selectType, 
            price,
            startValue,
            endValue,
            updateStartValue,
            updateEndValue,
            options,
            dealState,
            caseaderValue
        } = this.state;
        return (
            <Form className="ant-advanced-search-form">
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
                        <FormItem label='商品状态'>
                            {getFieldDecorator('商品状态')(
                                <div>
                                    <div id='spzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={sysState}
                                            onChange={(value) => {this.setState({sysState: value})}}
                                            getPopupContainer={() => document.getElementById('spzt')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>未上架</Option>
                                            <Option value='2'>审核中</Option>
                                            <Option value='3'>已上架</Option>
                                            <Option value='4'>审核失败</Option>
                                            <Option value='5'>已下架</Option>
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
                        <FormItem label='原进货价范围'>
                            {getFieldDecorator('原进货价范围')(
                                <div>
                                    <div id='yjhj' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={price}
                                            onChange={(value) => {this.handleFormatPriceChange(value)}}
                                            getPopupContainer={() => document.getElementById('yjhj')}
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
                        <FormItem label='价格变化时间'>
                            {getFieldDecorator('价格变化时间')(
                                <div>
                                    <div id='jgbhsj' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            onChange={this.handleDatePickerUpdateStartChange}
                                            placeholder='选择开始日期'
                                            value={updateStartValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('jgbhsj')}
                                        />
                                        <DatePicker
                                            style={{ width: '50%' }}
                                            disabledDate={this.updateDisabledEndDate}
                                            onChange={this.handleDatePickerUpdateEndChage}
                                            placeholder='选择结束日期'
                                            value={updateEndValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('jgbhsj')}
                                        />
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='处理状态'>
                            {getFieldDecorator('处理状态')(
                                <div>
                                    <div id='clzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={dealState}
                                            onChange={(value) => {this.setState({dealState: value})}}
                                            getPopupContainer={() => document.getElementById('clzt')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>已处理</Option>
                                            <Option value='0'>未处理</Option>
                                        </Select>
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
            sysState, 
        } = this.state;
        return (
            <Form className="ant-advanced-search-form">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
                        <FormItem label='商品状态'>
                            {getFieldDecorator('商品状态')(
                                <div>
                                    <div id='mspzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={sysState}
                                            onChange={(value) => {this.setState({sysState: value})}}
                                            getPopupContainer={() => document.getElementById('mspzt')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>未上架</Option>
                                            <Option value='2'>审核中</Option>
                                            <Option value='3'>已上架</Option>
                                            <Option value='4'>审核失败</Option>
                                            <Option value='5'>已下架</Option>
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
            channelCode: '1',
            dealState: '',
            state: '',
            sysState: '',
            inputContent: '',
            selectType: 'sysSku',
            maxPrice: '',
            minPrice: '',
            price: '',
            importStartTime: '',
            importEndTime: '',
            updateStartTime: '',
            updateEndTime: '',
            updateStartValue: null,
            updateEndValue: null,
            startValue: null,
            endValue: null,
            category: '',
            caseaderValue: [],
        });
    }
    render() {
        const { 
            dataSource, 
            pagination,
            synchroConfirmLoading,
            exanineText,
            examineConfirmLoading,
            selectedRowKeys,
            singledealVisible,
            singledealConfirmLoading,
            singledealListVisible,
            singledealText,
            singledealListConfirmLoading,
            list,
            button,
            batchPrice
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
            hideDefaultSelections: false,
            onChange: (selectedRowKeys, selectedRows) => {
                if (selectedRows.length !== 0) {
                    let selectedIdList = [];
                    selectedRows.map((item) => (selectedIdList.push(item.id)));
                    this.setState({singledealList: selectedIdList, selectedRowKeys: selectedRowKeys});
                } else {
                    this.setState({singledealList: [], selectedRowKeys: []});
                }
            },
            getCheckboxProps: (record) => {
                return {
                    disabled: record.state === 1,
                    state: record.state,
                }
            },
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Warp style={{display: list && button ? 'block' : 'none'}}>
                <Card bordered={false} style={{height: '100%'}}>
                    {this.renderForm()}
                    <OperationWarp>
                        <Button
                            type='primary'
                            style={{width: 168, display: batchPrice ? 'block' : 'none'}}
                            onClick={this.handleBatchDeal}
                        >
                            批量标记价格调整信息
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
                <Modal
                    title='单个商品标记已处理'
                    width={600}
                    closable={false}
                    visible={singledealVisible}
                    confirmLoading={singledealConfirmLoading}
                    onOk={this.handleSingledealOk}
                    onCancel={this.handleSingledealCancel}
                >
                    确认将该商品标记为已处理状态？
                </Modal>
                <Modal
                    title='批量处理'
                    width={600}
                    closable={false}
                    confirmLoading={singledealListConfirmLoading}
                    visible={singledealListVisible}
                    onOk={this.handleSingledealListOk}
                    onCancel={this.handleSingledealListCancel}
                >
                    <p>{ singledealText }</p>
                </Modal>
            </Warp>
        );
    }
}
export default connect(null, null)(Form.create({})(PriceTrim));