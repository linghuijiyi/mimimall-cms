import styled from 'styled-components';

export const Warp = styled.div `
    .ant-advanced-search-form {
        background: #fff;
        border-bottom: 1px solid #ccc;
    }
    .ant-advanced-search-form .ant-form-item {
        display: flex;
        label {
            display: block;
            font-size: 16px;
            width:120px;
            text-align: right;
        }
    }
    .ant-advanced-search-form .ant-form-item-control-wrapper {
        flex: 1;
    }
`;

export const  OperationWarp = styled.div `
    margin-top: 25px;
    margin-bottom: 25px;
    display: flex;
    button {
        margin-right: 20px;
        width: 150px;
        height: 40px;
    }
`;

export const UsercouponDetail = styled.div `
    padding: 0 20px;
    p {
        margin: 20px 0;
        font-size: 16px;
        span:nth-child(1) {
            display: inline-block;
            width: 130px;
            text-align: right;
            margin-right: 10px;
        }
    }
`;