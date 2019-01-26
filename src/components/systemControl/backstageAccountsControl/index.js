import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table, Modal, DatePicker, message, Select, Input, Spin, Icon } from 'antd';
import { Warp, Operation, Item, UpdateWarp, UpdateItem, QueryListWarp, CreateTime, CreateTimeItem, Search } from './style';
import fatch from './../../../common/js/fatch';
import baseURl from './../../../common/js/baseURL';
import pagination from './../../../common/js/pagination';
import formatDateTime from './../../../common/js/formatDateTime';
import { regEn, regCn } from './../../../common/js/regExp';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const styles = { red: 'red' };

class BackstageAccountsControl extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '编号',
                key: 'id',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '帐号',
                key: 'loginName',
                dataIndex: 'loginName',
                align: 'center',
            },
            {
                title: '名称',
                key: 'name',
                dataIndex: 'name',
                align: 'center',
            },
            {
                title: '角色',
                key: 'role',
                dataIndex: 'role',
                align: 'center',
            },
            {
                title: '创建时间',
                key: 'creatTime',
                dataIndex: 'creatTime',
                align: 'center',
                render: (text, record) => {
                    return (<span>{formatDateTime(record.creatTime)}</span>);
                }
            },
            {
                title: '更新时间',
                key: 'updateTime',
                dataIndex: 'updateTime',
                align: 'center',
                render: (text, record) => {
                    return (<span>{formatDateTime(record.updateTime)}</span>);
                }
            },
            {
                title: '操作人',
                key: 'operationName',
                dataIndex: 'operationName',
                align: 'center',
            },
            {
                title: '帐号状态',
                key: 'stages',
                dataIndex: 'stages',
                align: 'center',
                render: (text, record) => {
                    if (record.state === '0') return <span>使用中</span>;
                    else if (record.state === '1') return <span>已禁用</span>;
                }
            },
            {
                title: '操作',
                key: 'operation',
                dataIndex: 'operation',
                align: 'center',
                width: 250,
                render: (text, record) => {
                    return (
                        this.state.dataSource.length
                        ? (
                            <Operation>
                                <Item className='edit' style={{display: record.loginName === 'admin' ? 'none' : 'block'}}>
                                    <Button
                                        type='primary'
                                        onClick={this.handleUpdateClick.bind(this, record)}
                                    >
                                        <Icon>
                                            <i className='iconfont'>&#xe60a;</i>
                                        </Icon>
                                        编辑
                                    </Button>
                                </Item>
                                <Item className='elete'>
                                    <Button
                                        type='primary'
                                        style={{background: 'red', border: '1px solid red'}}
                                        onClick={this.handleResetPasswordClick.bind(this, record)}
                                    >
                                        <Icon>
                                            <i className='iconfont'>&#xe602;</i>
                                        </Icon>
                                        重置密码
                                    </Button>
                                </Item>
                            </Operation>
                        ) : null
                    );
                },
            }
        ];
        this.state = {
            dataSource: [],
            // 查询数据
            buttonLoading: false,
            createTimeValue: '',
            rolesList: '', // 领导列表
            endTimeValue: '',
            startValue: null,
            endValue: null,
            readRoleId: '', //查询角色id
            state: '', // 查询角色使用状态
            keywordValue: '',
            readDefaultValue: '', // 查询角色默认字段
            accountsChoice: '', // 角色列表数据
            // 添加帐号
            createAccountsVisible: false,
            createConfirmLoading: false,
            createLeaderList: '',
            createLoginName: '',
            createName: '',
            createPhone: '',
            createdDefaultRoleValue: '请选择角色',
            createDefaultLeaderValue: '无',
            createState: '0',
            createWiteState: '0',
            // 更新角色
            updateConfirmLoading: false,
            updateVisible: false,
            updateRoleID: '',
            updateLoginName: '',
            updateUsername: '',
            updateUserphone: '',
            updateRoleValue: '',
            updateUserLeaderID: '',
            updateLeaderList: '', // 所属领导列表
            updateUserstate: '', // 状态
            updateWhiteState: '', // 白名单状态
            // 重置
            resetConfirmLoading: false,
            resetPasswordVisible: false,
            resetName: '',
            resetID: '',
        };
        this.params = { page: 1 };
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(this.props.location.state));
        this.requestList();
    }
    requestList = (buttonLoading) => {
        if (buttonLoading) {
            this.setState({buttonLoading: true});
            this.params.page = 1;
        }
        this.showAndHideLoading(true);
        const url = `${baseURl}sys/manager/list`;
        const { createTimeValue, endTimeValue, readRoleId, state, keywordValue } = this.state;
        let _this = this;
        const params = {
            pageNo: this.params.page,
            beginTime: createTimeValue,
            endTime: endTimeValue,
            keyword: keywordValue,
            roleId: readRoleId,
            state
        }
        fatch(url, 'post', params, (err, state) => {
            this.setState({buttonLoading: state});
            this.showAndHideLoading(state);
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const accountsList = res.data.result;
                const roles = res.data.roles;
                accountsList.map((item, index) => {
                    if (item.creat !== null) item.operationName = item.creat.name;
                    item.role = item.role.name;
                    item.key = index;
                    item.Leader = item.leader;
                });
                this.setState({
                    dataSource: accountsList,
                    rolesList: roles,
                    pagination: pagination(res.data, (current) => {
                        _this.params.page = current;
                        this.requestList();
                    })
                });
                this.showAndHideLoading(false);
                if (buttonLoading) {
                    this.setState({
                        buttonLoading: false
                    });
                    message.info(res.msg);
                }
                this.getaccountsChoiceList(roles);
            } else {
                this.setState({buttonLoading: false});
                this.showAndHideLoading(false);
                message.info(res.msg);
            }
        });
    }
    /**********************获取选择日期的值*************************/
    handleDatePickerCreateChange = (value, dateString) => {
        this.setState({createTimeValue: dateString});
        this.timeChange('startValue', value);
    }
    handleDatePickerEndChange = (value, dateString) => {
        this.setState({endTimeValue: dateString});
        this.timeChange('endValue', value);
    }
    timeChange = (field, value) => {
        this.setState({[field]: value});
    }
    disabledStartDate = (startValue) => {
        // const endValue = this.state.endValue;
        // if (!startValue || !endValue) return false;
        // return startValue.valueOf() > endValue.valueOf();
    }
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }

    /***************************查询*************************/
    handleQueryList = () => {
        const { keywordValue } = this.state;
        if (regEn.test(keywordValue) || regCn.test(keywordValue)) {
            message.info('关键字不能包含特殊字符');
            return;
        }
        this.requestList(true);
    }

    /********************添加角色**************************/
    handelAddAccountsClick = () => {
        const url = `${baseURl}sys/manager/managers`;
        fatch(url, 'post', {}, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const managers = res.data;
                this.setState({createAccountsVisible: true});
                this.getLeaderList(managers, true);
            } else {}
        });
    }
    handleAccountsOk = () => {
        const url = `${baseURl}sys/manager/saveOrUpdate`;
        const { createLoginName, createName, createPhone, createdDefaultRoleValue, createState, createWiteState, createDefaultLeaderValue } = this.state;
        if (createLoginName === '') {
            message.info('请输入登录名称');
            return;
        }
        if (regEn.test(createLoginName) || regCn.test(createLoginName)) {
            message.info('名称不能包含特殊字符');
            return;
        }
        if (createName === '') {
            message.info('请输入用户名');
            return;
        }
        if (regEn.test(createName) || regCn.test(createName)) {
            message.info('用户名不能包含特殊字符');
            return;
        }
        if (createPhone === '') {
            message.info('请输入手机号');
            return;
        }
        if (!this.isPoneAvailable(createPhone)) {
            message.info('手机号格式错误');
            return;
        }
        if (createdDefaultRoleValue === '请选择角色') {
            message.info('请选择角色');
            return;
        }
        if (createDefaultLeaderValue === '无') {
            message.info('请选择所属领导');
            return;
        }
        this.setState({createConfirmLoading: true});
        const params = {
            loginName: createLoginName,
            leaderId: createDefaultLeaderValue,
            name: createName,
            phone: createPhone,
            roleId: createdDefaultRoleValue,
            state: createState,
            whiteList: createWiteState
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({createConfirmLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    createConfirmLoading: false,
                    createAccountsVisible: false,
                    createdDefaultRoleValue: '请选择角色',
                    createDefaultLeaderValue: '无',
                    createLoginName: '',
                    createName: '',
                    createPhone: '',
                    createState: '0',
                    createWiteState: '0'
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestList();
                }, 300);
            }  else {
                message.info(res.msg);
                this.setState({createConfirmLoading: false});
            }
        });
    }
    handleAccountsCancel = () => {
        this.setState({
            createAccountsVisible: false,
            createdDefaultRoleValue: '请选择角色',
            createDefaultLeaderValue: '无',
            createLoginName: '',
            createName: '',
            createPhone: '',
            createState: '0',
            createWiteState: '0'
        });
    }

    /**********************删除****************************/
    handleResetPasswordClick(record) {
        this.setState({
            resetPasswordVisible: true,
            resetName: record.name,
            resetID: record.id
        });
    }
    handleResetPasswordOk = () => {
        const url = `${baseURl}sys/manager/resetPassword`;
        this.setState({resetConfirmLoading: true});
        fatch(url, 'post', { id: this.state.resetID }, (err, state) => {
            this.setState({resetConfirmLoading: state});
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    resetConfirmLoading: false,
                    resetPasswordVisible: false,
                    resetName: '',
                    resetID: ''
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestList();
                }, 300);
            } else {
                this.setState({resetConfirmLoading: false});
                message.info(res.msg);
            }
        });
    }
    handleResetPasswordCancel = () => {
        this.setState({resetPasswordVisible: false});
    }
    /**********************帐号编辑****************************/
    handleUpdateClick(record) {
        const { rolesList } = this.state;
        const url = `${baseURl}sys/manager/managers`;
        fatch(url, 'post', {}, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const managers = res.data;
                if (record.leader !== null) {
                    for (let i = 0; i < managers.length; i++) {
                        if (record.leader.id === managers[i].id) {
                            this.setState({updateUserLeaderID: managers[i].id});
                        }
                    }
                } else {
                    this.setState({updateUserLeaderID: '0'});
                }
                this.setState({
                    updateVisible: true,
                    updateRoleID: record.id,
                    updateLoginName: record.loginName,
                    updateUsername: record.name,
                    updateUserphone: record.phone,
                    updateUserstate: record.state,
                    updateWhiteState: record.whiteList,
                });
                this.getLeaderList(managers);
                // 显示自己的角色名称
                for (let i = 0; i < rolesList.length; i++) {
                    if (record.roleId === rolesList[i].id) this.setState({updateRoleValue: rolesList[i].id});
                    else {}
                }
            } else {}
        });
    }
    handleUpdateOk = () => {
        let { updateRoleID, updateLoginName, updateUsername, updateUserphone, updateRoleValue, updateUserLeaderID, updateUserstate, updateWhiteState } = this.state;
        if (updateLoginName === '') {
            message.info('请输入登录名称！');
            return;
        }
        if (regEn.test(updateLoginName) || regCn.test(updateLoginName)) {
            message.info('名称不能包含特殊字符');
            return;
        }
        if (updateUsername === '') {
            message.info('请输入帐号！');
            return;
        }
        if (regEn.test(updateUsername) || regCn.test(updateUsername)) {
            message.info('帐号不能包含特殊字符');
            return;
        }
        if (updateUserphone !== '') {
            if (!this.isPoneAvailable(updateUserphone)) {
                message.info('手机号格式错误');
                return;
            }
        }
        this.setState({updateConfirmLoading: true});
        const url = `${baseURl}sys/manager/saveOrUpdate`;
        if (updateUserLeaderID === '0') updateUserLeaderID = '';
        const params = {
            id: updateRoleID,
            leaderId: updateUserLeaderID,
            loginName: updateLoginName,
            name: updateUsername,
            phone: updateUserphone,
            roleId: updateRoleValue,
            state: updateUserstate,
            whiteList: updateWhiteState
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({updateConfirmLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    updateVisible: false,
                    updateConfirmLoading: false,
                    updateRoleID: '',
                    updateUserLeaderID: '',
                    updateLoginName: '',
                    updateUsername: '',
                    updateUserphone: '',
                    updateRoleValue: '',
                    updateUserstate: '',
                    updateWhiteState: ''
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestList();
                }, 300);
            } else {
                message.info(res.msg);
                this.setState({updateConfirmLoading: false});
            }
        });
    }
    handleUpdateCancel = () => {
        this.setState({updateVisible: false});
    }
    // 获取帐号状态
    getaccountsChoiceList = (data) => {
        data.unshift({name: '全部', id: ''});
        if (data) {
            const list = data.map((item) => (<Option value={item.id} key={item.id}>{item.name}</Option>));
            this.setState({accountsChoice: list});
        }
    }
    // 获取所属领导
    getLeaderList(data, flag) {
        data.unshift({name: '无', id: '0'});
        if (data) {
            const list = data.map((item) => (<Option value={item.id} key={item.id}>{item.name}</Option>));
            flag ? (this.setState({createLeaderList: list})) : (this.setState({updateLeaderList: list}));
        }
    }
    isPoneAvailable = (phone) => {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        return reg.test(phone);
    }
    // 设置禁用列表行颜色
    setClassName = (record, index) => (record.state === '1' ? styles.red : '');
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const {
            dataSource,
            buttonLoading,
            startValue,
            endValue,
            keywordValue,
            state,
            readDefaultValue,
            createAccountsVisible,
            accountsChoice,
            createLeaderList,
            createLoginName,
            createName,
            createPhone,
            createdDefaultRoleValue,
            createState,
            createWiteState,
            createDefaultLeaderValue,
            createConfirmLoading,
            updateConfirmLoading,
            updateVisible,
            updateLoginName,
            updateUsername,
            updateUserphone,
            updateRoleValue,
            updateUserLeaderID,
            updateLeaderList,
            updateUserstate,
            updateWhiteState,
            resetConfirmLoading,
            resetPasswordVisible,
            resetName
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
        return (
            <Warp>
                <QueryListWarp>
                    <CreateTime>
                        <CreateTimeItem id='createTime' style={{position: 'relative' }}>
                            <span>创建时间:</span>
                            <DatePicker
                                disabledDate={this.disabledStartDate}
                                onChange={this.handleDatePickerCreateChange}
                                placeholder='选择开始日期'
                                value={startValue}
                                format={dateFormat}
                                getCalendarContainer={() => document.getElementById('createTime')}
                            />
                            <span>到</span>
                            <DatePicker
                                disabledDate={this.disabledEndDate}
                                onChange={this.handleDatePickerEndChange}
                                placeholder='选择开始日期'
                                value={endValue}
                                format={dateFormat}
                                getCalendarContainer={() => document.getElementById('createTime')}
                            />
                        </CreateTimeItem>
                        <CreateTimeItem id='zhzt' style={{position: 'relative' }}>
                            <span>账号状态:</span>
                            <Select
                                style={{ width: 300 }}
                                value={state}
                                onChange={(value) => {this.setState({state: value})}}
                                getPopupContainer={() => document.getElementById('zhzt')}
                            >
                                <Option value=''>全部</Option>
                                <Option value='0'>使用中</Option>
                                <Option value='1'>已禁用</Option>
                            </Select>
                        </CreateTimeItem>
                    </CreateTime>
                    <CreateTime>
                        <CreateTimeItem id='jexz' style={{position: 'relative' }}>
                            <span>角色选择:</span>
                            <Select
                                value={readDefaultValue}
                                style={{ width: 300 }}
                                onChange={(value) => {this.setState({readRoleId: value, readDefaultValue: value})}}
                                getPopupContainer={() => document.getElementById('jexz')}
                            >
                                {accountsChoice}
                            </Select>
                        </CreateTimeItem>
                        <CreateTimeItem>
                            <span>关&nbsp;键&nbsp; 词:</span>
                            <Input style={{ width: 300 }} value={keywordValue} onChange={(e) => {this.setState({keywordValue: e.target.value})}} />
                        </CreateTimeItem>
                    </CreateTime>
                    <Search>
                        <Button type='primary' loading={buttonLoading} onClick={this.handleQueryList}>查询</Button>
                    </Search>
                </QueryListWarp>
                <Button type='primary' style={{marginBottom: 15}} onClick={this.handelAddAccountsClick}>
                    添加帐号
                </Button>
                <Table
                    bordered
                    pagination={this.state.pagination}
                    dataSource={dataSource}
                    columns={columns}
                    rowClassName={this.setClassName}
                    style={{'overflowX': 'auto'}}
                />
                <Modal
                    width={300}
                    closable={false}
                    bodyStyle={{textAlign: 'center'}}
                    confirmLoading={resetConfirmLoading}
                    visible={resetPasswordVisible}
                    onOk={this.handleResetPasswordOk}
                    onCancel={this.handleResetPasswordCancel}
                >
                    <p>确定将<span style={{color: 'red'}}>【{resetName}】</span>帐号的密码重置？</p>
                </Modal>
                {/*******************编辑帐号********************/}
                <Modal
                    title='账号编辑'
                    okText='提交'
                    cancelText='取消'
                    confirmLoading={updateConfirmLoading}
                    visible={updateVisible}
                    closable={false}
                    onOk={this.handleUpdateOk}
                    onCancel={this.handleUpdateCancel}
                >
                    <UpdateWarp>
                        <UpdateItem>
                            <div className='name'>登录名称:</div>
                            <div className='input'>
                                <Input
                                    style={{ width: 300 }}
                                    value={updateLoginName}
                                    onChange={(e) => {this.setState({updateLoginName: e.target.value})}}
                                />
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>用户名:</div>
                            <div className='input'>
                                <Input
                                    style={{ width: 300 }}
                                    value={updateUsername}
                                    onChange={(e) => {this.setState({updateUsername: e.target.value})}}
                                />
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>电话号码:</div>
                            <div className='input'>
                                <Input
                                    style={{ width: 300 }}
                                    value={updateUserphone}
                                    onChange={(e) => {this.setState({updateUserphone: e.target.value})}}
                                />
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>角色:</div>
                            <div className='input' id='bjjs' style={{position: 'relative' }}>
                                <Select
                                    value={updateRoleValue}
                                    style={{ width: 300 }}
                                    onChange={(value) => {this.setState({updateRoleValue: value})}}
                                    getPopupContainer={() => document.getElementById('bjjs')}
                                >
                                    {accountsChoice}
                                </Select>
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>所属领导:</div>
                            <div className='input' id='ssld' style={{position: 'relative' }}>
                                <Select
                                    value={updateUserLeaderID}
                                    style={{ width: 300 }}
                                    onChange={(value) => {this.setState({updateUserLeaderID: value})}}
                                    getPopupContainer={() => document.getElementById('ssld')}
                                >
                                    {updateLeaderList}
                                </Select>
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>状态:</div>
                            <div className='input' id='state' style={{position: 'relative' }}>
                                <Select
                                    value={updateUserstate}
                                    style={{ width: 300 }}
                                    onChange={(value) => {this.setState({updateUserstate: value})}}
                                    getPopupContainer={() => document.getElementById('state')}
                                >
                                    <Option value="0">启用</Option>
                                    <Option value="1">禁用</Option>
                                </Select>
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>IP白名单验证:</div>
                            <div className='input' id='bmd' style={{position: 'relative' }}>
                                <Select
                                    value={updateWhiteState}
                                    style={{ width: 300 }}
                                    onChange={(value) => {this.setState({updateWhiteState: value})}}
                                    getPopupContainer={() => document.getElementById('bmd')}
                                >
                                    <Option value='0'>需要</Option>
                                    <Option value='1'>不需要</Option>
                                </Select>
                            </div>
                        </UpdateItem>
                    </UpdateWarp>
                </Modal>
                {/*******************添加帐号********************/}
                <Modal
                    title='添加帐号'
                    okText='提交'
                    cancelText='取消'
                    confirmLoading={createConfirmLoading}
                    visible={createAccountsVisible}
                    onOk={this.handleAccountsOk}
                    onCancel={this.handleAccountsCancel}
                    closable={false}
                >
                    <UpdateWarp>
                        <UpdateItem>
                            <div className='name'>登录名称:</div>
                            <div className='input'>
                                <Input
                                    style={{ width: 300 }}
                                    value={createLoginName}
                                    placeholder='登录名称'
                                    onChange={(e) => {this.setState({createLoginName: e.target.value})}}
                                />
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>用户名:</div>
                            <div className='input'>
                                <Input
                                    style={{ width: 300 }}
                                    value={createName}
                                    placeholder='用户名'
                                    onChange={(e) => {this.setState({createName: e.target.value})}}
                                />
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>电话号码:</div>
                            <div className='input'>
                                <Input
                                    style={{ width: 300 }}
                                    value={createPhone}
                                    placeholder='电话号码'
                                    onChange={(e) => {this.setState({createPhone: e.target.value})}}
                                />
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>角色:</div>
                            <div className='input' id='creactjs' style={{position: 'relative' }}>
                                <Select
                                    value={createdDefaultRoleValue}
                                    style={{ width: 300 }}
                                    onChange={(value) => {this.setState({createdDefaultRoleValue: value})}}
                                    getPopupContainer={() => document.getElementById('creactjs')}
                                >
                                    {accountsChoice}
                                </Select>
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>所属领导:</div>
                            <div className='input' id='createld' style={{position: 'relative' }}>
                                <Select
                                    value={createDefaultLeaderValue}
                                    style={{ width: 300 }}
                                    onChange={(value) => {this.setState({createDefaultLeaderValue: value})}}
                                    getPopupContainer={() => document.getElementById('createld')}
                                >
                                    {createLeaderList}
                                </Select>
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>状态:</div>
                            <div className='input' id='createstate' style={{position: 'relative' }}>
                                <Select
                                    style={{ width: 300 }}
                                    value={createState}
                                    onChange={(value) => {this.setState({createState: value})}}
                                    getPopupContainer={() => document.getElementById('createstate')}
                                >
                                    <Option value='0'>启用</Option>
                                    <Option value='1'>禁用</Option>
                                </Select>
                            </div>
                        </UpdateItem>
                        <UpdateItem>
                            <div className='name'>IP白名单验证:</div>
                            <div className='input' id='createbmd' style={{position: 'relative' }}>
                                <Select
                                    style={{ width: 300 }}
                                    value={createWiteState}
                                    onChange={(value) => {this.setState({createWiteState: value})}}
                                    getPopupContainer={() => document.getElementById('createbmd')}
                                >
                                    <Option value='0'>需要</Option>
                                    <Option value='1'>不需要</Option>
                                </Select>
                            </div>
                        </UpdateItem>
                    </UpdateWarp>
                </Modal>
            </Warp>
        );
    }
}

export default connect(null, null)(BackstageAccountsControl);
