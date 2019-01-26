import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DatePicker, Select, Button, Table, Modal, Input, Radio, message, Tree, Spin, Icon } from 'antd';
import { Warp, QueryListWarp, CreateTime, CreateTimeItem, Search, Operation, Item, CharacterName, Name, CharacterInfo, CharacterInfoName, HaveJurisdiction, Text } from './style';
import fatch from './../../../common/js/fatch';
import history from './../../../history';
import baseURl from './../../../common/js/baseURL';
import formatDateTime from './../../../common/js/formatDateTime';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const styles = { red: 'red' };
class BackstageCharacterControl extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '序号',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '渠道名称',
                dataIndex: 'channelCode',
                align: 'center',
                render: (text, record) => {
                    if (record.channelCode === 1) return <span>京东</span>;
                    else return <Text></Text>;
                }
            },
            {
                title: '提醒类型',
                dataIndex: 'remindType',
                align: 'center',
                render: (text, record) => {
                    if (record.remindType === 0) return <span>预存费不足</span>;
                    else return <span>进货价调整</span>;
                }
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                align: 'center',
                render: (text, record) => {
                    if (record.email === 'null') {
                        return <div></div>;
                    } else {
                        return <div>{record.email}</div>;
                    }
                }
            },
            {
                title: '电话号码',
                dataIndex: 'phone',
                align: 'center',
                render: (text, record) => {
                    if (record.phone === 'null') {
                        return <div></div>;
                    } else {
                        return <div>{record.phone}</div>;
                    }
                }
            },
            {
                title: '备注',
                dataIndex: 'remark',
                align: 'center',
                render: (text, record) => {
                    if (record.remark === 'null') {
                        return <div></div>;
                    } else {
                        return <div>{record.remark}</div>;
                    }
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
                            <div>
                                <Button
                                    style={{marginRight:4}}
                                    onClick={this.look.bind(this,record.id)}
                                >
                                    查看
                                </Button>
                                <Button
                                    type="danger"
                                    onClick={this.edit.bind(this,'update',record.id)}
                                >
                                    编辑
                                </Button>
                            </div>
                        ) : null
                    );
                },
            },
        ];
        this.state = {
            roleDataSource: [], // 表格数据
            keyWord: '',
            channelName: '',
            remindType:"",
            keyType:'0',
        };
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['系统管理', '渠道信息变更提醒设置']));
        this.requestList();
    }
    look=(record)=>{
        this.goToPage('/systemControl/changeRemind/remindLook',record,);
    }
    edit=(record,record_id)=>{
        this.goToPage('/systemControl/changeRemind/remindEdit',{record,record_id});
    }
    requestList = (buttonLoading) => {
        const url = `${baseURl}sys/remind/list`;
        const {
            roleDataSource,
            keyWord,
            channelName,
            remindType,
            keyType,
         } = this.state;
        let _this = this;
        var keyTypes;
        var remindTypes;
        var channelNames;
        if(keyType=='0'){
            keyTypes='email';
        }else if(keyType=='1'){
            keyTypes='phone';
        }
        if(remindType==''){
            remindTypes="";
        }else if(remindType=='0'){
            remindTypes=0;
        }else if(remindType=='1'){
            remindTypes=1;
        }
        if(channelName==''){
            channelNames="";
        }else if(channelName=='0'){
            channelNames=0;
        }else if(channelName=='1'){
            channelNames=1;
        }
        const params = {
            channelCode: channelNames,
            inputContent: keyWord,
            remindType: remindTypes,
            selectType: keyTypes,
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.reminds;
                result.map((item, index) => (item.key = index));
                this.setState({
                    roleDataSource: result,
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    handleQueryClick = () => {
        const { keyWord } = this.state;
        const regEn = /[`~!#$%^&*()_+<>?:"{},\/;'[\]]/im;
        const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (regEn.test(keyWord) || regCn.test(keyWord)) {
            message.info('关键字不能包含特殊字符');
            return;
        }
        this.requestList(true);
    }
    /**********************新增****************************/
    goToPage(path, record = {}) {
        history.push(path, record);
    }
    newSet = (record,record_id) => {
        this.goToPage('/systemControl/changeRemind/remindEdit',{record,record_id});
    }
    handleCreateCancel = () => {
        this.setState({createVisible: false});
    }
    setClassName = (record, index) => (record.type === '2' ? styles.red : '');
    render() {
        const {
            keyWord,
            channelName,
            keyType,
            remindType,
            roleDataSource,
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
                        <CreateTimeItem id='qdmc' style={{position: 'relative' }}>
                            <label>渠道名称：</label>
                            <Select
                                value={channelName}
                                style={{ width: 200 }}
                                onChange={(value) => {this.setState({channelName: value})}}
                                getPopupContainer={() => document.getElementById('qdmc')}
                            >
                                <Option value=''>全部</Option>
                                <Option value='0'>京东</Option>
                            </Select>
                        </CreateTimeItem>
                        <CreateTimeItem id='txlx' style={{position: 'relative' }}>
                            <label>提醒类型：</label>
                            <Select
                                value={remindType}
                                style={{ width: 200 }}
                                onChange={(value) => {this.setState({remindType: value})}}
                                getPopupContainer={() => document.getElementById('txlx')}
                            >
                                <Option value=''>全部</Option>
                                <Option value='0'>预存费用不足提醒</Option>
                                <Option value='1'>进货价调整提醒</Option>
                            </Select>
                        </CreateTimeItem>
                        <CreateTimeItem className='crux' id='gjc' style={{position: 'relative' }}>
                            <label>关键词:</label>
                            <Select
                                value={keyType}
                                style={{ width: 160 }}
                                onChange={(value) => {this.setState({keyType: value})}}
                                getPopupContainer={() => document.getElementById('gjc')}
                            >
                                <Option value='0'>邮箱</Option>
                                <Option value='1'>电话号码</Option>
                            </Select>
                            <Input
                                placeholder='请输入关键词'
                                style={{ width: 300,marginLeft:12 }}
                                value={keyWord}
                                onChange={(e) => {this.setState({keyWord: e.target.value})}}
                            />
                        </CreateTimeItem>
                    </CreateTime>
                    <Search>
                        <Button type='primary' onClick={this.handleQueryClick}>
                            查询
                        </Button>
                    </Search>
                </QueryListWarp>
                <Button
                    type='primary'
                    onClick={this.newSet.bind(this,"new",'')}
                    style={{marginBottom: 15}}
                >
                    新增设置
                </Button>
                <Table
                    bordered
                    dataSource={roleDataSource}
                    columns={columns}
                    rowClassName={this.setClassName}
                />
            </Warp>
        );
    }
}

export default connect(null, null)(BackstageCharacterControl);
