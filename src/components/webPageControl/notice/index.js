import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import { Select, Button, Table, Modal, Input, Radio, message, Spin, Icon } from 'antd';
import { Warp, QueryListWarp, CreateTime, CreateTimeItem, Search, Operation, Item, CharacterName, Name, CharacterInfo, CharacterInfoName, HaveJurisdiction, Text } from './style';
import fatch from './../../../common/js/fatch';
import formatDateTime from './../../../common/js/formatDateTime';
import baseURL from './../../../common/js/baseURL';
import pagination from './../../../common/js/pagination';
import history from './../../../history';
const Option = Select.Option;
const { TextArea } = Input;
class Notice extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '文章编号',
                dataIndex: 'id',
                align: 'center',
            }, 
            {
                title: '文章标题',
                dataIndex: 'title',
                align: 'center',
            }, 
            {
                title: '操作人',
                dataIndex: 'updateUserId',
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: 'updateTime',
                align: 'center',
                render: (text, record) => {
                    return <div>{formatDateTime(record.updateTime)}</div>;
                }
            },
            {
                title: '作者',
                dataIndex: 'author',
                align: 'center',
            },
            {
                title: '状态',
                dataIndex: 'state',
                align: 'center',
                render: (text, record) => {
                    if (record.state === '0') {
                        return <div>已失效</div>;
                    } else {
                        return <div>使用中</div>;
                    }
                }
            },
            {
                title: '是否重要公告',
                dataIndex: 'articleType',
                align: 'center',
                render: (text, record) => {
                    if (record.articleType === 0) {
                        return <div>普通</div>;
                    } else {
                        return <div>重要</div>;
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                width: '15%',
                render: (text, record) => {
                    return (
                        this.state.roleDataSource.length
                        ? (
                            <Operation>
                                <Item>
                                    <Button
                                        type='primary' 
                                        onClick={this.handleEditClick.bind(this, record)}
                                    >
                                        <Icon type='edit' />
                                        编辑
                                    </Button>
                                </Item>
                                <Item style={{display: record.state === '1' ? 'block' : 'none'}}>
                                    <Button
                                        type='primary'
                                        style={{background: 'red', border: '1px solid red'}}
                                        onClick={this.handleDeleteClick.bind(this, record)}
                                    >
                                        <Icon type='delete' />
                                        删除
                                    </Button>
                                </Item>
                                <Item style={{display: record.state === '0' ? 'block' : 'none'}}>
                                    <Button
                                        type='primary'
                                        onClick={this.handleOpenClick.bind(this, record)}
                                    >
                                        <Icon type='unlock' />
                                        启用
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
            // 查询数据
            queryState: '1',
            queryTitle: '',
            queryLoading: false,
            deleteVisible: false,
            deleteConfirmLoading: false,
            deleteId: '',
            openVisible: false,
            openConfirmLoading: false,
            openId: ''
        };
        this.params = { page: 1 };
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['前端页面管理', '公告管理']));
        let data = this.props.location.query;
        if (data !== undefined) {
            let { page, queryState, queryTitle } = data;
            this.params.page = page;
            this.setState({queryState, queryTitle}, () => {
                this.requestList();
            });
        } else {
            this.requestList();
        }
    }   
    requestList = (queryLoading) => {
        if (queryLoading) {
            this.setState({queryLoading: true});
            this.params.page = 1;
        }
        const url = `${baseURL}webPage/article/list`;
        const { queryState, queryTitle } = this.state;
        let _this = this;
        const params = {
            state: queryState,
            title: queryTitle,
            pageNo: this.params.page
        }
        this.showAndHideLoading(true);
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({queryLoading: state});
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.result;
                result.map((item, index) => (item.key = index));
                this.setState({
                    roleDataSource: result,
                    queryLoading: false,
                    pagination: pagination(res.data, (current) => {
                        _this.params.page = current;
                        this.requestList();
                    })
                });
                this.showAndHideLoading(false);
            } else {
                this.setState({queryLoading: false});
                this.showAndHideLoading(false);
                message.info(res.msg);
            }
        })
    }
    // 查询
    handleQueryClick = () => {
        if (/\s+/g.test(this.state.queryTitle)) {
            message.info('关键字不能包含空格');
            return;
        }
        this.requestList(true);
    }
    // 添加公告
    handleCreateEdit = () => {
        this.goToPage('/webPageControl/notice/createEdit');
    }
    // 编辑公告
    handleEditClick(record) {
        this.goToPage('/webPageControl/notice/edit', record);
    }
    goToPage(path, record = {}) {
        const page = this.params.page;
        const { queryState, queryTitle } = this.state;
        history.push(path, {page, queryState, queryTitle, record});
    }
    // 删除
    handleDeleteClick(record) {
        this.setState({
            deleteVisible: true,
            deleteId: record.id
        });
    }
    handleDeleteOk = () => {
        const url = `${baseURL}webPage/article/deleteOrUse`;
        this.setState({deleteConfirmLoading: true});
        fatch(url, 'post', {id: this.state.deleteId}, (err, state) => {
            this.setState({deleteConfirmLoading: state})
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    deleteVisible: false,
                    deleteConfirmLoading: false,
                    deleteId: ''
                });
                message.info(res.msg);
                this.requestList();
            } else {
                this.setState({deleteConfirmLoading: false})
                message.info(res.msg);
            }
        })
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    // 启用
    handleOpenClick(record) {
        this.setState({
            openVisible: true,
            openId: record.id
        })
    }
    handleOpenOk = () => {
        const url = `${baseURL}webPage/article/deleteOrUse`;
        this.setState({openConfirmLoading: true});
        fatch(url, 'post', {id: this.state.openId}, (err, state) => {
            this.setState({openConfirmLoading: state})
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    openVisible: false,
                    openConfirmLoading: false,
                    openId: ''
                });
                message.info(res.msg);
                this.requestList();
            } else {
                this.setState({openConfirmLoading: false})
                message.info(res.msg);
            }
        })
    }
    handleOpenCancel = () => {
        this.setState({openVisible: false});
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
     render() {
        const { 
            roleDataSource, 
            queryState, 
            queryTitle,
            queryLoading,
            deleteVisible,
            deleteConfirmLoading,
            openVisible,
            openConfirmLoading
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
                    <CreateTimeItem id='state' style={{position: 'relative' }}>
                            <span>使用状态:</span>
                            <Select
                                value={queryState}
                                style={{ width: 300 }}
                                onChange={(value) => {this.setState({queryState: value})}}
                                getPopupContainer={() => document.getElementById('state')}
                            >
                                <Option value='0'>已失效</Option>
                                <Option value='1'>使用中</Option>
                            </Select>
                    </CreateTimeItem>
                    <CreateTime>
                        <CreateTimeItem className='crux'>
                            <span>文章标题:</span>
                            <Input
                                placeholder='请输入关键词'
                                style={{ width: 300 }}
                                value={queryTitle}
                                onChange={(e) => {this.setState({queryTitle: e.target.value})}}
                            />
                        </CreateTimeItem>
                    </CreateTime>
                    <Search>
                        <Button type='primary' loading={queryLoading} onClick={this.handleQueryClick}>查询</Button>
                    </Search>
                </QueryListWarp>
                <Button type='primary' style={{marginBottom: 15}} onClick={this.handleCreateEdit}>添加公告</Button>
                <Table
                    bordered
                    pagination={this.state.pagination}
                    dataSource={roleDataSource}
                    columns={columns}
                />
                <Modal
                    width={300}
                    closable={false}
                    visible={deleteVisible}
                    onOk={this.handleDeleteOk}
                    confirmLoading={deleteConfirmLoading}
                    onCancel={this.handleDeleteCancel}
                >
                    <p>确定删除此公告</p>
                </Modal>
                <Modal
                    width={300}
                    closable={false}
                    visible={openVisible}
                    onOk={this.handleOpenOk}
                    confirmLoading={openConfirmLoading}
                    onCancel={this.handleOpenCancel}
                >
                    <p>确定启用此公告</p>
                </Modal>
            </Warp>
        );
    }
}

export default connect(null, null)(Notice);