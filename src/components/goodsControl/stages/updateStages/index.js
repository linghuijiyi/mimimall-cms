import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import { HomeActionCreators } from './../../../../base/home/store';
import { CreateStagesContainer, CreateItem, Name, InputWarp } from './../createStages/style';
import { Select, Col, Row, TreeSelect, Radio, InputNumber, Input, Button, Card, Form, Popconfirm, message } from 'antd';
import history from './../../../../history';
import baseURL from './../../../../common/js/baseURL';
import fatch from './../../../../common/js/fatch';
import uuid from './../../../../common/js/uuid';
import formatDateTime from './../../../../common/js/formatDateTime';
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
let stagesData = null;
class UpdateStages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            terms: [],
            categories: [],
            categoriesStr: [],
            channelCode: '1',
            type: 0,
            downPayment: 0,
            cover: 0,
            remark: '',
            excludeSpu: '',
            spu: '',
            createTime: ''
        }
    }
    componentWillMount() {
        stagesData = this.props.location.state;
        this.getTypeList(stagesData.record.categoriesStr);
        this.getStagesData(stagesData.record.id);
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '分期管理', '编辑分期规则']));
    }
    treeChange = (treeValue, label, extra) => {}
    // 获取分期数据
    getStagesData = (id) => {
        const url = `${baseURL}goods/instalment/detail`;
        fatch(url, 'post', { id }, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                const data = res.data;
                if (data.type === 0) {
                    this.setState({excludeSpu: data.content});
                } else {
                    this.setState({spu: data.content});
                }
                let termList = data.terms;
                let terms = [];
                if (termList.length) {
                    for (let i = 0; i < termList.length; i++) {
                        terms.push({
                            term: termList[i].terms,
                            rate: termList[i].rate,
                            id: termList[i].id,
                        });
                    }
                }
                this.setState({
                    channelCode: data.channelCode,
                    type: data.type,
                    downPayment: data.downPayment,
                    terms: terms,
                    cover: data.cover,
                    remark: data.remark,
                    createTime: formatDateTime(data.createTime)
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    // 获取分期列表
    getTypeList(data) {
        const url = `${baseURL}category/all/list`;
        fatch(url, 'post', {}, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    treeData: this.handleFormatTypeList(res.data)
                }, () => {
                    if (data !== null) {
                        let categoriesStr = data.split(',');
                        let list = [];
                        for (let i = 0; i < categoriesStr.length; i++) {
                            list.push({value: categoriesStr[i]});
                        }
                        this.setState({ categoriesStr: list });
                    }
                });
            } else {
                message.error('获取分类id失败：' + res.msg);
            }
        });
    }
    // 格式化分期列表数据
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
    // 保存更新数据
    handleSaveClick = () => {
        const { type, downPayment, terms, excludeSpu, spu, remark } = this.state;
        let content;
        let params = {};
        if (type === 0) {
            content = excludeSpu;
        } else {
            if (spu.length === 0) {
                message.warning('spu列表不能为空。'); 
                return;
            }
            content = spu;
        }
        if (terms.length) {
            for (let i = 0; i < terms.length; i++) {
                if (terms[i].term === '' || terms[i].rate === '' || terms[i].rate === undefined) {
                    message.error('请设置分期数和分期利率，如不设置请删除该条分期规则！');
                    return;
                }
                if (terms[i].term > 36) {
                    message.error('分期数不能超过36！');
                    return;
                }
                if (terms[i].term === 0) {
                    message.error('分期数不能为0！');
                    return;
                }
                if (terms[i].rate > 50) {
                    message.error('利率不能大于50！');
                    return;
                }
            }
        } else {
            message.error('分期规则最少设置一条！');
            return;
        }
        if (this.isTerm(terms)) {
            message.error('分期数不能相同！');
            return;
        }
        if (remark.length > 140) {
            message.error('备注文字不能超过140个字符！');
            return;
        }
        params.content = content;
        params.downPayment = downPayment;
        params.id = stagesData.record.id;
        params.instalments = JSON.stringify(terms);
        params.remark = remark;
        const url = `${baseURL}goods/instalment/update`;
        this.showAndHideLoading(true);
        fatch(url, 'post', params, (err, state) => {
            message.error(err);
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                this.showAndHideLoading(false);
                this.handleBack();
            } else {
                this.showAndHideLoading(false);
                message.error(res.msg);
            }
        });
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
    // 设置分期规则
    handleStagesChange = (type, e, index) => {
        const { terms } = this.state;
        if (type === 1) {
            terms[index].rate = e;
        } else {
            if (e.target.value === '') {
                terms[index].term = '';
            } else {
                terms[index].term = e.target.value.replace(/\D/g, '')
            }
        }
        this.setState({ terms });
    }
    handleStagesDelete = (index) => {
        const { terms } = this.state;
        terms.splice(index, 1);
        this.setState({ terms });
    }
    handleStagesCreate = () => {
        const { terms } = this.state;
        terms.push({
            term: '',
            rate: ''
        });
        this.setState({ terms });
    }
    cancel = () => {}
    handleBack = () => {
        history.push({pathname: '/goodsControl/stages', query: stagesData});
    }
    showAndHideLoading = (state) => this.props.dispatch(HomeActionCreators.changeLoading(state));
    render() {
        const { treeData, categoriesStr, createTime, channelCode, type, downPayment, terms, cover, excludeSpu, spu, remark } = this.state;
        const tProps = {
            treeData,
            value: categoriesStr,
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
                        <Name>创建日期:</Name>
                        <InputWarp id='admc' style={{position: 'relative' }}>
                            <Input disabled value={createTime} style={{ width: '500px' }} />
                        </InputWarp>
                    </CreateItem>
                    <CreateItem>
                        <Name>渠道:</Name>
                        <InputWarp id='admc' style={{position: 'relative' }}>
                            <Select
                                style={{ width: '500px' }}
                                disabled
                                value={channelCode}
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
                                disabled
                                value={type}
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
                            <TreeSelect  treeCheckStrictly={true} {...tProps} getPopupContainer={() => document.getElementById('fenlei')} />
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
                            terms.map((item, index) => {
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
                                            onCancel={this.cancel}
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
                                style={{ marginLeft: 105, width: 200, display: terms.length > 11 ? 'none' : 'inline-block' }}
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
                                disabled
                            >
                                <Radio value={0}>不覆盖</Radio>
                                <Radio value={1}>覆盖</Radio>
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
export default connect(null, null)(Form.create({})(UpdateStages));