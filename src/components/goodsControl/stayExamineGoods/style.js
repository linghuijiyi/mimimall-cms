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
    button {
        margin-right: 20px;
        width: 150px;
        height: 40px;
    }
`;