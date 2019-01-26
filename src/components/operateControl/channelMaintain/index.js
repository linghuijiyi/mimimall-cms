import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Select, Button, Icon, Table, Modal, Input, Spin, message, DatePicker } from 'antd';
import { 
    Warp,
    QueryListWarp,
    QueryListItem,
    Search,
    Operation,
    Item,
    CreateItem,
    Name,
    DataItem,
    Left,
    Right
} from './style';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import fatch from './../../../common/js/fatch';
import pagination from './../../../common/js/pagination';
import baseURL from './../../../common/js/baseURL';
const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

class ChannelMaintain extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '渠道名称',
                dataIndex: 'name',
                align: 'center',
            }, 
            {
                title: '渠道代码',
                dataIndex: 'code',
                align: 'center',
            }, 
            {
                title: '联系人',
                dataIndex: 'contacts',
                align: 'center',
            },
            {
                title: '手机号码',
                dataIndex: 'phone',
                align: 'center',
            },
            {
                title: 'qq',
                dataIndex: 'qq',
                align: 'center',
            },
            {
                title: 'E-mail',
                dataIndex: 'email',
                align: 'center',
            },
            {
                title: '数据维护',
                dataIndex: 'url',
                align: 'center',
                render: (text, record) => {
                    return (
                        this.state.roleDataSource.length
                        ? (
                            <Operation>
                                <Item>
                                    <Button
                                        style={{backgroundColor: '#87b87f', border: '1px solid #87b87f'}} 
                                        type='primary'
                                        icon='tool'
                                        onClick={this.handleDataClick.bind(this, record)}
                                    >
                                        数据维护
                                    </Button>
                                </Item>
                            </Operation>
                        ) : null
                    );
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                render: (text, record) => {
                    return (
                        this.state.roleDataSource.length
                        ? (
                            <Operation>
                                <Item>
                                    <Button
                                        type='primary'
                                        icon='edit'
                                        onClick={this.handleUpdateChannelClick.bind(this, record)}
                                    >
                                        修改
                                    </Button>
                                </Item>
                            </Operation>
                        ) : null
                    );
                }
            }
        ];
        this.state = {
            roleDataSource: [], // 表格数据
            buttonLoading: false,
            // 查询
            queryType: 'name',
            keyWord: '',
            // 创建渠道
            createChannelVisible: false,
            createConfirmLoading: false,
            createCode: '',
            createName: '',
            createContacts: '',
            createPhone: '',
            createQq: '',
            createEmail: '',
            // 修改渠道
            updateChannelVisible: false,
            updateConfirmLoading: false,
            updateCode: '',
            updateName: '',
            updateContacts: '',
            updatePhone: '',
            updateQq: '',
            updateEamil: '',
            updateId: '',
            // 数据维护
            dataMaintainVisible: false,
            dateConfirmLoading: false,
            downloadNum: '',
            installNum: '',
            dataTime: '',
            dataCode: '',
            dataTimeValue: null
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
        const url = `${baseURL}market/channelInfo/list`;
        const { queryType, keyWord } = this.state;
        let _this = this;
        const params = {
            pageNo: this.params.page,
            keyword: keyWord,
            selectType: queryType
        }
        this.showAndHideLoading(true);
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({buttonLoading: state});
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
                if (buttonLoading) {
                    this.setState({buttonLoading: false});
                    message.info(res.msg);
                }
            } else {
                this.setState({buttonLoading: false});
                this.showAndHideLoading(false);
                message.info(res.msg);
            }
        })
    }
    /********************查询列表*********************/
    handleQueryList = () => {
        const { keyWord } = this.state;
        const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
        const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (regEn.test(keyWord) || regCn.test(keyWord)) {
            message.info('关键字不能包含特殊字符');
            return;
        }
        this.requestList(true);
    }
    /********************创建渠道*******************/
    handleCreateChannelClick = () => {
        this.setState({
            createChannelVisible: true,
        });
    }
    handleCreateOk = () => {
        const url = `${baseURL}market/channelInfo/saveOrUpdate`;
        const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
        const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        const regQQ = /^[1-9][0-9]{4,10}$/gim;
        const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const { 
            createCode,
            createName,
            createContacts,
            createPhone,
            createQq,
            createEmail
        } = this.state;
        if (createName === '') {
            message.info('渠道名称不能为空');
            return;
        }
        if (createName.length > 50) {
            message.info('渠道名称长度不能超过50个字符');
            return;
        }
        if (regEn.test(createName) || regCn.test(createName)) {
            message.info('渠道名称不能包含特殊字符');
            return;
        }
        if (createCode === '') {
            message.info('渠道代码不能为空');
            return;
        }
        if (createCode.length > 10) {
            message.info('渠道代码长度不能超过10个字符');
            return;
        }
        if (regEn.test(createCode) || regCn.test(createCode)) {
            message.info('渠道代码不能包含特殊字符');
            return;
        }
        if (createContacts.length > 50) {
            message.info('联系人长度不能超过50个字符');
            return;
        }
        if (regEn.test(createContacts) || regCn.test(createContacts)) {
            message.info('联系人不能包含特殊字符');
            return;
        }
        if (createPhone !== '') {
            if (!this.isPoneAvailable(createPhone)) {
                message.info('手机号格式错误');
                return;
            }
        }
        if (createQq !== '') {
            if(!regQQ.test(createQq)) {
                message.info('qq号格式错误');
                return;
            }
        }
        if (createEmail !== '') {
            if (!regEmail.test(createEmail)) {
                message.info('邮箱格式错误');
                return;
            }
        }
        const params = {
            code: createCode,
            name: createName,
            contacts: createContacts,
            phone: createPhone,
            qq: createQq,
            email: createEmail,
        }
        this.setState({createConfirmLoading: true});
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({createConfirmLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    createChannelVisible: false,
                    createConfirmLoading: false,
                    createCode: '',
                    createName: '',
                    createContacts: '',
                    createPhone: '',
                    createQq: '',
                    createEmail: ''
                });
                message.info(res.msg);
                setTimeout(() => {
                    this.requestList();
                }, 300);
            } else {
                this.setState({
                    createConfirmLoading: false,
                });
                message.info(res.msg);
            }
        })
    }
    handleCreateCancel = () => {
        this.setState({
            createChannelVisible: false,
            createCode: '',
            createName: '',
            createContacts: '',
            createPhone: '',
            createQq: '',
            createEmail: ''
        });
    }
    /********************修改渠道*******************/
    handleUpdateChannelClick(record) {
        const { code, name, contacts, phone, qq, email, id } = record;
        this.setState({
            updateChannelVisible: true,
            updateCode: code,
            updateName: name,
            updateContacts: contacts,
            updatePhone: phone,
            updateQq: qq,
            updateEamil: email,
            updateId: id
        });
    }
    handleUpdateOk = () => {
        const url = `${baseURL}market/channelInfo/saveOrUpdate`;
        const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
        const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        const regQQ = /^[1-9][0-9]{4,10}$/gim;
        const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const { 
            updateCode,
            updateName,
            updateContacts,
            updatePhone,
            updateQq,
            updateEamil,
            updateId
        } = this.state;
        if (updateName === '') {
            message.info('渠道名称不能为空');
            return;
        }
        if (regEn.test(updateName) || regCn.test(updateName)) {
            message.info('渠道名称不能包含特殊字符');
            return;
        }
        if (updateCode === '') {
            message.info('渠道代码不能为空');
            return;
        }
        if (regEn.test(updateCode) || regCn.test(updateCode)) {
            message.info('渠道代码不能包含特殊字符');
            return;
        }
        if (regEn.test(updateContacts) || regCn.test(updateContacts)) {
            message.info('联系人不能包含特殊字符');
            return;
        }
        if (updatePhone !== '') {
            if (!this.isPoneAvailable(updatePhone)) {
                message.info('手机号格式错误');
                return;
            }
        }
        if (updateQq !== '') {
            if(!regQQ.test(updateQq)) {
                message.info('qq号格式错误');
                return;
            }
        }
        if (updateEamil !== '') {
            if (!regEmail.test(updateEamil)) {
                message.info('邮箱格式错误');
                return;
            }
        }
        const params = {
            code: updateCode,
            name: updateName,
            contacts: updateContacts,
            phone: updatePhone,
            qq: updateQq,
            email: updateEamil,
            id: updateId
        }
        this.setState({updateConfirmLoading: true});
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({updateConfirmLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    updateChannelVisible: false,
                    updateConfirmLoading: false,
                    updateCode: '',
                    updateName: '',
                    updateContacts: '',
                    updatePhone: '',
                    updateQq: '',
                    updateEamil: '',
                    updateId: ''
                });
                message.info(res.msg);
                setTimeout(() => {
                    this.requestList();
                }, 300);
            } else {
                this.setState({
                    updateConfirmLoading: false,
                });
                message.info(res.msg);
            }
        })
    }
    handleUpdateCancel = () => {
        this.setState({
            updateChannelVisible: false,
        });
    }
    /*********************数据维护********************/

    handleDataClick(record) {
        const url = `${baseURL}market/channelInfo/findChannelInfo`;
        const params = {
            code: record.code,
            time: this.state.dataTime
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                if (!data.installNum && data.installNum !== 0) data.installNum = '';
                if (!data.downloadNum && data.downloadNum !== 0) data.downloadNum = '';
                this.setState({
                    dataMaintainVisible: true,
                    installNum: data.installNum,
                    downloadNum: data.downloadNum,
                    dataCode: record.code,
                    dataTime: this.formatDateTime(data.time),
                    dataTimeValue: moment(this.formatDateTime(data.time), dateFormat)
                });
            } else {
                message.info('网络错误');
                this.setState({
                    installNum: '',
                    downloadNum: '',
                    dataCode: '',
                    dataTime: ''
                });
            }
        })
    }
    handleDataOk = () => {
        const url = `${baseURL}market/channelInfo/maintain`;
        const { dataCode, dataTime, installNum, downloadNum } = this.state;
        if (installNum === '') {
            message.info('下载数量不能为空');
            return;
        }
        if (downloadNum === '') {
            message.info('安装数量不能为空');
            return;
        }
        const params = {
            time: dataTime,
            code: dataCode,
            installNum: parseInt(installNum),
            downloadNum: parseInt(downloadNum)
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    dataMaintainVisible: false,
                    installNum: '',
                    downloadNum: '',
                    dataCode: '',
                    dataTime: ''
                });
                message.info(res.msg);
                setTimeout(() => {
                    this.requestList();
                }, 300);
            } else {
                message.info(res.msg);
            }
        });
    }
    handleDataCancel = () => {
        this.setState({
            dataMaintainVisible: false,
        });
    }
    handleChangeTime = (value, dateString) => {
        const url = `${baseURL}market/channelInfo/findChannelInfo`;
        const params = {
            code: this.state.dataCode,
            time: dateString
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                if (!data.installNum && data.installNum !== 0) data.installNum = '';
                if (!data.downloadNum && data.downloadNum !== 0) data.downloadNum = '';
                this.setState({
                    installNum: data.installNum,
                    downloadNum: data.downloadNum,
                    dataTime: dateString,
                    dataTimeValue: value
                });
            }
        })
    }
    isPoneAvailable = (phone) => {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        return reg.test(phone);
    }
    formatDateTime = (time) => {
        let date = new Date(time);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        m = m < 10 ? ('0' + m) : m;
        d = d < 10 ? ('0' + d) : d;
        return y + '/' + m + '/' + d;
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { 
            roleDataSource,
            createChannelVisible,
            createConfirmLoading,
            createCode,
            createName,
            createContacts,
            createPhone,
            createQq,
            createEmail,
            updateChannelVisible,
            updateConfirmLoading,
            updateCode,
            updateName,
            updateContacts,
            updatePhone,
            updateQq,
            updateEamil,
            queryType,
            keyWord,
            buttonLoading,
            dataMaintainVisible,
            installNum,
            downloadNum,
            dataTime,
            dataTimeValue
        } = this.state;
        const columns = this.columns.map((col) => {
            if (!col.editable) return col;
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
                    <QueryListItem>
                        <span>关键词:</span>
                        <div id='gjc' style={{position: 'relative' }}>
                            <Select
                                style={{ width: 100 }}
                                value={queryType}
                                onChange={(value) => {this.setState({queryType: value})}}
                                getPopupContainer={() => document.getElementById('gjc')}
                            >
                                <Option value='name'>渠道名称</Option>
                                <Option value='code'>渠道代码</Option>
                                <Option value='contacts'>联系人</Option>
                            </Select>
                            <Input
                                style={{ width: 300, margin: '0 5px' }}
                                placeholder='渠道名称/渠道代码/联系人'
                                value={keyWord}
                                onChange={(e) => this.setState({keyWord: e.target.value})}
                            />
                        </div>
                    </QueryListItem>
                    <Search>
                        <Button type='primary' loading={buttonLoading} onClick={this.handleQueryList}>查询</Button>
                    </Search>
                </QueryListWarp>
                <Button type='primary' style={{marginBottom: 15}} onClick={this.handleCreateChannelClick}>添加新渠道</Button>
                <Table
                    bordered
                    pagination={this.state.pagination}
                    dataSource={roleDataSource}
                    columns={columns}
                />
                {/****************创建渠道********************/}
                <Modal
                    width={600}
                    title='添加渠道'
                    closable={false}
                    visible={createChannelVisible}
                    confirmLoading={createConfirmLoading}
                    onOk={this.handleCreateOk}
                    onCancel={this.handleCreateCancel}
                >
                    <CreateItem>
                        <Name>渠道名称:&nbsp;</Name>
                        <Input
                            placeholder='渠道名称'
                            value={createName}
                            onChange={(e) => {this.setState({createName: e.target.value})}}
                        />
                    </CreateItem>
                    <CreateItem>
                        <Name>渠道代码:&nbsp;</Name>
                        <Input
                            placeholder='渠道代码'
                            value={createCode}
                            onChange={(e) => {this.setState({createCode: e.target.value})}}
                        />
                    </CreateItem>
                    <CreateItem>
                        <Name>联系人:&nbsp;</Name>
                        <Input
                            placeholder='联系人'
                            value={createContacts}
                            onChange={(e) => {this.setState({createContacts: e.target.value})}}
                        />
                    </CreateItem>
                    <CreateItem>
                        <Name>手机号码:&nbsp;</Name>
                        <Input
                            placeholder='手机号码'
                            value={createPhone}
                            onChange={(e) => {this.setState({createPhone: e.target.value})}}
                        />
                    </CreateItem>
                    <CreateItem>
                        <Name>QQ:&nbsp;</Name>
                        <Input
                            placeholder='QQ'
                            value={createQq}
                            onChange={(e) => {this.setState({createQq: e.target.value})}}
                        />
                    </CreateItem>
                    <CreateItem>
                        <Name>E-mail:&nbsp;</Name>
                        <Input
                            placeholder='E-mail'
                            value={createEmail}
                            onChange={(e) => {this.setState({createEmail: e.target.value})}}
                        />
                    </CreateItem>
                </Modal>
                {/****************修改渠道********************/}
                <Modal
                    width={600}
                    title='修改渠道'
                    closable={false}
                    visible={updateChannelVisible}
                    confirmLoading={updateConfirmLoading}
                    onOk={this.handleUpdateOk}
                    onCancel={this.handleUpdateCancel}
                >
                    <CreateItem>
                        <Name>渠道名称:&nbsp;</Name>
                        <Input
                            placeholder='渠道名称'
                            value={updateName}
                            onChange={(e) => {this.setState({updateName: e.target.value})}}
                        />
                    </CreateItem>
                    <CreateItem>
                        <Name>渠道代码:&nbsp;</Name>
                        <Input
                            placeholder='渠道代码'
                            value={updateCode}
                            onChange={(e) => {this.setState({updateCode: e.target.value})}}
                        />
                    </CreateItem>
                    <CreateItem>
                        <Name>联系人:&nbsp;</Name>
                        <Input
                            placeholder='联系人'
                            value={updateContacts}
                            onChange={(e) => {this.setState({updateContacts: e.target.value})}}
                        />
                    </CreateItem>
                    <CreateItem>
                        <Name>手机号码:&nbsp;</Name>
                        <Input
                            placeholder='手机号码'
                            value={updatePhone}
                            onChange={(e) => {this.setState({updatePhone: e.target.value})}}
                        />
                    </CreateItem>
                    <CreateItem>
                        <Name>QQ:&nbsp;</Name>
                        <Input
                            placeholder='QQ'
                            value={updateQq}
                            onChange={(e) => {this.setState({updateQq: e.target.value})}}
                        />
                    </CreateItem>
                    <CreateItem>
                        <Name>E-mail:&nbsp;</Name>
                        <Input
                            placeholder='E-mail'
                            value={updateEamil}
                            onChange={(e) => {this.setState({updateEamil: e.target.value})}}
                        />
                    </CreateItem>
                </Modal>
                {/****************数据维护********************/}
                <Modal
                    width={400}
                    title='修改渠道'
                    closable={false}
                    visible={dataMaintainVisible}
                    onOk={this.handleDataOk}
                    onCancel={this.handleDataCancel}
                >
                    <DataItem>
                        <Left>
                            <div>
                                <span>日&nbsp;&nbsp;&nbsp;&nbsp;期:</span>
                            </div>
                            <div>
                                <span>下载数:</span>
                            </div>
                            <div>
                                <span>安装数:</span>
                            </div>
                        </Left>
                        <Right>
                            <div>
                                <DatePicker
                                    style={{width: '100%'}}
                                    value={dataTimeValue} 
                                    format={dateFormat}
                                    onChange={this.handleChangeTime}
                                />
                            </div>
                            <div>
                                <Input
                                    style={{width: '100%'}}
                                    type='number'
                                    value={downloadNum}
                                    onChange={(e) => this.setState({downloadNum: e.target.value})}
                                />
                            </div>
                            <div>
                                <Input
                                    style={{width: '100%'}}
                                    type='number'
                                    value={installNum}
                                    onChange={(e) => this.setState({installNum: e.target.value})}
                                />
                            </div>
                        </Right>
                    </DataItem>
                </Modal> 
            </Warp>
        );
    }
}

export default connect(null, null)(ChannelMaintain);