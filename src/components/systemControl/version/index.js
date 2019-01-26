import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import fatch from './../../../common/js/fatch';
import baseURL from './../../../common/js/baseURL';
import pagination from './../../../common/js/pagination';
import formatDateTime from './../../../common/js/formatDateTime';
import { Select, Button, Input, Table, Modal, Checkbox, DatePicker, Icon, Tag, Cascader, message, Spin, Radio, Row, Col, Card, Form } from 'antd';
import { 
    Warp,
    OperationWarp
} from './style';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const confirm = Modal.confirm;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';

class Version extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            columns: [
                {
                    title: '序号',
                    dataIndex: 'id',
                    align: 'center',
                    width: 80
                },
                {   
                    title: 'APP版本号',
                    dataIndex: 'code',
                    align: 'center',
                    width: 80
                },
                {
                    title: 'APP版本名称',
                    dataIndex: 'name',
                    align: 'center',
                    width: 100
                },
                {
                    title: '下载地址',
                    dataIndex: 'downloadUrl',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        return <div style={{width: '150px', overflowX: 'auto'}}>{record.downloadUrl}</div>;
                    }
                },
                {
                    title: '是否需要强制更新',
                    dataIndex: 'forceUpdate',
                    align: 'center',
                    width: 80,
                    render: (text, record) => {
                        if (record.forceUpdate === 0 || record.forceUpdate === '0') {
                            return <div>否</div>;
                        } else {
                            return <div>是</div>; 
                        }
                    }
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        return <div>{record.createTime === null ? '' : formatDateTime(record.createTime)}</div>;
                    }
                },
                {
                    title: '生效时间',
                    dataIndex: 'enableTime',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        return <div>{record.enableTime === null ? '' : formatDateTime(record.enableTime)}</div>;
                    }
                },
                {
                    title: '需要强制更新最小版本号',
                    dataIndex: 'mincode',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '提示信息',
                    dataIndex: 'content',
                    align: 'center',
                    width: 150,
                    render: (text, record) => {
                        return <div style={{width: '150px'}}>{record.content}</div>;
                    }
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    align: 'center',
                    width: 100,
                    render: (text, record) => {
                        if (record.type === 1 || record.type === '1') {
                            return <div>android</div>;
                        } else {
                            return <div>IOS</div>;
                        }
                    }
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    align: 'center',
                    width: 150
                },
                {
                    title: '操作员',
                    dataIndex: 'operName',
                    align: 'center',
                    width: 120,
                },
                {
                    title: '修改时间',
                    dataIndex: 'editTime',
                    align: 'center',
                    width: 180,
                    render: (text, record) => {
                        return <div>{record.editTime === null ? '' : formatDateTime(record.editTime)}</div>;
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'op',
                    align: 'center',
                    render: (text, record) => {
                        return (
                            <div>
                                <Button type='primary' onClick={() => this.showUpdateModel(record)}>编辑</Button>
                            </div>
                        )
                    }
                }
            ],
            visible: false,
            forceUpdate: '',
            type: '',
            selectType: 'name',
            inputContent: '',
            appCode: '',
            name: '',
            downloadUrl: '',
            CreateForceUpdate: 1,
            createType: 1,
            mincode: '',
            content: '',
            remark: '',
            enableTime: '',
            enableTimeValue: null,
            createConfirmLoading: false,
            updateId: '',
            updadeVisible: false,
            updateCode: '',
            updateName: '',
            updateDownloadUrl: '',
            updateoFrceUpdate: 1,
            updateType: '1',
            updateEditTimeValue: null,
            updateMincode: '',
            updateContent: '',
            updateRemark: '',
            updateConfirmLoading: false,
            isUpdate: false
        }
        this.params = { page: 1 };
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['系统管理', 'App版本管理']));
        this.requestList();
    }
    requestList = (button) => {
        if (button) {
            this.params.page = 1;
        }
        const url = `${baseURL}sys/appversion/list`;
        const { type, forceUpdate, selectType, inputContent } = this.state;
        const params = {
            pageNo: this.params.page,
            type,
            forceUpdate,
            selectType,
            inputContent
        }
        this.showAndHideLoading(true);
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.error(err);
            this.showAndHideLoading(false);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.page.result;
                if (result !== null && result !== undefined && result.length) {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        dataSource: result,
                        pagination: pagination(res.data.page, (current) => {
                            _this.params.page = current;
                            this.requestList();
                        })
                    });
                } else {
                    this.setState({ dataSource: [] });
                }
                if (button) message.success(res.msg);
                this.showAndHideLoading(false);
            } else {
                message.error(res.msg);
                this.showAndHideLoading(false);
            }
        });
    }
    queryList = () => {
        this.requestList(true);
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
      }
    handleOk = () => {
        const {
            appCode,
            name,
            downloadUrl,
            CreateForceUpdate,
            createType,
            mincode,
            content,
            remark,
            enableTime,
            enableTimeValue
        } = this.state;
        if (appCode === '') {
            message.warn('APP版本号不能为空。');
            return;
        }
        if (name === '') {
            message.warn('版本名称不能为空。');
            return;
        }
        if (enableTime === '' || enableTimeValue === null) {
            message.warn('生效日期不能为空。');
            return;
        }
        if (new Date(formatDateTime(enableTime)).getTime() < new Date(new Date().getTime())) {
            message.warn('生效日期不能小于当前时间。');
            return;
        }
        if (content === '') {
            message.warn('提示信息为必填项。');
            return;
        }
        this.setState({createConfirmLoading: true});
        const url = `${baseURL}sys/appversion/save`;
        const params =  {
            code: appCode,
            name,
            downloadUrl,
            forceUpdate: CreateForceUpdate,
            type: createType,
            mincode,
            content,
            remark,
            enableTime,
        }
        fatch(url, 'post', params, (err, state) => {

        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    visible: false,
                    createConfirmLoading: false,
                    appCode: '',
                    name: '',
                    downloadUrl: '',
                    CreateForceUpdate: 1,
                    createType: 1,
                    mincode: '',
                    content: '',
                    remark: '',
                    enableTime: '',
                    enableTimeValue: null
                });
                message.success(res.msg);
                this.requestList();
            } else {
                this.setState({
                    createConfirmLoading: false,
                });
                message.error(res.msg);
            }
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            appCode: '',
            name: '',
            downloadUrl: '',
            CreateForceUpdate: 1,
            createType: 1,
            mincode: '',
            content: '',
            remark: '',
            enableTime: '',
            enableTimeValue: null
        });
    }
    showUpdateModel = (record) => {
        const url = `${baseURL}sys/appversion/info`;
        this.setState({
            updateId: record.id
        });
        this.showAndHideLoading(true);
        fatch(url, 'post', { id: record.id }, (err, state) => {
            this.showAndHideLoading(false);
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                let updateEnableTime = formatDateTime(data.enableTime);
                if (new Date(updateEnableTime).getTime() < new Date(new Date().getTime())) {
                    this.setState({isUpdate: true});
                    console.log('比较')
                }
                this.setState({
                    updadeVisible: true,
                    updateCode: data.code,
                    updateName: data.name,
                    updateDownloadUrl: data.downloadUrl,
                    updateoFrceUpdate: data.forceUpdate,
                    updateType: data.type,
                    updateEnableTime,
                    updateEditTimeValue: data.enableTime === null ? null : moment(updateEnableTime, dateFormat),
                    updateMincode: data.mincode,
                    updateContent: data.content,
                    updateRemark: data.remark
                });
                this.showAndHideLoading(false);
            } else {
                message.error(res.msg);
                this.showAndHideLoading(false);
            }
        });
    }
    handleUpdateOk = () => {
        const {
            updateCode,
            updateName,
            updateDownloadUrl,
            updateoFrceUpdate,
            updateType,
            updateEnableTime,
            updateEditTimeValue,
            updateMincode,
            updateContent,
            updateRemark,
            updateId
        } = this.state;
        if (updateCode === '') {
            message.warn('APP版本号不能为空。');
            return;
        }
        if (updateName === '') {
            message.warn('版本名称不能为空。');
            return;
        }
        if (updateEnableTime === '' || updateEditTimeValue === null) {
            message.warn('生效日期不能为空。');
            return;
        }
        if (!this.state.isUpdate) {
            if (new Date(formatDateTime(updateEnableTime)).getTime() < new Date(new Date().getTime())) {
                message.warn('生效日期不能小于当前时间。');
                return;
            }
        }
        if (updateContent === '') {
            message.warn('提示信息为必填项。');
            return;
        }
        this.setState({updateConfirmLoading: true});
        this.showAndHideLoading(true);
        const url = `${baseURL}sys/appversion/update`;
        const params = {
            code: updateCode === null ? '' : updateCode,
            name: updateName === null ? '' : updateName,
            downloadUrl: updateDownloadUrl === null ? '' : updateDownloadUrl,
            forceUpdate: updateoFrceUpdate === null ? '' : updateoFrceUpdate,
            type: updateType === null ? '' : updateType,
            mincode: updateMincode === null ? '' : updateMincode,
            content: updateContent === null ? '' : updateContent,
            remark: updateRemark === null ? '' : updateRemark,
            enableTime: updateEnableTime === null ? '' : updateEnableTime,
            id: updateId
        }
        fatch(url, 'post', params, (err, state) => {
            this.showAndHideLoading(false);
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    updadeVisible: false,
                    updateConfirmLoading: false,
                    updateCode: '',
                    updateName: '',
                    updateDownloadUrl: '',
                    updateoFrceUpdate: 1,
                    updateType: '1',
                    updateEditTimeValue: null,
                    updateMincode: '',
                    updateContent: '',
                    updateRemark: '',
                    updateId: ''
                });
                this.requestList();
                this.showAndHideLoading(false);
                message.success(res.msg);
            } else {
                this.showAndHideLoading(false);
                this.setState({updateConfirmLoading: false});
                message.error(res.msg);
            }
        });
    }
    handleUpdateCancel = () => {
        this.setState({
            updadeVisible: false,
            isUpdate: false
        });
    }
    disabledEndDate = (current) => {
        return current && current < moment().add(-1, 'day');
    }
    handleEndOpenChange = (value, dateString, str, valueStr) => {
        this.setState({[str]: dateString});
        this.timeChange([valueStr], value);
    }
    timeChange = (field, value) => {
        this.setState({[field]: value});
    }
    deleteApp = (type) => {
        const url = `${baseURL}sys/appversion/delete`;
        let _this = this;
        confirm({
            title: `删除${type === 1 ? 'android' : 'ios'}新增版本`,
            content: '确定删除最新版本？',
            onOk() {
                return new Promise((resolve, reject) => {
                    fatch(url, 'post', { type }, (err, state) => {
                        message.success(err);
                    }).then((res) => {
                        if (res.code === '0') {
                            message.success(res.msg);
                            _this.requestList();
                            resolve();
                        } else {
                            message.success(res.msg);
                            reject();
                        }
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
        });
    }
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    handleSetValue = (value) => {
        let num = '';
        if (value !== '') {
            value = value.replace(/[^\d]/g, '')
            if (value !== '') {
                num = parseInt(value);
            }
        }
        return num;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            dataSource,
            columns,
            pagination,
            visible,
            type,
            forceUpdate,
            selectType,
            inputContent,
            appCode,
            name,
            downloadUrl,
            CreateForceUpdate,
            createType,
            mincode,
            content,
            remark,
            enableTimeValue,
            createConfirmLoading,

            updadeVisible,
            updateCode,
            updateName,
            updateDownloadUrl,
            updateoFrceUpdate,
            updateType,
            updateEditTimeValue,
            updateMincode,
            updateContent,
            updateRemark,
            updateConfirmLoading,
            isUpdate
        } = this.state;
        return (
            <Warp>
                <Card bordered={false}>
                    <div>
                        <div className='tableListForm'>
                            <Form className="ant-advanced-search-form" layout="inline">
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>    
                                        <FormItem label='手机类型' style={{minWidth: '90px'}}>
                                            {getFieldDecorator('手机类型')(
                                                <div>
                                                    <div id='type' style={{position: 'relative' }}>
                                                        <Select
                                                            className='select'
                                                            style={{ width: '100%' }}
                                                            value={type}
                                                            onChange={(value) => this.setState({type: value})}
                                                            getPopupContainer={() => document.getElementById('type')}
                                                        >
                                                            <Option value=''>全部</Option>
                                                            <Option value={1}>android</Option>
                                                            <Option value={2}>ios</Option>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={12} sm={24} lg={8}>
                                        <FormItem label='是否需要强制更新'>
                                            {getFieldDecorator('是否需要强制更新')(
                                                <div>
                                                    <div id='force' style={{position: 'relative' }}>
                                                        <Select
                                                            className='select' 
                                                            style={{ width: '100%' }}
                                                            value={forceUpdate}
                                                            onChange={(value) => this.setState({forceUpdate: value})}
                                                            getPopupContainer={() => document.getElementById('force')}
                                                        >
                                                            <Option value=''>全部</Option>
                                                            <Option value={1}>强制更新</Option>
                                                            <Option value={0}>不强制更新</Option>
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
                                                    <div id='crux' style={{position: 'relative' }}>
                                                        <Select
                                                            className='select'
                                                            value={selectType}
                                                            style={{ width: '50%' }}
                                                            onChange={(value) => this.setState({selectType: value})}
                                                            getPopupContainer={() => document.getElementById('crux')}
                                                        >
                                                            <Option value='remark'>备注</Option>
                                                            <Option value='code'>APP版本号</Option>
                                                            <Option value='name'>APP版本名称</Option>
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
                                                        onClick={this.queryList}
                                                    >
                                                        查询
                                                    </Button>
                                                </div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                    <div style={{height: '1px', background: '#000', marginLeft: '-32px', marginRight: '-32px'}}></div>
                    <OperationWarp>
                        <Button type='primary' onClick={this.showModal}>新增</Button>
                        <Button type='primary' onClick={() => this.deleteApp(1)}>删除android最新版本</Button>
                        <Button type='primary' onClick={() => this.deleteApp(2)}>删除ios最新版本</Button>
                    </OperationWarp>
                    <Table
                        bordered
                        dataSource={dataSource}
                        pagination={this.state.pagination}
                        columns={columns}
                        style={{'overflowX': 'auto'}}
                    />
                </Card>
                <Modal
                    title='编辑版本'
                    confirmLoading={updateConfirmLoading}
                    visible={updadeVisible}
                    onOk={this.handleUpdateOk}
                    onCancel={this.handleUpdateCancel}
                >
                    <Warp>
                        <div className='tableListForm'>
                            <Form className="ant-advanced-search-form" layout="inline">
                                <FormItem label={<span>APP版本号<span style={{color: 'red'}}>*</span></span>} style={{minWidth: '90px'}}>
                                    {getFieldDecorator('UPAPP版本号', {
                                        rules: [{
                                            required: false,
                                            message: '',
                                        }],
                                    })(
                                        <div>
                                            <div>
                                                <Input
                                                    placeholder="请输入app版本号"
                                                    style={{ width: '100%' }}
                                                    className='input'
                                                    value={updateCode}
                                                    disabled={isUpdate}
                                                    onChange={(e) => {
                                                        this.setState({updateCode: this.handleSetValue(e.target.value)})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label={<span>版本名称<span style={{color: 'red'}}>*</span></span>} style={{minWidth: '90px'}}>
                                    {getFieldDecorator('版本名称', {
                                        rules: [{
                                            required: false,
                                            message: '此项为必填项',
                                        }],
                                    })(
                                        <div>
                                            <div>
                                                <Input
                                                    placeholder="请输入版本名称"
                                                    style={{ width: '100%' }}
                                                    className='input'
                                                    value={updateName}
                                                    disabled={isUpdate}
                                                    onChange={(e) => {this.setState({updateName: e.target.value})}}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label='下载地址' style={{minWidth: '90px'}}>
                                    {getFieldDecorator('下载地址')(
                                        <div>
                                            <div>
                                                <Input
                                                    placeholder="请输入下载地址"
                                                    style={{ width: '100%' }}
                                                    className='input'
                                                    disabled={isUpdate}
                                                    value={updateDownloadUrl}
                                                    onChange={(e) => {this.setState({updateDownloadUrl: e.target.value})}}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label={<span>强制更新<span style={{color: 'red'}}>*</span></span>}>
                                    {getFieldDecorator('强制更新', {
                                        rules: [{
                                            required: false,
                                            message: '此项为必填项',
                                        }],
                                    })(
                                        <div>
                                            <div id='update' style={{position: 'relative' }}>
                                                <Select
                                                    className='select' 
                                                    style={{ width: '100%' }}
                                                    value={updateoFrceUpdate}
                                                    onChange={(value) => {this.setState({updateoFrceUpdate: value})}}
                                                    getPopupContainer={() => document.getElementById('update')}
                                                >
                                                    <Option value={1}>强制更新</Option>
                                                    <Option value={0}>不强制更新</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label={<span>手机类型<span style={{color: 'red'}}>*</span></span>}>
                                    {getFieldDecorator('手机类型', {
                                        rules: [{
                                            required: false,
                                            message: '此项为必填项',
                                        }],
                                    })(
                                        <div>
                                            <div id='UMobile' style={{position: 'relative' }}>
                                                <Select
                                                    className='select' 
                                                    style={{ width: '100%' }}
                                                    value={updateType}
                                                    disabled={isUpdate}
                                                    onChange={(value) => {this.setState({updateType: value})}}
                                                    getPopupContainer={() => document.getElementById('UMobile')}
                                                >
                                                    <Option value='1'>android</Option>
                                                    <Option value='2'>ios</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label={<span>生效时间<span style={{color: 'red'}}>*</span></span>} style={{minWidth: '90px'}}>
                                    {getFieldDecorator('生效时间', {
                                        rules: [{
                                            required: false,
                                            message: '此项为必填项',
                                        }],
                                    })(
                                        <div>
                                            <div id='updateTime' style={{position: 'relative' }}>
                                                <DatePicker
                                                    disabledDate={this.disabledEndDate}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    placeholder='设置生效时间'
                                                    style={{width: '100%'}}
                                                    disabled={isUpdate}
                                                    showTime
                                                    onChange={(value, dateString) => this.handleEndOpenChange(value, dateString, 'updateEnableTime', 'updateEditTimeValue')}
                                                    value={updateEditTimeValue}
                                                    getCalendarContainer={() => document.getElementById('updateTime')}
                                                />
                                            </div>
                                        </div> 
                                    )}
                                </FormItem>
                                <FormItem label='最小版本号' style={{minWidth: '90px'}}>
                                    {getFieldDecorator('最小版本号')(
                                        <div>
                                            <div>
                                                <Input
                                                    placeholder="请输入最小版本号"
                                                    style={{ width: '100%' }}
                                                    className='input'
                                                    value={updateMincode}
                                                    disabled={isUpdate}
                                                    onChange={(e) => {
                                                        this.setState({updateMincode: this.handleSetValue(e.target.value)})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label={<span>提示信息<span style={{color: 'red'}}>*</span></span>} style={{minWidth: '90px'}}>
                                    {getFieldDecorator('提示信息')(
                                        <div>
                                            <div>
                                                <TextArea
                                                    style={{ width: '100%', height: '50px' }}
                                                    placeholder="请输入提示信息"
                                                    value={updateContent}
                                                    disabled={isUpdate}
                                                    maxLength='140'
                                                    onChange={(e) => {this.setState({updateContent: e.target.value})}}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label='备注' style={{minWidth: '90px'}}>
                                    {getFieldDecorator('备注')(
                                        <div>
                                            <div>
                                                <TextArea
                                                    style={{ width: '100%', height: '50px' }}
                                                    placeholder="请输入备注"
                                                    value={updateRemark}
                                                    maxLength='140'
                                                    onChange={(e) => {this.setState({updateRemark: e.target.value})}}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                    </Warp>
                </Modal>
                <Modal
                    title='新增版本'
                    confirmLoading={createConfirmLoading}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Warp>
                        <div className='tableListForm'>
                            <Form className="ant-advanced-search-form" layout="inline">
                                <FormItem label={<span>APP版本号<span style={{color: 'red'}}>*</span></span>} style={{minWidth: '90px'}}>
                                    {getFieldDecorator('APP版本号', {
                                        rules: [{
                                            required: false,
                                            message: '此项为必填项',
                                        }],
                                    })(
                                        <div>
                                            <div>
                                                <Input
                                                    placeholder="请输入app版本号"
                                                    style={{ width: '100%' }}
                                                    className='input'
                                                    value={appCode}
                                                    onChange={(e) => {
                                                        this.setState({appCode: this.handleSetValue(e.target.value)})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label={<span>版本名称<span style={{color: 'red'}}>*</span></span>} style={{minWidth: '90px'}}>
                                    {getFieldDecorator('版本名称', {
                                        rules: [{
                                            required: false,
                                            message: '此项为必填项',
                                        }],
                                    })(
                                        <div>
                                            <div>
                                                <Input
                                                    placeholder="请输入版本名称"
                                                    style={{ width: '100%' }}
                                                    className='input'
                                                    value={name}
                                                    onChange={(e) => {this.setState({name: e.target.value})}}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label='下载地址' style={{minWidth: '90px'}}>
                                    {getFieldDecorator('下载地址')(
                                        <div>
                                            <div>
                                                <Input
                                                    placeholder="请输入下载地址"
                                                    style={{ width: '100%' }}
                                                    className='input'
                                                    value={downloadUrl}
                                                    onChange={(e) => {this.setState({downloadUrl: e.target.value})}}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label={<span>强制更新<span style={{color: 'red'}}>*</span></span>}>
                                    {getFieldDecorator('强制更新', {
                                        rules: [{
                                            required: false,
                                            message: '此项为必填项',
                                        }],
                                    })(
                                        <div>
                                            <div id='create' style={{position: 'relative' }}>
                                                <Select
                                                    className='select' 
                                                    style={{ width: '100%' }}
                                                    value={CreateForceUpdate}
                                                    onChange={(value) => {this.setState({CreateForceUpdate: value})}}
                                                    getPopupContainer={() => document.getElementById('create')}
                                                >
                                                    <Option value={1}>强制更新</Option>
                                                    <Option value={0}>不强制更新</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label={<span>手机类型<span style={{color: 'red'}}>*</span></span>}>
                                    {getFieldDecorator('手机类型', {
                                        rules: [{
                                            required: false,
                                            message: '此项为必填项',
                                        }],
                                    })(
                                        <div>
                                            <div id='Mobile' style={{position: 'relative' }}>
                                                <Select
                                                    className='select' 
                                                    style={{ width: '100%' }}
                                                    value={createType}
                                                    onChange={(value) => {this.setState({createType: value})}}
                                                    getPopupContainer={() => document.getElementById('Mobile')}
                                                >
                                                    <Option value={1}>android</Option>
                                                    <Option value={2}>ios</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label={<span>生效时间<span style={{color: 'red'}}>*</span></span>} style={{minWidth: '90px'}}>
                                    {getFieldDecorator('生效时间', {
                                        rules: [{
                                            required: false,
                                            message: 'Input something!',
                                        }],
                                    })(
                                        <div>
                                            <div id='createTime' style={{position: 'relative' }}>
                                                <DatePicker
                                                    disabledDate={this.disabledEndDate}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    placeholder='设置生效时间'
                                                    style={{width: '100%'}}
                                                    showTime
                                                    onChange={(value, dateString) => this.handleEndOpenChange(value, dateString, 'enableTime', 'enableTimeValue')}
                                                    value={enableTimeValue}
                                                    getCalendarContainer={() => document.getElementById('createTime')}
                                                />
                                            </div>
                                        </div> 
                                    )}
                                </FormItem>
                                <FormItem label='最小版本号' style={{minWidth: '90px'}}>
                                    {getFieldDecorator('最小版本号')(
                                        <div>
                                            <div>
                                                <Input
                                                    placeholder="请输入最小版本号"
                                                    style={{ width: '100%' }}
                                                    className='input'
                                                    value={mincode}
                                                    onChange={(e) => {
                                                        this.setState({mincode: this.handleSetValue(e.target.value)})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label={<span>提示信息<span style={{color: 'red'}}>*</span></span>} style={{minWidth: '90px'}}>
                                    {getFieldDecorator('提示信息')(
                                        <div>
                                            <div>
                                                <TextArea
                                                    style={{ width: '100%', height: '50px' }}
                                                    placeholder="请输入提示信息"
                                                    value={content}
                                                    maxLength='140'
                                                    onChange={(e) => {this.setState({content: e.target.value})}}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem label='备注' style={{minWidth: '90px'}}>
                                    {getFieldDecorator('备注')(
                                        <div>
                                            <div>
                                                <TextArea
                                                    style={{ width: '100%', height: '50px' }}
                                                    placeholder="请输入备注"
                                                    maxLength='140'
                                                    value={remark}
                                                    onChange={(e) => {this.setState({remark: e.target.value})}}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                    </Warp>
                </Modal>
            </Warp>
        );
    }
}

export default connect(null, null)(Form.create({})(Version));