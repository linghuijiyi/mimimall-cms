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
    .ant-select-tree-dropdown {
        top: 40px!important;
        height: 500px;
    }
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
        padding: 10px 10px;
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

export const Options = styled.div `
    display: flex;
    button {
        flex: 1;
        margin: 0 2px;
    }
`;

export const Name = styled.p `
    width: 70px;
    text-align: right;
`;

export const SynchroView = styled.div `
    display: flex;
`;

export const Text = styled.span `
    width: 60px;
    text-align: right;
    margin-right: 15px;
`;

export const View = styled.div `
    flex: 1;
`;