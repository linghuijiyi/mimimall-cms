import styled from 'styled-components';

export const Warp = styled.div `
    padding: 0 15px;
    .red {
        color: red;
    }
`;

export const QueryListWarp = styled.div `
    margin-bottom: 20px;
    padding: 15px 15px;
    margin-left:  -15px;
    margin-right: -15px;
    border-bottom: 1px solid #CCCCCC;
    display: flex;
`;


export const QueryListItem = styled.div `
    height: 50px;
    line-height: 50px;
    display: flex;
    span {
        color: skyblue;
        margin-right: 5px;
    }
`;

export const Search = styled.div `
    width: 100px;
    line-height: 50px;
    button {
        width: 100%;
        height: 30px;
    }
`;


export const Operation = styled.div `
    display: flex;
`;

export const Item = styled.span `
    width: 100%;
    height: 35px;
    line-height: 35px;
    button {
        width: 100%;
        height: 100%;
        font-size: 14px;
    }
`;

export const CreateItem = styled.div `
    display: flex;
    margin-bottom: 15px;
    line-height: 32px;
    input {
        flex: 1;
    }
`;

export const Name = styled.div `
    width: 70px;
    text-align: right;
`;

export const DataItem = styled.div `
    display: flex;
`;

export const Left = styled.div `
    margin-right: 5px;
    div {
        line-height: 35px;
        margin: 8px 0;
    }
`;

export const Right = styled.div `
    flex: 1;
    div {
        line-height: 35px;
        margin: 5px 0;
    }
`;