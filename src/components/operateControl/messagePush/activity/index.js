import React, { Component } from 'react';
import { List, message, Avatar, Spin, Button, Icon, Modal } from 'antd';
import { Warp } from './style';
import { connect } from 'react-redux';
import { HomeActionCreators } from './../../../../base/home/store';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import fatch from './../../../../common/js/fatch';
import baseURL from './../../../../common/js/baseURL';
import history from './../../../../history';
import formatDateTime from './../../../../common/js/formatDateTime';

class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            userId: [],
            retryVisible: false
        }
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['运营管理', '活动短信推送', '查看短信内容']));
        this.requestList();
    }
    handleRetryClick = () => {
        this.setState({retryVisible: true});
    }
    requestList = () => {
        const url = `${baseURL}activity/marketing/sms/lookUp`;
        const state = this.props.location.state;
        if (state === undefined || state === null) {
            message.info('缺少参数');
            return;
        }
        this.showAndHideLoading(true);
        fatch(url, 'post', {id: state.id}, (err, state) => {
            this.showAndHideLoading(state);
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const resulet = res.data.activityMarketing;
                const user = resulet.userActivityMarketingList;
                let list = [];
                const userList = [];
                for (let key in resulet) {
                    if (key === 'name' || 
                        key === 'description' || 
                        key === 'smsContent' || 
                        key === 'smsPlatform' || 
                        key === 'smsStatus' ||
                        key === 'pushStatus' ||
                        key === 'pushContent') 
                    {
                        list.push({title: key, content: resulet[key]});
                        list.map((item) => {
                            item.title === 'name' ? (item.title = '活动名称') : null;
                            item.title === 'description' ? (item.title = '活动内容') : null;
                            item.title === 'smsContent' ? (item.title = '短信内容') : null;
                            item.title === 'smsStatus' ? (item.title = '短信状态') : null;
                            item.title === 'smsPlatform' ? (item.title = '短信平台') : null;
                            item.title === 'pushStatus' ? (item.title = '推送状态') : null;
                            item.title === 'pushContent' ? (item.title = '推送内容') : null;
                        });
                        this.setState({data: list});
                    }
                }
                for (let i = 0; i < list.length; i++) {
                    if (list[i].title === '短信状态') {
                        if (list[i].content === '2') {
                            list[i].content = `${formatDateTime(resulet.smsTime)}发送短信，已发送；`;
                            if (res.data.countSmsFailed > 0) {
                                list[i].content = <div>
                                    {formatDateTime(resulet.smsTime)}
                                    发送短信，已发送；但存在送达失败，失败用户数量
                                    {res.data.countSmsFailed}
                                    <Button type='primary' size='small' onClick={this.handleRetryClick}>给失败用户再次发送</Button>
                                </div>;
                            }
                        } else {
                            list[i].content = '未发送内容；';
                        }
                    }
                    if (list[i].title === '推送状态') {
                        if (list[i].content === '1') {
                            list[i].content = `${formatDateTime(resulet.pushTime)}发送推送，已发送；`;
                        } else {
                            list[i].content = '未推送内容；';
                        }
                    }
                }
                // 参与人数
                if (user.length) user.map((item) => (userList.push(item.userId)));
                this.setState({userId: userList});
                this.showAndHideLoading(false);
            } else {
                this.showAndHideLoading(false);
                message.info(res.msg);
            }
        })
    }
    handleRetryOk = () => {
        const url = `${baseURL}activity/marketing/sms/resendBatch`;
        this.setState({retryVisible: false});
        this.showAndHideLoading(true);
        fatch(url, 'post', {activityId: this.props.location.state.id}, (err, state) => {
            message.info(err);
            this.showAndHideLoading(state);
        }).then((res) =>　{
            if (res.code === '0') {
                this.showAndHideLoading(false);
                message.info(res.msg);
                this.requestList();
            } else {
                message.info(res.msg);
                this.showAndHideLoading(false);
            }
        });
    }
    handleRetryCancel = () => {
        this.setState({retryVisible: false});
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { data, userId, retryVisible } = this.state;
        return (
            <Warp>
                <Button 
                    type='primary' 
                    style={{margin: '10px 0'}}
                    onClick={() => {history.push({pathname: '/operateControl/messagePush', query: this.props.location.state})}}
                >
                    <Icon type='rollback' />
                    返回
                </Button>
                <List
                    style={{flex: 1}}
                    dataSource={data}
                    bordered={true}
                    renderItem={item => (
                        <List.Item key={item.content}>
                            <div style={{marginRight: 15}}>{item.title}:</div>
                            <div>{item.content}</div>
                        </List.Item>
                    )}
                />
                <h1 style={{margin: '15px 0'}}>参与人数</h1>
                <List
                    header={<div style={{background: 'skyblue', paddingLeft: '15px'}}>userId</div>}
                    bordered
                    dataSource={userId}
                    renderItem={item => (<List.Item>{item}</List.Item>)}
                />
                <Modal
                    okText='提交'
                    cancelText='取消'
                    closable={false}
                    width={400}
                    visible={retryVisible}
                    onOk={this.handleRetryOk}
                    onCancel={this.handleRetryCancel}
                >
                    请确认失败原因，是否继续发生。
                </Modal>
            </Warp>
        );
    }
}

export default connect(null, null)(Activity);