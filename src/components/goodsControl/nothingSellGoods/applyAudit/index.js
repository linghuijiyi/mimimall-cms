import React, { Component, Fragment } from 'react';
import { 
    Wrap,
    Container,
    ChannelHeader,
    ChannelItem,
    Text,
    View,
    ChannelView,
    ListView,
    ImgView,
    SkuView,
    Options,
    DrawerOption,
    ImgWarp,
    StopImg,
    Upload,
    JdImg,
    Spec,
    TermItem
} from './style';
import { Button, Cascader, InputNumber, Drawer, Icon, Input, message, Modal, BackTop, Table, Popconfirm, Radio } from 'antd';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../../base/home/store';
import { connect } from 'react-redux';
import history from './../../../../history.js';
import baseURL from './../../../../common/js/baseURL';
import fatch from './../../../../common/js/fatch';
import getTypeList from './../../../../common/js/getTypeList';
import formatDateTime from './../../../../common/js/formatDateTime';
import { ERR_CODE } from './../../../../common/js/regExp';
import E from 'wangeditor';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
let jdValue = [];
class ApplyAudit extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '姓名',
                align: 'center',
                dataIndex: 'name',
            },
            {
                title: '操作时间',
                align: 'center',
                dataIndex: 'createTime',
                render: (text, record) => {
                    if (record.createTime !== null) {
                        return <div>{formatDateTime(record.createTime)}</div>;
                    } else {
                        return <div>查询异常</div>;
                    }
                }
            }, 
            {
                title: '操作内容',
                dataIndex: 'operation',
                align: 'center',
            }
        ];
        this.state = {
            // 页面状态
            isShwo: false,
            noGoods: true,
            pageHome: true,
            // 登录日志
            visible: false,
            // 查看图片
            sysVisible: false,
            sysImgPath: '',
            // 商品数据
            goods: '',
            jdGoods: 0,
            goodsPrice: 0,
            goodsOriginalPrice: '',
            minPrice: '',
            credit: 0,
            goodsName: '',
            goodsCategory: '',
            goodsSkuType: '',
            goodsIntroduction: '',
            goodsParam: '',
            imgList:[],
            jdOptions: [],
            logSource: [],
            searchText: '',
            // 分期管理
            instalments: null,
            downPayment: 0
        }
    }
    componentDidMount() {
        setTimeout(() => {
            getTypeList().then((jdOptions) => (this.setState({ jdOptions })));
            this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '未上架商品', '申请审核']));
            let data = this.props.location.state;
            if (data !== undefined) {
                const sku = data.record.sysSku;
                if (sku) {
                    this.handleFormatTypeValue([data.record.categoryObj]);
                    this.getGoodsDetail(sku);
                    this.setState({jdValue: jdValue});
                    this.setState({goodsValue: jdValue});
                } else {
                    this.setState({pageHome: false});
                    this.showAndHideLoading(false);
                }
            } else {
                this.setState({pageHome: false});
                this.showAndHideLoading(false);
            }
        }, 20);
    }
    componentWillUnmount() {
         jdValue = [];
    }
    /******************************获取商品详情数据*********************************/ 
    getGoodsDetail = (sku) => {
        this.showAndHideLoading(true);
        const url = `${baseURL}goods/details/info`;
        fatch(url, 'post', { sku }, (err, state) => {
            this.setState({noGoods: state});
            this.showAndHideLoading(state);
            message.error(err);
        }).then((res) => {
            if (res.code === ERR_CODE) {
                const goods = res.data.goods;
                const jdGoods = res.data.jdGoods;
                const instalments = res.data.instalment;
                this.setState({
                    goods,
                    jdGoods,
                    instalments,
                    imgList: this.handelFormImgList(goods.images),
                    goodsPrice: goods.price,
                    goodsOriginalPrice: goods.originalPrice,
                    downPayment: res.data.instalment === null ? '' : res.data.instalment.downPayment,
                    minPrice: goods.minPrice,
                    goodsName: goods.name,
                    credit: goods.credit,
                    goodsCategory: goods.category,
                    goodsSkuType: goods.skuType,
                    goodsIntroduction: goods.introduction,
                    goodsParam: goods.param,
                    isShwo: true,
                }, () => {
                    this.createEditor(this.refs.goodsIntroductionEditor, 'goodsIntroduction', goods.introduction);
                    this.createEditor(this.refs.goodsParamEditor, 'goodsParam', goods.param);
                    this.showAndHideLoading(false);
                });
                
            } else {
                this.setState({noGoods: false});
                this.showAndHideLoading(false);
                message.error(res.msg);
            }
        });
    }
    /******************************格式化分类数据*********************************/ 
    handleFormatTypeValue = (data) => {
        return data.map((item) => {
            jdValue.push(item.name);
            item.value = item.name;
            item.label = item.name;
            item.children = item.thirdCategoryList;
            if (item.thirdCategoryList !== null && item.thirdCategoryList !== undefined) this.handleFormatTypeValue(item.thirdCategoryList);
            return item;
        });
    }
    /******************************格式化图片数据*********************************/ 
    handelFormImgList = (data) => {
        if (data.length) {
            let list = [];
            const imgUrl = 'http://img13.360buyimg.com/n0/';
            data.map((item) => {
                list.push({
                    imgUrl: `${item.imageSource === 0 ? '' : imgUrl}${item.imgUrl}`,
                    isPrimary: item.isPrimary,
                    imageSource: item.imageSource,
                    orderSort: item.orderSort,
                    imgId: item.imgId,
                    id: item.id
                });
            });
            return list;
        } else {
            return [];
        }
    }
    /*************************创建文本编辑器*************************/
    createEditor = (elem, textNmae, text) => {
        const editor = new E(elem);
        editor.customConfig.onchange = html => this.setState({[textNmae]: html});
        editor.customConfig.uploadImgShowBase64 = true;
        editor.customConfig.zIndex = 0;
        editor.create();
        editor.txt.html(text);
    }
    /*************************保存商品*****************************/
    handleSaveClick = (api) => {
        const { goods, goodsName, goodsCategory, imgList, goodsPrice, goodsOriginalPrice, minPrice, goodsIntroduction, goodsParam, goodsSkuType, credit } = this.state;
        if (goodsPrice === undefined || goodsPrice === '' || goodsPrice === null) {
            message.info('请输入商品售价');
            return;
        }
        if (goodsOriginalPrice === undefined || goodsOriginalPrice === '' || goodsOriginalPrice === null) {
            message.info('请输入商品原价');
            return;
        }
        if (minPrice === undefined || minPrice === '' || minPrice === null) {
            message.info('请输入商品最低售价');
            return;
        }
        this.showAndHideLoading(true);
        goods.name = goodsName;
        goods.category = goodsCategory;
        goods.minPrice = minPrice;
        goods.price = goodsPrice;
        goods.originalPrice = goodsOriginalPrice;
        goods.introduction = goodsIntroduction;
        goods.param = goodsParam;
        goods.skuType = goodsSkuType;
        goods.credit = credit;
        goods.createTime = null;
        goods.updateTime = null;
        delete goods.goodsChannel;
        delete goods.goodsPool;
        delete goods.images;
        let params = {
            goods: JSON.stringify(goods),
            imagelist: JSON.stringify(imgList)
        }
        const url = `${baseURL}${api}`;
        fatch(url, 'post', params, (err, state) => {
            message.error(err);
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === ERR_CODE) {
                message.success(res.msg);
                this.showAndHideLoading(false);
                setTimeout(() => {
                    this.handleBackClick();
                }, 1000);
            } else {
                message.error(res.msg);
                this.showAndHideLoading(false);
            }
        });
    }
    /******************************获取分类id*********************************/ 
    handleCascaderChange = (value, selectedOptions) => {
        let skuType = [];
        selectedOptions.map((item) => (skuType.push(item.categoryId)));
        this.setState({goodsValue: value, goodsSkuType: skuType.join(';')});
        if (selectedOptions.length === 0) this.setState({goodsCategory: ''});
        else this.setState({goodsCategory: selectedOptions[selectedOptions.length - 1].categoryId});
    }
    /******************************删除图片*********************************/ 
    deletPic = (nowIndex) => {
        this.setState({ nowIndex }, () => {
            let imgList=this.state.imgList;
            imgList.splice(this.state.nowIndex, 1);
            imgList.map((item, index) => {
                item.isPrimary = 0;
                item.orderSort = index;
            });
            if (imgList.length > 0) {
                imgList[0].isPrimary = 1;
                imgList[0].orderSort = null;
            }
            this.setState({ imgList });
        });
    }
    /******************************左移动图片*********************************/ 
    moveLeft = (index) => {
        let lists = this.state.imgList;
        if (index == 0) {
            let newimg = lists[index];
            lists.splice(index, 1);
            lists.push(newimg);
        } else {
            let newimg = lists[index];
            lists.splice(index, 1);
            lists.splice(index - 1, 0, newimg);
        }
        lists.map((item, index) => {
            item.isPrimary = 0;
            item.orderSort = index;
        });
        if (lists.length > 0) {
            lists[0].isPrimary = 1;
            lists[0].orderSort = null;
        }
        this.setState({imgList: lists});
    }
    /******************************右移动图片*********************************/ 
    moveRight = (index) => {
        let lists = this.state.imgList;
        if (index == lists.length - 1) {
            let newimg = lists[index];
            lists.splice(index, 1);
            lists.unshift(newimg);
        } else {
            let newimg = lists[index];
            lists.splice(index, 1);
            lists.splice(index + 1, 0, newimg);
        }
        lists.map((item, index) => {
            item.isPrimary = 0;
            item.orderSort = index;
        });
        if (lists.length > 0) {
            lists[0].isPrimary = 1;
            lists[0].orderSort = null;
        }
        this.setState({imgList: lists});
    }
    /******************************上传图片*********************************/ 
    uploadChange = () => {
        const { imgList } = this.state;
        const fileData = this.refs.file.files[0];
        const imgObj = new Image();
        let reader = new FileReader();
        let lists = imgList;
        let isPrimary = lists.length > 0 ? 0 : 1;
        reader.onload = (e) => {
            lists.push({
                imgUrl: e.target.result,
                isPrimary: isPrimary,
                imageSource: 0,
                orderSort: imgList.length,
            });
            this.setState(({ imgList }) => ({
                imgList: lists
            }));
        }
        imgObj.onload = () => {
            const w = imgObj.width;
            const h = imgObj.height;
            const max_size = 200;
            if (w > 1000 || h > 1000) {
                message.info('图片宽高不能超过1000px');
                return;
            }
            if (fileData.size > max_size * 1024) {
                message.info('图片大小不能超过200M');
                return;
            }
            reader.readAsDataURL(fileData);
        }
        if (fileData !== undefined) imgObj.src = window.URL.createObjectURL(fileData);
    }
    /******************************设置分期数据********************************/
    handleStagesChange = (type, e, index) => {
        const { instalments } = this.state;
        type === 1 ? (instalments[index].rate = e) : (instalments[index].terms = e.target.value.replace(/\D/g, ''));
        this.setState({ instalments });
    }
    handleStagesDelete = (index) => {
        const { instalments } = this.state;
        instalments.splice(index, 1);
        this.setState({ instalments });
    }
    handleStagesCreate = () => {
        const { instalments } = this.state;
        instalments.push({
            terms: '',
            rate: ''
        });
        this.setState({ instalments });
    }
    /*****************************返回操作**********************************/
    handleBackClick = () => history.push({pathname: this.props.location.state.paterPath, query: this.props.location.state});
    /******************************查看图片*********************************/ 
    handleSysClick = (sysImgPath) => this.setState({sysVisible: true, sysImgPath});
    /******************************登录日志*********************************/ 
    showDrawer = () => {
        const url = `${baseURL}goodsoperatrion/log/list`;
        const sysSku = this.props.location.state.record.sysSku;
        fatch(url, 'post', { sysSku }, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === ERR_CODE) {
                const result = res.data.logs;
                if (result !== null) {
                    if (result.length > 0) result.map((item, index) => (item.key = index));
                    this.setState({
                        logSource: result,
                        visible: true
                    });
                }
            } else {
                message.error(res.msg);
            }
        });
    }
    /*******************************分期数据列表******************************/
    renderInstalment = (data, downPayment) => {
        if (data === null) {
            return <View style={{border: '1px solid #ccc'}}>该商品不支持分期！</View>;
        } else {
            if (data.terms === null) return <View style={{border: '1px solid #ccc'}}>该商品不支持分期！</View>;
            return (
                <View style={{border: '1px solid #ccc'}}>
                    <div style={{padding: '0px 10px'}}>
                        <span>首付：</span>
                        <RadioGroup
                            style={{ width: 500 }}
                            value={downPayment}
                            disabled
                            onChange={(e) => {this.setState({downPayment: e.target.value})}}
                        >
                            <Radio value={0}>零首付</Radio>
                            <Radio value={10}>10%</Radio>
                            <Radio value={20}>20%</Radio>
                            <Radio value={30}>30%</Radio>
                            <Radio value={40}>40%</Radio>
                            <Radio value={50}>50%</Radio>
                        </RadioGroup>
                    </div>
                    {
                        data.terms.map((item, index) => {
                            return (
                                <div key={index}>
                                    <TermItem style={{padding: '10px 10px'}}>
                                        <span>期数：</span>
                                        <Input
                                            placeholder='请输入期数'
                                            value={item.terms}
                                            disabled
                                            style={{width: 130}}
                                            onChange={(e) => this.handleStagesChange(0, e, index)}
                                        />
                                        &nbsp;&nbsp;
                                        <span>利率：</span>
                                        <InputNumber
                                            placeholder='请输入利率'
                                            style={{width: 130}}
                                            disabled
                                            value={item.rate}
                                            min={0}
                                            onChange={(value) => this.handleStagesChange(1, value, index)}
                                        />
                                        &nbsp;&nbsp;
                                        <span>每期应还款：</span>
                                        <InputNumber
                                            placeholder='请输入利率'
                                            style={{width: 130}}
                                            disabled
                                            value={item.pay4EachTerm}
                                            min={0}
                                            onChange={(value) => this.handleStagesChange(1, value, index)}
                                        />
                                        元
                                        <div></div>
                                    </TermItem>
                                </div>
                            )
                        })
                    }
                </View>
            )
        }
    }
    hideDrawer = () => this.setState({visible: false});
    /********************************loading***********************************/
    showAndHideLoading = (state) => this.props.dispatch(HomeActionCreators.changeLoading(state));
    render() {
        const {
            isShwo,
            noGoods,
            pageHome,
            visible, 
            sysVisible, 
            sysImgPath,
            goods,
            jdGoods,
            imgList, 
            goodsOriginalPrice,
            minPrice,
            credit,
            goodsPrice,
            goodsName,
            jdOptions,
            jdValue,
            goodsValue,
            logSource,
            instalments,
            downPayment
        } = this.state;
        let jdRenderImgWarp = null;
        let renderImgWarp = null;
        let renderInstalment = null;
        if (jdGoods.images !== undefined) {
            jdRenderImgWarp = jdGoods.images.map((item, index) => {
                const imgUrl = 'http://img13.360buyimg.com/n0/';
                return (
                    <li key={index} className='li'>
                        <div className='container'>
                            <img src={`${imgUrl}${item.imgUrl}`} />
                            <div className='iconWrap'>
                                <JdImg>
                                    <Icon type='eye' onClick={() => {this.handleSysClick(`${imgUrl}${item.imgUrl}`)}} />
                                </JdImg>
                            </div>
                        </div>
                    </li>
                )
            });
        }
        if (imgList.length > 0) {
            renderImgWarp = imgList.map((item, index) => {
                return (
                    <li key={index} className='li'>
                        <div className='container'>
                            <img src={item.imgUrl} />
                            <div className='iconWrap'>
                                <Icon className='close' type='close-circle' onClick={() => this.deletPic(index)} />
                                <StopImg>
                                    <Icon type='arrow-left' onClick={() => this.moveLeft(index)} />
                                    <Icon type='arrow-right' onClick={() => this.moveRight(index)} />
                                </StopImg>
                            </div>
                        </div>
                    </li>
                )
            });
        }
        renderInstalment = this.renderInstalment(instalments, downPayment);
        const renderUpload = <Upload>
            <div><Icon type='plus' /></div>
            <input ref='file' type='file' onChange={this.uploadChange} />
        </Upload>;
        const limitDecimals = (value: string | number): string => {
            const reg = /^(\-)*(\d+)\.(\d\d).*$/;
            if(typeof value === 'string') return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
            else if (typeof value === 'number') return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
            else return '';
        };
        return (
            <Fragment>
                <div style={{display: pageHome ? 'none' : 'block'}}>
                    <Button type='primary' style={{margin: '20px 0 0 15px'}} onClick={() => {history.push({pathname: '/'})}}>
                        <Icon type='rollback' />
                        返回首页
                    </Button>
                    <div>数据丢失,请返回首页从新加载数据...</div>
                </div>
                <div style={{display: noGoods ? 'none' : 'block'}}>
                    <Button type='primary' style={{margin: '20px 0 0 15px'}} onClick={this.handleBackClick}>
                        <Icon type='rollback' />
                        返回
                    </Button>
                    <div>没有数据...</div>
                </div>
                <div style={{display: isShwo ? 'block' : 'none'}}>
                    <Button type='primary' style={{margin: '20px 0 0 15px'}} onClick={this.handleBackClick}>
                        <Icon type='rollback' />
                        返回
                    </Button>
                    <Wrap >
                        <Container style={{width: '42%'}}>
                            <ChannelHeader>
                                <span>渠道消息</span>
                                <span>同步时间：{formatDateTime(jdGoods.createTime)}</span>
                            </ChannelHeader>
                            <ChannelView>
                                <p>渠道商: <span>京东</span></p>
                                <p>商品品牌: <span>{jdGoods.brandName}</span></p>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>渠道商品名称:</Text>
                                    <View>
                                        <TextArea disabled value={jdGoods.name} autosize />
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem style={{alignItems: 'center'}}>
                                    <Text>所属分类:</Text>
                                    <View>
                                        <Cascader disabled value={jdValue} options={jdOptions} />
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>商品图片:</Text>
                                    <ImgWarp>
                                        { jdRenderImgWarp }
                                    </ImgWarp>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>重量:</Text>
                                    <View>{jdGoods.weight}kg</View>
                                </ChannelItem>
                                <ChannelItem>
                                    <Text>渠道SKU:</Text>
                                    <View>
                                        <ul style={{margin: 0}}>
                                            <li>
                                                {jdGoods.sysSku}
                                                &nbsp;&nbsp;&nbsp;
                                                <span>*售价:&nbsp;</span><InputNumber disabled value={jdGoods.jdPrice} />元
                                                &nbsp;&nbsp;&nbsp;
                                                <span>*原价:&nbsp;</span><InputNumber disabled value={jdGoods.originalPrice === null ? 0 : jdGoods.originalPrice} />元
                                            </li>
                                        </ul>
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>商品描述:</Text>
                                    <View style={{border: '1px solid #ccc'}}>
                                        <Spec>
                                            <li dangerouslySetInnerHTML={{__html: jdGoods.introduction}}></li>
                                        </Spec>
                                    </View>
                                </ChannelItem>

                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>商品规格:</Text>
                                    <View style={{border: '1px solid #ccc'}}>
                                        <ListView>
                                            <li dangerouslySetInnerHTML={{__html: jdGoods.param}}></li>
                                        </ListView>
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                        </Container>
                        <Container style={{width: '57%'}}>
                            <ChannelHeader>
                                <span>万鲸游信息</span>
                            </ChannelHeader>
                            <ChannelView>
                                <p>渠道商: <span>京东</span></p>
                                <p>商品品牌: <span>{goods.brandName}</span></p>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>渠道商品名称:</Text>
                                    <View>
                                        <TextArea value={goodsName} onChange={(e) => {this.setState({goodsName: e.target.value})}} autosize />
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem style={{alignItems: 'center'}}>
                                    <Text>所属分类:</Text>
                                    <View>
                                        <Cascader value={goodsValue} options={jdOptions} onChange={this.handleCascaderChange} />
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>商品图片:</Text>
                                    <View>
                                        <ImgWarp>
                                            { renderImgWarp }
                                            { imgList.length >= 10 ? null : renderUpload }
                                        </ImgWarp>
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>重量:</Text>
                                    <View>{goods.weight}kg</View>
                                </ChannelItem>
                                <ChannelItem>
                                    <Text>渠道SKU:</Text>
                                    <View>
                                        <SkuView>
                                            <li>
                                                {goods.sysSku}&nbsp;&nbsp;&nbsp;
                                                <span>*售价:&nbsp;</span>
                                                <InputNumber
                                                    style={{width: 100}}
                                                    value={goodsPrice}
                                                    min={0}
                                                    formatter={limitDecimals} 
                                                    parser={limitDecimals} 
                                                    onChange={(value) => {this.setState({goodsPrice: value})}}
                                                />元
                                                &nbsp;&nbsp;&nbsp;
                                                <span>*原价:&nbsp;</span>
                                                <InputNumber
                                                    style={{width: 100}} 
                                                    value={goodsOriginalPrice}
                                                    min={0}
                                                    formatter={limitDecimals} 
                                                    parser={limitDecimals}
                                                    onChange={(value) => {this.setState({goodsOriginalPrice: value})}}
                                                />元
                                                &nbsp;&nbsp;&nbsp;
                                                <span>*最低售价:&nbsp;</span>
                                                <InputNumber
                                                    style={{width: 100}} 
                                                    value={minPrice}
                                                    min={0}
                                                    formatter={limitDecimals} 
                                                    parser={limitDecimals}
                                                    onChange={(value) => {this.setState({minPrice: value})}}
                                                />元
                                                &nbsp;&nbsp;&nbsp;
                                                <span>积分:&nbsp;</span>
                                                <InputNumber
                                                    style={{width: 100}} 
                                                    value={credit === null ? 0 : credit}
                                                    min={0}
                                                    onChange={(value) => {
                                                        let num = String(value).replace(/\D/g, '');
                                                        let newNum = '';
                                                        if (num === '') {
                                                            newNum = num;
                                                        } else {
                                                            newNum = parseInt(num);
                                                            newNum < 0 ? 0 : newNum;
                                                        }
                                                        this.setState({credit: newNum})
                                                    }}
                                                />
                                            </li>
                                        </SkuView>
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>分期:</Text>
                                    { renderInstalment }
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>商品描述:</Text>
                                    <View style={{border: '1px solid #ccc', width: '100%'}}>
                                        <div ref='goodsIntroductionEditor' style={{textAlign: 'left'}}></div>
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>商品规格:</Text>
                                    <View style={{border: '1px solid #ccc', width: '100%'}}>
                                        <div ref='goodsParamEditor' style={{textAlign: 'left'}}></div>
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <p>商品状态: <span>{goods.sysState === 1 || goods.sysState === 2 || goods.sysState === 4 ? '未上架' : goods.sysState === 3 ?  '已上架' : '已下架'}</span></p>
                                <p>审核状态: <span>{goods.sysState === 1 ? '未审核' : goods.sysState === 2 ? '审核中' : goods.sysState === 4 ? '审核失败' : '审核成功'}</span></p>
                                <Options>
                                    <Button type='primary' onClick={this.showDrawer}>查看操作日志</Button>
                                    <Button type='primary' onClick={this.handleBackClick}>关闭</Button>
                                    <Button type='primary' onClick={() => {this.handleSaveClick('goods/details/savegoods')}}>保存</Button>
                                    <Button type='primary' onClick={() => {this.handleSaveClick('goods/details/auditapply')}}>保存并提交审核</Button>
                                </Options>
                            </ChannelView>
                        </Container>
                        <Drawer
                            width={600}
                            placement='right'
                            closable={false}
                            visible={visible}
                            onClose={this.hideDrawer}
                        >
                            <Table
                                bordered
                                style={{marginBottom: 53}}
                                pagination={false}
                                columns={this.columns} 
                                dataSource={logSource} 
                            />
                            <DrawerOption>
                                <Button onClick={this.hideDrawer} type='primary'>关闭</Button>
                            </DrawerOption>
                        </Drawer>
                    </Wrap>
                </div>
                {/**********查看图片**************/}
                <Modal
                    bodyStyle={{padding: 0}}
                    title='查看图片'
                    footer={null}
                    visible={sysVisible}
                    onCancel={() => {this.setState({sysVisible: false})}}
                >
                    <img style={{width: '100%', height: '100%'}} src={sysImgPath} />
                </Modal>
                <BackTop visibilityHeight={1000} style={{right: 30}} />
            </Fragment>
        );
    }
}

export default connect(null, null)(ApplyAudit);