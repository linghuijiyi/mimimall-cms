import React, { Component } from 'react';
import { Warp, Container, Left, Right, Item, AtmImg, Options } from './style';
import { Input, Select, DatePicker, Upload, Button, Icon, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import baseURL from './../../../../common/js/baseURL';
import fatch from './../../../../common/js/fatch';
import Storage from './../../../../common/js/storage';
import history from './../../../../history';
import reqwest from 'reqwest';
import moment from 'moment';
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const Option = Select.Option;
const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
let imgWidth = 0;
let imgHeight = 0;

class CreateAtm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createLoading: false,
            // 请求参数
            company: '',
            name: '',
            advertPositionId: '请选择广告位',
            platformType: '0',
            startTimeStr: '',
            endTimeStr: '',
            path: '',
            startValue: null,
            endValue: null,
            // 上传图片数据
            previewVisible: false,
            previewImage: '',
            fileList: [],
            fileListParams: [],
            // 隐藏图片
            compareSrc: '',
            // 广告位数据
            propaganda: '',
            propagandaList: [],
        }
    }
    componentDidMount() {
        this.props.handleChangeBreadcrumb(['前端页面管理', '广告管理', '添加广告']);
        this.getPropagandaList();
    }
    /**************************获取广告位数据********************/
    getPropagandaList = () => {
        const url = `${baseURL}webPage/advert/findPosition`;
        fatch(url, 'post', null, (err, state) => {
            message.info(err);
            message.info('获取广告位数据失败');
        }).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                let list = [];
                data.unshift({name: '请选择广告位', id: '请选择广告位', state: '1'});
                if (data.length) {
                    const list = data.map((item) => {
                        if (item.state !== '0') {
                            let element = '';
                            if (item.id === '请选择广告位') element = `${item.name}`; 
                            else element = `${item.name} (W:${item.width} × H:${item.height})`;
                            return <Option value={item.id} key={item.id}>{element}</Option>;
                        }
                    });
                    this.setState({propaganda: list, propagandaList: data});
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    /*************************保存*******************************/
    handleOnOkClick = () => {
        const { 
            company,
            name,
            advertPositionId,
            platformType,
            startTimeStr,
            endTimeStr,
            fileListParams,
            compareSrc,
            propagandaList,
            path
        } = this.state;
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
        if (propagandaList.length) {
            if (advertPositionId === '请选择广告位') {
                message.info('请选择广告位');
                return;
            }
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
                if (item.width && item.width !== undefined && item.width !== null) {
                    imgWidth = item.width;
                }
                if (item.height && item.height !== undefined && item.height !== null) {
                    imgHeight = item.height;
                }
            }
        });
        const { width, height } = this.refs.img;
        if (width !== imgWidth) {
            message.info('广告位宽度和图片宽度不一致，请重新上传。');
            return;
        }
        if (height !== imgHeight) {
            message.info('广告位高度和图片高度不一致，请重新上传。');
            return;
        }
        this.setState({createLoading: true});
        const url = `${baseURL}webPage/advert/saveAdvert`;
        const formData = new FormData();
        fileListParams.map((file) => (formData.append('file', file)));
        const params = { company, name, advertPositionId, platformType, startTimeStr, endTimeStr, url:  path };
        for(let key in params) formData.append(key, params[key]);
        reqwest({
            url: url,
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
                    this.setState({createLoading: false});
                    message.info(res.msg);
                }
            },
            error: (err) => {
                this.setState({createLoading: false});
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
        // 重新设置开始时间，必须重新设置结束时间  
        if (field === 'startValue') this.setState({endValue: null, endTimeStr: ''});
        this.setState({[field]: value});
    }
    disabledStartDate = (startValue) => startValue < moment(Date.now()).add(-1, 'days');
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }
    /************************预览图片****************************/
    handleCancel = () => this.setState({ previewVisible: false })
    /*********************返回**********************/
    handleBackClick = () => history.push({pathname: '/webPageControl/advertisement', query: this.props.location.state});
    render() {
        const {
            company,
            name,
            startValue,
            endValue, 
            previewVisible, 
            previewImage, 
            fileList,
            propaganda,
            advertPositionId,
            platformType,
            path,
            compareSrc,
            createLoading
        } = this.state;
        const props = {
            action: `${baseURL}webPage/advertPosition/saveOrUpdate`,
            listType: 'picture-card',
            accept: 'image/*',
            onRemove: (file) => {
                this.setState(({ fileList, fileListParams, compareSrc }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return { fileList: newFileList, fileListParams: newFileList, compareSrc: ''};
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListParams }) => ({
                    fileListParams: [...fileListParams, file]
                }));
                return false;
            },
            fileList: this.state.fileList,
            onPreview: (file) => {
                this.setState({
                    previewImage: file.url || file.thumbUrl,
                    previewVisible: true,
                });
            },
            onChange: ({ fileList }) => {
                this.setState({ fileList });
                setTimeout(() => {
                    if (fileList.length > 0) this.setState({compareSrc: fileList[0].thumbUrl});
                }, 100);
            }
        };
        return (
            <Warp>
                <Button type='primary' style={{margin: '10px 20px'}} onClick={this.handleBackClick}>
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
                            <Input placeholder='请输入广告公司' value={company} onChange={(e) => {this.setState({company: e.target.value})}} />
                        </Item>
                        <Item>
                            <Input placeholder='请输入广告名称' value={name} onChange={(e) => {this.setState({name: e.target.value})}} />
                        </Item>
                        <Item id='ggw' style={{position: 'relative' }}>
                            <Select
                                style={{width: '100%'}}
                                value={advertPositionId}
                                onChange={(value) => {this.setState({advertPositionId: value})}}
                                getPopupContainer={() => document.getElementById('ggw')}
                            >
                                {propaganda}
                            </Select>
                        </Item>
                        <Item id='pt' style={{position: 'relative' }}>
                            <Select
                                style={{width: '100%'}}
                                value={platformType}
                                onChange={(value) => {this.setState({platformType: value})}}
                                getPopupContainer={() => document.getElementById('pt')}
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
                                placeholder='选择开始日期'
                                value={startValue}
                                format={dateFormat}
                                getCalendarContainer={() => document.getElementById('sj')}
                            />
                            <span> — </span>
                            <DatePicker
                                showToday={false}
                                disabledDate={this.disabledEndDate}
                                onChange={this.handleDatePickerEndChange}
                                placeholder='选择结束日期'
                                value={endValue}
                                format={dateFormat}
                                getCalendarContainer={() => document.getElementById('sj')}
                            />
                        </Item>
                        <AtmImg style={{minHeight: 104, marginBottom: 20}}>
                            <img ref='img' src={compareSrc} style={{display: 'none'}} />
                            <Upload {...props}>
                                {fileList.length >= 1 ? null : <div><Icon type='plus' /></div>}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </AtmImg>
                        <Item>
                            <Input value={path} onChange={(e) => {this.setState({path: e.target.value})}} />
                        </Item>
                    </Right>
                </Container>
                <Options>
                    <Button type='primary' onClick={this.handleBackClick}>取消</Button>
                    <Button type='primary' loading={createLoading} onClick={this.handleOnOkClick}>保存</Button>
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

export default connect(null, mapDispatchToProps)(CreateAtm);