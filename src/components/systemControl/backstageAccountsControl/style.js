import styled from 'styled-components';

export const Warp = styled.div `
    padding: 0 15px;
    background: #fff;
    .red {
        color: red;
    }
`;

export const QueryListWarp = styled.div `
    padding: 15px 0;
    margin-bottom: 20px;
    margin-left:  -15px;
    margin-right: -15px;
    border-bottom: 1px solid #CCCCCC;
`;

export const CreateTime = styled.div `
`;

export const CreateTimeItem = styled.div `
    margin: 0 25px;
    height: 50px;
    line-height: 50px;
    span {
        color: skyblue;
        margin-right: 5px;
    }
    
`;

export const Search = styled.div `
    width: 300px;
    margin: 0 55px;
    button {
        width: 100%;
        height: 35px;
    }
`;

export const Operation = styled.div `
    display: flex;
`;

export const Item = styled.span `
    flex: 1;
`;

export const UpdateWarp = styled.div `

`;

export const UpdateItem = styled.div `
    height: 50px;
    line-height: 50px;
    display: flex;
    font-size: 18px;
    .name {
        width: 120px;
        margin-right: 5px;
        text-align: right;
        font-weight: bold;
    }
    .input {
        flex: 1;
    }
`;