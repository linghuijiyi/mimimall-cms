import React, { Component } from 'react';
import { Input, Radio, Button, message, Icon } from 'antd';
import { Warp, EditItem, EditInfo, EditSubmit } from './style';
import { connect } from 'react-redux';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import fatch from './../../../../common/js/fatch';
import baseURL from './../../../../common/js/baseURL';
import history from './../../../../history';
import E from 'wangeditor';
const RadioGroup = Radio.Group;
let editor;
class NoticeEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: '',
            origin: '',
            content: '',
            articleType: '',
            id: '',
            buttonLoading: false
        }
    }
    componentDidMount() {
        this.props.handleChangeBreadcrumb(['前端页面管理', '公告管理', '编辑公告']);
        const state = this.props.location.state;
        if (state !== undefined) {
            const { title, author, origin, articleType, content, id } = state.record;
            this.setState({
                title,
                author,
                origin,
                articleType,
                content,
                id,
            });
            setTimeout(() => {
                editor = new E(this.refs.Article);
                editor.customConfig.onchange = html => this.setState({content: html});
                editor.customConfig.uploadImgShowBase64 = true;
                editor.customConfig.zIndex = 0;
                editor.customConfig.menus = [
                    'head',
                    'bold',
                    'fontName',
                    'italic',
                    'underline',
                    'strikeThrough',
                    'foreColor',
                    'backColor',
                    'link',
                    'list',
                    'justify',
                    'quote',
                    'image',
                    'table',
                    'video',
                    'code',
                    'undo',
                    'redo'
                ]
                editor.create();
                editor.txt.html(content);
            }, 20);
        }
    }
    handleSubmitClick = () => {
        const { title, author, content, origin, articleType, id } = this.state;
        if (title === '') {
            message.info('标题不能为空');
            return;
        }
        if (/\s+/g.test(title)) {
            message.info('标题不能包含空格');
            return;
        }
        if (author === '') {
            message.info('作者不能为空');
            return;
        }
        if (/\s+/g.test(author)) {
            message.info('作者不能包含空格');
            return;
        }
        if (editor.txt.html() === '<p><br></p>') {
            message.info('内容不能为空');
            return;
        }
        this.setState({buttonLoading: true});
        const url = `${baseURL}webPage/article/saveOrUpdate`;
        const params = {
            title,
            author,
            content,
            origin,
            articleType,
            id
        }
        fatch(url, 'post', params, (err, state) => {
            message.info(err);
            this.setState({buttonLoading: state});
        }).then((res) => {
            if (res.code === '0') {
                let state = this.props.location.state;
                state.page = 1;
                setTimeout(() => {
                    history.push({pathname: '/webPageControl/notice', query: state});
                }, 1000);
            } else {
                message.info(res.msg);
                this.setState({buttonLoading: false});
            }
        })
    }

    
    render() {
        const state = this.props.location.state;
        let content = '';
        if (state !== undefined) {
            content = state.record.content;
        } else {
            return <div>
                <Button 
                    type='primary' 
                    style={{margin: '10px 10px'}}
                    onClick={() => {history.push({pathname: '/webPageControl/notice'})}}
                >
                    <Icon type='rollback' />
                    返回
                </Button>
            </div>;
        }
        const { title, author, origin, articleType, buttonLoading } = this.state;
        return (
            <div>
                <Button 
                    type='primary' 
                    style={{margin: '10px 10px'}}
                    onClick={() => {history.push({pathname: '/webPageControl/notice', query: this.props.location.state})}}
                >
                    <Icon type='rollback' />
                    返回
                </Button>
                <Warp style={{width: 1200, margin: '0 auto', paddingTop: '15px'}}>
                    <EditItem>
                        <p>文章标题:</p>
                        <Input
                            style={{ width: '90%' }}
                            value={title}
                            onChange={(e) => {this.setState({title: e.target.value})}}
                        />
                    </EditItem>
                    <EditItem>
                        <p>重要公告:</p>
                        <div style={{width: '90%', border: '1px solid #d9d9d9', borderRadius: '4px', background: '#fff', paddingLeft: '11px'}}>
                            <RadioGroup value={articleType} onChange={(e) => {this.setState({articleType: e.target.value})}}>
                                <Radio value={0}>普通</Radio>
                                <Radio value={1}>重要</Radio>
                            </RadioGroup>
                        </div>
                    </EditItem>
                    <EditItem>
                        <p>文章作者:</p>
                        <Input 
                            style={{ width: '90%' }}
                            value={author}
                            onChange={(e) => {this.setState({author: e.target.value})}}
                        />
                    </EditItem>
                    <EditItem>
                        <p>来源地址:</p>
                        <Input 
                            style={{ width: '90%' }}
                            value={origin}
                            onChange={(e) => {this.setState({origin: e.target.value})}}
                        />
                    </EditItem>
                    <EditInfo>
                        <p style={{width: '100px', textAlign: 'right', marginRight: '3px'}}>文章内容:</p>
                        <div ref='Article' style={{textAlign: 'left', width: '90%'}}></div>
                    </EditInfo>
                    <EditSubmit>
                        <Button type='primary' loading={buttonLoading} onClick={this.handleSubmitClick}>提交</Button>
                    </EditSubmit>
                </Warp>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleChangeBreadcrumb(list) {
            dispatch(actionCreators.changeBreadcrumb(list));
        }
    }
}

export default connect(null, mapDispatchToProps)(NoticeEdit);