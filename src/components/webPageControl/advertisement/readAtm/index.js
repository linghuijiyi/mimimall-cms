import React, { Component } from 'react';
import { Warp, Container, Left, Right, Item, ImgWarp } from './style';
import { connect } from 'react-redux';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import history from './../../../../history';
import formatDateTime from './../../../../common/js/formatDateTime';
import { Input, Button, Icon, DatePicker, message } from 'antd';
import fatch from './../../../../common/js/fatch';
import baseURL from './../../../../common/js/baseURL';
import moment from 'moment';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD HH:mm:ss';

class ReadAtm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createTime: '',
            company: '',
            name: '',
            state: '发布',
            userSessions: '',
            url: '',
            startTime: '',
            endTime: '',
            advertType: '',
            advertPositionName: '',
            imgUrl: ''
        }
    }
    componentDidMount() {
        this.props.handleChangeBreadcrumb(['前端页面管理', '广告管理', '查看广告']);
        this.getPropagandaInfo();
    }
    getPropagandaInfo = () => {
        let state = this.props.location.state;
        let data = '';
        if (state !== undefined) {
            data = state.record;
        } else {
            return;
        }
        let stateText = '';
        let advertTypeText = '';
        if (data.android === '1' && data.ios === '1') advertTypeText = 'Android/Ios';
        else if (data.android === '1' && data.ios !== '1') advertTypeText = 'Android';
        else if (data.android !== '1' && data.ios === '1') advertTypeText = 'IOS';
        if (data.state === '1') stateText = '发布';
        else stateText = '禁止';
        this.setState({
            createTime: formatDateTime(data.createTime),
            company: data.company,
            name: data.name,
            state: stateText,
            userSessions: data.userSessions,
            url: data.url,
            startTime: formatDateTime(data.startTime),
            endTime: formatDateTime(data.endTime),
            advertType: advertTypeText,
        });
        this.getPropagandaList(data.advertPositionId);
        this.getImgUrl(data.adPicUrl);
    }
    getPropagandaList = (id) => {
        const url = `${baseURL}webPage/advert/findPosition`;
        fatch(url, 'post', null, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                if (data.length) {
                    data.map((item) => {
                        if (item.id === id) this.setState({advertPositionName: item.name});
                    });
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    getImgUrl = (imgName) => {
        const url = `${baseURL}account/getImgUrl`;
        fatch(url, 'post', {imgName}, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') this.setState({imgUrl: res.data});
            else message.info(res.msg);
        });
    }
    handleBackClick = () => {
        history.push({pathname: '/webPageControl/advertisement', query: this.props.location.state});
    }
    render() {
        const { createTime, company, name, state, userSessions, url, startTime, endTime, advertType, advertPositionName, imgUrl } = this.state;
        if (this.props.location.state === undefined) {
            return <div>
                <Button type='primary' style={{margin: '10px 20px'}} onClick={() => {history.push({pathname: '/webPageControl/advertisement'})}}>
                    <Icon type='rollback' />
                    返回
                </Button>
            </div>;
        }
        return (
            <Warp>
                <Button type='primary' style={{margin: '10px 20px'}} onClick={this.handleBackClick}>
                    <Icon type='rollback' />
                    返回
                </Button>
                <Container>
                    <Left>
                        <Item>
                            <span>创建时间:</span>
                        </Item>
                        <Item>
                            <span>广告名称:</span>
                        </Item>
                        <Item>
                            <span>广告公司:</span>
                        </Item>
                        <Item>
                            <span>选择广告位:</span>
                        </Item>
                        <Item>
                            <span>发布平台:</span>
                        </Item>
                        <Item>
                            <span>使用状态:</span>
                        </Item>
                        <Item>
                            <span>广告时间:</span>
                        </Item>
                        <Item>
                            <span>访问量:</span>
                        </Item>
                        <Item>
                            <span>URL:</span>
                        </Item>
                        <ImgWarp>
                            <span>广告图片:</span>
                        </ImgWarp>
                    </Left>
                    <Right>
                        <Item>
                            <Input disabled value={createTime} />
                        </Item>
                        <Item>
                            <Input disabled value={name} />
                        </Item>
                        <Item>
                            <Input disabled value={company} />
                        </Item>
                        <Item>
                            <Input disabled value={advertPositionName} />
                        </Item>
                        <Item>
                            <Input disabled value={advertType} />
                        </Item>
                        <Item>
                            <Input disabled value={state} />
                        </Item>
                        <Item>
                            <DatePicker showToday={false} disabled value={moment(startTime, dateFormat)} format={dateFormat} />
                            <span> — </span>
                            <DatePicker showToday={false} disabled value={moment(endTime, dateFormat)} format={dateFormat} />
                        </Item>
                        <Item>
                            <Input disabled value={userSessions} />
                        </Item>
                        <Item>
                            <Input disabled value={url} />
                        </Item>
                        <ImgWarp>
                            <img src={imgUrl} />
                        </ImgWarp>
                    </Right>
                </Container>
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

export default connect(null, mapDispatchToProps)(ReadAtm);