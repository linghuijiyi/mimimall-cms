import React, { Component } from 'react';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import { connect } from 'react-redux';
import { Button, Table, Modal, Input, Select, message, Spin, Icon } from 'antd';
import { Warp, QueryListWarp, CreateTime, CreateTimeItem, Search, Operation, Item, CharacterName, Name, CharacterInfo, CharacterInfoName } from './style';
import fatch from './../../../common/js/fatch';
import baseURl from './../../../common/js/baseURL';
import pagination from './../../../common/js/pagination';
import formatDateTime from './../../../common/js/formatDateTime';
const { TextArea } = Input;
const Option = Select.Option;
const styles = { red: 'red' };  
let disabled = false;
let restart = false;

class WhiteListControl extends Component {
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
                title: 'IP',
                key: 'ip',
                dataIndex: 'ip',
                align: 'center',
            }, 
            {
                title: '备注',
                key: 'remark',
                dataIndex: 'remark',
                align: 'center',
            },
            {
                title: '创建时间',
                key: 'createTime',
                dataIndex: 'createTime',
                align: 'center',
                render: (text, record) => {
                    return (
                        <span>{formatDateTime(record.createTime)}</span>
                    );
                }
            },
            {
                title: '更新时间',
                key: 'updateTime',
                dataIndex: 'updateTime',
                align: 'center',
                render: (text, record) => {
                    return (
                        <span>{formatDateTime(record.updateTime)}</span>
                    );
                }
            },
            {
                title: 'IP状态',
                key: 'IPState',
                dataIndex: 'IPState',
                align: 'center',
                render: (text, record) => {
                    if (record.state === '0') {
                        return <span>使用中</span>;
                    } else if (record.state === '1') {
                        return <span>已禁用</span>;
                    }
                }
            },
            {
                title: '操作人',
                key: 'operationName',
                dataIndex: 'operationName',
                align: 'center',
            },
            {
                title: '操作',
                key: 'operation',
                dataIndex: 'operation',
                align: 'center',
                width: 230,
                render: (text, record) => {
                    return (
                        this.state.dataSource.length
                        ? (
                            <Operation>
                                <Item className='edit'>
                                    <Button
                                        type='primary'
                                        onClick={this.handleUptadeClick.bind(this, record)}
                                    >
                                        <Icon>
                                            <i className='iconfont'>&#xe60a;</i>
                                        </Icon>
                                        编辑
                                    </Button>
                                </Item>
                                <Item className='elete' style={{display: record.state === '1' ? 'none' : 'block'}}>
                                    <Button
                                        type='primary'
                                        style={{background: 'red', border: '1px solid red'}}
                                        onClick={this.handleDelete.bind(this, record)}
                                    >
                                        <Icon>
                                            <i className='iconfont'>&#xe623;</i>
                                        </Icon>
                                        删除
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
             // 查询
            buttonLoading: false,
            readState: '',
            keyword: '',
            // 添加
            createIpVisible: false,
            createIpConfirmLoading: false,
            createIPValue: '',
            createRemark: '',
            // 删除
            deleteVisible: false,
            deleteconfirmLoading: false,
            deleteIp: '',
            deleteIpId: '',
            // 更新
            updateVisible: false,
            updateConfirmLoading: false,
            updateIp: '',
            updateId: '',
            updateRemark: '',
            // 重置Ip
            restartVisible: false,
            restartIp: '',
            restartRemark: '',
            restartState: '',
            restartId: '',
            restartConfirmLoading: false
        };
        this.params = { page: 1 }
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(this.props.location.state));
        this.requestList();
    }
    requestList = (buttonLoading) => {
        const url = `${baseURl}sys/whiteList/list`;
        const { readState, keyword } = this.state;
        let _this = this;
        if (buttonLoading) {
            this.setState({buttonLoading: true});
            this.params.page = 1;
        }
        this.showAndHideLoading(true);
        const params = {
            pageNo: this.params.page,
            state: readState, 
            keyword
        }
        fatch(url, 'post', params, (err, state) => {
            this.setState({buttonLoading: state});
            this.showAndHideLoading(state);
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.result;
                result.map((item, index) => {
                    item.key = index;
                    if (item.manager !== null ) item.operationName = item.manager.name
                });
                this.setState({
                    buttonLoading: false,
                    dataSource: result,
                    pagination: pagination(res.data, (current) => {
                        _this.params.page = current;
                        this.requestList();
                    })
                });
                this.showAndHideLoading(false);
                if (buttonLoading) {
                    message.info(res.msg);
                }
            } else {
                this.setState({buttonLoading: false});
                this.showAndHideLoading(false);
                message.info(res.msg);
            }
        });
    }
    /***********************添加***************************/
    handleAddIPClick = () => {
        this.setState({createIpVisible: true});
    }
    handleAddIpOk = () => {
        const url = `${baseURl}sys/whiteList/saveOrUpdate`;
        const { createIPValue, createRemark } = this.state;
        if (createIPValue === '') {
            message.info('ip地址不能为空！');
            return;
        }
        if (!this.isValidIP(createIPValue)) {
            message.info('ip格式错误，请检查ip格式！');
            return;
        }
        this.setState({createIpConfirmLoading: true});
        const params = {
            ip: createIPValue,
            remark: createRemark
        }
        fatch(url, 'post', params, (err, state) => {
            this.setState({createIpConfirmLoading: state});
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    createIpConfirmLoading: false,
                    createIpVisible: false,
                    createIPValue: '',
                    createRemark: ''
                });
                setTimeout(() => {
                    this.requestList();
                    message.info(res.msg);
                }, 300);
            } else {
                this.setState({createIpConfirmLoading: false});
                message.info(res.msg);
            }
        });
    }
    handleAddIpCancel = () => {
        this.setState({
            createIpVisible: false,
            createIPValue: '',
            createRemark: ''
        });
    }
    /**********************查询****************************/
    handleQueryList = () => {
        const { keyword } = this.state;
        const regEn = /[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/im;
        const regCn = /[！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (regEn.test(keyword) || regCn.test(keyword)) {
            message.info('关键字不能包含特殊字符');
            return;
        }
        this.requestList(true);
    }
    /**********************删除****************************/
    handleDelete(record) {  
        this.setState({
            deleteVisible: true,
            deleteIp: record.ip,
            deleteIpId: record.id
        });
    }
    handleDeleteOk = () => {
        const url = `${baseURl}sys/whiteList/delete`;
        this.setState({deleteconfirmLoading: true});
        fatch(url, 'post', { id: this.state.deleteIpId }, (err, state) => {
            this.setState({deleteconfirmLoading: state});
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    deleteVisible: false,
                    deleteconfirmLoading: false
                });
                setTimeout(() => {
                    this.requestList();
                    message.info(res.msg);
                }, 300);
            } else {
                this.setState({deleteconfirmLoading: false});
                message.info(res.msg);
            }
        });
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    /**********************编辑****************************/
    handleUptadeClick(record) {
        if (record.state === '0') {
            this.setState({
                updateVisible: true,
                updateIp: record.ip,
                updateId: record.id,
                updateRemark: record.remark
            });
        } else {
            this.setState({
                restartVisible: true,
                restartIp: record.ip,
                restartRemark: record.remark,
                restartState: record.state,
                restartId: record.id
            });
        }
    }
    handleUpdateOk = () => {
        const url = `${baseURl}sys/whiteList/saveOrUpdate`;
        const { updateId, updateIp, updateRemark } = this.state;
        if (updateIp === '') {
            message.info('请输入IP地址！');
            return;
        }
        if (!this.isValidIP(updateIp)) {
            message.info('ip格式错误，请检查ip格式！');
            return;
        }
        this.setState({updateConfirmLoading: true});
        const params = {
            id: updateId,
            ip: updateIp,
            remark: updateRemark,
        }
        fatch(url, 'post', params, (err, state) => {
            this.setState({updateConfirmLoading: state});
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    updateConfirmLoading: false,
                    updateVisible: false,
                    updateId: '',
                    updateIp: '',
                    updateRemark: '',
                });
                setTimeout(() => {
                    this.requestList();
                    message.info(res.msg);
                }, 300);
            } else {
                this.setState({updateConfirmLoading: false});
                message.info(res.msg);
            }
        });
    }
    handleUpdateCancel = () => {
        this.setState({
            updateVisible: false
        })
    }
    handleRestartOk = () => {
        const url = `${baseURl}sys/whiteList/saveOrUpdate`;
        const { restartId, restartState, restartIp, restartRemark } = this.state;
        const params = {
            id: restartId,
            remark: restartRemark,
            ip: restartIp,
            state: restartState
        }
        this.setState({restartConfirmLoading: true});
        fatch(url, 'post', params, (err, state) => {
            this.setState({restartConfirmLoading: state});
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    restartVisible: false,
                    restartConfirmLoading: false,
                    restartIp: '',
                    restartRemark: '',
                    restartState: '',
                    restartId: ''
                });
                setTimeout(() => {
                    this.requestList();
                    message.info(res.msg);
                }, 300);
            } else {
                this.setState({restartConfirmLoading: false});
                message.info(res.msg);
            }
        });
    }
    handleRestartCancel = () => {
        this.setState({
            restartVisible: false
        })
    }
    // 表格样式
    setClassName = (record, index) => {
        return ( record.state  === '1' ? styles.red : '');
    }
    // 校验ip地址格式
    isValidIP = (ip) => {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        return reg.test(ip);
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { 
            dataSource, 
            buttonLoading,
            readState,
            keyword,
            createIpVisible,
            createIpConfirmLoading,
            createIPValue,
            createRemark,
            deleteVisible, 
            deleteconfirmLoading,
            deleteIp,
            updateVisible,
            updateIp,
            updateRemark,
            updateConfirmLoading,
            restartVisible,
            restartState,
            restartIp,
            restartRemark,
            restartConfirmLoading
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
                        <CreateTimeItem id='state' style={{position: 'relative' }}>
                            <span>IP状态:</span>
                            <Select
                                value={readState}
                                style={{ width: 200 }}
                                onChange={(value) => {this.setState({readState: value})}}
                                getPopupContainer={() => document.getElementById('state')}
                            >
                                <Option value=''>全部</Option>
                                <Option value='0'>使用中</Option>
                                <Option value='1'>已禁用</Option>
                            </Select>
                        </CreateTimeItem>
                        <CreateTimeItem>
                            <span>关键词:</span>
                            <Input style={{ width: 200 }} value={keyword} onChange={(e) => {this.setState({keyword: e.target.value})}}/>
                        </CreateTimeItem>
                        <Search>
                            <Button type='primary' loading={buttonLoading} onClick={this.handleQueryList}>
                                查询
                            </Button>
                        </Search>
                    </CreateTime>
                </QueryListWarp>
                <Button type='primary' style={{marginBottom: 15}} onClick={this.handleAddIPClick}>
                    新增IP
                </Button>
                <Table bordered pagination={this.state.pagination} dataSource={dataSource} columns={columns} rowClassName={this.setClassName} />
                {/******************删除IP******************/}
                <Modal
                    width={300}
                    closable={false}
                    visible={deleteVisible}
                    onOk={this.handleDeleteOk}
                    confirmLoading={deleteconfirmLoading}
                    onCancel={this.handleDeleteCancel}
                >
                    <p>确定要删除【<span style={{color: 'red'}}>{deleteIp}</span>】IP地址吗？</p>
                </Modal>
                {/******************编辑IP******************/}
                <Modal
                    title='编辑IP'
                    okText='提交'
                    cancelText='取消'
                    maxLength='160'
                    width={400}
                    visible={updateVisible}
                    confirmLoading={updateConfirmLoading}
                    closable={false}
                    onOk={this.handleUpdateOk}
                    onCancel={this.handleUpdateCancel}
                >
                    <CharacterName>
                        <Name>IP:</Name>
                        <Input 
                            value={updateIp}
                            disabled={disabled}
                            onChange={(e) => {this.setState({updateIp: e.target.value})}}
                          />
                    </CharacterName>
                    <CharacterInfo>
                        <CharacterInfoName>备注:</CharacterInfoName>
                        <TextArea 
                            style={{ height: 100 }}
                            maxLength='160'
                            value={updateRemark}
                            disabled={disabled}
                            onChange={(e) => {this.setState({updateRemark: e.target.value})}}
                        />
                    </CharacterInfo>
                    <CharacterInfo style={{display: restart ? 'block' : 'none'}}>
                        <CharacterInfoName>IP状态:</CharacterInfoName>
                        <Select value='0' style={{ width: 200 }}>
                            <Option value='0'>使用中</Option>
                            <Option value='1'>已禁用</Option>
                        </Select>
                    </CharacterInfo>
                </Modal>
                {/*********************重置IP状态****************/}
                <Modal
                    title='重置IP状态'
                    okText='提交'
                    cancelText='取消'
                    maxLength='160'
                    width={400}
                    visible={restartVisible}
                    confirmLoading={restartConfirmLoading}
                    closable={false}
                    onOk={this.handleRestartOk}
                    onCancel={this.handleRestartCancel}
                >
                    <CharacterName>
                        <Name>IP:</Name>
                        <Input 
                            value={restartIp}
                            disabled={true}
                        />
                    </CharacterName>
                    <CharacterInfo>
                        <CharacterInfoName>备注:</CharacterInfoName>
                        <TextArea 
                            style={{ height: 100 }}
                            maxLength='160'
                            value={restartRemark}
                            disabled={true}
                        />
                    </CharacterInfo>
                    <CharacterInfo>
                        <CharacterInfoName>IP状态:</CharacterInfoName>
                        <Select value={restartState} style={{ flex: 1 }} onChange={(value) => {this.setState({restartState: value})}}>
                            <Option value='0'>使用中</Option>
                            <Option value='1'>已禁用</Option>
                        </Select>
                    </CharacterInfo>
                </Modal>
                {/******************添加IP******************/}
                <Modal
                    title='添加IP'
                    okText='提交'
                    cancelText='取消'
                    width={400}
                    visible={createIpVisible}
                    confirmLoading={createIpConfirmLoading}
                    closable={false}
                    onOk={this.handleAddIpOk}
                    onCancel={this.handleAddIpCancel}
                >
                    <CharacterName>
                        <Name>IP:</Name>
                        <Input 
                            value={createIPValue}
                            onChange={(e) => {this.setState({createIPValue: e.target.value})}}
                        />
                    </CharacterName>
                    <CharacterInfo>
                        <CharacterInfoName>备注:</CharacterInfoName>
                        <TextArea 
                            style={{ height: 100 }}
                            maxLength='160'
                            value={createRemark}
                            onChange={(e) => {this.setState({createRemark: e.target.value})}}
                        />
                    </CharacterInfo>
                </Modal>
            </Warp>
        );
    }
}

export default connect(null, null)(WhiteListControl);