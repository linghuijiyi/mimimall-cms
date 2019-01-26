import React, { Component } from 'react';
import { 
    Warp, 
    QueryBox, 
    Container, 
    QueryItem, 
    Left, 
    Right, 
    QueryButton,
    CreatePoster,
    CreateLeft,
    CreateRight,
    CreateItem,
    CreateImg,
    ReadPoster,
    Options
} from './style';
import { 
    Button, 
    Select, 
    Table, 
    Icon, 
    Modal, 
    Input, 
    Radio, 
    InputNumber, 
    Upload, 
    message,
    Spin
} from 'antd';
import { connect } from 'react-redux';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../../base/home/store';
import reqwest from 'reqwest';
import history from './../../../../history';
import fatch from './../../../../common/js/fatch';
import Storage from './../../../../common/js/storage';
import baseURL from './../../../../common/js/baseURL';
import pagination from './../../../../common/js/pagination';
const Option = Select.Option;
const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

class AtmControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            // 查询
            queryNmae: '',
            queryState: '',
            queryLoading: false,
            // 添加广告
            createVisible: false,
            createConfirmLoading: false,
            createPreviewVisible: false,
            createPreviewImage: '',
            createWidth: '',
            createHeight: '',
            createName: '',
            fileList: [],
            fileListParams: [],
            compareSrc: '',
            // 查看
            readVisible: false,
            readConfirmLoading: false,
            readName: '',
            readWidth: '',
            readHeight: '',
            readFileList: [],
            // 更新
            updateVisible: false,
            updateConfirmLoading: false,
            updateName: '',
            updateWidth: '',
            updateHeight: '',
            updateId:  '',
            updateImgName: '',
            updateFileList: [],
            // 禁用/启用
            optionVisible: false,
            optionConfirmLoading: false,
            optionId: '',
            optionText: '',
            optionTitle: ''
        }
        this.columns = [
            {
                title: '广告位id',
                key: 'id',
                dataIndex: 'id',
                align: 'center',
            }, 
            {
                title: '广告位名称',
                key: 'name',
                dataIndex: 'name',
                align: 'center',
            }, 
            {
                title: '位置大小',
                key: 'width/height',
                dataIndex: 'width/height',
                align: 'center',
                render: (text, record) => (<div>宽{record.width}/高{record.height}</div>)
            },
            {
                title: '状态',
                key: 'role',
                dataIndex: 'role',
                align: 'center',
                render: (rext, record) => {
                    if (record.state === '0') return <div>禁用</div>;
                    else if (record.state === '1') return <div>正常</div>;
                }
            },
            {
                title: '默认图片',
                key: 'imgName',
                dataIndex: 'imgName',
                align: 'center',
            },
            {
                title: '操作',
                key: 'updateTime',
                dataIndex: 'updateTime',
                align: 'center',
                render: (text, record) => {
                    return (
                        <Options>
                            <div style={{display: record.state === '0' ? 'block' : 'none'}}>
                                <Button 
                                    type='primary'
                                    onClick={this.handleUpdateClick.bind(this, record)}
                                    style={{background: 'rgb(135, 208, 104)', border: '1px solid rgb(135, 208, 104)'}}
                                >
                                    <Icon type='file-text' />
                                    编辑
                                </Button>
                            </div>
                            <div style={{display: record.state === '1' ? 'block' : 'none'}}>
                                <Button 
                                    type='primary'
                                    style={{background: 'rgb(135, 208, 104)', border: '1px solid rgb(135, 208, 104)'}}
                                    onClick={this.handleReadClick.bind(this, record)}
                                >
                                    <Icon type='eye' />
                                    查看
                                </Button>
                            </div>
                            <div style={{display: record.state === '1' ? 'block' : 'none'}}>
                                <Button 
                                    type='primary'
                                    style={{background: 'red', border: 'red'}}
                                    onClick={this.handleDeleteClick.bind(this, record, '确认禁用此广告！', '禁用广告')}
                                >
                                    <Icon type='lock' />
                                    禁用
                                </Button>
                            </div>
                            <div style={{display: record.state === '0' ? 'block' : 'none'}}>
                                <Button 
                                    type='primary'
                                    onClick={this.handleDeleteClick.bind(this, record, '确认启用此广告！', '启用广告')}
                                >
                                    <Icon type='unlock' />
                                    使用
                                </Button>
                            </div>
                        </Options>
                    )
                }
            }
        ];
        this.params = { page: 1 };
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['前端页面管理', '广告管理', '广告位管理']));
        this.requestList();
        this.requestList();
    }
    // 获取数据列表
    requestList = (queryLoading) => {
        if (queryLoading) {
            this.setState({queryLoading: true});
            this.params.page = 1;
        }
        this.showAndHideLoading(true);
        let _this = this;
        const { queryNmae, queryState } = this.state;
        const url = `${baseURL}webPage/advertPosition/list`;
        const params = {
            name: queryNmae,
            state: queryState
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({queryLoading: state});
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.result;
                result.map((item, index) => (item.key = index));
                this.setState({
                    dataSource: result,
                    pagination: pagination(res.data, (current) => {
                        _this.params.page = current;
                        this.requestList();
                    })
                });
                this.showAndHideLoading(false);
                if (queryLoading) {
                    this.setState({queryLoading: false});
                    message.info(res.msg);
                }
            } else {
                this.setState({queryLoading: false});
                this.showAndHideLoading(false);
                message.info(res.msg);
            }
        });
    }
    handleQueryList = () => {
        const { queryNmae } = this.state;
        if (regEn.test(queryNmae) || regCn.test(queryNmae)) {
            message.info('广告位名称不能包含特殊字符');
            return;
        }
        if (/\s+/g.test(queryNmae)) {
            message.info('广告位名称不能包含空格');
            return;
        }
        this.requestList(true);
    }
    /*********************添加光广告*************************/
    handleCreateOk = () => {
        const { createWidth, createHeight, createName, fileListParams } = this.state;
        const { width, height } = this.refs.img;
        if (createName === '') {
            message.info('请输入广告位名称');
            return;
        }
        if (regEn.test(createName) || regCn.test(createName)) {
            message.info('广告位名称不能包含特殊字符');
            return;
        }
        if (/\s+/g.test(createName)) {
            message.info('广告位名称不能包含空格');
            return;
        }
        if (createWidth === '') {
            message.info('请填写广告位宽度');
            return;
        }
        if (createWidth < 0) {
            message.info('广告位宽度不能是负数');
            return;
        }
        if (createHeight === '') {
            message.info('请填写广告位高度');
            return;
        }
        if (createHeight < 0) {
            message.info('广告位高度不能是负数');
            return;
        }
        if (!fileListParams.length) {
            message.info('请上传广告位图片');
            return;
        }
        if (width !== createWidth) {
            message.info('广告位宽度和图片宽度不一致');
            return;
        }
        if (height !== createHeight) {
            message.info('广告位高度和图片高度不一致');
            return;
        }
        this.setState({createConfirmLoading: true});
        const formData = new FormData();
        fileListParams.map((file) => (formData.append('file', file)));
        formData.append('name', createName);
        formData.append('width', createWidth);
        formData.append('height', createHeight);
        reqwest({
            url: `${baseURL}webPage/advertPosition/saveOrUpdate`,
            method: 'post',
            processData: false,
            headers: {
                authorization: Storage.get('token')
            },
            data: formData,
            success: (res) => {
                if (res.code === '0') {
                    this.setState({
                        createConfirmLoading: false,
                        fileListParams: [],
                        fileList: [],
                        createWidth: '',
                        createHeight: '',
                        createName: '',
                        createVisible: false
                    });
                    setTimeout(() => {
                        message.info(res.msg);
                        this.requestList();
                    });
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
    handleCreateCancel = () => this.setState({
        createVisible: false,
        fileListParams: [],
        fileList: [],
        createWidth: '',
        createHeight: '',
        createName: ''
    });
    /***************************图片预览*******************************/
    handleCancel = () => this.setState({ createPreviewVisible: false });
    /****************************查看**********************************/
    handleReadClick(record) {
        const url = `${baseURL}account/getImgUrl`;
        fatch(url, 'post', {imgName: record.imgName}, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                let imgList = [];
                imgList.push({
                    uid: '-1',
                    name: 'img.png',
                    status: 'done',
                    url: res.data
                });
                this.setState({
                    readVisible: true,
                    readName: record.name,
                    readWidth: record.width,
                    readHeight: record.height,
                    readFileList: imgList    
                });
            } else {
                message.info(res.msg);
            }
        })
    }
    handleReadCancel = () => this.setState({readVisible: false});
    /***************************更新****************************************/
    handleUpdateClick(record) {
        const url = `${baseURL}account/getImgUrl`;
        fatch(url, 'post', {imgName: record.imgName}, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                let imgList = [];
                imgList.push({
                    uid: '-1',
                    name: 'img.png',
                    status: 'done',
                    url: res.data
                });
                this.setState({
                    updateVisible: true,
                    updateHeight: record.height,
                    updateWidth: record.width,
                    updateName: record.name,
                    updateId: record.id,
                    updateImgName: record.imgName,
                    updateFileList: imgList,
                    compareSrc: res.data
                });
            } else {
                message.info(res.msg);
            }
        });
    }
    handleUpdateOk = () => {
        const { updateId, updateName, updateWidth, updateHeight, updateFileList, updateImgName, fileListParams, compareSrc } = this.state;
        const { width, height } = this.refs.img;
        if (updateName === '') {
            message.info('请输入广告位名称');
            return;
        }
        if (regEn.test(updateName) || regCn.test(updateName)) {
            message.info('广告位名称不能包含特殊字符');
            return;
        }
        if (/\s+/g.test(updateName)) {
            message.info('广告位名称不能包含空格');
            return;
        }
        if (updateWidth === '') {
            message.info('请填写广告位宽度');
            return;
        }
        if (updateWidth < 0) {
            message.info('广告位宽度不能是负数');
            return;
        }
        if (updateHeight === '') {
            message.info('请填写广告位高度');
            return;
        }
        if (updateHeight < 0) {
            message.info('广告位高度不能是负数');
            return;
        }
        if (compareSrc === '' && !fileListParams.length) {
            message.info('请上传广告位图片');
            return;
        }
        if (width !== updateWidth) {
            message.info('广告位宽度和图片宽度不一致');
            return;
        }
        if (height !== updateHeight) {
            message.info('广告位高度和图片高度不一致');
            return;
        }
        this.setState({updateConfirmLoading: true});
        const formData = new FormData();
        fileListParams.map((file) => (formData.append('file', file)));
        formData.append('name', updateName);
        formData.append('width', updateWidth);
        formData.append('height', updateHeight);
        formData.append('id', updateId);
        formData.append('imgName', updateImgName);
        reqwest({
            url: `${baseURL}webPage/advertPosition/saveOrUpdate`,
            method: 'post',
            processData: false,
            headers: {
                authorization: Storage.get('token')
            },
            data: formData,
            success: (res) => {
                if (res.code === '0') {
                    this.setState({
                        updateConfirmLoading: false,
                        updateVisible: false,
                        fileListParams: [],
                        updateFileList: [],
                    });
                    setTimeout(() => {
                        message.info(res.msg);
                        this.requestList();
                    }, 300);
                } else {
                    message.info(res.msg);
                    this.setState({updateConfirmLoading: false});
                }
            },
            error: () => {
                this.setState({updateConfirmLoading: false});
                message.info('网络错误!!!');
            }
        });
    }
    handleUpdateCancel = () => this.setState({updateVisible: false});
    /***************************禁用**************************************/
    handleDeleteClick(record, optionText, optionTitle) {
        this.setState({
            optionVisible: true,
            deleteId: record.id,
            optionText,
            optionTitle
        });
    }
    handleOptionOk = () => {
        const url = `${baseURL}webPage/advertPosition/deleteOrUse`;
        this.setState({optionConfirmLoading: true});
        fatch(url, 'post', {id: this.state.deleteId}, (err, state) => {
            message.info(err);
            this.setState({optionConfirmLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    optionVisible: false,
                    optionConfirmLoading: false,
                    deleteId: ''
                });
                setTimeout(() => {
                    message.info(res.msg);
                    this.requestList();
                }, 300);
            } else {
                message.info(res.msg);
                this.setState({optionConfirmLoading: false});
            }
        });
    }
    handleOptionCancel = () => this.setState({optionVisible: false});
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
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
        const { 
            dataSource,
            createVisible,
            createConfirmLoading,
            fileList,
            createPreviewImage,
            createPreviewVisible,
            createWidth,
            createHeight,
            createName,
            compareSrc,
            queryNmae,
            queryState,
            queryLoading,
            readVisible,
            readConfirmLoading,
            readFileList,
            readName,
            readHeight,
            readWidth,
            updateVisible,
            updateConfirmLoading,   
            updateName,
            updateWidth,
            updateHeight,
            updateFileList,
            optionVisible,
            optionConfirmLoading,
            optionText,
            optionTitle
        } = this.state;
        const props = {
            action: `${baseURL}webPage/advertPosition/saveOrUpdate`,
            listType: 'picture-card',
            accept: 'image/*',
            onRemove: (file) => {
                this.setState(({ fileList, fileListParams, compareSrc }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return { fileList: newFileList, fileListParams: newFileList, compareSrc: '' };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListParams }) => ({
                    fileListParams: [...fileListParams, file]
                }));
                return false;
            },
            fileList: this.state.fileList,
            onPreview: (file) => {
                this.setState({
                    createPreviewImage: file.url || file.thumbUrl,
                    createPreviewVisible: true,
                });
            },
            onChange: ({ fileList }) => {
                this.setState({ fileList });
                setTimeout(() => {
                    if (fileList.length > 0) this.setState({compareSrc: fileList[0].thumbUrl});
                }, 150);
            }
        };
        const readProps = {
            action: `${baseURL}webPage/advertPosition/saveOrUpdate`,
            listType: 'picture-card',
            accept: 'image/*',
            fileList: this.state.readFileList,
            beforeUpload: (file) => {
                this.setState(({ fileListParams }) => ({
                    fileListParams: [...fileListParams, file]
                }));
                return false;
            },
            onPreview: (file) => {
                this.setState({
                    createPreviewImage: file.url || file.thumbUrl,
                    createPreviewVisible: true,
                });
            }
        };
        const updateProps = {
            action: `${baseURL}webPage/advertPosition/saveOrUpdate`,
            listType: 'picture-card',
            accept: 'image/*',
            onRemove: (file) => {
                this.setState(({ updateFileList, fileListParams, compareSrc }) => {
                    const index = updateFileList.indexOf(file);
                    const newFileList = updateFileList.slice();
                    newFileList.splice(index, 1);
                    return { updateFileList: newFileList, fileListParams: newFileList, compareSrc: '' };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListParams }) => ({
                    fileListParams: [...fileListParams, file]
                }));
                return false;
            },
            fileList: this.state.updateFileList,
            onPreview: (file) => {
                this.setState({
                    createPreviewImage: file.url || file.thumbUrl,
                    createPreviewVisible: true,
                });
            },
            onChange: ({ fileList }) => {
                this.setState({ updateFileList: fileList });
                setTimeout(() => {
                    if (fileList.length > 0) this.setState({compareSrc: fileList[0].thumbUrl});
                }, 150);
            }
        };
        return (
            <Warp>
                <img ref='img' src={compareSrc} style={{display: 'none'}} />
                <Button 
                    type='primary' 
                    style={{margin: '10px 0px'}}
                    onClick={() => {history.push({pathname: '/webPageControl/advertisement', query: this.props.location.state})}}
                >
                    <Icon type='rollback' />
                    返回
                </Button>
                <QueryBox>
                    <Container>
                        <Left>
                            <QueryItem>
                                <span>广告位名称:</span>
                            </QueryItem>
                            <QueryItem>
                                <span>当前状态:</span>
                            </QueryItem>
                        </Left>
                        <Right>
                            <QueryItem>
                                <Input placeholder='请输入广告位名称' value={queryNmae} onChange={(e) => {this.setState({queryNmae: e.target.value})}} />
                            </QueryItem>
                            <QueryItem id='state' style={{position: 'relative' }}>
                                <Select
                                    style={{width: '100%'}}
                                    value={queryState}
                                    onChange={(value) => {this.setState({queryState: value})}}
                                    getPopupContainer={() => document.getElementById('state')}
                                >
                                    <Option value="">全部</Option>
                                    <Option value='0'>禁用</Option>
                                    <Option value='1'>使用</Option>
                                </Select>   
                            </QueryItem>
                        </Right>
                    </Container>
                    <QueryButton>
                        <Button type='primary' loading={queryLoading} onClick={this.handleQueryList}>查询</Button>
                    </QueryButton>
                </QueryBox>
                <Button type='primary' style={{margin: '15px 0'}} onClick={() => {this.setState({createVisible: true})}}>
                    添加广告位
                </Button>
                <Table bordered pagination={this.state.pagination} dataSource={dataSource} columns={columns}/>
                <Modal
                    title='添加广告'
                    width={700}
                    closable={false}
                    visible={createVisible}
                    confirmLoading={createConfirmLoading}
                    onOk={this.handleCreateOk}
                    onCancel={this.handleCreateCancel}
                >
                    <CreatePoster>
                        <CreateLeft>
                            <CreateItem>广告位名称：</CreateItem>
                            <CreateItem>位置大小：</CreateItem>
                            <CreateImg>默认图片：</CreateImg>
                        </CreateLeft>
                        <CreateRight>
                            <CreateItem>
                                <Input
                                    placeholder='命名规则页面+具体位置，例如：首页+顶部通栏'
                                    onChange={(e) => {this.setState({createName: e.target.value})}}
                                />
                            </CreateItem>
                            <CreateItem>
                                <div style={{display: 'flex'}}>
                                    <div>
                                        <InputNumber placeholder='宽' value={createWidth} onChange={(value) => {this.setState({createWidth: value})}} />
                                    </div>
                                    <div style={{marginLeft: 5}}>
                                        <InputNumber placeholder='高' value={createHeight} onChange={(value) => {this.setState({createHeight: value})}} />
                                    </div>
                                </div>
                            </CreateItem>
                            <CreateImg style={{minHeight: 104}}>
                                <Upload {...props}>
                                    {fileList.length >= 1 ? null : <div><Icon type='plus' /></div>}
                                </Upload>
                                <Modal visible={createPreviewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={createPreviewImage} />
                                </Modal>
                            </CreateImg>
                        </CreateRight>
                    </CreatePoster>
                </Modal>
                <Modal
                    title='查看广告内容'
                    width={700}
                    closable={true}
                    visible={readVisible}
                    onCancel={this.handleReadCancel}
                    footer={null}
                >
                    <ReadPoster>
                        <CreateLeft>
                            <CreateItem>广告位名称：</CreateItem>
                            <CreateItem>位置大小：</CreateItem>
                            <CreateImg>默认图片：</CreateImg>
                        </CreateLeft>
                        <CreateRight>
                            <CreateItem>
                                <Input value={readName} disabled={true} onChange={(e) => {this.setState({readName: e.target.value})}} />
                            </CreateItem>
                            <CreateItem>
                                <div style={{display: 'flex'}}>
                                    <div>
                                        <InputNumber placeholder='宽' value={readWidth} disabled />
                                    </div>
                                    <div style={{marginLeft: 5}}>
                                        <InputNumber placeholder='高' value={readHeight} disabled />
                                    </div>
                                </div>
                            </CreateItem>
                            <CreateImg className='readImg' style={{minHeight: 104}}>
                                <Upload {...readProps}>
                                    {readFileList.length >= 1 ? null : <div><Icon type='plus' /></div>}
                                </Upload>
                                <Modal visible={createPreviewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={createPreviewImage} />
                                </Modal>
                            </CreateImg>
                        </CreateRight>
                    </ReadPoster>
                </Modal>
                <Modal
                    title='编辑广告内容'
                    width={700}
                    closable={false}
                    visible={updateVisible}
                    confirmLoading={updateConfirmLoading}
                    onOk={this.handleUpdateOk}
                    onCancel={this.handleUpdateCancel}
                >
                    <CreatePoster>
                        <CreateLeft>
                            <CreateItem>广告位名称：</CreateItem>
                            <CreateItem>位置大小：</CreateItem>
                            <CreateImg>默认图片：</CreateImg>
                        </CreateLeft>
                        <CreateRight>
                            <CreateItem>
                                <Input
                                    placeholder='命名规则页面+具体位置，例如：首页+顶部通栏'
                                    value={updateName}
                                    onChange={(e) => {this.setState({updateName: e.target.value})}}
                                />
                            </CreateItem>
                            <CreateItem>
                                <div style={{display: 'flex'}}>
                                    <div>
                                        <InputNumber placeholder='宽' value={updateWidth} onChange={(value) => {this.setState({updateWidth: value})}} />
                                    </div>
                                    <div style={{marginLeft: 5}}>
                                        <InputNumber placeholder='高' value={updateHeight} onChange={(value) => {this.setState({updateHeight: value})}} />
                                    </div>
                                </div>
                            </CreateItem>
                            <CreateImg style={{minHeight: 104}}>
                                <Upload {...updateProps}>
                                    {updateFileList.length >= 1 ? null : <div><Icon type='plus' /></div>}
                                </Upload>
                                <Modal visible={createPreviewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={createPreviewImage} />
                                </Modal>
                            </CreateImg>
                        </CreateRight>
                    </CreatePoster>
                </Modal>
                <Modal
                    title={optionTitle}
                    width={700}
                    closable={false}
                    visible={optionVisible}
                    confirmLoading={optionConfirmLoading}
                    onOk={this.handleOptionOk}
                    onCancel={this.handleOptionCancel}
                >
                    {optionText}
                </Modal>
            </Warp>
        );
    }
}

export default connect(null, null)(AtmControl);