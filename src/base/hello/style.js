import styled from 'styled-components';

export const InputCard = styled.div `
    display: flex;
    width: 150px;
    top: 110px;
    bottom: auto;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border-radius: 10px;
    border-width: 0;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
    position: fixed;
    right: 10px;
    flex: 1 1 auto;
    padding: 9px 15px;
    .input-item {
        position: relative;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -ms-flex-align: center;
        align-items: center;
        width: 100%;
        height: 36px;
    }
`;


export const PlaceSearch = styled.div `
    position: fixed;
    width: 300px;
    top: 0;
    left: 50%;
    margin-left: -150px;
`;

export const Panel = styled.div `
    position: fixed;
    width: 300px;
    right: 200px;
    top: 0;
`;