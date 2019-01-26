import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Modal, Input, Select, message, Spin } from 'antd';
import { CreateModalBody, ModalGroup, Label, InputModal } from './style';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import baseURl from './../../../common/js/baseURL';
import fatch from './../../../common/js/fatch';
const Option = Select.Option;
const { TextArea } = Input;

class MenuControl extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '名称',
                dataIndex: 'text',
                key: 'text',
                render: (text, record) => {
                    return (<span onClick={this.handleReadMenuClick.bind(this, record)}>{record.text}</span>);
                }
            }, 
            {
                title: '链接',    
                dataIndex: 'url',
                key: 'url',
            }, 
            {
                title: '是否生效',
                dataIndex: 'flag',
                key: 'flag',
                render: (text, record) => {
                    return (<span>{record.flag === '0' ? '是' : '否'}</span>);
                }
            }, 
            {
                title: '是否为导航菜单',
                dataIndex: 'leftMenu',
                key: 'leftMenu',
                render: (text, record) => {
                    return (<span>{record.leftMenu === '0' ? '是' : '否'}</span>);
                }
            }, 
            {
                title: '当前目录级排序',
                dataIndex: 'sort',
                key: 'sort',
            }, 
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                width: 400,
                render: (text, record) => {
                    return (
                        <div>
                            <Button
                                style={{marginRight: '5px'}} 
                                icon='plus' 
                                type='primary'
                                onClick={this.handleChildrenMenuClick.bind(this, record)}
                            >
                                添加下级菜单
                            </Button>
                            <Button
                                style={{background: '#87b87f', marginRight: '5px'}}
                                icon='form'
                                type='primary'
                                onClick={this.handleUpdateMenuClick.bind(this, record)}
                            >
                                修改
                            </Button>
                            <Button 
                                style={{background: '#ffb752', marginRight: '5px'}} 
                                icon='warning' 
                                type='primary'
                                disabled={record.flag === '1' ? true : false}
                                onClick={this.handleInvalidMenuClick.bind(this, record)}
                            >
                                失效
                            </Button>
                        </div>
                    );
                }
            }
        ];
        
        this.state = {
            // 菜单数据列表
            menuDataSource: [],
            // 创建一级菜单
            createMenuVisible: false,
            createConfirmLoading: false,
            createDesc: '',
            createFlag: '0',
            createLeftMenu: '0',
            createName: '',
            createSort: '',
            createIcon: '',
            // 添加子级菜单
            createChildrenMenuVisble: false,
            childernConfirmLoading: false,
            childrenID: '',
            childrenLevel: '',
            childrenName: '',
            childrenPatch: '',
            childrenDesc: '',
            childrenFlag: '0',
            childrenLeftMenu: '0',
            childrenSort: '',
            childrenInterfaceUrl: '',
            // 更新菜单
            updateMenuVisble: false,
            updateName: '',
            updatePatch: '',
            updateFlag: '',
            updateMenuLeft: '',
            updateSort: '',
            updateDesc: '',
            updateId: '',
            updateFatherId: '',
            updateLevel: '',
            updateInterfaceUrl: '',
            // 查看菜单详情
            readMenuVisble: false,
            readName: '',
            readPatch: '',
            readSort: '',
            readFlg: '',
            readMenuLeft: '',
            readDesc: '',
            updateConfirmLoading: false,
            // 菜单失效
            disableMenuVisble: false,
            disableMenuID: '',
            disableConfirmLoading: false
        }
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(this.props.location.state));
        this.requestMenuList();
    }
    // 获取列表数据
    requestMenuList = () => {
        this.showAndHideLoading(true);
        const url = `${baseURl}sys/menu/list`;
        fatch(url, 'post', {}, (err, state) => {
            message.info(err);
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                const menuList = this.formatData(data);
                this.setState({menuDataSource: menuList});
                this.showAndHideLoading(false);
            } else {
                message.info(res.msg);
                this.showAndHideLoading(false);
            }
        });
    }
    // 格式化菜单列表数据
    formatData = (data) => {
        data.map((item) => {
            if (item.menus && item.menus.length) {
                item.key = item.id;
                item.children = item.menus;
                item.children.map((childrenItem) => {
                    childrenItem.parentID = item.id;
                    childrenItem.parentLevelID = item.level;
                });
                this.formatData(item.menus);
            } else {
                item.key = item.id;
            }
        });
        return data;
    }
    /**************************新建一级菜单*********************************/
    handleCreateMenuClick = () => {
        this.setState({createMenuVisible: true});
    }
    handleCreateMenuOk = () => {
        const { createName, createFlag, createLeftMenu, createSort, createDesc, createIcon } = this.state;
        if (createName === '') {
            message.info('请输入名称');
            return;
        }
        if (createSort === '') {
            message.info('请输入序号');
            return;
        }
        if (createSort < 0) {
            message.info('序号不能是负数');
            return;
        }
        const params = {
            name: createName,
            fatherId: '0',
            fatherLevel: '0',
            flag: createFlag,
            leftMenu: createLeftMenu,
            sort: createSort,
            description: createDesc,
            iconStr: createIcon
        }
        this.setState({createConfirmLoading: true});
        const url = `${baseURl}sys/menu/saveOrUpdate`;
        fatch(url, 'post', params, (err, state) => {
            this.setState({createConfirmLoading: state});
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    createName: '',
                    createFlag: '0',
                    createLeftMenu: '0',
                    createDesc: '',
                    createSort: '',
                    createIcon: '',
                    createMenuVisible: false,
                    createConfirmLoading: false
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestMenuList();
                }, 300);
            } else {
                this.setState({createConfirmLoading: false});
                message.info(res.msg);
            }
        });
    }
    handleCreateMenuCancel = () => {
        this.setState({
            createMenuVisible: false,
            createName: '',
            createFlag: '0',
            createLeftMenu: '0',
            createDesc: '',
            createSort: '',
            createIcon: '',
        });
    }
    /***************************添加子级菜单**************************/
    handleChildrenMenuClick = (record) => {
        this.setState({
            childrenID: record.id,
            childrenLevel: record.level,
            createChildrenMenuVisble: true
        });
    }
    handleCreateChildrenMenuOk = () => {
        const { childrenName, childrenPatch, childrenFlag, childrenLeftMenu, childrenSort, childrenID, childrenLevel, childrenDesc, childrenInterfaceUrl } = this.state;
        if (childrenName === '') {
            message.info('请输入名称');
            return;
        }
        if (childrenSort === '') {
            message.info('请输入序号');
            return;
        }
        if (childrenSort < 0) {
            message.info('序号不能是负数');
            return;
        }
        const params = {
            name: childrenName,
            fatherId: childrenID,
            fatherLevel: childrenLevel,
            flag: childrenFlag,
            leftMenu: childrenLeftMenu,
            sort: childrenSort,
            description: childrenDesc,
            path: childrenPatch,
            interfaceUrl: childrenInterfaceUrl
        }
        this.setState({childernConfirmLoading: true});
        const url = `${baseURl}sys/menu/saveOrUpdate`;
        fatch(url, 'post', params, (err, state) => {
            this.setState({childernConfirmLoading: state});
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    childrenName: '',
                    childrenPatch: '',
                    childrenFlag: '0',
                    childrenLeftMenu: '0',
                    childrenSort: '',
                    childrenDesc: '',
                    childrenID: '',
                    childrenLevel: '',
                    childrenInterfaceUrl: '',
                    createChildrenMenuVisble: false,
                    childernConfirmLoading: false
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestMenuList();
                }, 300);
            } else {
                this.setState({childernConfirmLoading: false});
                message.info(res.msg);
            }
        });
    }
    handleCreateChildrenMenuCancel = () => {
        this.setState({
            createChildrenMenuVisble: false,
            childrenName: '',
            childrenPatch: '',
            childrenFlag: '0',
            childrenLeftMenu: '0',
            childrenSort: '',
            childrenDesc: '',
            childrenID: '',
            childrenLevel: '',
            childrenInterfaceUrl: '',
        });
    }
    /**************************更新菜单*********************************/
    handleUpdateMenuClick(record) {
        let desc = '';
        if (record.description) desc = record.description;
        this.setState({
            updateMenuVisble: true,
            updateId: record.id,
            updateName: record.text,
            updateFlag: record.flag,
            updateMenuLeft: record.leftMenu,
            updatePatch: record.url,
            updateSort: record.sort,
            updateLevel: record.level,
            updateDesc: desc,
            updateFatherId: record.fatherId,
            updateInterfaceUrl: record.interfaceUrl
        });
    }
    handleUpdateMenuOk = () => {
        const { 
            updateName, 
            updatePatch, 
            updateFlag, 
            updateMenuLeft, 
            updateSort, 
            updateDesc, 
            updateId, 
            updateLevel, 
            updateFatherId,
            updateInterfaceUrl 
        } = this.state;
        if (updateName === '') {
            message.info('请输入名称');
            return;
        }
        if (updateSort === '') {
            message.info('请输入序号');
            return;
        }
        if (updateSort < 0) {
            message.info('序号不能是负数');
            return;
        }
        let path = '';
        if (updatePatch !== undefined) path = updatePatch;
        this.setState({updateConfirmLoading: true});
        const params = {
            name: updateName,
            flag: updateFlag,
            leftMenu: updateMenuLeft,
            fatherLevel: updateLevel,
            sort: updateSort,
            description: updateDesc,
            path: path,
            id: updateId,
            fatherId: updateFatherId,
            interfaceUrl: updateInterfaceUrl
        }
        const url = `${baseURl}sys/menu/saveOrUpdate`;
        fatch(url, 'post', params, (err, state) => {
            this.setState({updateConfirmLoading: state});
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    updateMenuVisble: false,
                    updateConfirmLoading: false,
                    updateName: '',
                    updateDesc: '',
                    updatePatch: '',
                    updateId: '',
                    flag: '',
                    leftMenu: '',
                    updateLevel: '',
                    updateFatherId: '',
                    updateInterfaceUrl: ''
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestMenuList();
                }, 300);
            } else {
                this.setState({updateConfirmLoading: false})
                message.info(res.msg);
            }
        })
    }
    handleUpdateMenuCancel = () => {
        this.setState({
            updateMenuVisble: false
        });
    }
    /*****************************查看菜单详情******************************/
    handleReadMenuClick(record) {
        const { text, url, sort, flag, leftMenu } = record;
        let desc = '';
        if (record.description) desc = record.description;
        this.setState({
            readMenuVisble: true,
            readName: text,
            readPatch: url,
            readSort: sort,
            readFlg: flag,
            readMenuLeft: leftMenu,
            readDesc: desc
        });
    }
    handleReadMenuonCancel = () => {
        this.setState({readMenuVisble: false});
    }
    /***********************************菜单失效**************************************/
    handleInvalidMenuClick(record) {
        this.setState({
            disableMenuVisble: true,
            disableMenuID: record.id
        });
    }
    handleDisableMenuOk = () => {
        const url = `${baseURl}sys/menu/deleteMenu`;
        const params = {
            id: this.state.disableMenuID
        }
        this.setState({disableConfirmLoading: true})
        fatch(url, 'post', params, (err, state) => {
            this.setState({disableConfirmLoading: state})
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    disableMenuVisble: false,
                    disableConfirmLoading: false,
                    disableMenuID: ''
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestMenuList();
                }, 300);
            } else {
                this.setState({disableConfirmLoading: false})
                message.info(res.msg);
            }
        })
    }
    handleDisableMenuCancel = () => {
        this.setState({disableMenuVisble: false});
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const {
            menuDataSource, 
            createMenuVisible, 
            createChildrenMenuVisble, 
            updateMenuVisble, 
            readMenuVisble,
            createName,
            createFlag,
            createLeftMenu,
            createSort,
            createDesc,
            createIcon,
            createConfirmLoading,
            childrenName,
            childrenPatch,
            childrenFlag,
            childrenLeftMenu,
            childrenSort,
            childrenDesc,
            childernConfirmLoading,
            childrenInterfaceUrl,
            readName,
            readPatch,
            readFlg,
            readMenuLeft,
            readSort,
            readDesc,
            updateName,
            updatePatch,
            updateFlag,
            updateMenuLeft,
            updateSort,
            updateDesc,
            updateInterfaceUrl,
            updateConfirmLoading,
            disableMenuVisble,
            disableConfirmLoading
        } = this.state;
        return ( 
            <div style={{padding: '0 15px', background: '#fff'}} >
                <Button
                    style={{margin: '15px 0', height: '45px'}}
                    type='primary'
                    onClick={this.handleCreateMenuClick}
                >
                    新建一级菜单
                </Button>
                {/****************菜单失效*****************/}
                <Modal
                    width={600}
                    okText='确认'
                    cancelText='取消'
                    title='禁用菜单'
                    confirmLoading={disableConfirmLoading}
                    visible={disableMenuVisble}
                    onOk={this.handleDisableMenuOk}
                    onCancel={this.handleDisableMenuCancel}
                >
                    <p>确定要将该菜单失效吗？</p>
                </Modal>
                {/**************新建一级菜单***************/}
                <Modal
                    width={600}
                    okText='保存'
                    cancelText='关闭'
                    title='新建一级菜单'
                    confirmLoading={createConfirmLoading}
                    visible={createMenuVisible}
                    onOk={this.handleCreateMenuOk}
                    onCancel={this.handleCreateMenuCancel}
                >
                    <CreateModalBody>
                        <ModalGroup>
                            <Label>名称<span style={{color: 'red'}}>*</span></Label>
                            <InputModal>
                                <Input
                                    placeholder='必填项'
                                    value={createName}
                                    onChange={(e) => {this.setState({createName: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>生效</Label>
                            <InputModal id='sx' style={{position: 'relative' }}>
                                <Select
                                    style={{width: '100%'}}
                                    value={createFlag}
                                    onChange={(value) => {this.setState({createFlag: value})}}
                                    getPopupContainer={() => document.getElementById('sx')}
                                >
                                    <Option value='0'>是</Option>
                                    <Option value='1'>否</Option>
                                </Select>
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>菜单导航</Label>
                            <InputModal id='dh' style={{position: 'relative' }}>
                                <Select
                                    style={{width: '100%'}}
                                    value={createLeftMenu}
                                    onChange={(value) => {this.setState({createLeftMenu: value})}}
                                    getPopupContainer={() => document.getElementById('dh')}
                                >
                                    <Option value='0'>是</Option>
                                    <Option value='1'>否</Option>
                                </Select>
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>菜单图标</Label>
                            <InputModal>
                                <Input
                                    value={createIcon}
                                    onChange={(e) => {this.setState({createIcon: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>排序<span style={{color: 'red'}}>*</span></Label>
                            <InputModal>
                                <Input 
                                    type='number' 
                                    placeholder='请输入1-99999以内的整数'
                                    value={createSort}
                                    onChange={(e) => {this.setState({createSort: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>简述</Label>
                            <InputModal>
                                <TextArea
                                    style={{height: 100}}
                                    maxLength='160'
                                    placeholder='菜单简述（不超过250个字符）'
                                    value={createDesc}
                                    onChange={(e) => {this.setState({createDesc: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                    </CreateModalBody>
                </Modal>
                {/**************新建子级菜单***************/}
                <Modal
                    width={600}
                    okText='保存'
                    cancelText='关闭'
                    title='新建子级菜单'
                    confirmLoading={childernConfirmLoading}
                    visible={createChildrenMenuVisble}
                    onOk={this.handleCreateChildrenMenuOk}
                    onCancel={this.handleCreateChildrenMenuCancel}
                >
                    <CreateModalBody>
                        <ModalGroup>
                            <Label>名称<span style={{color: 'red'}}>*</span></Label>
                            <InputModal>
                                <Input
                                    placeholder='必填项'
                                    value={childrenName}
                                    onChange={(e) => {this.setState({childrenName: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>链接</Label>
                            <InputModal>
                                <Input
                                    value={childrenPatch}
                                    onChange={(e) => {this.setState({childrenPatch: e.target.value})}}
                                 />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>生效</Label>
                            <InputModal id='zsx' style={{position: 'relative' }}>
                                <Select
                                    style={{width: '100%'}}
                                    value={childrenFlag}
                                    onChange={(value) => {this.setState({childrenFlag: value})}}
                                    getPopupContainer={() => document.getElementById('zsx')}
                                >
                                    <Option value='0'>是</Option>
                                    <Option value='1'>否</Option>
                                </Select>
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>菜单导航</Label>
                            <InputModal id='zdh' style={{position: 'relative' }}>
                                <Select
                                    style={{width: '100%'}}
                                    value={childrenLeftMenu}
                                    onChange={(value) => {this.setState({childrenLeftMenu: value})}}
                                    getPopupContainer={() => document.getElementById('zdh')}
                                >
                                    <Option value='0'>是</Option>
                                    <Option value='1'>否</Option>
                                </Select>
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>排序<span style={{color: 'red'}}>*</span></Label>
                            <InputModal>
                                <Input
                                    type='number'
                                    placeholder='请输入1-99999以内的整数'
                                    value={childrenSort}
                                    onChange={(e) => {this.setState({childrenSort: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>接口地址前缀<span style={{color: 'red'}}>*</span></Label>
                            <InputModal>
                                <Input
                                    placeholder='必填项'
                                    value={childrenInterfaceUrl}
                                    onChange={(e) => {this.setState({childrenInterfaceUrl: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>简述</Label>
                            <InputModal>
                                <TextArea
                                    style={{height: 100}} 
                                    maxLength='160'
                                    placeholder='菜单简述（不超过250个字符）'
                                    value={childrenDesc}
                                    onChange={(e) => {this.setState({childrenDesc: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                    </CreateModalBody>
                </Modal>
                {/**************更新菜单***************/}
                <Modal
                    width={600}
                    okText='保存'
                    cancelText='关闭'
                    title='更新菜单'
                    confirmLoading={updateConfirmLoading}
                    visible={updateMenuVisble}
                    onOk={this.handleUpdateMenuOk}
                    onCancel={this.handleUpdateMenuCancel}
                >
                    <CreateModalBody>
                        <ModalGroup>
                            <Label>名称*</Label>
                            <InputModal>
                                <Input 
                                    value={updateName}
                                    onChange={(e) => {this.setState({updateName: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>链接</Label>
                            <InputModal>
                                <Input
                                    value={updatePatch}
                                    onChange={(e) => {this.setState({updatePatch: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>生效</Label>
                            <InputModal id='xsx' style={{position: 'relative' }}>
                                <Select 
                                    value={updateFlag} 
                                    style={{width: '100%'}}
                                    onChange={(value) => {this.setState({updateFlag: value})}}
                                    getPopupContainer={() => document.getElementById('xsx')}
                                >
                                    <Option value='0'>是</Option>
                                    <Option value='1'>否</Option>
                                </Select>
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>菜单导航</Label>
                            <InputModal id='xdh' style={{position: 'relative' }}>
                                <Select 
                                    value={updateMenuLeft} 
                                    style={{width: '100%'}}
                                    onChange={(value) => {this.setState({updateMenuLeft: value})}}
                                    getPopupContainer={() => document.getElementById('xdh')}
                                >
                                    <Option value='0'>是</Option>
                                    <Option value='1'>否</Option>
                                </Select>
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>接口地址前缀<span style={{color: 'red'}}>*</span></Label>
                            <InputModal>
                                <Input
                                    placeholder='必填项'
                                    value={updateInterfaceUrl}
                                    onChange={(e) => {this.setState({updateInterfaceUrl: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>排序</Label>
                            <InputModal>
                                <Input 
                                    type='number'
                                    value={updateSort}
                                    onChange={(e) => {this.setState({updateSort: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>简述</Label>
                            <InputModal>
                                <TextArea 
                                    style={{height: 100}} 
                                    maxLength='160'
                                    placeholder='菜单简述（不超过250个字符）'
                                    value={updateDesc}
                                    onChange={(e) => {this.setState({updateDesc: e.target.value})}}
                                />
                            </InputModal>
                        </ModalGroup>
                    </CreateModalBody>
                </Modal>
                {/**************菜单详情***************/}
                <Modal
                    width={600}
                    title='菜单详情'
                    visible={readMenuVisble}
                    onCancel={this.handleReadMenuonCancel}
                    footer={null}
                >
                    <CreateModalBody>
                        <ModalGroup>
                            <Label>名称</Label>
                            <InputModal>
                                <Input disabled value={readName} />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>链接</Label>
                            <InputModal>
                                <Input disabled value={readPatch} />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>生效</Label>
                            <InputModal>
                                <Select disabled value={readFlg} style={{width: '100%'}}>
                                    <Option value='0'>是</Option>
                                    <Option value='1'>否</Option>
                                </Select>
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>菜单导航</Label>
                            <InputModal>
                                <Select disabled value={readMenuLeft} style={{width: '100%'}}>
                                    <Option value='0'>是</Option>
                                    <Option value='1'>否</Option>
                                </Select>
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>排序</Label>
                            <InputModal>
                                <Input disabled value={readSort} />
                            </InputModal>
                        </ModalGroup>
                        <ModalGroup>
                            <Label>简述</Label>
                            <InputModal>
                                <TextArea 
                                    maxLength='160'
                                    disabled 
                                    style={{height: 100}}
                                    value={readDesc}
                                />
                            </InputModal>
                        </ModalGroup>
                    </CreateModalBody>
                </Modal>
                <Table bordered pagination={false} columns={this.columns}  dataSource={menuDataSource} />
            </div>
        );
    }
}

export default connect(null, null)(MenuControl);