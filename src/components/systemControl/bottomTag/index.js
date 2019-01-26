import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { View, ViewTitle, ViewImg, Upload } from './style';
import { Select, Button, Input, Modal, Radio, message, Icon } from 'antd';
import { actionCreators } from './../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../base/home/store';
import fatch from './../../../common/js/fatch';
import Storage from './../../../common/js/storage';
import baseURL from './../../../common/js/baseURL';
import reqwest from 'reqwest';
const RadioGroup = Radio.Group;
const Option = Select.Option;   
class BottomTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            andClickReplaceIcon: '', // 安卓不显示时替换icon高亮效果图片加密链接
            andReplaceIcon: '', // 安卓不显示时替换icon图片加密链接
            andReplaceImage: '', // 安卓不显示时替换落地图片加密链接
            iosClickReplaceIcon: '', // ios不显示时替换icon高亮效果图片加密链接
            iosReplaceIcon: '', // ios不显示时替换icon图片加密链接
            iosReplaceImage: '', // ios不显示时替换落地图片加密链接
            iosState: 0, // ios显示状态,
            androidState: 0, // 安卓显示状态
            link: '', // 落地页链接
            name: '', // 底部标签名称
            replaceName: '', // 不显示时替换名称
            id: '', // id
            // 替换标签icon点击效果图
            andClickReplaceImg: [],
            andClickIcon: '',
            iosClickReplaceImg: [],
            iosClickIcon: '',
            // 不显示状态替换标签icon
            iosIconImg: [],
            iosIcon: '',
            andIconImg: [],
            andIcon: '',
            // 不显示状态替换落地页图片
            iosGroundImg: [],
            iosImg: '',
            andGroundImg: [],
            andImg: '',

            andReplaceImageLink: '',
            iosReplaceImageLink: '',

        }
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['系统管理', '底部标签管理']));
        this.requestList();
    }
    /****************获取列表数据*****************/
    requestList = () => {
        const url = `${baseURL}sys/banner/info`;
        const params = {};
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                if (res.data === null) return;
                const {
                    name,
                    link,
                    id,
                    replaceName,
                    iosState,
                    androidState,
                    iosClickReplaceIcon,
                    andClickReplaceIcon,
                    iosReplaceIcon,
                    andReplaceIcon,
                    iosReplaceImage,
                    andReplaceImage
                } = res.data;
                this.setState({
                    iosState,
                    androidState,
                    id,
                    link,
                    name,
                    replaceName,
                    iosClickReplaceIcon,
                    andClickReplaceIcon,
                    iosReplaceIcon,
                    andReplaceIcon,
                    iosReplaceImage,
                    andReplaceImage,
                    andReplaceImageLink: andReplaceImage,
                    iosReplaceImageLink: iosReplaceImage
                }, () => {
                    if (androidState !== 0) {
                        this.getAndroidImg();
                    }
                    if (iosState !== 0) {
                        this.getIosImg();
                    }
                });
            } else {
                message.info(res.msg);
            }
        });
    }
    getAndroidImg = () => {
        let imgName = ['andClickReplaceImg', 'andIconImg', 'andGroundImg'];
        const { andClickReplaceIcon, andReplaceIcon, andReplaceImage } = this.state;
        let imgLink = [andClickReplaceIcon, andReplaceIcon, andReplaceImage];
        for (let i = 0; i < imgName.length; i++) this.getImgUrl(imgName[i], imgLink[i]);
    }
    getIosImg = () => {
        let imgName = ['iosClickReplaceImg', 'iosIconImg', 'iosGroundImg'];
        const { iosClickReplaceIcon, iosReplaceIcon, iosReplaceImage } = this.state;
        let imgLink = [iosClickReplaceIcon, iosReplaceIcon, iosReplaceImage];
        for (let i = 0; i < imgName.length; i++) this.getImgUrl(imgName[i], imgLink[i]);
    }
    /****************获取图片链接*****************/
    getImgUrl = (field, imgName) => {
        const url = `${baseURL}account/getImgUrl`;
        fatch(url, 'post', { imgName }, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                let imgWrap = [];
                imgWrap.push({ imgUrl: res.data });
                this.setState({[field]: imgWrap});
            } else {
                // message.error(res.msg);
            }
        });
    }
    /******************删除图片*******************/
    deletPic = (nowIndex, field, fieldObj) => {
        let imgList = this.state[field];
        imgList.splice(nowIndex, 1);
        this.setState({ [field]: imgList, [fieldObj]: '' });
    }
    /******************上传图片*******************/
    uploadChange = (field, fieldObj, input, width, height, file_size) => {
        const imgList = this.state[field];
        const fileData = this.refs[input].files[0];
        const imgObj = new Image();
        let reader = new FileReader();
        let lists = imgList;
        reader.onload = (e) => {
            lists.push({ imgUrl: e.target.result, id: 0 });
            this.setState({ [field]: lists, [fieldObj]: fileData });
        }
        imgObj.onload = () => {
            if (imgObj.width !== width || imgObj.height !== height) {
                message.info(`请选择宽度为${width}px,高度为${height}px大小的图片上传.`);
                return;
            }
            if (fileData.size > file_size * 1024) {
                message.info('图片大小不能超过200M.');
                return;
            }
            reader.readAsDataURL(fileData);
        }
        if (fileData !== undefined) imgObj.src = window.URL.createObjectURL(fileData);
    }
    /*******************保存**********************/
    handleSaveClick = () => {
        const {
                id,
                link,
                replaceName,
                androidState,
                iosState,
                iosClickReplaceIcon,
                iosClickIcon,
                andClickReplaceIcon,
                andClickIcon,
                iosReplaceIcon,
                iosIcon,
                andReplaceIcon,
                andIcon,
                iosReplaceImage,
                iosImg,
                andReplaceImage,
                andImg,
                //判断是否为空
                iosIconImg,
                iosClickReplaceImg,
                iosGroundImg,
                andIconImg,
                andClickReplaceImg,
                andGroundImg,



                andReplaceImageLink,
                iosReplaceImageLink
        } = this.state;
        if (link.length === 0) {
            message.info('落地页链接不能为空。');
            return;
        } else if (link.length > 128) {
            message.info('落地页链接不能超过128个字符。');
            return;
        }
        if (iosState === 1 || androidState === 1) {
            if (replaceName.length === 0) {
                message.info('不显示状态替换标签名称不能为空。');
                return;
            }
            if (replaceName.length > 4) {
                message.info('不显示状态替换标签名称长度不能大于4个字符。');
                return;
            }
            if (iosReplaceImageLink.length === 0 || iosReplaceImageLink.length === '' || andReplaceImageLink.length === 0 || andReplaceImageLink.length === '') {
                message.info('不显示状态替换落地页链接不能为空。');
                return;
            }
        }
        if (iosState === 1) {
            if (iosReplaceImageLink.length === 0 || iosReplaceImageLink.length === '') {
                message.info('不显示状态替换落地页链接不能为空。');
                return;
            }
            if (!iosIconImg.length) {
                message.info('请上传ios设备，不显示状态替换标签icon。');
                return;
            }
            if (!iosClickReplaceImg.length) {
                message.info('请上传ios设备，替换标签icon点击效果图。');
                return;
            }
            if (!iosGroundImg.length) {
                message.info('请上传ios设备，不显示状态替换落地页图片。');
                return;
            }
        }
        if (androidState === 1) {
            if (andReplaceImageLink.length === 0 || andReplaceImageLink.length === '') {
                message.info('不显示状态替换落地页链接不能为空。');
                return;
            }
            if (!andIconImg.length) {
                message.info('请上传android设备，不显示状态替换标签icon。');
                return;
            }
            if (!andClickReplaceImg.length) {
                message.info('请上传android设备，替换标签icon点击效果图。');
                return;
            }
            if (!andGroundImg.length) {
                message.info('请上传android设备，不显示状态替换落地页图片。');
                return;
            }
        }
        let params = null;
        if (androidState === 0 && iosState === 0) {
            params = {
                id,
                link,
                androidState,
                iosState,
            }
        } else if (androidState === 1 && iosState === 1) {
            params = {
                id,
                link,
                replaceName,
                androidState,
                iosState,
                iosClickReplaceIcon,
                iosClickIcon,
                andClickReplaceIcon,
                andClickIcon,
                iosReplaceIcon,
                iosIcon,
                andReplaceIcon,
                andIcon,
                iosReplaceImage: iosReplaceImageLink,
                iosImg,
                andReplaceImage: andReplaceImageLink,
                andImg
            }
        } else if (androidState === 1 && iosState === 0) {
            params = {
                id,
                link,
                replaceName,
                androidState,
                iosState,
                andClickReplaceIcon,
                andClickIcon,
                andReplaceIcon,
                andIcon,
                andReplaceImage: andReplaceImageLink,
                andImg
            }
        } else if (androidState === 0 && iosState === 1) {
            params = {
                id,
                link,
                replaceName,
                androidState,
                iosState,
                iosClickReplaceIcon,
                iosClickIcon,
                iosReplaceIcon,
                iosIcon,
                iosReplaceImage: iosReplaceImageLink,
                iosImg,
            }
        }
        const formData = new FormData();
        for(let key in params) formData.append(key, params[key]);
            this.showAndHideLoading(true);
        reqwest({
            url: `${baseURL}sys/banner/updateBanner`,
            method: 'post',
            processData: false,
            headers: {
                authorization: Storage.get('token')
            },
            data: formData,
            success: (res) => {
                if (res.code === '0') {
                    message.success(res.msg);
                    this.showAndHideLoading(false);
                    this.requestList();
                } else {
                    message.error(res.msg);
                    this.showAndHideLoading(false);
                }
            },
            error: (err) => {
                message.error(`'网络错误！！！'`);
                this.showAndHideLoading(false);
            }
        });
    }
    /*******************重置**********************/
    handleResetClick = () => {
        this.setState({
            link: '',
            iosState: 0,
            androidState: 0,
            andClickReplaceImg: [],
            iosClickReplaceImg: [],
            iosIconImg: [],
            andIconImg: [],
            iosGroundImg: [],
            andGroundImg: []
        });
    }
    /******************loading********************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const {
            id,
            name,
            link,
            replaceName,
            iosState,
            androidState,
            andClickReplaceImg,
            iosClickReplaceImg,
            iosIconImg,
            andIconImg,
            iosGroundImg,
            andGroundImg,

            andReplaceImageLink,
            iosReplaceImageLink
        } = this.state;
        const renderImg = (imgList, imgName, imgObj) => {
            if (imgList.length > 0) {
                return (
                    imgList.map((item, index) => {
                        return (
                            <div key={index} className='addDiv'>
                                <li className='li'>
                                    <div className='container'>
                                        <img src={item.imgUrl} />
                                        <div className='iconWrap'>
                                            <Icon className='close' type='close-circle' onClick={() => this.deletPic(index, imgName, imgObj)} />
                                        </div>
                                    </div>
                                </li>
                            </div>
                        )
                    })
                )
            }
        }
        const renderUpload = (encryption, imgName, imgObj, width, height, file_size) => {
            return (
                <Upload>
                    <div><Icon type='plus' /></div>
                    <input ref={encryption} type='file' onChange={() => {this.uploadChange(imgName, imgObj, encryption, width, height, file_size)}} />
                </Upload>
            );
        }
        const RowClassState = { display: iosState === 0 && androidState === 0 ? 'none' : 'flex' }
        const IosClassState = { width: 170, textAlicn: 'center', display: iosState === 0 ? 'none' : 'block' }
        const AndroidClassState = { width: 170, display: androidState === 0 ? 'none' : 'block' }
        return (
            <Fragment>
                <View>
                    <ViewTitle>底部标签名称：</ViewTitle>
                    <div>{ name }</div>
                </View>
                <View>
                    <ViewTitle><label style={{color:'red'}}>*</label>落地页链接：</ViewTitle>
                    <Input
                        style={{width:350}}
                        value={link} onChange={(e) => this.setState({link: e.target.value})}
                    />
                </View>
                <View>
                    <ViewTitle>ios显示状态：</ViewTitle>
                    <RadioGroup
                        value={iosState}
                        onChange={(e) => {
                            this.setState({iosState: e.target.value})
                            this.getIosImg()
                        }}
                    >
                        <Radio value={0}>显示</Radio>
                        <Radio value={1}>不显示</Radio>
                    </RadioGroup>
                </View>
                <View>
                    <ViewTitle>安卓显示状态：</ViewTitle>
                    <RadioGroup
                        value={androidState}
                        onChange={(e) => {
                            this.setState({androidState: e.target.value})
                            this.getAndroidImg()
                        }}
                    >
                        <Radio value={0}>显示</Radio>
                        <Radio value={1}>不显示</Radio>
                    </RadioGroup>
                </View>
                <View style={RowClassState}>
                    <ViewTitle><label style={{color:'red'}}>*</label>不显示状态替换标签名称：</ViewTitle>
                    <Input
                        style={{width:350}}
                        value={replaceName} 
                        placeholder="最多输入四个字符"
                        onChange={(e) => this.setState({replaceName: e.target.value})} />
                </View>
                <View style={{ display: androidState === 0 ? 'none' : 'flex' }}>
                    <ViewTitle><label style={{color:'red'}}>*</label>不显示状态替换落地页链接(android):</ViewTitle>
                    <Input
                        style={{width:350}}
                        value={andReplaceImageLink}
                        onChange={(e) => {this.setState({andReplaceImageLink: e.target.value})}}
                    />
                </View>
                <View style={{ display: iosState === 0 ? 'none' : 'flex' }}>
                    <ViewTitle><label style={{color:'red'}}>*</label>不显示状态替换落地页链接(ios):</ViewTitle>
                    <Input
                        style={{width:350}}
                        value={iosReplaceImageLink}
                        onChange={(e) => {this.setState({iosReplaceImageLink: e.target.value})}}
                    />
                </View>
                <View className='bigRow' style={RowClassState}>
                    <ViewTitle>不显示状态替换标签icon:</ViewTitle>
                    <div style={{display: 'flex'}}>
                        <div style={IosClassState}>
                            <span>苹果设备(30px*30px):</span>
                            <ViewImg>
                                { renderImg(iosIconImg, 'iosIconImg', 'iosIcon') }
                                { iosIconImg.length >= 1 ? null : renderUpload('iosReplaceIcon', 'iosIconImg', 'iosIcon', 30, 30, 200) }
                            </ViewImg>
                        </div>
                        <div style={AndroidClassState}>
                            <span>安卓设备(48px*48px):</span>
                            <ViewImg>
                                { renderImg(andIconImg, 'andIconImg', 'andIcon') }
                                { andIconImg.length >= 1 ? null : renderUpload('andReplaceIcon', 'andIconImg', 'andIcon', 48, 48, 200) }
                            </ViewImg>
                        </div>
                    </div>
                </View>
                <View className='bigRow' style={RowClassState}>
                    <ViewTitle>替换标签icon点击效果图:</ViewTitle>
                    <div style={{display: 'flex'}}>
                        <div style={IosClassState}>
                            <span>苹果设备(30px*30px):</span>
                            <ViewImg>
                                { renderImg(iosClickReplaceImg, 'iosClickReplaceImg', 'iosClickIcon') }
                                { iosClickReplaceImg.length >= 1 ? null : renderUpload('iosClickReplaceIcon', 'iosClickReplaceImg', 'iosClickIcon', 30, 30, 200) }
                            </ViewImg>
                        </div>
                        <div style={AndroidClassState}>
                            <span>安卓设备(48px*48px):</span>
                            <ViewImg>
                                { renderImg(andClickReplaceImg, 'andClickReplaceImg', 'andClickIcon') }
                                { andClickReplaceImg.length >= 1 ? null : renderUpload('andClickReplaceIcon', 'andClickReplaceImg', 'andClickIcon', 48, 48, 200) }
                            </ViewImg>
                        </div>
                    </div>
                </View>
                {
                        /*
                        <View className='bigRow' style={RowClassState}>
                            <ViewTitle>不显示状态替换落地页图片:</ViewTitle>
                            <div style={{display: 'flex'}}>
                                <div style={IosClassState}>
                                    <span>苹果设备(750px*1334px):</span>
                                    <ViewImg>
                                        { renderImg(iosGroundImg, 'iosGroundImg', 'iosImg') }
                                        { iosGroundImg.length >= 1 ? null : renderUpload('iosReplaceImage', 'iosGroundImg', 'iosImg', 750, 1334, 200) }
                                    </ViewImg>
                                </div>
                                <div style={AndroidClassState}>
                                    <span>安卓(1080px*1920px):</span>
                                    <ViewImg>
                                        { renderImg(andGroundImg, 'andGroundImg', 'andImg') }
                                        { andGroundImg.length >= 1 ? null : renderUpload('andReplaceImage', 'andGroundImg', 'andImg', 1080, 1920, 200) }
                                    </ViewImg>
                                </div>
                            </div>
                        </View>
                    */
                }
                <div style={{marginTop: 30}}>
                    <Button type='primary' style={{marginLeft:360,marginRight:24,width:120}} onClick={this.handleResetClick}>重置</Button>
                    <Button type='primary' style={{width:120}} onClick={this.handleSaveClick}>确定</Button>
                </div>
            </Fragment>
        );
    }
}

export default connect(null, null)(BottomTag);