import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { DatePicker, Button, Table , Input, message, Spin, Modal } from 'antd';
import { Warp, QueryListWarp, CreateTime, CreateTimeItem, Search } from './style';
import fatch from './../../../common/js/fatch';
import pagination from './../../../common/js/pagination';
import baseURL from './../../../common/js/baseURL';
import formatDateTime from './../../../common/js/formatDateTime';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD';
const { TextArea } = Input;
class Reply extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '编号',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '信息内容',
                dataIndex: 'content',
                align: 'center',
                width: 900
            },
            {
                title: '操作人',
                dataIndex: 'creatName',
                align: 'center',
            },
            {
                title: '最后修改时间',
                dataIndex: 'updateTime',
                align: 'center',
                render: (text, record) => {
                    return (<span>{formatDateTime(record.updateTime)}</span>);
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                render: (text, record) => {
                    return (
                        this.state.dataSource.length
                        ? (
                            <div>
                                <Button style={{marginRight:4}} onClick={this.edit.bind(this,record)}>编辑</Button>
                                <Button type="danger" onClick={this.remove.bind(this,record)}>删除</Button>
                            </div>
                        ) : null
                    );
                },
            }
        ];
        this.state = {
            inputContent:"",
            dataSource: [],  // 表格数据
            loading:false,
            updateVisibleLoading: false,
            deleteVisibleLoading:false,
            visibleLoading:false,
            createTimeValue: '', // 接口参数日期
            startValue: null, // 开始日期
            keyWordInputValue:"", // 更新textarea默认值
            visible:false,//添加快速回复模板
            updateVisible:false, //修改快速回复模板
            deleteVisible:false,// 删除模板
            infoContent:"",// 要添加的文字模板
            updateInfoContent:'',// 要修改的文字模板
            nowId:""
        };
        this.params = { page: 1 }
    }
    componentWillMount() {
        this.props.handleChangeBreadcrumb(["客服管理","快速回复编辑"]);
        this.requestList();
    }
    addModal=(e)=>{
        this.setState({visible:true});
    }
    edit=(value)=>{
        this.setState({
            updateVisible:true,
            nowId: value.id,
            updateInfoContent:value.content,
        });
    }
    handleOk=(e)=>{
        const url = `${baseURL}sys/quickreply/saveQuickReply`;
        const {
            infoContent,
        } = this.state;
        const params = {
            content: infoContent,
        }
        this.setState({loading: true});
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({loading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    visible: false,
                    infoContent: '',
                });
                message.success("添加模块成功");
                setTimeout(() => {
                    this.requestList();
                }, 300);
            } else {
                this.setState({
                    loading: false,
                });
                message.warning(res.msg);
            }
        })
    }
    requestList = (queryButtonLoading) => {
        this.setState({loading: true});
        const url = `${baseURL}sys/quickreply/list`;
        const {
            startValue,
            keyWordInputValue,
            createTimeValue,
        } = this.state;
        const params = {};
        params.pageNo = this.params.page;
        params.keyword = keyWordInputValue;
        if(startValue===null||startValue===""){
        }else{
            params.updateTimeStr = createTimeValue;
        }
        if (queryButtonLoading) {
            this.setState({loading: true});
            this.params.page = 1;
        }
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({loading: state});
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.result;
                if (result === null) {
                    this.setState({
                        dataSource: [],
                        loading: false
                    });
                    if (queryButtonLoading) {
                        this.setState({loading: false});
                        message.info(res.msg);
                    }
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        loading: false,
                        dataSource: result,
                        pagination: pagination(res.data, (current) => {
                            _this.params.page = current;
                            this.requestList();
                        })
                    })
                    if (queryButtonLoading) {
                        this.setState({loading: false});
                        message.info(res.msg);
                    }
                }
            } else {
                this.setState({loading: false});
                message.info(res.msg);
            }
        });
    }
    handleQueryClick = () => {
        const { keyWordInputValue } = this.state;
        const regEn = /[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/im;
        const regCn = /[！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (regEn.test(keyWordInputValue) || regCn.test(keyWordInputValue)) {
            message.info('关键字中不能包含特殊字符');
            return;
        }
        this.requestList(true);
    }
    handleDatePickerCreateChange = (value, dateString) => {
        this.setState({createTimeValue:dateString})
        this.timeChange('startValue', value);
    }
    timeChange = (field, value) => {
        this.setState({[field]: value});
    }
    updateOk=(e)=>{
        const url = `${baseURL}sys/quickreply/updateQuickReply`;
        const {
            updateInfoContent,
            nowId,
        } = this.state;
        const params = {
            content: updateInfoContent,
            id:nowId
        }
        this.setState({loading: true});
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({loading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    updateVisible: false,
                    updateInfoContent: '',
                });
                message.success("修改模块成功");
                setTimeout(() => {
                    this.requestList();
                }, 300);
            } else {
                this.setState({
                    loading: false,
                });
                message.warning(res.msg);
            }
        })
    }
    remove=(e)=>{
        this.setState({
            deleteVisible:true,
            nowId: e.id
        });
    }
    // 确定删除模板
    deleteOk=(e)=>{
        const url = `${baseURL}sys/quickreply/deleteQuickReply`;
        const {
            nowId,
        } = this.state;
        const params = {
            id:nowId
        }
        this.setState({loading: true});
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({loading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    deleteVisible: false,
                });
                message.success("删除成功");
                setTimeout(() => {
                    this.requestList();
                }, 300);
            } else {
                this.setState({
                    loading: false,
                });
                message.warning(res.msg);
            }
        })
    }
    render() {
        const { dataSource, startValue, infoContent, keyWordInputValue, loading, updateInfoContent } = this.state;
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
                        <CreateTimeItem id='time' style={{position: 'relative' }}>
                            <span className="span_title">最后修改时间:</span>
                            <DatePicker
                                onChange={this.handleDatePickerCreateChange}
                                placeholder='选择开始日期'
                                value={startValue}
                                format={dateFormat}
                                getCalendarContainer={() => document.getElementById('time')}
                            />
                        </CreateTimeItem>
                        <CreateTimeItem className='crux'>
                            <span className="span_title">关键字:</span>
                            <Input
                                placeholder='请输入关键字'
                                style={{ width: 300 }}
                                value={keyWordInputValue}
                                onChange={(e) => {this.setState({keyWordInputValue: e.target.value})}}
                            />
                        </CreateTimeItem>
                    </CreateTime>
                    <Search>
                        <Button type='primary' loading={loading} onClick={this.handleQueryClick}>
                            查询
                        </Button>
                    </Search>
                </QueryListWarp>
                <Spin size='large' spinning={loading}>
                    <Button type='primary' loading={loading} onClick={this.addModal} style={{marginBottom:10}}>
                        添加模块
                    </Button>
                    <Table
                        bordered
                        pagination={this.state.pagination}
                        dataSource={dataSource}
                        columns={columns}
                        rowClassName={this.setClassName}
                    />
                </Spin>
                <Modal
                  title="添加快速回复模板"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  bodyStyle={{padding:'10px 24px'}}
                  confirmLoading={loading}
                  onCancel={()=>{this.setState({visible:false})}}
                >
                    <div className="editWrap">
                        <p style={{marginBottom:4}}>请输入信息内容：</p>
                        <TextArea
                            rows={4}
                            placeholder="..."
                            value={infoContent}
                            onChange={(e) => {this.setState({infoContent: e.target.value})}}
                        />
                    </div>
                </Modal>
                <Modal
                  title="修改快速回复模板"
                  visible={this.state.updateVisible}
                  onOk={this.updateOk}
                  confirmLoading={loading}
                  bodyStyle={{padding:'10px 24px'}}
                  onCancel={()=>{this.setState({updateVisible:false})}}
                >
                    <div className="editWrap">
                        <p style={{marginBottom:4}}>请输入信息内容：</p>
                        <TextArea
                            rows={4}
                            placeholder="..."
                            value={updateInfoContent}
                            onChange={(e) => {this.setState({updateInfoContent: e.target.value})}}
                        />
                    </div>
                </Modal>
                <Modal
                  title="删除"
                  visible={this.state.deleteVisible}
                  onOk={this.deleteOk}
                  bodyStyle={{padding:'10px 24px'}}
                  confirmLoading={loading}
                  onCancel={()=>{this.setState({deleteVisible:false})}}
                >
                    <div className="editWrap">
                        确定删除？
                    </div>
                </Modal>
            </Warp>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleChangeBreadcrumb(list) {
            dispatch(actionCreators.changeBreadcrumb(list));
        }
    }
}

export default connect(null, mapDispatchToProps)(Reply);
