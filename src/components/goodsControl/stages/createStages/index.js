import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import { CreateStagesContainer, CreateItem, Name, InputWarp } from './style';
import { Select, Col, Row, TreeSelect, Radio, InputNumber, Input, Button, Card, Form, Popconfirm, message } from 'antd';
import history from './../../../../history';
import baseURL from './../../../../common/js/baseURL';
import fatch from './../../../../common/js/fatch';
import uuid from './../../../../common/js/uuid';
import { HomeActionCreators } from './../../../../base/home/store';
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
class CreateStages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depositValue: 1,
            instalments: [
                {term: '', rate: ''},
            ],
            treeData: [],
            categories: [],
            treeValue: [],
            channelCode: '1',
            type: 0,
            downPayment: 0,
            cover: 1,
            remark: '',
            excludeSpu: '',
            spu: '',
            
        }
    }
    componentWillMount() {
        this.getTypeList();
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '分期管理', '新增设置']));
    }
    treeChange = (treeValue, label, extra) => {
        let data = extra.allCheckedNodes;
        let categories = [];
        for (let i = 0; i < data.length; i++) {
            categories.push(data[i].props.categoryId);
        }
        this.setState({ categories });
        this.setState({ treeValue });
    }
    getTypeList() {
        const url = `${baseURL}category/all/list`;
        fatch(url, 'post', {}, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    treeData: this.handleFormatTypeList(res.data)
                })
            } else {
                message.error('获取分类id失败：' + res.msg);
            }
        });
    }
    handleFormatTypeList(data) {
        return data.map((item, index) => {
            item.value = item.categoryId.toString();
            item.title = item.name;
            item.key = uuid();
            item.children = item.thirdCategoryList;
            if (item.thirdCategoryList !== null) this.handleFormatTypeList(item.thirdCategoryList);
            return item;
        });
    }
    handleSaveClick = () => {
        const { channelCode, type, categories, downPayment, instalments, excludeSpu, spu, cover, remark } = this.state;
        let content;
        let params = {};
        if (type === 0) {
            content = excludeSpu;
            if (!categories.length) {
                message.error('最少选择一条分类');
                return;
            }
            params.categories = categories;
        } else {
            if (spu.length === 0) {
                message.warning('spu列表不能为空。'); 
                return;
            }
            content = spu;
        }
        if (instalments.length) {
            for (let i = 0; i < instalments.length; i++) {
                if (
                    instalments[i].term === '' ||
                    instalments[i].term === undefined ||
                    instalments[i].rate === '' ||
                    instalments[i].rate === undefined
                )
                {
                    message.error('请设置分期数和分期利率，如不设置请删除该条分期规则！');
                    return;
                }
                if (instalments[i].term > 36) {
                    message.error('分期数不能超过36！');
                    return;
                }
                if (instalments[i].term === 0) {
                    message.error('分期数不能为0');
                    return;
                }
                if (instalments[i].rate > 50) {
                    message.error('利率不能大于50！');
                    return;
                }
            } 
        } else {
            message.error('分期规则最少设置一条！');
            return;
        }
        if (this.isTerm(instalments)) {
            message.error('分期数不能相同！');
            return;
        }
        if (remark.length > 140) {
            message.error('备注文字不能超过140个字符！');
            return;
        }
        params.channelCode = channelCode;
        params.type = type;
        params.downPayment = downPayment;
        params.cover = cover;
        params.content = content;
        params.remark = remark;
        params.instalments = JSON.stringify(instalments);
        const url = `${baseURL}goods/instalment/save`;
        this.showAndHideLoading(true);
        fatch(url, 'post', params, (err, state) => {
            message.error(err);
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                this.showAndHideLoading(false);
                history.push('/goodsControl/stages');
            } else {
                this.showAndHideLoading(false);
                message.error(res.msg);
            }
        });
    }
    /***************首付**********************/
    handleDepositChange = (e) => {
        this.setState({ depositValue: e.target.value });
    }
    handleStagesChange = (type, e, index) => {

        const { instalments } = this.state;
        if (type === 1) {
            if (e === undefined) {
                instalments[index].rate = '';
            } else {
                instalments[index].rate = e;
            }
        } else {
            if (e.target.value === '') {
                instalments[index].term = '';
            } else {
                instalments[index].term = e.target.value.replace(/\D/g, '');
            }
        }
        this.setState({ instalments });
    }
    handleStagesDelete = (index) => {
        const { instalments } = this.state;
        instalments.splice(index, 1);
        this.setState({ instalments });
    }
    handleStagesCreate = () => {
        const { instalments } = this.state;
        instalments.push({
            term: '',
            rate: ''
        });
        this.setState({ instalments });
    }
    isTerm = (arr) => {
        let hash = {};
        for (let i in arr) {
            if (hash[arr[i].term]) return true;
            hash[arr[i].term] = true;
        }
        return false;
    }
    isRate = (arr) => {
        let hash = {};
        for (let i in arr) {
            if (hash[arr[i].rate]) return true;
            hash[arr[i].rate] = true;
        }
        return false;
    }
    handleBack = () => {
        history.push({pathname: '/goodsControl/stages', query: this.props.location.state});
    }
    showAndHideLoading = (state) => this.props.dispatch(HomeActionCreators.changeLoading(state));
    render() {
        const { treeData, treeValue, channelCode, type, downPayment, instalments, cover, excludeSpu, spu, remark } = this.state;
        const tProps = {
            treeData,
            value: treeValue,
            onChange: this.treeChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            maxTagCount: 3,
            searchPlaceholder: '全部分类',
            style: {
                width: 500,
            },
        }
        const limitDecimals = (value: string | number): string => {
            const reg = /^(\-)*(\d+)\.(\d\d).*$/;
            if(typeof value === 'string') return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
            else if (typeof value === 'number') return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
            else return '';
        };
        return (
            <div>
                <Button
                    type='primary'
                    icon='left'
                    style={{ width: 80, margin: '15px 0px 0px 15px' }}
                    onClick={this.handleBack}
                >  
                    返回
                </Button>
                <CreateStagesContainer>
                    <CreateItem>
                        <Name>渠道:</Name>
                        <InputWarp id='admc' style={{position: 'relative' }}>
                            <Select
                                style={{ width: '500px' }}
                                value={channelCode}
                                onChange={(value) => {this.setState({channelCode: value})}}
                                getPopupContainer={() => document.getElementById('admc')}
                            >
                                <Option value=''>全部</Option>
                                <Option value='1'>京东商城</Option>
                            </Select>
                        </InputWarp>
                    </CreateItem>
                    <CreateItem>
                        <Name>类型:</Name>
                        <InputWarp id='leixing' style={{position: 'relative' }}>
                            <Select
                                style={{ width: '500px' }}
                                value={type}
                                onChange={(value) => {this.setState({type: value})}}
                                getPopupContainer={() => document.getElementById('leixing')}
                            >
                                <Option value={0}>分类</Option>
                                <Option value={1}>单个/多个商品</Option>
                            </Select>
                        </InputWarp>
                    </CreateItem>
                    <CreateItem style={{height: type === 1 ? 0 : 40}}>
                        <Name style={{display: type === 1 ? 'none' : 'block'}}>分类:</Name>
                        <InputWarp id='fenlei' style={{position: 'relative', display: type === 1 ? 'none' : 'block' }}>
                            <TreeSelect treeCheckStrictly={true} {...tProps} getPopupContainer={() => document.getElementById('fenlei')} />
                        </InputWarp>
                    </CreateItem>
                    <CreateItem>
                        <Name>首付:</Name>
                        <InputWarp>
                            <RadioGroup
                                style={{ width: 500 }}
                                value={downPayment}
                                onChange={(e) => {this.setState({downPayment: e.target.value})}}
                            >
                                <Radio value={0}>零首付</Radio>
                                <Radio value={10}>10%</Radio>
                                <Radio value={20}>20%</Radio>
                                <Radio value={30}>30%</Radio>
                                <Radio value={40}>40%</Radio>
                                <Radio value={50}>50%</Radio>
                            </RadioGroup>
                        </InputWarp>
                    </CreateItem>
                    <div style={{ position: 'relative' }}>
                        <Name style={{ display: 'inline-block' }}>分期设置:</Name>
                        <Name style={{ width: 'auto', display: 'inline-block' }}>期数:（<span style={{ color: 'red' }}>整数</span>）利率:（<span style={{ color: 'red' }}>支持小数点后2位</span>）%</Name>
                        
                        {
                            instalments.map((item, index) => {
                                return (
                                    <CreateItem className='qishu' key={index}>
                                        <InputWarp>
                                            <Input
                                                placeholder='期数'
                                                style={{width: 200}}
                                                value={item.term}
                                                onChange={(e) => this.handleStagesChange(0, e, index)}
                                            />
                                            <InputNumber
                                                placeholder='利率'
                                                style={{width: 200}}
                                                value={item.rate}
                                                min={0}
                                                formatter={limitDecimals} 
                                                parser={limitDecimals}
                                                onChange={(value) => this.handleStagesChange(1, value, index)}
                                            />
                                        </InputWarp>
                                        <Popconfirm
                                            title='确定要删除吗？'
                                            okText='确定'
                                            cancelText='取消'
                                            onConfirm={() => this.handleStagesDelete(index)} 
                                            onCancel={() => {}}
                                        >
                                            <Button icon='delete' style={{ width: 100, background: '#f5222d', border: '1px solid #f5222d' }} type='primary'>删除</Button>
                                      </Popconfirm>
                                    </CreateItem>
                                )
                            })
                        }
                        <div>
                            <Button
                                type='primary'
                                icon='plus'
                                style={{ marginLeft: 105, width: 200, display: instalments.length > 11 ? 'none' : 'inline-block' }}
                                onClick={this.handleStagesCreate}
                            >  
                                添加
                            </Button>
                        </div>
                        
                    </div>
                    <CreateItem className='textarea'>
                        <Name>{ type === 0 ? '排除的spu' : 'spu' }:</Name>
                        <InputWarp>
                            <TextArea 
                                style={{ width: 500, height: '100px', resize: 'none', display: type === 0 ? 'block' : 'none' }}
                                placeholder='多个之间用"/"分隔，选填项'
                                value={excludeSpu}
                                onChange={(e) => {this.setState({excludeSpu: e.target.value.replace(/[^0-9A-Z\/]/g,'')})}}
                            />
                            <TextArea 
                                style={{ width: 500, height: '100px', resize: 'none', display: type !== 0 ? 'block' : 'none' }}
                                placeholder='多个之间用"/"分隔，最少添加一条。'
                                value={spu}
                                onChange={(e) => {this.setState({spu: e.target.value.replace(/[^0-9A-Z\/]/g,'')})}}
                            />
                        </InputWarp>
                    </CreateItem>
                    <CreateItem>
                        <Name className='repeat'>存在重复设置是否覆盖:</Name>
                        <InputWarp>
                            <RadioGroup
                                style={{ width: 500 }}
                                value={cover}
                                onChange={(e) => {this.setState({cover: e.target.value})}}
                            >
                                <Radio value={1}>覆盖</Radio>
                                <Radio value={0}>不覆盖</Radio>
                            </RadioGroup>
                        </InputWarp>
                    </CreateItem>
                    <CreateItem className='textarea'>
                        <Name>备注:</Name>
                        <InputWarp>
                            <TextArea
                                style={{ width: 500, height: '100px', resize: 'none' }} 
                                placeholder='选填项'
                                value={remark}
                                onChange={(e) => {this.setState({remark: e.target.value})}}
                            />
                        </InputWarp>
                    </CreateItem>
                    <Button
                        type='primary'
                        style={{ width: 300, marginLeft: 150, marginTop: 20}}
                        onClick={this.handleSaveClick}
                    >  
                        保存
                    </Button>
                </CreateStagesContainer>
            </div>
        );
    }
}
export default connect(null, null)(Form.create({})(CreateStages));