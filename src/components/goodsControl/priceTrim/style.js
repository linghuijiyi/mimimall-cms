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

export const Options = styled.div `
    display: flex;
    button {
        margin: 0 10px;
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