export default [
    {
        key: '/home',
        component: 'Hello'
    },
    {
        key: '/goodsControl/nothingSellGoods',
        component: 'NothingSellGoods',
        exact: true
    },
    {
        key: '/goodsControl/lookGoods',
        component: 'LookGoods',
        exact: true
    },
    {
        key: '/goodsControl/nothingSellGoods/applyAudit',
        component: 'ApplyAudit',
        exact: false
    },
    {
        key: '/goodsControl/stayExamineGoods',
        component: 'StayExamineGoods',
        exact: true
    },
    {
        key: '/goodsControl/stayExamineGoods/applyAudit',
        component: 'StayExamineGoodsApplyAudit',
        exact: false
    },
    {
        key: '/goodsControl/alreadySellGoods',
        component: 'AlreadySellGoods',
        exact: true
    },
    {
        key: '/goodsControl/alreadySellGoods/offshelf',
        component: 'Offshelf',
        exact: false
    },
    {
        key: '/goodsControl/stopGoods',
        component: 'StopGoods',
        exact: true
    },
    {
        key: '/goodsControl/stopGoods/onshelf',
        component: 'Onshelf',
        exact: false
    },
    {
        key: '/goodsControl/priceTrim',
        component: 'PriceTrim',
        exact: true
    },
    {
        key: '/goodsControl/stages',
        component: 'Stages',
        exact: true 
    },
    {
        key: '/goodsControl/integral',
        component: 'Integral',
        exact: true 
    },
    {
        key: '/goodsControl/integral/createIntegral',
        component: 'CreateIntegral',
        exact: true 
    },
    {
        key: '/goodsControl/integral/readIntegral',
        component: 'ReadIntegral',
        exact: true 
    },
    {
        key: '/goodsControl/stages/createStages',
        component: 'CreateStages',
        exact: true
    },
    {
        key: '/goodsControl/stages/readStages', 
        component: 'ReadStages',
        exact: true
    },
    {
        key: '/goodsControl/stages/updateStages',
        component: 'UpdateStages',
        exact: true
    },
    {
        key: '/goodsControl/integral/updateIntegral',
        component: 'UpdateIntegral',
        exact: true 
    },
    {
        key: '/orderControl/orderList',
        component: 'OrderList',
        exact: true
    },
    {   
        key: '/orderControl/asService',
        component: 'AsService',
        exact: true
    },
    {
        key: '/operateControl/channelTable',
        component: 'ChannelTable',
        exact: true
    },
    {
        key: '/operateControl/channelMaintain',
        component: 'ChannelMaintain',
        exact: true
    },
    {
        key: '/operateControl/couponRule',
        component: 'CouponRule',
        exact: true
    },
    {
        key: '/operateControl/couponRule/createCoupon',
        component: 'CreateCoupon',
        exact: true
    },
    {
        key: '/operateControl/couponRule/readCoupon',
        component: 'ReadCoupon',
        exact: true
    },
    {
        key: '/operateControl/couponRule/updateCoupon',
        component: 'UpdateCoupon',
        exact: true
    },
    {
        key: '/operateControl/couponList',
        component: 'CouponList',
        exact: true
    },
    {
        key: '/operateControl/messagePush',
        component: 'MessagePush',
        exact: true
    },
    {
        key: '/operateControl/messagePush/activity',
        component: 'Activity',
        exact: false
    },
    {
        key: '/webPageControl/advertisement',
        component: 'Advertisement',
        exact: true
    },
    {
        key: '/webPageControl/advertisement/createAtm',
        component: 'CreateAtm',
        exact: false
    },
    {
        key: '/webPageControl/advertisement/updateAtm',
        component: 'UpdateAtm',
        exact: false
    },
    {
        key: '/webPageControl/advertisement/readAtm',
        component: 'ReadAtm',
        exact: false
    },
    {
        key: '/webPageControl/advertisement/atmControl',
        component: 'AtmControl',
        exact: false
    },
    {
        key: '/webPageControl/notice',
        component: 'Notice',
        exact: true
    },
    {
        key: '/webPageControl/notice/createEdit',
        component: 'CreateEdit',
        exact: false
    },
    {
        key: '/webPageControl/notice/edit',
        component: 'NoticeEdit',
        exact: false
    },
    {
        key: '/customerServiceControl/userList',
        component: 'UserList',
        exact: true
    },
    {
        key: '/customerServiceControl/news',
        component: 'News',
        exact: true
    },
    {
        key: '/customerServiceControl/userDetail',
        component: 'UserDetail',
        exact: true
    },
    {
        key: '/customerServiceControl/reply',
        component: 'Reply',
        exact: true
    },
    {
        key: '/financeControl/dailyDataTable',
        component: 'DailyDataTable',
        exact: true
    },
    {
        key: '/financeControl/billQuery',
        component: 'BillQuery',
        exact: true
    },
    {
        key: '/financeControl/refundList',
        component: 'RefundList',
        exact: true
    },
    {
        key: '/systemControl/backstageCharacterControl',
        component: 'BackstageCharacterControl',
        exact: true
    },
    {
        key: '/systemControl/backstageAccountsControl',
        component: 'BackstageAccountsControl',
        exact: true
    },
    {
        key: '/systemControl/whiteListControl',
        component: 'WhiteListControl',
        exact: true
    },
    {
        key: '/systemControl/loginLogSee',
        component: 'LoginLogSee',
        exact: true
    },
    {
        key: '/systemControl/sensitiveTerms',
        component: 'SensitiveTerms',
        exact: true
    },
    {
        key: '/systemControl/informationTemplate',
        component: 'InformationTemplate',
        exact: true
    },
    {
        key: '/systemControl/menuControl',
        component: 'MenuControl',
        exact: true
    },
    {
        key: '/systemControl/bottomTag',
        component: 'BottomTag',
        exact: true
    },
    {
        key: '/systemControl/changeRemind',
        component: 'ChangeRemind',
        exact: true
    },{
        key: '/systemControl/changeRemind/remindEdit',
        component: 'RemindEdit',
        exact: true
    },
    {
        key: '/systemControl/changeRemind/remindLook',
        component: 'RemindLook',
        exact: true
    },
    {
        key: '/systemControl/version',
        component: 'Version',
        exact: true
    },
    {
        key: '/orderControl/goodsInfo',
        component: 'GoodsInfo',
        exact: false
    }
]
