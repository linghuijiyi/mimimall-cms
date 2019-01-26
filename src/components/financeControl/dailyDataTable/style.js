import styled from 'styled-components';

export const Warp = styled.div `
    padding: 0 15px;
`;

export const QueryListWarp = styled.div `
    padding: 15px 0;
    margin-bottom: 20px;
    margin-left:  -15px;
    margin-right: -15px;
    border-bottom: 1px solid #CCCCCC;
`;

export const QueryItem = styled.div `
    margin: 0 25px;
    height: 50px;
    line-height: 50px;
    .name {
        display: inline-block;
        color: skyblue;
        width: 70px;
        text-align: right;
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