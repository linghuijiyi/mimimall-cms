import styled from 'styled-components';
export const Wrap = styled.div `
    width:96%;
    height:'500px';
    margin-left:2%;
    margin-top:12px;
    p{
        margin-bottom:0;
    }
    .tabWrap{
        .ant-tabs-nav-wrap{
            background:#fff;
            border:1px solid #e4e4e4;
            height:50px;
            padding-left:12px;
            margin-bottom: 0 !important;
            .ant-tabs-ink-bar{
                display:none !important;
            }
            .ant-tabs-tab{
                border:1px solid #e4e4e4;
                width:90px;
                height:32px;
                margin-top:9px;
                text-align:center;
                padding:0;
                line-height:32px;
                background:#fff;
                color:#333;
            }
            .ant-tabs-tab-active{
                background:#40a9ff;
                color:#fff;
            }
        }
        .user_detail_title{
            font-size:16px;
            height:30px;
            line-height:30px;
            margin-bottom:10px;
            text-align:left;
        }
        table{
            background:#fff;
        }
        .user_detail_content{
            border: 1px solid #e4e4e4;
            width:1100px;
            background:#fff;
            overflow:hidden;
            margin-bottom:16px;
            li{
                width:50%;
                display: inline-block;
                float:left;
                border-bottom:1px solid #e4e4e4;
                height:50px;
                overflow:hidden;
                span{
                    display: inline-block;
                    width:120px;
                    text-align:center;
                    height:49px;
                    line-height:49px;
                    border-right:1px solid #e4e4e4;
                    background:#f9fafc;
                    float:left;
                }
                p{
                    display: inline-block;
                    width:428px;
                    height:50px;
                    line-height:50px;
                    padding:0 12px;
                    float:left;
                }
            }
            li:nth-child(odd){
                border-right:1px solid #e4e4e4;
            }
            li:last-child{
                border-bottom:none;
            }
            li:nth-child(7){
                border-bottom:none;
            }
        }
    }
`;
export const Options = styled.div `
    button {
        margin: 0 10px;
    }
`;
