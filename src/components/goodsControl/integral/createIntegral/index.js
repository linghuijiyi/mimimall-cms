import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../../base/breadcrumbCustom/store';
import { CreateStagesContainer, CreateItem, Name, InputWarp } from './style';
import { message, Select, Col, Row, TreeSelect, Radio, InputNumber, Input, Button, Card, Form, Popconfirm } from 'antd';
import history from './../../../../history';
import fatch from './../../../../common/js/fatch';
import baseURL from './../../../../common/js/baseURL';
import uuid from './../../../../common/js/uuid';
import { HomeActionCreators } from './../../../../base/home/store';
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
class CreateIntegral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            channelCode: 1,
            type: 0,
            categories: [],
            creditType: 0,
            number: '',
            percentage: undefined,
            cover: 1,
            content: '',
            remark: '',
            excludeSpu: '',
            spu: '',
            soveBtnLoading: false,
        }
    }
    componentWillMount() {
        this.getTypeList();
        this.props.dispatch(actionCreators.changeBreadcrumb(['商品管理', '积分管理', '新增设置']));
    }
    handleSaveClick = () => {
        const { channelCode, type, categories, creditType, number, percentage, cover, excludeSpu, spu, remark } = this.state;
        let credit;
        let content;
        if (type === 0) {
            if (!categories.length) {
                message.warning('请设置分类列表。');
                return;
            }
        } else if (type === 1) {
            if (spu.length === 0) {
                message.warning('spu列表不能为空。'); 
                return;
            }
        }
        if (creditType === 0) {
            if (number === '') {
                message.warning('请设置积分');
                return;
            }
            if (parseInt(number) > 200 || parseInt(number) <= 0) {
                message.warning('数值积分不能大于200，并且不能小于等于0。');
                return;
            }
            credit = number;
        } else {
            if (percentage === undefined) {
                message.warning('请设置积分');
                return;
            }
            if (percentage > 50 || percentage <= 0) {
                message.warning('百分比积分不能大于50， 并且不能小于等于0');
                return;
            }
            credit = percentage;
        }
        if (remark.length > 140) {
            message.warning('备注不能超过140个字符.');
            return;
        }
        type === 0 ? (content = excludeSpu) : (content = spu);
        this.showAndHideLoading(true);
        const url = `${baseURL}goods/credit/save`;
        this.setState({soveBtnLoading: true});
        const params = {
            channelCode, type, categories, creditType, credit, cover, content, remark
        }
        fatch(url, 'post', params, (err, state) => {
            message.error(err);
            this.showAndHideLoading(state);
        }).then((res) => {
            if (res.code === '0') {
                this.showAndHideLoading(false);
                this.setState({soveBtnLoading: false});
                history.push('/goodsControl/integral');
            } else {
                this.showAndHideLoading(false);
                this.setState({soveBtnLoading: false});
                message.error(res.msg);
            }
        });
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
    onChange = (treeValue, label, extra) => {
        let data = extra.allCheckedNodes;
        let categories = [];
        for (let i = 0; i < data.length; i++) {
            categories.push(data[i].props.categoryId);
        }
        this.setState({ categories });
        this.setState({ treeValue });
    }
    handleStagesChange = (type, e) => {
        if (type === 1) {
            this.setState({ number: e.target.value.replace(/\D/g, '') });
        } else {
            this.setState({ percentage: e })
        }
    }
    handleBack = () => {
        history.push({pathname: '/goodsControl/integral', query: this.props.location.state});
    }
    showAndHideLoading = (state) => this.props.dispatch(HomeActionCreators.changeLoading(state));
    render() {
        const { treeData, channelCode, type, treeValue, creditType, number, percentage, cover, excludeSpu, spu, remark, soveBtnLoading } = this.state;
        const tProps = {
            treeData,
            value: treeValue,
            onChange: this.onChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            maxTagCount: 3,
            searchPlaceholder: '设置分类列表',
            style: {
                width: 500,
            }
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
                                <Option value={1}>京东商城</Option>
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
                        <Name>积分类型:</Name>
                        <InputWarp id='jifenleixing' style={{position: 'relative' }}>
                            <Select
                                style={{ width: '500px' }}
                                value={creditType}
                                onChange={(value) => {this.setState({creditType: value})}}
                                getPopupContainer={() => document.getElementById('jifenleixing')}
                            >
                                <Option value={1}>销售价格百分比</Option>
                                <Option value={0}>按数值</Option>
                            </Select>
                        </InputWarp>
                    </CreateItem>
                    <CreateItem>
                        <Name>积分:</Name>
                        <InputWarp>
                            <Input
                                style={{width: 500, display: creditType === 0 ? 'block' : 'none' }}
                                placeholder='请输入积分'
                                value={number}
                                onChange={(e) => this.handleStagesChange(1, e)}
                            />
                            <InputNumber
                                min={0}
                                formatter={limitDecimals} 
                                parser={limitDecimals}
                                value={percentage}
                                step={0.01}
                                onChange={(value) => this.handleStagesChange(0, value)}
                                style={{width: 480, display: creditType !== 0 ? 'inline-block' : 'none' }}
                            />
                            <span style={{width: 20, display: creditType !== 0 ? 'inline-block' : 'none' }}>%</span>
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
                        loading={soveBtnLoading}
                    >  
                        保存
                    </Button>
                </CreateStagesContainer>
            </div>
        );
    }
}
export default connect(null, null)(Form.create({})(CreateIntegral));