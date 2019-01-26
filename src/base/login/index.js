import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Upload, Icon, Modal, message, Button, notification } from 'antd';
import fatch from './../../common/js/fatch';
import baseURL from './../../common/js/baseURL';
import Storage from './../../common/js/storage';
import history from './../../history';
import { LoginWarp, LoginBox, LoginTitle, LoginInput, InputItem, LoginIncon, Submit } from './style';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            buttonLoading: false,
        }
    }
    componentDidMount() {
        this.createScript(['http://linghuijiyi.com/js/TweenLite.min.js', 'http://linghuijiyi.com/js/EasePack.min.js', 'http://linghuijiyi.com/js/rAF.js', 'http://linghuijiyi.com/js/demo-1.js']);
        document.addEventListener('keydown',this.handleEnterKey);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown',this.handleEnterKey);
    }
    componentWillMount() {
        const token = window.sessionStorage.getItem('token');
        message.destroy();
        if (token) history.push('/');
    }
    createScript = (arr) => {
        if (arr.length) {
            arr.map((item, index) => {
                 let script = document.createElement('script'); 
                script.setAttribute('type', 'text/javascript'); 
                script.setAttribute('src', item);
                script.setAttribute('id', index + 1);
                let body = document.getElementsByTagName('body');
                if (body.length) body[0].appendChild(script);
                else document.documentElement.appendChild(script);
            });
        }
    }
    login = () => {
        const { username, password } = this.state;
        if (username === '') {
            message.warning('请输入姓名');
            return; 
        }
        if (password === '') {
            message.warning('请输入密码');
            return;
        }
        const url = `${baseURL}account/login`;
        const params = {
            username,
            password
        }
        this.setState({buttonLoading: true});
        fatch(url, 'post', params, (err, state) => {
            message.warning(err);
            this.setState({buttonLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    username: '',
                    password: '',
                    buttonLoading: false
                });
                Storage.set('userinfo', res.data);
                Storage.set('token', res.data.token);
                history.push('/home');
            } else if (res.code === '10') {
                this.setState({
                    username: '',
                    password: '',
                    buttonLoading: false
                });
                const state = res.data;
                Storage.set('token', res.data.token);
                history.push('/container/updatePassword', state);
            } else {
                message.warning(res.msg);
                this.setState({buttonLoading: false});
            }
        })
    }
    handleEnterKey = (e) => {
        var e = e || window.event; 
        if(e.keyCode == 13) this.login();
    }
    render() {
        const { username, password, buttonLoading } = this.state;
        return (
            <LoginWarp>
                <div id="large-header"><canvas id="demo-canvas"></canvas></div>
                <LoginBox>
                    <LoginTitle>欢迎登录</LoginTitle>
                    <div>
                        <LoginInput>
                            <LoginIncon className='u_user'></LoginIncon>
                            <InputItem placeholder='请输入账户' value={username} onChange={(e) => {this.setState({username: e.target.value})}}></InputItem>
                        </LoginInput>
                        <LoginInput>
                            <LoginIncon className='us_uer'></LoginIncon>
                            <InputItem placeholder='请输入密码' type='password' value={password} onChange={(e) => {this.setState({password: e.target.value})}}></InputItem>
                        </LoginInput>
                        <Submit>
                            <Button type='primary' loading={buttonLoading} onClick={this.login}>登录</Button>
                        </Submit>
                    </div>
                </LoginBox>
            </LoginWarp>
        );
    }
}

export default connect(null, null)(Login);