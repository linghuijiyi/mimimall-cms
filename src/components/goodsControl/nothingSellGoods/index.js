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
import pagination from './../../../common/js/pagination';
import formatDateTime from './../../../common/js/formatDateTime';
import Storage from './../../../common/js/storage';
import baseURL from './../../../common/js/baseURL';
import { regEn, regCn, ERR_CODE } from './../../../common/js/regExp';
import getTypeList from './../../../common/js/getTypeList';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class NothingSellGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
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
                    render: (text, record) => (<div>{record.name}</div>)
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
                    render: (text, record) => {
                        if (record.sysState === 1) return <Tag color="#f50">未审核</Tag>;
                        else if (record.sysState === 4) return <Tag color="#FF0000">审核失败</Tag>;
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    width: 200,
                    render: (text, record) => {
                        return (
                            this.state.dataSource.length
                            ? (
                                <Options>
                                    <Button
                                        type='primary'
                                        style={{minWidth: '85px'}}
                                        onClick={this.handleSeeClick.bind(this, record)}
                                    >
                                        <Icon><i className='iconfont icon-chakan'></i></Icon>
                                        查看
                                    </Button>
                                    <Button
                                        type='primary'
                                        style={{background: 'rgb(255, 183, 82)', minWidth: '112px', border: '1px solid rgb(255, 183, 82)', display: record.state === 0 ? 'none' : 'block'}}
                                        onClick={this.handleApplyAudit.bind(this, record)}
                                    >
                                        <Icon><i className='iconfont icon-shenqingshenhe'></i></Icon>
                                        申请审核
                                    </Button>
                                </Options>
                            ) : null
                        );
                    },
                }
            ],
            expandForm: false,
            // 查询数据
            channelCode: '1',
            state: '',
            sysState: '',
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
            dataSource: [],
            // 手动同步商品
            synchroVisible: false,
            synchroValue: '1',
            synchroConfirmLoading: false,
            // 批量审核
            examineVisible: false,
            examineConfirmLoading: false,
            examineSysSkus: [],
            exanineText: '',
            // 清空表格选中的数据
            selectedRowKeys: [],
            // 页面权限
            list: false,
            button: false,
            power: '',
            manual: ''
        };
        this.params = { page: 1 };
    }
    componentWillMount() {
        getTypeList().then((options) => (this.setState({ options })));
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '未上架商品']));
        let data = this.props.location.query;
        if (data !== undefined) {
            const { 
                page, 
                channelCode, 
                state, 
                sysState, 
                inputContent, 
                selectType, 
                price, 
                createStartTime,
                createEndTime
            } = data;
            this.params.page = page;
            if (price !== '') this.handleFormatPriceChange(price);
            this.setState({
                channelCode,
                state,
                sysState,
                inputContent,
                selectType,
                createStartTime,
                createEndTime,
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
                        if (data[i].name === '批量申请审核') {
                            this.setState({power: true});
                        }
                        if (data[i].name === '手动同步商品') {
                            this.setState({manual: true});
                        }
                        this.setState({button: true});
                    }
                }
            } else {
                this.setState({button: true});
            }
        });
        if (queryButtonLoading) {
            this.setState({queryButtonLoading: true});
            this.params.page = 1;
        }
        this.showAndHideLoading(true);
        let _this = this;
        const url =  `${baseURL}goods/unsale/list`;
        const { 
            channelCode, 
            state, 
            sysState, 
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
            sysState,
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
            this.showAndHideLoading(false);
        }).then((res) => {
            if (res.code === ERR_CODE) {
                const result = res.data.page.result;
                this.setState({list: true});
                if (result === null) {
                    this.setState({dataSource: []});
                    this.showAndHideLoading(false);
                    if (queryButtonLoading) {
                        this.setState({queryButtonLoading: false});
                        this.showAndHideLoading(false);
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
    /**********************手动同步商品***********************/
    handleSynchroClick = () => {
        this.setState({synchroVisible: true});
    }
    handleSynchroOk = () => {
        this.showAndHideLoading(true);
        this.setState({
            synchroVisible: false,
        });
        const url = `${baseURL}goods/unsale/importgoods`;
        fatch(url, 'post', {channel: this.state.synchroValue} , (err, state) => {
            message.error(err);
            this.showAndHideLoading(false);
        }).then((res) => {
            if (res.code === 0) {
                this.showAndHideLoading(false);
            } else {
                this.showAndHideLoading(false);
                message.error(res.msg);
            }
        });
    }
    handleSycnhroCancel = () => {
        this.setState({synchroVisible: false});
    }
    /**********************批量申请审核***********************/
    handleExamineClick = () => {
        const { examineSysSkus } = this.state;
        if (examineSysSkus.length === 0) this.setState({exanineText: '请选择需要审核的数据后申请审核。'});
        else this.setState({exanineText: '是否确认提交审核？'});
        this.setState({examineVisible: true});
    }
    handleExamineOk = () => {
        const { examineSysSkus } = this.state;
        if (examineSysSkus.length === 0) {
            this.setState({examineVisible: false});
        } else {
            this.setState({examineConfirmLoading: true});
            const url = `${baseURL}goods/unsale/auditapply`;
            fatch(url, 'post', {sysSkus: examineSysSkus}, (err, state) => {
                message.info(err);
                this.setState({examineConfirmLoading: state});
            }).then((res) => {
                if (res.code === ERR_CODE) {
                    this.setState({
                        examineVisible: false,
                        examineConfirmLoading: false,
                        examineSysSkus: [],
                        selectedRowKeys: [],
                    }, () => {
                        message.info(res.msg);
                        this.requestList();
                    });
                } else {
                    message.info(res.msg);
                    this.setState({examineConfirmLoading: false});
                }
            });
        }
    }
    handleExamineCancel = () => {
        this.setState({examineVisible: false});
    }
    /**********************查看详情***********************/
    handleSeeClick(record) {
        this.gotoPage('/goodsControl/lookGoods', record);
    }
    /*********************申请审核***********************/
    handleApplyAudit(record){
        this.gotoPage('/goodsControl/nothingSellGoods/applyAudit', record);
    }
    gotoPage = (path, record) => {
        const page = this.params.page;
        const paterPath = '/goodsControl/nothingSellGoods';
        const breadcrumb = ['商品管理', '未上架商品'];
        const { 
            channelCode, 
            state, 
            sysState, 
            inputContent, 
            selectType, 
            price, 
            createStartTime,
            createEndTime,
        } = this.state;
        history.push(path, {
            record, 
            page, 
            breadcrumb, 
            channelCode, 
            state, 
            sysState, 
            inputContent, 
            selectType, 
            price, 
            createStartTime, 
            createEndTime, 
            paterPath
        });
    }
    renderAdvancedForm = () => {
        const { getFieldDecorator } = this.props.form;
        const { 
            channelCode, 
            state, 
            sysState, 
            inputContent, 
            selectType, 
            price,
            startValue,
            endValue,
            options,
            queryButtonLoading,
            synchroVisible,
            examineVisible,
            synchroConfirmLoading,
            caseaderValue
        } = this.state;
        return (
            <Form className="ant-advanced-search-form">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} lg={8}>
                        <FormItem label='渠道名称'>
                            {getFieldDecorator('渠道名称')(
                                <div >
                                    <div id='admc' style={{position: 'relative' }}>
                                        <Select
                                            style={{ width: '100%' }}
                                            value={channelCode}
                                            onChange={(value) => {this.setState({channelCode: value})}}
                                            getPopupContainer={() => document.getElementById('admc')}
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
                                    <div id='qdsp' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={state}
                                            onChange={(value) => {this.setState({state: value})}}
                                            getPopupContainer={() => document.getElementById('qdsp')}
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
                                    <div id='qsspfl' style={{position: 'relative' }}>
                                        <Cascader
                                            style={{width: '100%'}}
                                            value={caseaderValue}
                                            placeholder='选择渠道商品分类'
                                            options={options} 
                                            onChange={this.handleCascaderChange}
                                            getPopupContainer={() => document.getElementById('qsspfl')}
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
                        <FormItem label='审核状态'>
                            {getFieldDecorator('审核状态')(
                                <div>
                                    <div id='shzt' style={{position: 'relative' }}>
                                        <Select
                                            className='select'
                                            style={{ width: '100%' }}
                                            value={sysState}
                                            onChange={(value) => {this.setState({sysState: value})}}
                                            getPopupContainer={() => document.getElementById('shzt')}
                                        >
                                            <Option value=''>全部</Option>
                                            <Option value='1'>未审核</Option>
                                            <Option value='4'>审核失败</Option>
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
            queryButtonLoading,
            caseaderValue,
            options
        } = this.state;
        return (
            <Form className="ant-advanced-search-form" layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>    
                        <FormItem label='渠道名称' style={{minWidth: '90px'}}>
                            {getFieldDecorator('渠道名称')(
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
                                    <div id='mqdsp' style={{position: 'relative' }}>
                                        <Select
                                            className='select' 
                                            style={{ width: '100%' }}
                                            value={state}
                                            onChange={(value) => {this.setState({state: value})}}
                                            getPopupContainer={() => document.getElementById('mqdsp')}
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
                                    <div id='mqdfl' style={{position: 'relative' }}>
                                        <Cascader
                                            style={{width: '100%'}}
                                            value={caseaderValue}
                                            placeholder='选择渠道商品分类'
                                            options={options}
                                            onChange={this.handleCascaderChange}
                                            getPopupContainer={() => document.getElementById('mqdfl')}
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
            caseaderValue: [],
            category: '',
            price: '',
            maxPrice: '',
            minPrice: '',
            sysState: '',
            startValue: null,
            endValue: null,
            createStartTime: '',
            createEndTime: '',
            selectType: 'sysSku',
            inputContent: '',
        });
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { 
            dataSource, 
            synchroVisible,
            examineVisible,
            pagination,
            synchroConfirmLoading,
            exanineText,
            examineConfirmLoading,
            selectedRowKeys,
            power,
            list,
            button,
            manual
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
        });
        const rowSelection = {
            selectedRowKeys,
            hideDefaultSelections: false,
            onChange: (selectedRowKeys, selectedRows) => {
                const { examineSysSkus } = this.state;
                if (selectedRows.length !== 0) {
                    let selectedIdList = [];
                    selectedRows.map((item) => (selectedIdList.push(item.sysSku)));
                    this.setState({examineSysSkus: selectedIdList, selectedRowKeys: selectedRowKeys});
                } else {
                    this.setState({examineSysSkus: [], selectedRowKeys: []});
                }
            },
            getCheckboxProps: (record) => {
                return {
                    disabled: record.state === 0,
                    state: record.state,
                }
            },
        };
        return (
            <Warp style={{display: list && button ? 'block' : 'none'}}>
                <Card bordered={false}>
                    <div>
                        <div className='tableListForm'>
                            {this.renderForm()}
                        </div>
                    </div>
                    <OperationWarp>
                        <Button type='primary' style={{display: manual ? 'block' : 'none'}} onClick={this.handleSynchroClick}>手动同步商品</Button>
                        <Button type='primary' style={{display: power ? 'block' : 'none'}} onClick={this.handleExamineClick}>批量申请审核</Button>
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
                {/*手动同步商品*/}
                <Modal
                    title='手动同步商品'
                    width={600}
                    closable={false}
                    confirmLoading={synchroConfirmLoading}
                    visible={synchroVisible}
                    onOk={this.handleSynchroOk}
                    onCancel={this.handleSycnhroCancel}
                >
                    <SynchroView>
                        <Text>选择渠道:</Text>
                        <View>
                            <RadioGroup 
                                value={this.state.synchroValue} 
                                onChange={(e) => {this.setState({synchroValue: e.target.value})}}
                            >
                                <Radio value='1'>京东商城</Radio>
                            </RadioGroup>
                        </View>
                    </SynchroView>
                </Modal>
                {/*批量申请审核*/}
                <Modal
                    title='批量申请审核'
                    width={600}
                    closable={false}
                    confirmLoading={examineConfirmLoading}
                    visible={examineVisible}
                    onOk={this.handleExamineOk}
                    onCancel={this.handleExamineCancel}
                >
                    <p>{exanineText}</p>
                </Modal>
            </Warp>
        );
    }
}
export default connect(null, null)(Form.create({})(NothingSellGoods));