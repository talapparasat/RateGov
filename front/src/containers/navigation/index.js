import React, { Component } from 'react'
import {Table, Divider, Button, Icon, Input, Form, Select, InputNumber, message} from 'antd';
import {connect} from 'react-redux';
import Common from "../../components/common";
import Modal from "antd/es/modal";
import TextArea from "antd/es/input/TextArea";
import {
    addNavigation,
    deleteNav,
    getMaxOrder,
    getNavigation,
    getNavigationByOspt,
    getPrev, isDelete, updateNavigation
} from "../../actions/navigationActions";
import axios from "axios";
import {GET_ERRORS, GET_MAX, IP} from "../../actions/types";
import Spin from "antd/es/spin";
import {Map, Placemark, YMaps} from "react-yandex-maps";
const {Option} = Select
class Navigation extends Component {
    constructor(){
        super();
        this.state={
            service_type_id:null,
            page:1,
            query:"",
            regionVisible: false,
            districtVisible: false,
            editvisible:false,
            deleteVisible:false,
            id:null,
            deleteId:null,
            orderRegion: 1,
            orderDistrict: 1,
            prevId: null,
            transform: false,
            fromRegion: null,
            fromDistrict: null,
            toRegion: null,
            toDistrict: null,
            districtDelete: null,
            regionDelete: null,
            loading: false,
            coords: [],
        }
    }
    openDeleteModal = id => {
       this.setState({
           deleteVisible: true,
           deleteId: id
       })
        this.props.getPrev(null)
    }

