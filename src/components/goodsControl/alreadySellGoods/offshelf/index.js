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
} from './style';
import { Button, Cascader, InputNumber, Drawer, Icon, Input, message, Modal, Radio, BackTop, Table } from 'antd';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../../base/home/store';
import { connect } from 'react-redux';
import history from './../../../../history';
import baseURL from './../../../../common/js/baseURL';
import fatch from './../../../../common/js/fatch';
import formatDateTime from './../../../../common/js/formatDateTime';
import getTypeList from './../../../../common/js/getTypeList';
import { ERR_CODE } from './../../../../common/js/regExp';
const { TextArea } = Input;
const RadioGroup = Radio.Group; 
let goodsValue = [];
class Offshelf extends Component {
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
            goods: '',
            jdGoods: '',
            isShwo: false,
            pageHome: true,
            noGoods: true,
            value: 1,
            visible: false,
            sysVisible: false,
            sysImgPath: '',
            offshelfLoading: false,
            logSource: [],
            searchText: '',
            // 分期管理
            instalments: null,
            downPayment: 0
        }
    }
    componentWillMount() {
        getTypeList().then((jdOptions) => (this.setState({ jdOptions })));
        let data = this.props.location.state;
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '以上架商品', '下架商品']));
        if (data !== undefined) {
            const sku = data.record.sysSku;
            if (sku) {
                this.handleFormatTypeValue([data.record.categoryObj]);
                this.getGoodsDetail(sku);
            } else {
                this.setState({pageHome: false});
                this.showAndHideLoading(false);
            }
        } else {
            this.setState({pageHome: false});
            this.showAndHideLoading(false);
        }
    }
    componentWillUnmount() {
         goodsValue = [];
    }
    getGoodsDetail = (sku) => {
        this.showAndHideLoading(true);
        const url = `${baseURL}goods/details/info`;
        fatch(url, 'post', { sku }, (err, state) => {
            message.info(err);
            this.setState({noGoods: state});
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === ERR_CODE) {
                const goods = res.data.goods;
                const jdGoods = res.data.jdGoods;
                const instalments = res.data.instalment;
                this.setState({
                    instalments,
                    goods,
                    jdGoods,
                    isShwo: true
                });
                this.showAndHideLoading(false);
            } else {
                this.setState({noGoods: false});
                this.showAndHideLoading(false);
            }
        });
    }
    /******************************格式化分类数据*************************************/ 
    handleFormatTypeValue = (data) => {
        return data.map((item) => {
            goodsValue.push(item.name);
            if (item.thirdCategoryList !== null && item.thirdCategoryList !== undefined) this.handleFormatTypeValue(item.thirdCategoryList);
        });
    }
    /********************************渲染图片******************************************/ 
    renderImgList = (data) => {
        return data.map((item, index) => {
            const imgUrl = 'http://img13.360buyimg.com/n0/';
            let path = '';
            path = item.imageSource === 0 ? item.imgUrl : `${imgUrl}${item.imgUrl}`
            return (
                <li key={index} className='li'>
                    <div className='container'>
                        <img src={path} />
                        <div className='iconWrap'>
                            <JdImg>
                                <Icon type='eye' onClick={() => {this.handleSysClick(path)}}/>
                            </JdImg>
                        </div>
                    </div>
                </li>
            )
        });
    }
    showDrawer = () => {
        const url = `${baseURL}goodsoperatrion/log/list`;
        const sysSku = this.props.location.state.record.sysSku;
        fatch(url, 'post', { sysSku }, (err, state) => {
            message.info(err);
        }).then((res) => {
            if (res.code === '0') {
                const result = res.data.logs;
                if (result !== null) {
                    if (result.length > 0) {
                        result.map((item, index) => (item.key = index));
                    }
                    this.setState({
                        logSource: result,
                        visible: true
                    });
                }
            } else {
                message.info(res.msg);
            }
        });
    }
    hideDrawer = () => {
        this.setState({visible: false});
    }
    handleBackClick = () => history.push({pathname: this.props.location.state.paterPath, query: this.props.location.state});
    // 查看图片
    handleSysClick = (sysImgPath) => {
        this.setState({
            sysVisible: true,
            sysImgPath: sysImgPath
        });
    }
    offshelfGoods = (syssku) => {
        this.setState({offshelfLoading: true});
        this.showAndHideLoading(true);
        const url = `${baseURL}goods/details/offshelf`;
        fatch(url, 'post', { syssku }, (err, state) => {
            message.info(err);
            this.showAndHideLoading(state);
            this.setState({offshelfLoading: state});
        }).then((res) => {
            if (res.code === ERR_CODE) {
                this.showAndHideLoading(false);
                this.setState({offshelfLoading: false});
                message.info(res.msg);
                setTimeout(() => {
                    this.handleBackClick();
                }, 1500);
            } else {
                this.showAndHideLoading(false);
                this.setState({offshelfLoading: false});
                message.info(res.msg);
            }
        });
    }
    /********************************渲染分期数据*********************************/
    renderInstalment = (data) => {
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
                            value={data.downPayment}
                            disabled
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
                                    <div style={{padding: '10px 10px'}}>
                                        <span>期数：</span>
                                        <Input
                                            placeholder='请输入期数'
                                            value={item.terms}
                                            disabled
                                            style={{width: 130}}
                                        />
                                        &nbsp;&nbsp;
                                        <span>利率：</span>
                                        <InputNumber
                                            placeholder='请输入利率'
                                            style={{width: 130}}
                                            disabled
                                            value={item.rate}
                                            min={0}
                                        />
                                        &nbsp;&nbsp;
                                        <span>每期应还款：</span>
                                        <InputNumber
                                            placeholder='请输入利率'
                                            style={{width: 130}}
                                            disabled
                                            value={item.pay4EachTerm}
                                            min={0}
                                        />
                                        元
                                        <div></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </View>
            )
        }
    }
    /*****************************************loading*********************************/
    showAndHideLoading = (state) => {
        this.props.dispatch(HomeActionCreators.changeLoading(state));
    }
    render() {
        const { 
            pageHome, 
            noGoods, 
            isShwo, 
            visible, 
            sysVisible, 
            sysImgPath, 
            goods, 
            jdGoods, 
            jdOptions,
            offshelfLoading,
            logSource,
            credit,
            instalments
        } = this.state;
        let renderJdImg = null;
        let renderImg = null;
        let renderInstalment = null;
        if (jdGoods.images !== undefined) renderJdImg = this.renderImgList(jdGoods.images);
        if (goods.images !== undefined) renderImg = this.renderImgList(goods.images);
        renderInstalment = this.renderInstalment(instalments);
        const radioStyle = {
            display: 'block',
            width: '130px',
            height: '30px',
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
                <div  style={{display: isShwo ? 'block' : 'none'}}>
                    <Button 
                        type='primary'
                        style={{margin: '20px 0 0 15px'}}
                        onClick={this.handleBackClick}
                    >
                        <Icon type='rollback' />
                        返回
                    </Button>
                    <Wrap>
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
                                    <View>{jdGoods.name}</View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem style={{alignItems: 'center'}}>
                                    <Text>所属分类:</Text>
                                    <View>
                                        <Cascader disabled value={goodsValue} options={jdOptions} />
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>商品图片:</Text>
                                    <ImgWarp>
                                        { renderJdImg }
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
                                    <View>
                                        <Spec>
                                            <li dangerouslySetInnerHTML={{__html: jdGoods.introduction}}></li>
                                        </Spec>
                                    </View>
                                </ChannelItem>

                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>商品规格:</Text>
                                    <View>
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
                                    <View>{goods.name}</View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem style={{alignItems: 'center'}}>
                                    <Text>所属分类:</Text>
                                    <View>
                                        <Cascader disabled value={goodsValue} options={jdOptions} />
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>商品图片:</Text>
                                    <View>
                                        <ImgWarp>
                                            { renderImg }
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
                                                {goods.sysSku}
                                                &nbsp;&nbsp;&nbsp;
                                                <span>*售价:&nbsp;</span><InputNumber disabled value={goods.price} />元
                                                &nbsp;&nbsp;&nbsp;
                                                <span>*原价:&nbsp;</span><InputNumber disabled value={goods.originalPrice === null ? 0 : goods.originalPrice} />元
                                                &nbsp;&nbsp;&nbsp;
                                                <span>*最低售价:&nbsp;</span><InputNumber disabled value={goods.minPrice === null ? 0 : goods.minPrice} />元
                                                &nbsp;&nbsp;&nbsp;
                                                <span>积分:&nbsp;</span>
                                                <InputNumber style={{width: 100}} disabled value={goods.credit === null ? 0 : goods.credit} min={0} />
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
                                    <View>
                                        <Spec>
                                            <li dangerouslySetInnerHTML={{__html: goods.introduction}}></li>
                                        </Spec>
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem>
                                    <Text>商品规格:</Text>
                                    <View>
                                        <ListView>
                                            <li dangerouslySetInnerHTML={{__html: goods.param}}></li>
                                        </ListView>
                                    </View>
                                </ChannelItem>
                            </ChannelView>
                            <ChannelView>
                                <ChannelItem style={{marginBottom: 20}}>
                                    <Text style={{width: 65, textAlign: 'right'}}>商品状态:</Text>
                                    <View>
                                        {goods.sysState === 1 || goods.sysState === 2 || goods.sysState === 4 ? '未上架' : goods.sysState === 3 ?  '已上架' : '已下架'}
                                    </View>
                                </ChannelItem>
                                <ChannelItem style={{marginBottom: 20}}>
                                    <Text style={{width: 65, textAlign: 'right'}}>审核状态:</Text>
                                    <View>
                                        {goods.sysState === 1 ? '未审核' : goods.sysState === 2 ? '审核中' : goods.sysState === 4 ? '审核失败' : '审核成功'}
                                    </View>
                                </ChannelItem>
                                <Options>
                                    <Button type='primary' onClick={this.showDrawer}>查看操作日志</Button>
                                    <Button type='primary' onClick={this.handleBackClick}>取消</Button>
                                    <Button type='primary' loading={offshelfLoading} onClick={() => {this.offshelfGoods(this.props.location.state.record.sysSku)}}>下架</Button>
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
                        {/**********查看图片**************/}
                        <Modal
                            bodyStyle={{padding: 0, height: 350}}
                            title='查看图片'
                            footer={null}
                            visible={sysVisible}
                            onCancel={() => {this.setState({sysVisible: false})}}
                        >
                            <img style={{width: '100%', height: '100%'}} src={sysImgPath} />
                        </Modal>
                    </Wrap>
                </div>
                <BackTop visibilityHeight={1000} style={{right: 30}} />
            </Fragment>
        );
    }
}

export default connect(null, null)(Offshelf);