import styled from 'styled-components';

export const Container = styled.div `
    background: #fff;
    background-size: cover;
    min-height: 100vh;
    padding-top: 150px;
    background-position: center center;
`;

export const UpdateWarp = styled.div `
    width: 1000px;
    height: 300px;
    margin: 0 auto;
`;

export const Title = styled.h1 `
    padding-left: 10%;
    font-size: 25px;
    line-height: 50px;
`;

export const Item = styled.div `
    display: flex;
    height: 40px;
    line-height: 40px;
    margin-bottom: 35px;

`;

export const ItemText = styled.div `
    width: 10%;
    text-align: right;
    color: red;
    margin-right: 5px;
`;

export const ItemInput = styled.div `
    width: 500px;
`;

export const Warning = styled.div `
    flex: 1;
    margin-left: 8px;
`;

export const Sublime = styled.div `
    margin-left: 10%;
    button {
        width: 150px;
    }
`;