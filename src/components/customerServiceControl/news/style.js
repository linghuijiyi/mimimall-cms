import styled from 'styled-components';
export const Wrap = styled.div `
    input,select,option,textarea{   
        outline: none;
    }
    overflow-x: auto;
    p{
        margin-bottom:0;
    }
    .content {
        width: 1300px;
        margin: 0 auto;
        text-align: center;
        margin-top:10px;
        .chatBox {
            width: 100%;
            border: 1px #666666 solid;
            height: 100%;
            margin: 10px auto;
            position: relative;
            overflow:hidden;
        }
        .chatLeft {
            width: 250px;
            height: auto;
            float: left;
            .chat03_title{
                background-color: #EEE;
                position: relative;
                padding-bottom:20px;
                .chat03_listtitle{
                    height:30px;
                    text-align:center;
                    line-height:30px;
                }
                .select_option{
                    height:30px;
                    width:200px;
                }
                input{
                    width:200px;
                    height:30px;
                }
                .marginB10{
                    margin-bottom:4px;
                }
            }
            .chat03_content{
                text-align: left;
                font-size: 12px;
                color: #333;
                padding: 2px 0px;
                overflow-y: auto;
                width: 250px;
                height: 384px;
                background:#fff;
                li{
                    height:24px;
                    line-height:24px;
                    padding:0 30px;
                    cursor:pointer;
                    .chat_name{
                        display:inline-block;
                        width:50px;
                    }
                }
            }
        }
        .chatCenter {
            border-left: 1px #bebebe solid;
            border-right: 1px #bebebe solid;
            width: 650px;
            height: 100%;
            float: left;
            .chatList{
                height:430px;
                .chatList_title{
                    background-color: #EEEEEE;
                    height: 30px;
                    position: relative;
                    line-height:30px;
                }
                .chatList_content{
                    background-color: #fff;
                    height: 400px;
                    overflow-y: auto;
                    overflow: scroll;
                    resize: vertical;
                    .lookMore{
                        color:#4376a6;
                        cursor:pointer;
                    }
                    div{
                        height:42px;
                    }
                    li{
                        padding:0 10px;
                        width:100%;
                        display:block;
                    }
                    .customer_left{
                        float:left;
                        .customer_word{
                            text-align:left;
                            width:auto;
                            max-width:70%;
                            float:left;
                            color:#333;
                            font-size:15px;
                            line-height:26px;
                        }
                        .customer_name{
                            float:left;
                            text-align:left;
                            color:#CCC;
                            font-size:12px;
                            line-height:16px;
                            width:100%;
                        }
                    }
                    .customer_right{
                        float:right;
                        .customer_word{
                            text-align:left;
                            width:auto;
                            max-width:70%;
                            float:right;
                            color:#333;
                            font-size:15px;
                            line-height:26px;
                        }
                        .customer_name{
                            text-align:right;
                            float:right;
                            color:#CCC;
                            font-size:12px;
                            line-height:16px;
                            width:100%;
                        }
                    }
                }
            }
            .chatSend{
                height:156px;
                .chatSend_title{
                    background-color: #EEEEEE;
                    height: 20px;
                }
                .chatSend_content{
                    height: 116px;
                    background:#fff;
                    .ant-input{
                        outline:none !important;
                        height:100%;
                        border-radius:0;
                        border:medium none;
                        overflow-y:auto;
                    }
                }
                .chatSend_bar{
                    height: 34px;
                    position: relative;
                    background:#e3e3e3;
                    button{
                        position:absolute;
                        right:20px;
                        height:28px;
                        top:3px;
                        width:100px;
                        text-align:center;
                        background:#4376a6;
                        color:#fff;
                    }
                }
            }
        }
        .chatRight{
            width: 398px;
            height: 100%;
            float: left;
            .usertitle{
                text-align:left;
                height:30px;
                line-height:30px;
                padding:0 12px;
            }
            .userInfo{
                height:180px;
                width:100%;
                background:#fff;
                .avtar{
                    float:left;
                    margin-top:10px;
                    height: 170px;
                    width: 140px;
                    text-align:center;
                    img{
                        border: solid #dce1e6;
                        width: 120px;
                        height: 160px;
                    }
                }
                .detail{
                    margin-left: 10px;
                    width: 240px;
                    height: 160px;
                    float: left;
                    display: inline-block;
                    text-align:left;
                    button{
                        width:180px;
                        text-align:center;
                        height:30px;
                        line-height:30px;
                        margin-top:10px;
                    }
                }
                li{
                    height:40px;
                    line-height:40px;
                }
            }
            .quickReply{
                height:390px;
                overflow-y:auto;
                width:100%;
                ul{
                    li{
                        padding:0 12px;
                        margin-bottom:4px;
                        p{
                            text-align:left;
                            cursor:pointer;
                            font-size:14px;
                        }
                    }
                }
            }
        }
    }
`;
