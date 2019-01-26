import styled from 'styled-components';

export const View = styled.div `
    width:900px;
    min-height:50px;
    display:flex;
    &.bigRow {
        margin-bottom:5px;
    }
`;

export const ViewTitle = styled.span `
    width:400px;
    text-align:right;
    margin-right:12px;
`;

export const ViewImg = styled.ul `
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    &.li:hover .imgOptions {
        display: block;
    }
    .addDiv{
        .imgName{
            width:88px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            text-align:center;
        }
    }
    li {
        padding: 8px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        width:80px;
        height:80px;
        margin: 0 8px 8px 0;
        margin-bottom:0px;
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
        opacity: 0;
        cursor:pointer;
    }
`;