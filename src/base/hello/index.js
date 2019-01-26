import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../base/breadcrumbCustom/store';
import { message, Input } from 'antd';
import { InputCard, PlaceSearch, Panel } from './style';

class Hello extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: '',
            toolBar:  '',
            overView: '',
            map: '',
            keywords: '北京欢乐谷',
            SearchList: [],
            position: [116.397428, 39.90923]
        }
    }
    componentDidMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb([]));
        // this.initMap();

    }
    initMap = () => {
        this.setState({
            scale: new window.AMap.Scale({visible: false}),
            toolBar: new window.AMap.ToolBar({visible: false}),
            overView: new window.AMap.OverView({visible: false}),
            map: new window.AMap.Map("container", { 
                resizeEnable: true,
                zoom: 99999,
                center: this.state.position,
                viewMode: '3D',
                rotateEnable: true,
                pitchEnable: true,
            })
        }, () => {
            const { map, scale, toolBar, overView } = this.state;
            map.addControl(scale);
            map.addControl(toolBar);
            map.addControl(overView);
            map.on('complete', () => message.success('地图加载完成...'));
            map.addControl(new AMap.ControlBar({
                showZoomBar: false,
                showControlButton: true,
                position: {
                  right: '35px',
                  top: '10px'
                }
            }));
            var driving = new AMap.Driving({
                map: map,
                panel: "panel"
            }); 
            AMap.event.addListener(new AMap.Autocomplete({ input }), 'select', this.select);
        });
    }
    select = (e) => {
        const { map } = this.state;
        let placeSearch = new AMap.PlaceSearch({ map });
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);
    }
    toggleScale = (checkbox) => {
        if (checkbox.checked) {
            this.state.scale.show();
        } else {
            this.state.scale.hide();
        }
    }
    toggleToolBar = (checkbox) => {
        if (checkbox.checked) {
            showToolBar();
            showToolBarDirection();
            showToolBarRuler();
        } else {
            hideToolBar();
            hideToolBarDirection();
            hideToolBarRuler();
        }
    }
    toggleToolBarDirection = (checkbox) => {
        if (checkbox.checked) {
            this.state.toolBar.show()
        } else {
            this.state.toolBar.hide()
        }
    }
    toggleToolBarRuler = (checkbox) => {
        if (checkbox.checked) {
            toolBar.showRuler();
        } else {
            toolBar.hideRuler();
        }
    }
    toggleOverViewShow = (checkbox) => {
        if (checkbox.checked) {
            overView.show();
            document.getElementById('overviewOpen').disabled = false;
        } else {
            overView.hide();
            document.getElementById('overviewOpen').disabled = true;
        }
    }
    toggleOverViewOpen = (checkbox) => {
        if (checkbox.checked) {
            overView.open();
        }
        else {
            overView.close();
        }
    }
    showToolBar = () => {
        document.getElementById('toolbar').checked = true;
        document.getElementById('toolbarDirection').disabled = false;
        document.getElementById('toolbarRuler').disabled = false;
        toolBar.show();
    }
    hideToolBar = () => {
        document.getElementById('toolbar').checked = false;
        document.getElementById('toolbarDirection').disabled = true;
        document.getElementById('toolbarRuler').disabled = true;
        toolBar.hide();
    }
    showToolBarDirection = () => {
        document.getElementById('toolbarDirection').checked = true;
        toolBar.showDirection();
    }
    hideToolBarDirection = () => {
        document.getElementById('toolbarDirection').checked = false;
        toolBar.hideDirection();
    }
    showToolBarRuler = () => {
        document.getElementById('toolbarRuler').checked = true;
        toolBar.showRuler();
    }
    hideToolBarRuler = () => {
        document.getElementById('toolbarRuler').checked = false;
        toolBar.hideRuler();
    }
    handlepositionclick = (data) => {
        let list = [];
        list.push(data.location.lng);
        list.push(data.location.lat);
        this.setState({position: list}, () => {this.initMap()})
    }
    render() {
        const {keywords} = this.state;
        return (
            <div style={{transform: 'translate(0,0)', display: 'none'}}>
                <div id='container' style={{width: '100%', height: 'calc(100vh - 110px)'}}></div>
                <PlaceSearch>
                    <Input id='input' placeholder='请输入关键字' />
                </PlaceSearch>
                <InputCard>
                     <div className='input-item'>
                        <input type='checkbox' ref='scale' onClick={() => {this.toggleScale(this.refs.scale)}} />比例尺
                    </div>
                     <div className="input-item">
                        <input type="checkbox" ref='toolbarDirection' id="toolbarDirection" onClick={() => {this.toggleToolBarDirection(this.refs.toolbarDirection)}} />工具条方向盘
                    </div>
                    <div className="input-item">
                        <input type="checkbox" id="toolbarRuler" />工具条标尺
                    </div>
                    <div className="input-item">
                        <input type="checkbox" id="overview"/>显示鹰眼
                    </div>
                    
                    <div className="input-item">
                        <input type="checkbox" id="overviewOpen" />展开鹰眼
                    </div>
                </InputCard>
            </div>
        );
    }
}

export default connect(null, null)(Hello);