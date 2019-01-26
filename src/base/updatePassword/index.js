import React, { Component } from 'react';
import { Input, Icon, Button, message } from 'antd';
import { connect } from 'react-redux';
import fatch from './../../common/js/fatch';
import { Redirect } from 'react-router-dom';
import http from './../../common/js/http';
import baseURL from './../../common/js/baseURL';
import Storage from './../../common/js/storage';
import { Container, UpdateWarp, Title, Item, ItemText, ItemInput, Warning, Sublime } from './style';
class UpdatePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 校验旧密码
            onceTips: false,
            oncePassword: '',
            oncePasswordText: '密码不能为空',
            onceIconType: 'close-circle',
            onceColor: 'red',
            onceState: false,
            token: '',
            // 输入新密码
            newPassword: '',
            // 确认密码
            correctPass: '',
            buttonLoading: false,
            id: this.props.location.state && this.props.location.state.id,
            user: this.props.location.state && this.props.location.state.username,
            state: false
        }
    }
    handleBlur = (e) => {
        if (!e.target.value.length) {
            this.setState({
                onceTips: true,
                onceColor: 'red',
                onceIconType: 'close-circle',
                oncePasswordText: '密码不能为空',
            });
            return;
        }
        const url = `${baseURL}account/checkPassword`;
        const params = {
            managerId: this.state.id,
            oldPassword: this.state.oncePassword
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    onceState: true,
                    onceTips: true,
                    onceIconType: 'check-circle',
                    onceColor: 'green',
                    oncePasswordText: 'OK',
                    token: res.data
                });
            } else {
                this.setState({
                    onceTips: true,
                    onceState: false,
                    onceColor: 'red',
                    onceIconType: 'close-circle',
                    oncePasswordText: res.msg
                });
            }
        });
    }
    //  确认修改
    handleUpdateClick = () => {
        const { newPassword, correctPass, onceState, token } = this.state;
        var reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,16}$/;
        if (!onceState) {
            message.info('原始密码输入错误');   
            return;
        }
        if (!reg.test(newPassword)) {
            message.info('密码输入错误！！！');
            return;
        }
        if (newPassword !== correctPass) {
            message.info('两次密码输入不一致');
            return;
        }
        this.setState({buttonLoading: true});
        const url = `${baseURL}account/changePassword`;
        const params = {
            id: this.state.id,
            password: newPassword,
            loginName: this.state.user,
            token
        }
        http(url, 'post', params).then((res) => {
            if (res.data.code === '0') {
                Storage.clear();
                this.props.history.push('/login');
            } else {
                this.setState({buttonLoading: false});
                message.info(res.data.msg);
            }
        })
    }
    authLogin() {
        if (this.state.id === undefined) {
            return <Redirect to='/login' />;
        } else {
            const { 
                oncePassword,
                onceTips, 
                oncePasswordText, 
                onceIconType,
                onceColor,
                newPassword,
                correctPass,
                buttonLoading,
            } = this.state;
            return (
                <Container>
                    <UpdateWarp>
                        <Title>修改密码</Title>
                        <Item>
                            <ItemText>原始密码:</ItemText>
                            <ItemInput>
                                <Input
                                    style={{height: 39}}
                                    placeholder='请输入原始密码'
                                    type='password'
                                    value={oncePassword}
                                    onBlur={(e) => {this.handleBlur(e)}}
                                    onChange={(e) => {this.setState({oncePassword: e.target.value})}}
                                />
                            </ItemInput>
                            <Warning>
                                <div style={{display: onceTips ? 'block' : 'none'}}>
                                    <Icon type={onceIconType} style={{color: onceColor, marginRight: '5px'}} />
                                    {oncePasswordText}
                                </div> 
                            </Warning>
                        </Item>
                        <Item>
                            <ItemText>新密码:</ItemText>
                            <ItemInput>
                                <Input
                                    style={{height: 39}}
                                    type='password'
                                    placeholder='6-16个字符，请使用字母加数字或者符号，不能单独使用字母 数字或者字符'
                                    value={newPassword}
                                    onChange={(e) => {this.setState({newPassword: e.target.value})}}
                                />
                            </ItemInput>
                        </Item>
                        <Item>
                            <ItemText>确认密码:</ItemText>
                            <ItemInput>
                                <Input 
                                    style={{height: 39}}
                                    placeholder='6-16个字符，请使用字母加数字或者符号，不能单独使用字母 数字或者字符'
                                    type='password'
                                    value={correctPass}
                                    onChange={(e) => this.setState({correctPass: e.target.value})}
                                />
                            </ItemInput>
                        </Item>
                        <div><Button type='primary' loading={buttonLoading} onClick={this.handleUpdateClick}>确认修改</Button></div>
                    </UpdateWarp>
                </Container>
            );
        }
    }
    render() {
        return (<div>{this.authLogin()}</div>);
    }
}

export default connect(null, null)(UpdatePassword);