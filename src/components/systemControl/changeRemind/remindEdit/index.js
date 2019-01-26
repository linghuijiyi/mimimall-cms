import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Wrap, ImgWarp, Upload, StopImg } from './style';
import { Select, Button, Input, Modal, Radio, message, Icon } from 'antd';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import fatch from './../../../../common/js/fatch';
import pagination from './../../../../common/js/pagination';
import baseURL from './../../../../common/js/baseURL';
import history from './../../../../history';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
class RemindEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channelName:'1',
            remindType:'1',
            emails:"",
            phoneNum:"",
            remark:"",
            display_show:'flex',
            display_none:'none',
            keyid:"",
            keyname:"",
        };
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['系统管理', '渠道信息变更提醒管理']));
        let data = this.props.location.state;
        this.setState({
            keyid:data.record_id,
            keyname:data.record,
        })
        this.requestList(data.record_id);
    }
    isPoneAvailable = (phone) => {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        return reg.test(phone);
    }
    cancels=(e)=>{
       history.push("/systemControl/changeRemind");
    }
    save=(e)=>{
        const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const {
            channelName,
            remindType,
            emails,
            phoneNum,
            remark,
            keyid,
            keyname,
        } = this.state;
        if(emails==""){
            message.warning("邮箱为必填项");
            return;
        }
        if (emails !== '') {
            if (!regEmail.test(emails)) {
                message.info('邮箱格式错误');
                return;
            }
        }
        if (phoneNum !== '') {
            if (!this.isPoneAvailable(phoneNum)) {
                message.info('手机号格式错误');
                return;
            }
        }
        var url;
        var params = {};
        if(keyname=='new'){
            url = `${baseURL}sys/remind/save`;
            params = {
                channelCode:channelName,
                email:emails,
                phone:phoneNum,
                remark:remark,
                remindType:remindType,
            };
        }else if(keyname=='update'){
            url = `${baseURL}sys/remind/update`;
            params = {
                channelCode:channelName,
                email:emails,
                id:keyid,
                phone:phoneNum,
                remark:remark,
                remindType:remindType,
            };
        }
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                message.success(res.msg);
            } else {
                message.error(res.msg);
            }
        });
    }
    chooseChannel=(e)=>{
        this.setState({
            channelName:e,
        })
    }
    chooseRemind=(e)=>{
        this.setState({
            remindType:e,
        })
        if(e==0){
            this.setState({
                display_none:"none",
                display_show:'flex',
            })
        }else if(e==1){
            this.setState({
                display_none:"flex",
                display_show:'none',
            })
        }
    }
    remarkable=(e)=>{
        this.setState({
            remark:e.target.value,
        })
    }
    handleEmails=(e)=>{
        this.setState({
            emails:e.target.value,
        })
    }
    handlePhone=(e)=>{
        this.setState({
            phoneNum:e.target.value,
        })
    }
    requestList = (id) => {
        const {
            channelName,
            remindType,
            emails,
            phoneNum,
            remark,
        } = this.state;
        const url = `${baseURL}sys/remind/detail`;
        const params = {
            id:id,
        };
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data;
                if (result === null) {
                    this.setState({});
                }else{
                    if(result.remindType==1){
                        this.setState({
                            remindType:'1',
                        })
                        this.chooseRemind('1');
                        this.chooseChannel('1');
                    }else if(result.remindType==0){
                        this.setState({
                            remindType:'0',
                        })
                        this.chooseRemind('0');
                        this.chooseChannel('0');
                    }
                    if(result.channelCode==1){
                        this.setState({
                            channelName:'1',
                        })
                        this.chooseChannel('1');
                    }else if(result.channelCode==0){
                        this.setState({
                            channelName:'0',
                        })
                        this.chooseChannel('0');
                    }
                    this.setState({
                        emails:result.email,
                        phoneNum:result.phone,
                        remark:result.remark,
                    })
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    render() {
        const {
            channelName,
            remindType,
            emails,
            phoneNum,
            remark,
            display_show,
            display_none,
        } = this.state;
        return (
            <Wrap>
                <div className="row" id='qdmc' style={{position: 'relative' }}>
                    <span className="rowTitle"><label className="redCode">*</label>渠道名称：</span>
                    <Select
                        value={channelName}
                        style={{ width: 500 }}
                        onChange={this.chooseChannel}
                        getPopupContainer={() => document.getElementById('qdmc')}
                    >
                        <Option value="1">京东</Option>
                    </Select>
                </div>
                <div className="row" id='txlx' style={{position: 'relative' }}>
                    <span className="rowTitle"><label className="redCode">*</label>提醒类型：</span>
                    <Select
                        value={remindType}
                        style={{ width: 500 }}
                        onChange={this.chooseRemind}
                        getPopupContainer={() => document.getElementById('txlx')}
                    >
                        <Option value="0">预存费用不足提醒（1.每天15点提醒余额 2.余额小于等于500时提醒）</Option>
                        <Option value="1">进货价调整提醒</Option>
                    </Select>
                </div>
                <div className="row" style={{display:display_show}}>
                    <span className="rowTitle">提醒内容：</span>
                    <p>截止到<label className="redCode">【20**年*月*日 **:**】</label>，京东余额为<label className="redCode">【*****】元</label>，请酌情判断是否充值</p>
                </div>
                <div className="row" style={{display:display_none}}>
                    <span className="rowTitle">提醒内容：</span>
                    <p>截止到<label className="redCode">【20**年*月*日 **:**】</label>，存在<label className="redCode">【*****】</label>个sku的进货价调整请到商品管理内进行处理</p>
                </div>
                <div className="row">
                    <span className="rowTitle"><label className="redCode">*</label>邮箱：</span>
                    <TextArea rows={3} value={emails} onChange={this.handleEmails} placeholder="必填项，输入邮箱"/>
                </div>
                <div className="row">
                    <span className="rowTitle">电话号码：</span>
                    <TextArea rows={3} value={phoneNum} onChange={this.handlePhone} placeholder="选填项，输入电话号码"/>
                </div>
                <div className="row">
                    <span className="rowTitle">备注：</span>
                    <TextArea rows={3} value={remark} onChange={this.remarkable} placeholder="选填项"/>
                </div>
                <div className="bigRow" style={{marginTop:32}}>
                    <Button type="primary" style={{marginLeft:180,marginRight:24,width:120}} onClick={this.cancels}>取消</Button>
                    <Button type="primary" style={{width:120}} onClick={this.save}>保存</Button>
                </div>
            </Wrap>
        );
    }
}

export default connect(null, null)(RemindEdit);
