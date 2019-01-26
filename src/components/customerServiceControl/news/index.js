import React, { Component } from 'react';
import {
    Wrap
} from './style';
import { Select, Button, Input, Table, Modal, DatePicker, Icon, Spin, Radio, message } from 'antd';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import fatch from './../../../common/js/fatch';
import pagination from './../../../common/js/pagination';
import baseURL from './../../../common/js/baseURL';
import formatDateTime from './../../../common/js/formatDateTime';
import moment from 'moment';
import history from './../../../history';
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const { TextArea } = Input;
class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue:null,
            startValue_t:null,
            userList:[],
            quickReplyList:[],
            chatList:[],
            borrowName:"",
            nowTime:null,
            selectType:"",
            selectState:"",
            keyCode:"",
            userInfo:{},
            init_info:"none",
            chatCode:''
        }
        this.params = { page: 1 };
    }
    lookMore=(value)=>{

        const url = `${baseURL}sys/customerService/moreRecords`;
        const {
            chatList
        } = this.state;
        if(chatList.length<5){
            message.info("没有更多聊天记录");
            return;
        }
        const params = {
            customerServiceId:chatList[0].customerServiceId
        };
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({loading: state});
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data;
                if (result === null) {
                    this.setState({
                        userList: [],
                    });
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        chatList: result,
                    })
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    componentWillMount() {
        this.props.handleChangeBreadcrumb(this.props.location.state);
        this.format();
    }
    format=(value)=>{
        const url = `${baseURL}sys/customerService/initView`;
        const {
            userList,
            quickReplyList,
            startValue,
            nowTime,
        } = this.state;
        const params = {};
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({loading: state});
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.page.result;
                const replyList = res.data.quickReplies;
                if (result === null) {
                    this.setState({
                        userList: [],
                        quickReplyList:[],
                        startValue_t:'',
                    });
                } else {
                    result.map((item, index) => (item.key = index));
                    const today = moment(res.data.time);
                    this.setState({
                        userList: result,
                        quickReplyList:replyList,
                        startValue:today,
                        nowTime:res.data.time,
                    })
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    copyCode=(value)=>{
        this.setState({chatCode:value});
        document.getElementById("chatCode").value = value;
    }
    handleDatePickerCreateChange = (value, dateString) => {
        this.setState({startValue: value});
        this.setState({nowTime: dateString});
    }
    selectType=(value)=>{
        this.setState({selectType:value});
    }
    selectState=(value)=>{
        this.setState({selectState:value});
    }
    viewDetail=(e)=>{
        const userId = this.state.userId;
        history.push("/customerServiceControl/userDetail", userId);
    }
    sendMessage=(e)=>{
        const url = `${baseURL}sys/customerService/send`;
        const {
            borrowName,
            userInfo,
            chatCode,
        } = this.state;
        if(userInfo.userId==""||userInfo.userId==undefined){
            message.error("请选择对话用户");
            return;
        }
        if(chatCode==""){
            message.error("发送内容不可以为空");
            return;
        }
        const params = {
            userId:userInfo.userId,
            content:chatCode
        };
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({chatCode:""});
                document.getElementById("chatCode").value = "";
                this.chatWith(userInfo.userId);
            } else {
                message.info(res.msg);
            }
        });
    }
    chatWith=(value)=>{
        this.setState({
            userId: value,
            init_info:'block',
        })
        const url = `${baseURL}sys/customerService/viewRecord`;
        const {
            borrowName,
            userInfo,
        } = this.state;
        const params = {
            userId:value
        };
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.customerServiceRecords;
                if (result === null) {
                    this.setState({
                        userList: [],
                    });
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        chatList: result,
                        borrowName:res.data.userInfo.name,
                        userInfo:res.data.userInfo
                    })
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    serach=(value)=>{
        const url = `${baseURL}sys/customerService/records`;
        const {
            startValue_t,
            nowTime,
            keyCode,
            selectType,
            selectState,
        } = this.state;
        const params = {
            pageNo:this.params.page,
            keyword:keyCode,
            selectType:selectType,
            state:selectState,
            time:nowTime,
        };
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({loading: state});
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.result;
                if (result === null) {
                    this.setState({
                        userList: [],
                    });
                } else {
                    result.map((item, index) => (item.key = index));
                    this.setState({
                        userList: result,
                    })
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    render() {
        const {
            startValue,
            endValue,
            borrowName,
            userList,
            quickReplyList,
            chatList,
            manager,
            userInfo,
            chatCode,
        } = this.state;
        return (
            <Wrap>
                <div className="content">
                    <div style={{color: 'red', textAlign: 'center', fontSize: '20px'}}>注意：手动刷新更新数据</div>
                    <div className="chatBox">
                        <div className="chatLeft">
                            <div className="chat03">
                                <div className="chat03_title">
                                    <div className="chat03_listtitle">
                                        <label>
                                            用户列表
                                        </label>
                                    </div>
                                    <div className="marginB10" id='time' style={{position: 'relative' }}>
                                        <DatePicker
                                            style={{ width: 200}}
                                            onChange={this.handleDatePickerCreateChange}
                                            placeholder='选择开始日期'
                                            value={startValue}
                                            format={dateFormat}
                                            getCalendarContainer={() => document.getElementById('time')}
                                        />
                                    </div>
                                    <div className="marginB10" id='tiaojian' style={{position: 'relative' }}>
                                        <Select
                                            className="select_option"
                                            defaultValue="userPhone"
                                            onChange={this.selectType}
                                            getPopupContainer={() => document.getElementById('tiaojian')}
                                        >
                                            <Option value="userPhone">手机号</Option>
                                            <Option value="userName">姓名</Option>
                                            <Option value="userId">用户ID</Option>
                                        </Select>
                                    </div>
                                    <div className="marginB10">
                                        <Input type="text"
                                            placeholder="手机/姓名/用户ID"
                                            id="keyword"
                                            onChange={(e)=>{this.setState({ keyCode: e.target.value })}}
                                        />
                                    </div>
                                    <div className="marginB10" id='state' style={{position: 'relative' }}>
                                        <Select
                                            className="select_option"
                                            defaultValue=""
                                            onChange={this.selectState}
                                            getPopupContainer={() => document.getElementById('state')}
                                        >
                                            <Option value="">状态：全部</Option>
                                            <Option value="0">状态：【未回复】</Option>
                                            <Option value="2">状态：【已回复】</Option>
                                            <Option value="1">状态：【再提问】</Option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Input type="button" value="查询" onClick={this.serach}/>
                                    </div>
                                </div>
                                <div className="chat03_content" id="list">
                                    <div className="endless_scroll_inner_wrap">
                                        <ul>
                                            {
                                                this.state.userList.map(function(record,key) {
                                                    return (
                                                        <li key={key}>
                                                            <p onClick={this.chatWith.bind(this,record.userId)} style={{display: record.state === '0' ? 'block' : 'none'}}>
                                                                <span className="chat_name">{record.userInfoName}</span>
                                                                <span>
                                                                    &nbsp;(&nbsp;未回复&nbsp;
                                                                    <span style={{color:"red"}}>{record.userNoRead}</span>
                                                                    &nbsp;)&nbsp;
                                                                </span>
                                                            </p>
                                                            <p onClick={this.chatWith.bind(this,record.userId)} style={{display: record.state === '1' ? 'block' : 'none'}}>
                                                                <span className="chat_name">{record.userInfoName}</span>
                                                                <span>
                                                                    &nbsp;(&nbsp;再提问&nbsp;
                                                                    <span style={{color:"red"}}>{record.managerNoRead}</span>
                                                                    &nbsp;)&nbsp;
                                                                </span>
                                                            </p>
                                                            <p onClick={this.chatWith.bind(this,record.userId)} style={{display: record.state === '2' ? 'block' : 'none'}}>
                                                                <span className="chat_name">{record.userInfoName}</span>
                                                                <span>
                                                                    &nbsp;(&nbsp;已回复&nbsp;&nbsp;)&nbsp;
                                                                </span>
                                                            </p>
                                                        </li>
                                                    )
                                                },this)
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chatCenter">
                            <div className="chatList">
                                <div className="chatList_title">{this.state.borrowName}</div>
                                <div className="chatList_content">
                                    <p className="lookMore" onClick={this.lookMore}>查看更多消息...</p>
                                    {
                                        this.state.chatList.map(function(record,key) {
                                            return (
                                                <div key={key}>
                                                    <li className="customer_left" style={{display: record.type === '0' ? 'block' : 'none'}}>
                                                        <p className="customer_name">{borrowName} {record.createTimeStr}</p>
                                                        <p className="customer_word">{record.content}</p>
                                                    </li>

                                                    <li className="customer_right" style={{display: record.type === '1' ? 'block' : 'none'}}>
                                                        <p className="customer_name">{record.managerName} {record.createTimeStr}</p>
                                                        <p className="customer_word">{record.content}</p>
                                                    </li>
                                                </div>
                                            )
                                        },this)
                                    }
                                </div>
                            </div>
                            <div className="chatSend">
                                <div className="chatSend_title"></div>
                                <div className="chatSend_content">
                                    <TextArea id="chatCode" style={{resize:'none' }} onChange={(e)=>{this.setState({ chatCode: e.target.value })}}/>
                                </div>
                                <div className='chatSend_bar'>
                                    <Button onClick={this.sendMessage}>发送</Button>
                                </div>
                            </div>
                        </div>
                        <div className="chatRight">
                            <div className="usertitle">用户信息</div>
                            <div className="userInfo">
                                <div className="avtar" style={{display:this.state.init_info}}>
                                    <img src={require("./../../../static/avtar.jpg")}/>
                                </div>
                                <ul className="detail" style={{display:this.state.init_info}}>
                                    <li>
                                        <label>姓名：</label><label>{borrowName}</label>
                                    </li>
                                    <li>
                                        <label>手机：</label><label>{userInfo.phone}</label>
                                    </li>
                                    <li>
                                        <Button onClick={this.viewDetail}>查看详情</Button>
                                    </li>
                                </ul>
                            </div>
                            <div className="quickReply">
                                <ul>
                                    {
                                        this.state.quickReplyList.map(function(value,key) {
                                            return (
                                                <li key={key}>
                                                    <p onClick={this.copyCode.bind(this,value.content)}>{key+1}.&nbsp;{value.content}</p>
                                                </li>
                                            )
                                        },this)
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Wrap>
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

export default connect(null, mapDispatchToProps)(News);
