import styled from 'styled-components';

export const Wrap = styled.div `
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
`;

export const Container = styled.div `
    background: #fff;
    border: 1px solid #ccc;
    div:last-child {
        border: none;
    }
`;

export const ChannelHeader = styled.div `
    height: 50px;
    padding: 0 20px;
    align-items: center;
    background: #e6e6e6;
    display: flex;
    justify-content: space-between;
    span {
        font-size:16px;
    }
`;

export const ChannelView = styled.div `
    width: 100%;
    padding: 20px;
    border-bottom: 1px dotted #ccc;
`;

export const ChannelItem = styled.div `
    display: flex;
`;

export const Text = styled.div `
    width: 100px;
    margin-right: 8px;
`;

export const View = styled.div `
    flex: 1;
    .ant-cascader-picker {
        width: 100%;
    }
    img {
        width: 110px;
        height: 110px;
        margin: 0 8px 8px 0;
    }
`;

export const ImgWarp = styled.ul `
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    &.li:hover .imgOptions {
        display: block;
    }
    li {
        padding: 8px;
        border: 1px solid #d9d9d9;
        border-radius: 4px; 
        width:110px;
        height:110px;
        margin: 0 8px 8px 0;
        .container {
            width:100%;
            height:100%;
            position: relative;
            .iconWrap {
                width:100%;
                height:100%;
                background: rgba(0, 0, 0, .7);
                position:absolute;
                left: 0;
                bottom: 0;
                opacity: 0;
                transition: all .5s;
                .close {
                    position:absolute;
                    right:7px;
                    top:7px;
                    cursor:pointer;
                    color: rgba(255, 255, 255, 0.7);
                }
            }
            .iconWrap:hover {
                transition-duration: .5s;
                opacity: 1;
                transition: all .5s;
            }
            img {
                height: 100%;
                width: 100%;
            }
        }
    }
`;

export const StopImg = styled.div `
    width: 100%;
    height: 30px;
    position:absolute;
    left: 0;
    bottom: 0;
    i {
        width: 50%;
        text-align: center;
        font-size: 20px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.7);
    }
`;

export const JdImg = styled.div `
    position: absolute;
    width: 50px;
    height: 21px;
    transform: translate(-50%,-50%);
    left: 50%;
    top: 50%;
    font-size: 18px;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    i {
        cursor: pointer;
    }
`;

export const Upload = styled.li `
    border: 1px dashed #d9d9d9;
    height: 110px;
    position: relative;
    div {
        width:100%;
        height:100%;
        position:absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        top: 0;
        left: 0;
        i {
            font-size: 55px;
            color: #999;
        }
    }
    input {
        width:100%;
        height:100%;
        position:absolute;
        top: 0;
        left: 0;
        zIndex: 999999;
        opacity: 0
    }
`;

export const SkuView = styled.ul `
    margin: 0;
    li {
        span {
            color: red;
        }
        .ant-input-number {
            border: 1px solid #ccc;
            width: 80px;
        }
    }
`;

export const ListView = styled.ul `
    border: 1px solid #ccc;
    padding: 10px;
    overflow: hidden;
    li {
        width: 100%;
        overflow: hidden;
        div {
            width: 100%;
            overflow: hidden;
        }
        img {
            display: block;
            width: 100%;
            margin: 0 auto;
        }
    }
`;

export const ImgView = styled.div `
    img {
        display: block;
        width: 360px;
        height: 120px;
        margin: 0 auto;
    }
`;

export const Options = styled.div `
    button {
        margin-right: 20px;
        background: rgba(26, 188, 156, 1);
        border: 1px solid rgba(26, 188, 156, 1);
    }
`;

export const DrawerOption = styled.div `
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 4px 4px;
`;

export const Spec = styled.ul `
    border: 1px solid #ccc;
    padding: 10px;
    overflow: hidden;
    li {
        width: 100%;
        overflow: hidden;
        * {
            width: 100%!important;
            overflow: hidden;
        }
        div {
            width: 100%!important;
            overflow: hidden;
        }
        img {
            display: block;
            width: 100%;
            height: auto;
            margin: 0 auto;
        }
    }
`;