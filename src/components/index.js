import React, { Lazy } from 'react';
import { asyncComponent } from './asyncComponent';
// const App = asyncComponent(() => import('./../App'));
import App from './../App';
// const Login = asyncComponent(() => import('./../base/login'));
import Login from './../base/login';
// const Home = asyncComponent(() => import('./../base/home'));
import Home from './../base/home';
// const Hello = asyncComponent(() => import('./../base/hello'));
import Hello from './../base/hello';
// const Container = asyncComponent(() => import('./../container'));
import Container from './../container';
// 修改密码
// const UpdatePassword = asyncComponent(() => import('./../base/updatePassword'));
import UpdatePassword from './../base/updatePassword';
// 未上架商品
// const NothingSellGoods = asyncComponent(() => import('./goodsControl/nothingSellGoods'));
import NothingSellGoods from './goodsControl/nothingSellGoods';
// 查看未上架商品
// const LookGoods = asyncComponent(() => import('./goodsControl/lookGoods'));
import LookGoods from './goodsControl/lookGoods';
// 申请审核
// const ApplyAudit = asyncComponent(() => import('./goodsControl/nothingSellGoods/applyAudit'));
import ApplyAudit from './goodsControl/nothingSellGoods/applyAudit';
// 待审核商品
// const StayExamineGoods = asyncComponent(() => import('./goodsControl/stayExamineGoods'));
import StayExamineGoods from './goodsControl/stayExamineGoods';
// 审核商品
// const StayExamineGoodsApplyAudit = asyncComponent(() => import('./goodsControl/stayExamineGoods/applyAudit'));
import StayExamineGoodsApplyAudit from './goodsControl/stayExamineGoods/applyAudit';
// 已上架商品
// const AlreadySellGoods = asyncComponent(() => import('./goodsControl/alreadySellGoods'));
import AlreadySellGoods from './goodsControl/alreadySellGoods';
// 下架商品
// const Offshelf = asyncComponent(() => import('./goodsControl/alreadySellGoods/offshelf'));
import Offshelf from './goodsControl/alreadySellGoods/offshelf';
// 已下架商品
// const StopGoods = asyncComponent(() => import('./goodsControl/stopGoods'));
import StopGoods from './goodsControl/stopGoods';
// 上架商品
// const Onshelf = asyncComponent(() => import('./goodsControl/stopGoods/onshelf'));
import Onshelf from './goodsControl/stopGoods/onshelf';
// 商品价格调整
// const PriceTrim = asyncComponent(() => import('./goodsControl/priceTrim'));
import PriceTrim from './goodsControl/priceTrim';
// 商品分期
import Stages from './goodsControl/stages';
import CreateStages from './goodsControl/stages/createStages';
import ReadStages from './goodsControl/stages/readStages';
import UpdateStages from './goodsControl/stages/updateStages';
// 商品积分
import Integral from './goodsControl/integral';
import CreateIntegral from './goodsControl/integral/createIntegral';
import ReadIntegral from './goodsControl/integral/readIntegral';
import UpdateIntegral from './goodsControl/integral/updateIntegral';
// 订单列表
// const OrderList = asyncComponent(() => import('./orderControl/orderList'));
import OrderList from './orderControl/orderList';
// 商品详情
// const GoodsInfo = asyncComponent(() => import('./orderControl/goodsInfo'));
import GoodsInfo from './orderControl/goodsInfo';
// 用户列表
// const UserList = asyncComponent(() => import('./customerServiceControl/userList'));
import UserList from './customerServiceControl/userList';
// 售后服务列表
import AsService from './orderControl/asService';
// 消息中心
// const News = asyncComponent(() => import('./customerServiceControl/news'));
import News from './customerServiceControl/news';
// 用户详情
// const UserDetail = asyncComponent(() => import('./customerServiceControl/userDetail'));
import UserDetail from './customerServiceControl/userDetail';
// 快速回复中心
// const Reply = asyncComponent(() => import('./customerServiceControl/reply'));
import Reply from './customerServiceControl/reply';
// 每日数据总表
// const DailyDataTable = asyncComponent(() => import('./financeControl/dailyDataTable'));
import DailyDataTable from './financeControl/dailyDataTable';
// 单据查询
// const BillQuery = asyncComponent(() => import('./financeControl/billQuery'));
import BillQuery from './financeControl/billQuery';
// 退款列表
import RefundList from './financeControl/refundList'
// 渠道总表
// const ChannelTable = asyncComponent(() => import('./operateControl/channelTable'));
import ChannelTable from './operateControl/channelTable';
// 渠道维护
// const ChannelMaintain = asyncComponent(() => import('./operateControl/channelMaintain'));
import ChannelMaintain from './operateControl/channelMaintain';
// 活动短信推送
// const MessagePush = asyncComponent(() => import('./operateControl/messagePush'));
import MessagePush from './operateControl/messagePush';
// 查看活动
// const Activity = asyncComponent(() => import('./operateControl/messagePush/activity'));
import Activity from './operateControl/messagePush/activity';
// 广告位列表
// const Advertisement = asyncComponent(() => import('./webPageControl/advertisement'));
import Advertisement from './webPageControl/advertisement';
// 优惠券管理
import CouponRule from './operateControl/couponRule';
import CreateCoupon from './operateControl/couponRule/createCoupon';
import ReadCoupon from './operateControl/couponRule/readCoupon';
import UpdateCoupon from './operateControl/couponRule/updateCoupon';
import CouponList from './operateControl/couponList';
// 创建广告
// const CreateAtm = asyncComponent(() => import('./webPageControl/advertisement/createAtm'));
import CreateAtm from './webPageControl/advertisement/createAtm';
// 更新广告
// const UpdateAtm = asyncComponent(() => import('./webPageControl/advertisement/updateAtm'));
import UpdateAtm from './webPageControl/advertisement/updateAtm';
// 查看广告
// const ReadAtm = asyncComponent(() => import('./webPageControl/advertisement/readAtm'));
import ReadAtm from './webPageControl/advertisement/readAtm';
// 广告位管理
// const AtmControl = asyncComponent(() => import('./webPageControl/advertisement/atmControl'));
import AtmControl from './webPageControl/advertisement/atmControl';
// 公告管理
// const Notice = asyncComponent(() => import('./webPageControl/notice'));
import Notice from './webPageControl/notice';
// 创建公告
// const CreateEdit = asyncComponent(() => import('./webPageControl/notice/createEdit'));
import CreateEdit from './webPageControl/notice/createEdit';
// 文章公告
// const NoticeEdit = asyncComponent(() => import('./webPageControl/notice/edit'));
import NoticeEdit from './webPageControl/notice/edit';
// 后台角色管理
// const BackstageCharacterControl = asyncComponent(() => import('./systemControl/backstageCharacterControl'));
import BackstageCharacterControl from './systemControl/backstageCharacterControl';
// 后台帐号管理
// const BackstageAccountsControl = asyncComponent(() => import('./systemControl/backstageAccountsControl'));
import BackstageAccountsControl from './systemControl/backstageAccountsControl';
// 白名单管理
// const WhiteListControl = asyncComponent(() => import('./systemControl/whiteListControl'));
import WhiteListControl from './systemControl/whiteListControl';
// 登录日志查看
// const LoginLogSee = asyncComponent(() => import('./systemControl/loginLogSee'));
import LoginLogSee from './systemControl/loginLogSee';
// 菜单管理
// const MenuControl = asyncComponent(() => import('./systemControl/menuControl'));
import MenuControl from './systemControl/menuControl';
// 底部标签管理
// const BottomTag = asyncComponent(() => import('./systemControl/bottomTag'));
import BottomTag from './systemControl/bottomTag';
// 渠道信息变更提醒管理
// const ChangeRemind = asyncComponent(() => import('./systemControl/changeRemind'));
import ChangeRemind from './systemControl/changeRemind';
// 渠道信息变更提醒管理-编辑
// const RemindEdit = asyncComponent(() => import('./systemControl/changeRemind/remindEdit'));
import RemindEdit from './systemControl/changeRemind/remindEdit';
// 渠道信息变更提醒管理-查看
// const RemindLook = asyncComponent(() => import('./systemControl/changeRemind/remindLook'));
import RemindLook from './systemControl/changeRemind/remindLook';
import InformationTemplate from './systemControl/informationTemplate';
import SensitiveTerms from './systemControl/sensitiveTerms';
import Version from './systemControl/version';
export default {
    App,
    Login,
    Home,
    Hello,
    Container,
    GoodsInfo,
    UpdatePassword,
    NothingSellGoods,
    LookGoods,
    ApplyAudit,
    StayExamineGoods,
    CreateAtm,
    UpdateAtm,
    ReadAtm,
    AtmControl,
    CreateEdit,
    NoticeEdit,
    AlreadySellGoods,
    Offshelf,
    Onshelf,
    StopGoods,
    Stages,
    CreateStages,
    ReadStages,
    UpdateStages,
    Integral,
    CreateIntegral,
    ReadIntegral,
    UpdateIntegral,
    PriceTrim,
    OrderList,
    UserList,
    AsService,
    News,
    UserDetail,
    Reply,
    DailyDataTable,
    BillQuery,
    RefundList,
    ChannelTable,
    ChannelMaintain,
    StayExamineGoodsApplyAudit,
    MessagePush,
    Activity,
    CouponRule,
    CreateCoupon,
    UpdateCoupon,
    ReadCoupon,
    CouponList,
    Advertisement,
    Notice,
    BackstageCharacterControl,
    BackstageAccountsControl,
    WhiteListControl,
    LoginLogSee,
    MenuControl,
    ChangeRemind,
    RemindEdit,
    RemindLook,
    BottomTag,
    InformationTemplate,
    SensitiveTerms,
    Version
}