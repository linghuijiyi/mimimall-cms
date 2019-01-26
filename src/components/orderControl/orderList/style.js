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

export const QueryBox = styled.div `
    padding: 15px;
    margin: 0 -15px 20px -15px;
    border-bottom: 1px solid #CCCCCC;
`;

export const CreateItem = styled.div `
    display:flex;
    justify-content:flex-start;
    line-height: 40px;
`;


export const QueryItem = styled.div `
    height: 40px;
    line-height: 40px;
    margin-right:20px;
    margin-bottom: 10px;
    .btn {
        width: 300px;
        height: 40px;
        margin-left:20px;
    }
`;

export const QyeryTitle = styled.h3 `
    width:110px;
    text-align: right;
    font-size: 16px;
    font-weight: 700;
    color: skyblue;
    margin-right: 5px;
    float:left;
`;

export const Keyword = styled.div `
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    .input {
        width: 280px;
    }
`;

export const QueryButton = styled.div `
    width: 100%;
    height: 45px;
    margin-bottom: 25px;
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