    onChange=(e)=> {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    componentDidMount() {
        this.props.getNavigation(this.handleError, this.handleLoading)
    }
    onChangeAdd = (value) => {
        console.log(value)
        if(value === 'region'){
            this.setState({
                regionVisible: true,
                regionNameRu:'',
                regionNameKz:'',
            })
            this.props.getMaxOrder(null)
        }
        else if(value === 'district'){
            this.setState({
                districtVisible: true,
                districtNameRu:'',
                districtNameKz:'',
                prevId: '',
                orderDistrict: 1,
            })
            this.props.getPrev(null)
        }
    }
    handleError = () => {
        this.setState({
            loading: true,
        })
    }
    handleLoading = () => {
        this.setState({
            loading: false
        })
    }
    handleRegionCancel=()=>{
        this.setState({
            regionVisible: false
        })
    }
    handleDistrictCancel=()=>{
        this.setState({
            districtVisible: false
        })
    }
    openEditModal=(record)=>{
        this.setState({
            editvisible:true,
            editnameRu:record.nameRu,
            editnameKz:record.nameKz,
            editid:record._id,
            editOrder: record.order,
            coords: record.coordinates ? record.coordinates.toString() : '' ,
            prevId: record.prevId
        })
        if(record.prevId) {
            this.props.getMaxOrder(record.prevId)
        }
        else {
            this.props.getMaxOrder()
        }
    }
    handleEditCancel=()=>{
        this.setState({
            editvisible:false
        })
    }

    handleDelete = () => {
        let data = {
            navId: this.state.deleteId,
        }
        this.props.deleteNav(data, true, this.handleDeleteCancel, this.handleError, this.handleLoading)
    }
    handleEditOk = ()=>{
        console.log(this.state.coords)
        let data ={
            nameRu: this.state.editnameRu,
            nameKz: this.state.editnameKz,
            order: this.state.editOrder,
            coordinates: JSON.stringify(this.state.coords.split(',')),
        }
        if( this.state.editnameRu && this.state.editnameKz ) {
            this.props.updateNavigation(this.state.editid, data, this.handleEditCancel, this.handleError, this.handleLoading)
        } else {
            message.error('Заполните нужные поля!')
        }

    }
    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false,
            toRegion: null,
            fromRegion: null,
            toDistrict: null,
            fromDistrict: null,
            transform: false,
        })
    };
    handleRegionOk=()=>{
        console.log(this.state.coords)
        let data ={
            nameRu:this.state.regionNameRu,
            nameKz:this.state.regionNameKz,
            order: this.state.orderRegion,
            coordinates: JSON.stringify(this.state.coords.split(','))
        }
        if (this.state.regionNameRu.length > 0 && this.state.regionNameKz.length > 0) {
            this.props.addNavigation(data,this.handleRegionCancel, this.handleError, this.handleLoading)
        } else {
            message.error('Заполните нужные поля!')
        }
    }
    handleDistrictOk=()=>{
        let data ={
            nameRu: this.state.districtNameRu,
            nameKz: this.state.districtNameKz,
            order: this.state.orderDistrict,
            prevId: this.state.prevId
        }
        if(this.state.districtNameRu.length > 0 && this.state.districtNameKz.length > 0 && this.state.prevId) {
            this.props.addNavigation(data, this.handleDistrictCancel, this.handleError, this.handleLoading)
        } else {
            message.error('Заполните нужные поля!')
        }

    }
    onKeyUp=(e)=> {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getAllServiceSearch({query: e.target.value, page: this.state.page});
    }
    onChangeRegion = (value,option) => {
        console.log(value,option)
        this.setState({
            prevId: value,
            orderDistrict: option.props.title + 1
        })
    }
    onChangeOrderRegion = (value) =>{
        this.setState({
            orderRegion: value
        })
    }
    onChangeOrderDistrict = (value) =>{
        this.setState({
            orderDistrict: value
        })
    }
    onChangePage=(page)=>{
        this.setState({
            page:page.current
        })
        // this.props.getNav({query: this.state.query, page: page.current});
    }
    componentWillReceiveProps(props) {
        if(props.navs){
            this.setState({
                orderRegion: Number(props.navs.max.maxOrder) + 1
            })
        }
    }
    customExpandIcon = (props) => {
        // console.log(props)
        // if (props.record.children.length > 0){
        //     props.expandable = true
        // }
        // else {
        //     props.expandable = false
        // }
    }
    transformNav = () => {
        this.setState({
            transform: !this.state.transform,
        })
    }

    sendToDelete = (navs, serviceProviders, record) => {
        this.openDeleteModal(record._id)
        this.setState({
            navCount: navs,
            serviceProvidersCount: serviceProviders
        })
        if( serviceProviders > 0 && record.prevId){
                this.setState({
                    districtDelete: true,
                    fromRegion: record.nameRu,
                    fromDistrictId: record._id,
                    fromDistrict: record.nameRu
                })
        }
        else if ((navs > 0 || serviceProviders > 0) && !record.prevId) {
            console.log(1)
            this.setState({
                regionDelete: true,
                fromRegion: record.nameRu,
                fromRegionId: record._id
            })
        }
    }
    canDelete = record => {
        console.log(record)
        if(record._id) {
            this.props.isDelete(record,  this.sendToDelete, this.handleError, this.handleLoading)

            // if(this.returnCount){
            //     this.sendToDelete(this.returnCount, record)
            // }
            // else {
            //     this.props.deleteNav({navId: record._id}, this.handleDeleteCancel, true)
            // }
        }
    }
    transformElementsDistrict = () => {
        let data = {
            navId: this.state.fromDistrictId,
            to: this.state.toDistrict
        }
        if (data.navId  && data.to){
            this.props.deleteNav(data, false,  this.handleDeleteCancel, this.handleError, this.handleLoading)
        }
    }
    transformElementsRegion = () => {
        let data = {
            navId: this.state.fromRegionId,
            to: this.state.toRegion
        }
        if (data.navId &&  data.to){
            this.props.deleteNav(data, false, this.handleDeleteCancel, this.handleError, this.handleLoading)
        }
    }
    onSelectRegion = value => {
        this.setState({
            toRegion: value
        })
        this.props.getPrev(value)
    }
    onSelectDistrict = value => {
        this.setState({
            toDistrict: value
        })
    }
    onChangeEditOrder = value => {
        this.setState({
            editOrder: value
        })
    }
    render() {
        const {navCount, serviceProvidersCount, coords, editOrder, districtDelete, regionDelete, fromRegion, fromDistrict, transform, prevId, regionVisible, districtVisible, orderRegion, orderDistrict, editvisible, editnameRu, editnameKz, districtNameRu, districtNameKz, regionNameRu, regionNameKz, deleteVisible}=this.state;
        let actionColumn = {}, addButton = '';
        const {user, navs} = this.props
        let optionsSelect = []
            if(navs.parents && navs.parents.length > 0){
            for(let i=0;i<navs.parents.length;i++) {
                optionsSelect.push({
                    text: navs.parents[i].nameRu,
                    value: navs.parents[i]._id,
                    order: navs.parents[i].maxInnerOrder,
                });
            }
        }

        let options;
        if(optionsSelect && optionsSelect.length>0){
            options = optionsSelect.map((item,i)=>(
                <Option key={i} title={item.order} value={item.value}>{item.text}</Option>
            ))
        }
        let optionsSelectChild = []
        if(navs.children && navs.children.length > 0){
            for(let i=0;i<navs.children.length;i++) {
                optionsSelectChild.push({
                    text: navs.children[i].nameRu,
                    value: navs.children[i]._id,
                    order: navs.children[i].maxInnerOrder,
                });
            }
        }

        let optionsChild;
        if(optionsSelectChild && optionsSelectChild.length>0){
            optionsChild = optionsSelectChild.map((item,i)=>(
                <Option key={i} title={item.order} value={item.value}>{item.text}</Option>
            ))
        }
        if(user.profile.role === "superadmin" || user.profile.role==="admin"){
            actionColumn =   {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <Button type="link" onClick={() => this.openEditModal(record)}><Icon type="edit"/>Редактировать</Button>
        <Divider type="vertical"/>
        <Button type="link" onClick={() => this.canDelete(record)}> <Icon type="delete"/>Удалить</Button>
      </span>
                ),
            }
            addButton=(<Select onChange={this.onChangeAdd} value="Добавить">
                            <Option key="1" value="region">Регион</Option>
                            <Option key="2" value="district">Район</Option>
                        </Select>)
        }

        const columns = [
            {
                title: 'Название региона на русском',
                dataIndex: 'nameRu',
                key: 'nameRu',
            },
            {
                title: 'Название региона на казахском',
                dataIndex: 'nameKz',
                key: 'nameKz',
            },
            actionColumn
        ];
        let  data = []
        console.log(navs)
        if(navs.navs && navs.navs.length > 0){
            data = navs.navs.map((item, i) => {
                return {
                    ...item,
                    children: item.navs ? item.navs.map((nav, j) => {
                        return {
                            ...nav,
                            key: i+ '.' +j
                        }
                    }) : [],
                    key: i,
                }}
            )
        }
        let transformElements = ''
        if (transform) {
            console.log(1)
            if(districtDelete){
                transformElements = (
                    <Form>
                        {/*<Form.Item label="От этого региона">*/}
                        {/*    <Input placeholder="Введите регион"  value={fromRegion} name="fromRegion" onChange={this.onChange} />*/}
                        {/*</Form.Item>*/}
                        <Form.Item label="От этого района">
                            <Input placeholder="Введите район"  value={fromDistrict} name="fromDistrict" onChange={this.onChange} />
                        </Form.Item>
                        <Form.Item label="К этому региону">
                            <Select
                                showSearch
                                placeholder="Выберите тип услуги"
                                optionFilterProp="children"
                                onSelect={this.onSelectRegion}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {options}
                            </Select>
                        </Form.Item>
                        <Form.Item label="К этому району">
                            <Select
                                showSearch
                                placeholder="Выберите тип услуги"
                                optionFilterProp="children"
                                onSelect={this.onSelectDistrict}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {optionsChild}
                            </Select>
                        </Form.Item>
                        <Form.Item style={{textAlign: "center"}}>
                            <Button type="primary" onClick={this.transformElementsDistrict}>Перенести</Button>
                        </Form.Item>
                    </Form>
                )
            }
            else if(regionDelete) {
                transformElements = <Form>
                    <Form.Item label="От этого региона">
                        <Input placeholder="Введите регион" value={fromRegion} name="fromRegion" onChange={this.onChange} />
                    </Form.Item>
                    <Form.Item label="К этому региону">
                        <Select
                            showSearch
                            placeholder="Выберите тип услуги"
                            optionFilterProp="children"
                            onSelect={this.onSelectRegion}
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {options}
                        </Select>
                    </Form.Item>
                    <Form.Item style={{textAlign: "center"}}>
                        <Button type="primary" onClick={this.transformElementsRegion}>Перенести</Button>
                    </Form.Item>
                </Form>
            }
        }
        console.log(navs.max)
        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Навигация</h5>
                                <p className="title-text">Список регионов и районов который был добавлен в систему</p>
                                {/*<Input  onKeyUp={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите русское название " prefix={<Icon type="search"/>}/>*/}
                            </div>
                            <div className="org-link" >
                                {addButton}
                            </div>
                        </div>
                        {data.length===0 ? <Common/> : <Table    onChange={this.onChangePage}   columns={columns} dataSource={data} />}
                    </div>
                    <Modal
                        visible={regionVisible}
                        title="Добавить регион"
                        onCancel={this.handleRegionCancel}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        footer={[
                            <Button key="edit" onClick={this.handleRegionOk}>
                                Сохранить
                            </Button>,
                            <Button key="back" onClick={this.handleRegionCancel}>
                                Отменить
                            </Button>
                        ]}
                    >
                        <Form layout={"vertical"}>
                            <Form.Item label="Наименование на русском">
                                <Input value={regionNameRu} name="regionNameRu" onChange={this.onChange} placeholder="Введите на русском"/>
                            </Form.Item>
                            <Form.Item label="Наименование на казахском">
                                <Input value={regionNameKz} name="regionNameKz" onChange={this.onChange} placeholder="Введите на казахском"/>
                            </Form.Item>
                            <Form.Item label="Последовательность">
                                <InputNumber  min={1} max={navs.max ? Number(navs.max.maxOrder) + 1: 1} value={orderRegion} onChange={this.onChangeOrderRegion} />
                            </Form.Item>
                            <Form.Item label="Локация">
                                <Input value={coords} name="coords" onChange={this.onChange} placeholder="Введите координаты"/>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        visible={districtVisible}
                        title="Добавить район"
                        onCancel={this.handleDistrictCancel}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        footer={[
                            <Button key="edit" onClick={this.handleDistrictOk}>
                                Сохранить
                            </Button>,
                            <Button key="back" onClick={this.handleDistrictCancel}>
                                Отменить
                            </Button>,

                        ]}
                    >
                        <Form layout={"vertical"}>
                            <Form.Item label="Выберите регион">
                                <Select value={prevId} onChange={this.onChangeRegion}>
                                    {options}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Наименование на русском">
                                <Input value={districtNameRu} name="districtNameRu" onChange={this.onChange} placeholder="Введите на русском"/>
                            </Form.Item>
                            <Form.Item label="Наименование на казахском">
                                <Input value={districtNameKz} name="districtNameKz" onChange={this.onChange} placeholder="Введите на казахском"/>
                            </Form.Item>
                            <Form.Item label="Последовательность">
                                <InputNumber  min={1} max={orderDistrict} value={orderDistrict} onChange={this.onChangeOrderDistrict} />
                            </Form.Item>

                        </Form>
                    </Modal>
                    <Modal
                        visible={editvisible}
                        title="Редактировать навигацию"
                        onCancel={this.handleEditCancel}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        footer={[
                            <Button key="edit" onClick={this.handleEditOk}>
                                Сохранить
                            </Button>,
                            <Button key="back" onClick={this.handleEditCancel}>
                                Отменить
                            </Button>,

                        ]}
                    >
                        <Form layout={"vertical"}>
                            <Form.Item label="Наименование">
                                <Input value={editnameRu} name="editnameRu" onChange={this.onChange} placeholder="Введите на русском"/>
                            </Form.Item>
                            <Form.Item>
                                <Input value={editnameKz} name="editnameKz" onChange={this.onChange} placeholder="Введите на казахском" />
                            </Form.Item>
                            <Form.Item label="Последовательность">
                                <InputNumber  min={1} max={navs.max ? Number(navs.max.maxOrder): 1} value={editOrder} onChange={this.onChangeEditOrder} />
                            </Form.Item>
                            {!this.state.prevId ?
                                <Input value={coords} name="coords" onChange={this.onChange} placeholder="Введите координаты"/>
                                : ''}

                        </Form>
                    </Modal>
                    <Modal
                        title="Удалить"
                        visible={deleteVisible}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        onCancel={this.handleDeleteCancel}
                        footer={[
                            <Button style={{background:"#000",color:"#fff"}} key="ok" onClick={this.handleDelete}>
                                <Icon type="check-circle" />Да, удалить
                            </Button>,

                            <Button key="no" onClick={this.handleDeleteCancel}>
                                <Icon type="close-circle" /> Нет, не удалять
                            </Button>,
                        ]}
                    >
                        <p>В данном регионе есть {serviceProvidersCount} услугодателей и {navCount} район(-а/-ов). Вы можете <span onClick={this.transformNav} style={{cursor: "pointer", fontWeight:"600", textDecoration: "underline"}}>Перенести</span> их в другой регион</p>
                        {transformElements}
                    </Modal>
                </Spin>
            </div>

        )
    }
}
const mapStateToProps=(state)=>({
    user:state.user,
    navs: state.navs,
});

export  default connect(mapStateToProps,{getNavigation, addNavigation, getMaxOrder, getPrev, getNavigationByOspt, deleteNav, isDelete, updateNavigation}) (Navigation);