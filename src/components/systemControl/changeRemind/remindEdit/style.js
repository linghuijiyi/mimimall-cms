import styled from 'styled-components';

export const Wrap = styled.div `
    width:1000px;
    padding-left:40px;
    padding-top:20px;
    p{
        margin-bottom:0;
    }
    .row{
        width:800px;
        padding:8px 0;
        display:flex;
        .redCode{
            color:red;
        }
        textarea{
            width:500px;
            resize:none;
        }
    }
    .rowTitle{
        width:140px;
        text-align:right;
        margin-right:12px;
    }
    .bigRow{
        width:900px;
        display:flex;
        margin-bottom:12px;
    }
`;
export const ImgWarp = styled.ul `
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    width:450px;
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
