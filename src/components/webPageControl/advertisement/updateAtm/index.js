import React, { Component } from 'react';
import { Warp, Container, Left, Right, Item, AtmImg, Options } from './../createAtm/style';
import { Input, Select, Radio, DatePicker, Upload, Button, Icon, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import baseURL from './../../../../common/js/baseURL';
import fatch from './../../../../common/js/fatch';
import Storage from './../../../../common/js/storage';
import formatDateTime from './../../../../common/js/formatDateTime';
import history from './../../../../history';
import 'moment/locale/zh-cn';
import reqwest from 'reqwest';
import moment from 'moment';
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
let imgWidth = 0;
let imgHeight = 0;

class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            company: '',
            name: '',
            advertPositionId: '',
            propaganda: '',
            propagandaList: [],
            platformType: '',
            startTimeStr: '',
            endTimeStr: '',
            startValue: null,
            endValue: null,
            adPicUrl: '',
            url: '',
            updateFileList: [],
            fileListParams: [],
            compareSrc: '',
            previewVisible: false,
            previewImage: '',
            fileList: [],
            saveLoading: false,
            selectColor: ''
        }
    }
    componentDidMount () {
        this.props.handleChangeBreadcrumb(['前端页面管理', '广告管理', '编辑广告']);
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
        let advertTypeText = '';
        let startTimeStr = formatDateTime(data.startTime, true);
        let endTimeStr = formatDateTime(data.endTime, true);
        if (data.android === '1' && data.ios === '1') advertTypeText = '0';
        else if (data.android === '1' && data.ios !== '1') advertTypeText = '1';
        else if (data.android !== '1' && data.ios === '1') advertTypeText = '2';
        this.setState({
            id: data.id,
            company: data.company,
            name: data.name,
            platformType: advertTypeText,
            startTimeStr: startTimeStr,
            startValue: moment(startTimeStr, dateFormat),
            endTimeStr: endTimeStr,
            endValue: moment(endTimeStr, dateFormat),
            adPicUrl: data.adPicUrl,
            url: data.url === null ? '' : data.url,
        });
        this.getPropagandaList(data.advertPositionId);
        this.getReadImg(data.adPicUrl);
    }
    /**************************获取广告位数据********************/
    getPropagandaList = (id) => {
        const url = `${baseURL}webPage/advert/findPosition`;
        fatch(url, 'post', null, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                const list = data.map((item) => {
                    let element = `${item.name} (W:${item.width} × H:${item.height})`;
                    item.id === id ? this.setState({advertPositionId: item.id}) : '';
                    return <Option style={{color: item.state === '0' ? 'red' : ''}} id={item.state} value={item.id} key={item.id}>{element}</Option>;
                });
                this.setState({
                    propaganda: list,
                    propagandaList: data
                });
            } else {
                message.info(res.msg);
            }
        });
    }
    /**************************获取图片信息*********************************/
    getReadImg = (imgName) => {
        const url = `${baseURL}account/getImgUrl`;
        fatch(url, 'post', {imgName}, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                let imgList = [];
                imgList.push({
                    uid: '-1',
                    name: 'img.png',
                    url: res.data,
                    status: 'done'
                });
                this.setState({
                    updateFileList: imgList,
                    compareSrc: res.data
                });
            } else {
                message.info(res.msg);
            }
        });
    }
    /************************保存更改内容************************/
    handleSaveClick = () => {
        const { width, height } = this.refs.img;
        const {
            id,
            company,
            name,
            startTimeStr,
            endTimeStr,
            advertPositionId,
            platformType,
            adPicUrl,
            url,
            fileListParams,
            propagandaList,
            compareSrc,
        } = this.state;
        const params = {
            id,
            company,
            name,
            startTimeStr,
            endTimeStr,
            advertPositionId,
            platformType,
            adPicUrl,
            url
        }
        if (company === '') {
            message.info('广告公司不能为空');
            return;
        }
        if (regEn.test(company) || regCn.test(company)) {
            message.info('广告公司不能包含特殊字符');
            return;
        }
        if (/\s+/g.test(company)) {
            message.info('广告公司不能包含空格');
            return;
        }
        if (name === '') {
            message.info('广告名称不能为空');
            return;
        }
        if (regEn.test(name) || regCn.test(name)) {
            message.info('广告名称不能包含特殊字符');
            return;
        }
        if (/\s+/g.test(name)) {
            message.info('广告名称不能包含空格');
            return;
        }
        if (startTimeStr === '') {
            message.info('请选择开始时间');
            return;
        }
        if (endTimeStr === '') {
            message.info('请选择结束时间');
            return;
        }
        if (compareSrc === '' && !fileListParams.length) {
            message.info('请上传广告位图片');
            return;
        }
        propagandaList.map((item) => {
            if (item.id === advertPositionId) {
                if (item.width && item.width !== undefined && item.width !== null) imgWidth = item.width;
                if (item.height && item.height !== undefined && item.height !== null) imgHeight = item.height;
            }
        });
        if (width !== imgWidth) {
            message.info('广告位宽度和图片宽度不一致，请重新上传。');
            return;
        }
        if (height !== imgHeight) {
            message.info('广告位高度和图片高度不一致，请重新上传。');
            return;
        }
        this.setState({saveLoading: true});
        const formData = new FormData();
        fileListParams.map((file) => (formData.append('file', file)));
        for(let key in params) formData.append(key, params[key]);
            reqwest({
            url: `${baseURL}webPage/advert/updateAdvert`,
            method: 'post',
            processData: false,
            headers: {
                authorization: Storage.get('token')
            },
            data: formData,
            success: (res) => {
                if (res.code === '0') {
                    message.info(res.msg);
                    let state = this.props.location.state;
                    state.page = 1;
                    setTimeout(() => {
                        history.push({pathname: '/webPageControl/advertisement', query: state});
                    }, 1000);
                } else {
                    this.setState({saveLoading: false});
                    message.info(res.msg);
                }
            },
            error: (err) => {
                this.setState({saveLoading: false});
                message.info('网络错误！！！');
            }
        });
    }
    /************************设置日期格式************************/
    handleDatePickerCreateChange = (value, dateString) => {
        if (dateString !== '') {
            this.setState({startTimeStr: dateString});
            this.timeChange('startValue', value);
        } else {
            this.setState({startTimeStr: ''});
            this.timeChange('startValue', null);
        }
    }
    handleDatePickerEndChange = (value, dateString) => {
        if (dateString !== '') {
            this.setState({endTimeStr: dateString});
            this.timeChange('endValue', value);
        } else {
            this.setState({endTimeStr: ''});
            this.timeChange('endValue', null);
        }
    }
    timeChange = (field, value) => {
        if (field === 'startValue') this.setState({endValue: null, endTimeStr: ''});
        this.setState({[field]: value});
    }
    disabledStartDate = (startValue) => startValue < moment(Date.now()).add(-1, 'days');
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }
    /*************************图片预览*************************/
    handleCancel = () => this.setState({ previewVisible: false });
    /*************************   返回   *************************/
    selectCol = (id) => {
        const { propagandaList } = this.state;
        if (id !== '' && propagandaList.length) {
            let flag = false;
            propagandaList.map((item) => {
                if (item.id === id && item.state === '0') flag = true;
            });
            return flag;
        }
    }
    handelBackClick = () => history.push({pathname: '/webPageControl/advertisement', query: this.props.location.state});
    render() {
        if (this.props.location.state === undefined) {
            return <div>
                <Button type='primary' style={{margin: '10px 20px'}} onClick={() => {history.push({pathname: '/webPageControl/advertisement'})}}>
                    <Icon type='rollback' />
                    返回
                </Button>
            </div>;
        }
        const {
            company,
            name,
            propaganda,
            advertPositionId,
            platformType,
            startValue,
            endValue,
            url,
            updateFileList,
            compareSrc,
            previewVisible,
            previewImage,
            saveLoading,
            selectColor
        } = this.state;
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
                    previewImage: file.url || file.thumbUrl,
                    previewVisible: true,
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
                <Button type='primary' style={{margin: '10px 20px'}} onClick={this.handelBackClick}>
                    <Icon type='rollback' />
                    返回
                </Button>
                <Container>
                    <Left>
                        <Item>
                            <span><span style={{color: 'red'}}>*</span>广告公司:</span>
                        </Item>
                        <Item>
                            <span><span style={{color: 'red'}}>*</span>广告名称:</span>
                        </Item>
                        <Item>
                            <span><span style={{color: 'red'}}>*</span>选择广告位:</span>
                        </Item>
                        <Item>
                            <span><span style={{color: 'red'}}>*</span>发布平台:</span>
                        </Item>
                        <Item>
                            <span><span style={{color: 'red'}}>*</span>广告时间:</span>
                        </Item>
                        <div style={{minHeight: 104, marginBottom: 20}}>
                            <span><span style={{color: 'red'}}>*</span>广告图片:</span>
                        </div>
                        <Item>
                            <span>URL:</span>
                        </Item>
                    </Left>
                    <Right>
                        <Item>
                            <Input value={company} onChange={(e) => {this.setState({company: e.target.value})}} />
                        </Item>
                        <Item>
                            <Input value={name} onChange={(e) => {this.setState({name: e.target.value})}} />
                        </Item>
                        <Item id='ggw' style={{position: 'relative' }}>
                            <Select
                                style={{width: '100%', color: this.selectCol(advertPositionId) ? 'red' : ''}}
                                value={advertPositionId} onChange={(value, selectEle) => {
                                    this.setState({advertPositionId: value});
                                }}
                                getPopupContainer={() => document.getElementById('ggw')}
                            >
                                { propaganda }
                            </Select>
                        </Item>
                        <Item id='qt' style={{position: 'relative' }}>
                            <Select
                                style={{width: '100%'}}
                                value={platformType}
                                onChange={(value) => {this.setState({platformType: value})}}
                                getPopupContainer={() => document.getElementById('qt')}
                            >
                                <Option value='0'>Android/Ios</Option>
                                <Option value='1'>Android</Option>
                                <Option value='2'>Ios</Option>
                            </Select>
                        </Item>
                        <Item id='sj' style={{position: 'relative' }}>
                            <DatePicker
                                showToday={false}
                                disabledDate={this.disabledStartDate}
                                onChange={this.handleDatePickerCreateChange}
                                value={startValue}
                                format={dateFormat}
                                getCalendarContainer={() => document.getElementById('qt')}
                            />
                            <span> — </span>
                            <DatePicker
                                showToday={false}
                                disabledDate={this.disabledEndDate}
                                onChange={this.handleDatePickerEndChange}
                                value={endValue}
                                format={dateFormat}
                                getCalendarContainer={() => document.getElementById('qt')}
                            />
                        </Item>
                        <AtmImg style={{minHeight: 104, marginBottom: 20}}>
                            <img ref='img' src={compareSrc} style={{display: 'none'}} />
                            <Upload {...updateProps}>
                                {updateFileList.length >= 1 ? null : <div><Icon type='plus' /></div>}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </AtmImg>
                        <Item>
                            <Input value={url} onChange={(e) => {this.setState({url: e.target.value})}} />
                        </Item>
                    </Right>
                </Container>
                <Options>
                    <Button type='primary' onClick={this.handelBackClick}>取消</Button>
                    <Button type='primary' loading={saveLoading} onClick={this.handleSaveClick}>
                        保存
                    </Button>
                </Options>
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

export default connect(null, mapDispatchToProps)(Update);
