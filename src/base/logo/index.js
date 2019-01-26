import React, { Component } from 'react';
import { Icon } from 'antd';
import { LogoWrapp, LogoImgWarp, LogoImg, LogoText, Time } from './style';

class Logo extends Component {
    toggle = () => {
        console.log(999)
    }
    render() {
        return (
            <LogoWrapp>
                <LogoImgWarp>
                    <LogoImg onClick={this.toggle} src={require('./../../static/logo.png')}></LogoImg>
                </LogoImgWarp>
                <LogoText>
                    万鲸游后台
                </LogoText>
            </LogoWrapp>
        )
    }
}

export default Logo;