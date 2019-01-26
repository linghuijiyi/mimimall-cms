import styled from 'styled-components';

export const Container = styled.div `
    .ant-table.ant-table-bordered .ant-table-title {
        text-align: center;
        background: #1890ff;
        color: #fff;
        font-size: 18px;
    }
    .ant-table.ant-table-bordered .ant-table-footer {
        text-align: right;
        background: #F57527;
        color: #fff;
    }
    .ant-list-bordered {
        border: 0;
    }
    .ant-card-body {
        padding: 0!important;
    }
    .ant-card-head {
        background: #1890ff;
        .ant-card-head-title {
            color: #fff;
            text-align: center;
        }
    }
    .ant-tabs-bar {
        margin: 0;
    }
    
`;

export const StepsContainer = styled.div `
    padding: 30px 0;
    .zent-step-head-inner {
        font-size: 40px;
        line-height: 40px;
    }
    .zent-step-head-inner .zent-icon {
        width: 40px;
        height: 40px;
        line-height: 40px;
    }
    .zent-steps-tail {
        top: 20px;
    }
    .zent-steps-step .zent-step-head {
        margin-left: 35px;
    }
`;

export const GoodsImg = styled.div `
    position: relative;
    .img {
        width: 100%;
    }
    .cneg:hover {
        transition-duration: .5s;
        opacity: 1;
        transition: all .5s;
    }
    .cneg {
        position: absolute;
        width: 100%;
        height: 90px;
        line-height: 90px;
        background: rgba(0, 0, 0, .5);
        left: 0;
        top: 0;
        opacity: 0;
        transition: all .5s;
        .eye {
            color: #fff;
            font-size: 18px;
            cursor: pointer;
        }
    }
`;

export const AfterSale = styled.div `
    padding: 0 0 55px 0;
    .ant-collapse-content > .ant-collapse-content-box {
        padding: 0;
    }
    .close {
        position: absolute;
        background: #fff;
        z-index: 99;
        width: 100%;
        bottom: 0;
        left: 0;
        button {
            display: block;
            width: 80%;
            margin: 0 auto;
        }
    }
    .goodsInfo {
        margin-bottom: 10px;
        background: #f5f5f5;
    }
    .goodsInfo:last-child {
        margin: 0;
    }
    .saleItem {
        padding: 0 10px;
        min-height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #ccc;
        display: flex;
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        .name {
            width: 150px;
            text-align-last: justify;
            margin-right: 5px;
        }
        .description {
            flex: 1;
            margin-left: 5px;
        }
        .fixedHeight {
            line-height: 1.8;
        }
        .goodsImg {
            padding: 10px 0;
            box-sizing: border-box;
            img {
                width: 90px;
                height: 90px;
                margin: 0 5px;
                border: 2px solid #ccc;
                padding: 5px;
                box-sizing: border-box;
            }
        }
    }
`;