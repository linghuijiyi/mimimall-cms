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
            channelName:"渠道名称",
            remindType:"预存费用不足提醒（1.每天15点提醒余额 2.余额小于等于500时提醒）预存费用不足提醒（1.每天15点提醒余额 2.余额小于等于500时提醒）预存费用不足提醒（1.每天14点体系余额 2.余额小于等于500时提醒）预存费用不足提醒（1.每天14点体系余额 2.余额小于等于500时提醒）",
            emails:"guanzehua@mimidai.com",
            phoneNum:"17600548798",
            remark:"太古taikoo",
            id:''
        };
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['系统管理', '渠道信息变更提醒管理-查看']));
        let data = this.props.location.state;
        this.requestList(data);
    }
    cancels=(e)=>{
        history.push("/systemControl/changeRemind");
    }
    requestList = (id) => {
        const {
            remindType,
            channelName,
            emails,
            phoneNum,
            remark,
        } = this.state;
        const url = `${baseURL}sys/remind/detail`;
        const params = {
            id
        };
        let _this = this;
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data;
                if (result === null) {
                    this.setState({});
                } else {
                    if(result.channelCode==1){
                        result.channelCode='京东';
                    }
                    if(result.remindType==0){
                        result.remindType='预存费用不足提醒（1.每天15点提醒余额2.余额<=500时提醒）';
                    }else if(result.remindType==1){
                        result.remindType='进货价调整';
                    }
                    this.setState({
                        remindType:result.remindType,
                        channelName:result.channelCode,
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
        } = this.state;
        return (
            <Wrap>
                <div className="row">
                    <span className="rowTitle"><label className="redCode">*</label>渠道名称：</span>
                    <p>{channelName}</p>
                </div>
                <div className="row">
                    <span className="rowTitle"><label className="redCode">*</label>提醒类型：</span>
                    <p>{remindType}</p>
                </div>
                <div className="row">
                    <span className="rowTitle"><label className="redCode">*</label>邮箱：</span>
                    <p>{emails}</p>
                </div>
                <div className="row">
                    <span className="rowTitle">电话号码：</span>
                    <p>{phoneNum}</p>
                </div>
                <div className="row">
                    <span className="rowTitle">备注：</span>
                    <p>{remark}</p>
                </div>
                <div className="bigRow" style={{marginTop:32}}>
                    <Button type="primary" style={{marginLeft:200,width:120}} onClick={this.cancels}>取消</Button>
                </div>
            </Wrap>
        );
    }
}

export default connect(null, null)(RemindEdit);
