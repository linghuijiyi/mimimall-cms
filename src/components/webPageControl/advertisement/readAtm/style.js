import styled from 'styled-components';

export const Warp = styled.div `
    width: 600px;
    margin-left: 20px;
`;

export const Container = styled.div `
    width: 600px;
    display: flex;
    margin-top: 20px;
`;

export const Left = styled.div `
    width: 15%;
    text-align: right;
    margin-right: 5px;
`;

export const Right = styled.div `
    flex: 1;
`;

export const Item = styled.div `
    height: 32px;
    line-height: 32px;
    margin-bottom: 20px;
`;

export const ImgWarp = styled.div `
    height: 300px;
    img {
        display: block;
        width: 100%;
    }
`;