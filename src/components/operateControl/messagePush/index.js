import React, { Component } from 'react';
import { Select, Button, Table, Modal, Input, message, Spin, Tag, Radio, Upload, Icon  } from 'antd';
import { 
    Warp, 
    QueryListWarp, 
    CreateTimeItem, 
    Search, 
    Operation, 
    Item,
    SendWarp,
    SendPlatform,
    SendInfo,
    SendType,
    PushWrap,
    CreateItem
} from './style';
import { connect } from 'react-redux';
import { HomeActionCreators } from './../../../base/home/store';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import fatch from './../../../common/js/fatch';
import pagination from './../../../common/js/pagination';
import baseURL from './../../../common/js/baseURL';
import formatDateTime from './../../../common/js/formatDateTime';
import history from './../../../history';
import reqwest from 'reqwest';
import Storage from './../../../common/js/storage';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const download = `${baseURL}static/mimidai/csv/template.csv`;
class MessagePush extends Component {
    constructor(props) {    
        super(props);
        this.columns = [
            {
                title: '活动名称',
                dataIndex: 'name',
                align: 'center',
            }, 
            {
                title: '活动期限',
                align: 'center',
                render: (text, record) => {
                    if (record.status === '2') return <div>{formatDateTime(record.startTime)} ~ {formatDateTime(record.endTime)}</div>;
                    else return <div>{formatDateTime(record.startTime)}</div>;
                }
            }, 
            {
                title: '用户总数',
                dataIndex: 'userCount',
                align: 'center',
            },
            {
                title: '活动状态',
                dataIndex: 'status',
                align: 'center',
                render: (text, record) => {
                    if (record.status === '0') return <Tag color="#f50">未开始</Tag>;
                    else if (record.status === '1') return <Tag color="#87d068">进行中</Tag>;
                    else if (record.status === '2') return <Tag color="#2db7f5">已结束</Tag>;
                }
            },
            {
                title: '短信状态',
                dataIndex: 'smsStatus',
                align: 'center',
                render: (text, record) => <div>{record.userCount}/{record.smsStatus}</div>,
            },
            {
                title: '操作',
                dataIndex: 'caozuo',
                align: 'center',
                width: '20%',
                render: (text, record) => {
                    let showsms = 'block';
                    let pushStatus = 'block';
                    if (record.smsStatus !== null && record.smsStatus !== '0') showsms = 'none';
                    if (record.pushStatus !== null && record.pushStatus !== '0') pushStatus = 'none';
                    if (record.status !== null && record.status === '2') {
                        showsms = 'none';
                        pushStatus = 'none';
                    }
                    return (
                        this.state.roleDataSource.length
                        ? (
                            <Operation>
                                <Item style={{display: showsms}}>
                                    <Button type='primary' onClick={this.handleSendSmsClick.bind(this, record)}>
                                        <i className='iconfont'>&#xe88f;</i>发送短信
                                    </Button>
                                </Item>
                                <Item style={{display: record.status !== null && record.status === '1' ? 'block' : 'none'}}>
                                    <Button type='primary'  className='close' onClick={this.handleCloseClick.bind(this, record)}>
                                        <i className='iconfont'>&#xe624;</i>结束活动
                                    </Button>
                                </Item>
                                <Item style={{display: pushStatus}} onClick={this.handlePushInfoClick.bind(this, record)}>
                                    <Button type='primary' className='pushMsm'>
                                        <i className='iconfont'>&#xe88f;</i>推送通知
                                    </Button>
                                </Item>
                                <Item>
                                      <Button type='primary' className='see' onClick={this.handleSeeClick.bind(this, record)}>
                                        <i className='iconfont'>&#xe600;</i>查看
                                    </Button>
                                </Item>
                            </Operation>
                        ) : null
                    );
                }
            }
        ];
        this.state = {
            loading: false,
            roleDataSource: [], // 表格数据
            // 查询
            readState: '1',
            readKeyword: '',
            readLoading: false,
            // 发送短信
            sendSmsVisible: false,
            sendList: '',
            sendState: '选择平台',
            sendContent: '',
            sendId: '',
            sendConfirmLoading: false,
            sendColor: '',
            value: "1",
            // 推送短信
            pushVisible: false,
            pushId: '',
            pushConfirmLoading: false,
            pushContent: '',
            // 结束活动
            closeVisible: false,
            closeConfirmLoading: false,
            closeId: '',
            // 创建活动
            createVisible: false,
            createConfirmLoading: false,
            createName: '',
            createDesc: '',
            fileList: [],
            uploading: false,
        };
        this.params = { page: 1 };
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['运营管理', '活动短信推送']));
        let data = this.props.location.query;
        if (data !== undefined) {
            let { page, readState, readKeyword } = data;
            this.params.page = page;
            this.setState({readState, readKeyword}, () => {
                this.requestList();
            });
        } else {
            this.requestList();
        }
    }
    // 获取数据列表
    requestList = (readLoading) => {
        if (readLoading) {
            this.setState({readLoading: true});
            this.params.page = 1;
        }
        const url = `${baseURL}activity/marketing/list`;
        const { readState, readKeyword } = this.state;
        let _this = this;
        this.showAndHideLoading(true);
        const params = {
            pageNo: this.params.page,
            name: readKeyword,
            status: readState
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({readLoading: state});
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.result;
                result.map((item, index) => (item.key = index));
                this.setState({
                    roleDataSource: result,
                    pagination: pagination(res.data, (current) => {
                        _this.params.page = current;
                        this.requestList();
                    })
                });
                this.showAndHideLoading(false);
                if (readLoading) {
                    this.setState({readLoading: false});
                    message.info(res.msg);
                }
            } else {
                message.info(res.msg);
                this.showAndHideLoading(false);
            }
        });
    }
    // 查询
    handleReadClick = () => this.requestList(true);
    // 发送短信
    handleSendSmsClick(record) {
        this.setState({sendId: record.id});
        const url = `${baseURL}activity/marketing/sms/edit`;
        fatch(url, 'post', null, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') this.getSendList(res.data);
            else message.info(res.msg);
        });
        this.setState({sendSmsVisible: true});
    }
    handleSendSmsOk = () => {
        const url = `${baseURL}activity/marketing/sms/send`;
        const { sendState, sendContent, value, sendId } = this.state;
        if (sendState === '选择平台') {
            message.info('请选择短信平台');
            return;
        }
        if (sendContent === '') {
            message.info('请输入短信内容');
            return;
        }
        const params = {
            content: sendContent,
            smsPlatform: sendState,
            type: value,
            id: sendId
        }
        this.setState({sendSmsVisible: false});
        this.showAndHideLoading(true);
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.showAndHideLoading(false);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    sendState: '选择平台',
                    sendContent: '',
                    value: '1',
                    sendId: ''
                });
                this.showAndHideLoading(false);
                this.requestList();
                message.info(res.msg);
            } else {
                message.info(res.msg);
                this.showAndHideLoading(false);
            }
        })
    }
    handleSendSmsCancel = () => this.setState({sendSmsVisible: false});
    // 推送内容
    handlePushInfoClick(record) {
        this.setState({
            pushVisible: true,
            pushId: record.id
        });
    }
    handlePushOk = () => {
        const { pushContent, pushId } = this.state;
        if (pushContent === '') {
            message.info('请输入推送内容');
            return;
        }
        const url = `${baseURL}activity/marketing/notice/send`;
        const params = {
            content: pushContent,
            id: pushId
        }
        this.setState({pushConfirmLoading: true});
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({pushConfirmLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    pushVisible: false,
                    pushConfirmLoading: false,
                    pushContent: '',
                    pushId: ''
                });
                message.info(res.msg);
                this.requestList();
            } else {
                this.setState({pushConfirmLoading: false});
                message.info(res.msg);
            }
        })
        
    }
    handlePushCancel = () => this.setState({pushVisible: false});
    // 结束活动
    handleCloseClick(record) {
        this.setState({
            closeVisible: true,
            closeId: record.id
        });
    }
    handleCloseOk = () => {
        const url = `${baseURL}activity/marketing/endActivity`;
        this.setState({closeConfirmLoading: true});
        fatch(url, 'post', {id: this.state.closeId}, (err, state) => {
            message.info(err);
            this.setState({closeConfirmLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    closeVisible: false,
                    closeId: '',
                    closeConfirmLoading: false
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestList();
                });
            } else {
                this.setState({closeConfirmLoading: false});
                message.info(res.msg);
            }
        })
    }
    handleCloseCancel = () => this.setState({closeVisible: false});
    // 创建活动
    handleCreateClick = () => this.setState({createVisible: true});
    handleCreateOk = () => {
        const { fileList, createName, createDesc } = this.state;
        if (createName === '') {
            message.info('活动名称不能为空');
            return;
        }
        if (!fileList.length) {
            message.info('请选择参与用户文件');
            return;
        }
        this.setState({createConfirmLoading: true});
        const formData = new FormData();
        fileList.map((file) => (formData.append('file', file)));
        formData.append('name', createName);
        formData.append('description', createDesc);
        reqwest({
            url: `${baseURL}activity/marketing/add`,
            method: 'post',
            processData: false,
            headers: {
                authorization: Storage.get('token')
            },
            data: formData,
            success: (res) => {
                if (res.code === '0') {
                    this.setState({
                        fileList: [],
                        createName: '',
                        createDesc: '',
                        createVisible: false,
                        createConfirmLoading: false
                    });
                    setTimeout(() => {
                        message.info(res.msg);
                        this.requestList();
                    }, 300);
                } else {
                    message.info(res.msg);
                    this.setState({createConfirmLoading: false});
                }
            },
            error: () => {
                this.setState({createConfirmLoading: false});
                message.info('网络错误!!!');
            }
        });
    }
    handleCreateCancel = () => {
        this.setState({
            createVisible: false,
            fileList: [],
            createName: '',
            createDesc: '',
        });
    }
    // 查看活动
    handleSeeClick(record) {
        const id = record.id;
        const page = this.params.page;
        const { readState, readKeyword } = this.state;
        const path = '/operateControl/messagePush/activity';
        history.push(path, {id, page, readState, readKeyword});
    }
    getSendList = (data) => {
        if (data) {
            const list = data.map((item) => (<Option value={item.key} key={item.key}>{item.value}</Option>));
            this.setState({sendList: list});
        }
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { 
            pagination,
            roleDataSource, 
            sendSmsVisible,
            sendList,
            sendState,
            sendContent,
            sendColor,
            sendConfirmLoading,    
            pushVisible,
            pushConfirmLoading,
            pushContent,
            closeVisible,
            closeConfirmLoading,
            createVisible,
            createConfirmLoading,
            createName,
            createDesc,
            readState,
            readKeyword,
            readLoading,
            fileList
        } = this.state;
        const props = {
            action: `${baseURL}activity/marketing/add`,
            accept: '.csv',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return { fileList: newFileList };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file]
                }));
                return false;
            },
            fileList: this.state.fileList,
        };
        return (
            <Warp>
                <QueryListWarp>
                    <CreateTimeItem>
                        <span>状态:</span>
                        <div id='state' style={{position: 'relative' }}>
                            <Select
                                style={{ width: 300 }}
                                value={readState}
                                onChange={(value) => {this.setState({readState: value})}}
                                getPopupContainer={() => document.getElementById('state')}
                            >
                                <Option value=''>全部</Option>
                                <Option value='1'>进行中</Option>
                                <Option value='2'>已结束</Option>
                            </Select>
                        </div>
                    </CreateTimeItem>
                    <CreateTimeItem>
                        <span>关键词:</span>
                        <Input style={{ width: 300 }} value={readKeyword} onChange={(e) => {this.setState({readKeyword: e.target.value})}}/>
                    </CreateTimeItem>
                    <Search>
                        <Button type='primary' loading={readLoading} onClick={this.handleReadClick}>查询</Button>
                    </Search>
                </QueryListWarp>
                <Button type='primary' style={{marginBottom: 15}} onClick={this.handleCreateClick}>新建营销</Button>
                <Table bordered pagination={pagination} dataSource={roleDataSource} columns={this.columns} />
                {/*************发送短信*****************/}
                <Modal
                    title='发送短信'
                    okText='提交'
                    cancelText='取消'
                    width={400}
                    visible={sendSmsVisible}
                    confirmLoading={sendConfirmLoading}
                    closable={false}
                    onOk={this.handleSendSmsOk}
                    onCancel={this.handleSendSmsCancel}
                >
                    <SendWarp>
                        <SendPlatform>
                            <span>短信平台</span>
                            <Select style={{ flex: 1 }} value={sendState} onChange={(value) => {this.setState({sendState: value})}}>
                                {sendList}
                            </Select>
                        </SendPlatform>
                    </SendWarp>
                    <SendInfo>
                        <span>短信内容</span>
                        <TextArea style={{ flex: 1, color: sendColor }} value={sendContent} onChange={(e) => {
                            if (e.target.value.length > 70) this.setState({sendColor: 'red'});
                            else this.setState({sendColor: ''});
                            this.setState({sendContent: e.target.value});
                        }} />
                    </SendInfo>
                    <SendType>
                        <p>发送方式</p>
                        <RadioGroup value={this.state.value} onChange={(e) => {this.setState({value: e.target.value})}}>
                            <Radio value='1'>单条发送</Radio>
                            <Radio value='2'>打包发送</Radio>
                        </RadioGroup>
                    </SendType>
                </Modal>
                {/*************推送短信*****************/}
                <Modal
                    title='推送短信'
                    okText='提交'
                    cancelText='取消'
                    width={400}
                    visible={pushVisible}
                    confirmLoading={pushConfirmLoading}
                    closable={false}
                    onOk={this.handlePushOk}
                    onCancel={this.handlePushCancel}
                >
                    <PushWrap>
                        <span>推送内容</span>
                        <TextArea style={{ flex: 1 }} value={pushContent} onChange={(e) => {this.setState({pushContent: e.target.value})}} />
                    </PushWrap>
                </Modal>
                {/*************结束活动*****************/}
                <Modal
                    title='结束活动'
                    okText='提交'
                    cancelText='取消'
                    width={400}
                    visible={closeVisible}
                    confirmLoading={closeConfirmLoading}
                    closable={false}
                    onOk={this.handleCloseOk}
                    onCancel={this.handleCloseCancel}
                >
                    确定要结束该活动吗？
                </Modal>
                {/*************创建活动*****************/}
                <Modal
                    title='创建活动'
                    okText='提交'
                    cancelText='取消'
                    width={400}
                    visible={createVisible}
                    confirmLoading={createConfirmLoading}
                    closable={false}
                    onOk={this.handleCreateOk}
                    onCancel={this.handleCreateCancel}
                >
                    <form encType='multipart/form-data' method='post' id='createFrom'>
                        <CreateItem>
                            <p>活动名称</p>
                            <Input style={{ flex: 1 }} value={createName} onChange={(e) => {this.setState({createName: e.target.value})}} />
                        </CreateItem>
                        <CreateItem>
                            <p>活动概述</p>
                            <TextArea style={{ flex: 1 }} value={createDesc} onChange={(e) => {this.setState({createDesc: e.target.value})}} />
                        </CreateItem>
                        <CreateItem>
                            <p>参与用户</p>
                            <Upload {...props}>
                                {
                                    fileList.length >= 1 ? null : <Button><div><Icon type='upload' />文件上传</div></Button>
                                }
                            </Upload>
                        </CreateItem>
                        <CreateItem>
                            <p>文件模板</p>
                            <div style={{flex: 1}}>
                                <a href={download} style={{ color: 'skyblue', lineHeight: '40px' }}>模板下载</a>
                            </div>
                        </CreateItem>
                    </form>
                </Modal>
            </Warp>
        );
    }
}


export default connect(null, null)(MessagePush);