import React,{Component} from "react";
import {Button, Form, Icon, List, Input, message} from 'antd';
import classnames from "classnames";
import {withRouter} from "react-router-dom";
import '../service-type/serviceType.css'
import {connect} from 'react-redux'
import {
   getServiceTypesByOrganization
} from "../../actions/serviceTypeActions";
import Modal from "antd/es/modal";
import Select from "antd/es/select";
import {connectOrganization, createFieldOrganization, deleteConnect, getFieldsOspt, getFields} from "../../actions/fieldActions";
import Switch from "antd/es/switch";
import Spin from "antd/es/spin";
const {Option} = Select

class AddFieldOrganization extends Component{
    constructor(){
        super();
        this.state={
            nameKz: '',
            span: true,
            nameRu: '',
            selected: false,
            organizationId: null,
            visible: false,
            disabled: false,
            serviceProviderTypeId: null,
            fieldId: null,
            addVisible: false,
            labelRu: '',
            labelKz: '',
            name: '',
            required: '',
            type: '',
            serviceProviderTypeIdAdd: null,
            loading: false,
        }
    }

    onSelect=(value)=>{

        this.setState({
            selected:true,
            disabled:true,
            service_provider_type_id:this.props.serviceType.serviceTypes[value]._id,
            nameKz: this.props.serviceType.serviceTypes[value].nameKz,
            nameRu: this.props.serviceType.serviceTypes[value].nameRu
        })
    }

    onClickRus=()=>{
        this.setState({
            span: true,
            spanStyle:{}
        })
    };
    onClickKaz=()=>{
        this.setState({
            span: false,
            spanStyle:{borderBottom: '1px dashed #999'}
        })
    };
    handleOk = e => {
        e.preventDefault();
        let data = {
            nameKz: this.state.nameKz,
            nameRu: this.state.nameRu,
            image: this.state.img,
            isGovernment: this.state.isGovernment,
            organization_id: this.state.organization_id
        };
        let dataConnect={
            organizationId: this.state.organization_id,
            serviceProviderTypeId: this.state.service_provider_type_id,
        }

        if(this.state.selected){
            this.props.addServiceTypeConnect(dataConnect);
        }
        else{
            this.props.addServiceType(data);
        }
        this.setState({
            nameKz: "",
            nameRu: "",
            img: null,
            imageUrl: null,
            selected: false,
            disabled: false
        })
    };
    handleDelete = value => {
        let fieldId = this.props.field.fieldsOspt[value]._id
        let data ={
            serviceProviderTypeId: this.state.serviceProviderTypeId,
            organizationId: this.state.organizationId,
            fieldId: fieldId
        }
        if(data.serviceProviderTypeId && data.organizationId && fieldId) {
            this.props.deleteConnect(data, this.handleError, this.handleLoading);
        }
    };
    onPrev=()=>{
        this.props.history.push('/dashboard/navigation/add');
    };
    onNext=()=>{
        this.props.history.push('/dashboard/service/add');
    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkCancel=()=>{
        this.setState({
            addVisible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/organizations');
        localStorage.removeItem('organization_id')
    }
    componentDidMount() {
        let id = localStorage.getItem('organization_id');
        this.setState({
            organizationId:id
        });
        this.props.getServiceTypesByOrganization(id, this.handleError, this.handleLoading);
    }
    handleClose=()=>{
        this.setState({
            visible:true,
        })
    }
    openModal = () => {
        this.setState({
            addVisible: true,
            labelRu: '',
            labelKz: '',
            name: '',
            required: false,
            type: '',
            serviceProviderTypeIdAdd: null,
        })
    }
    onChangeType = value => {
        this.setState({
            serviceProviderTypeId: value
        })
        let data = {
            organizationId: this.state.organizationId,
            serviceProviderTypeId: value
        }
       this.props.getFields({query: '', page: 1}, this.handleError, this.handleLoading)
        this.props.getFieldsOspt(data, this.handleError, this.handleLoading)
    }
    onChangeField = value => {
        this.setState({
            fieldId: value
        })
    }
    onChangeTypeAdd = value => {
        this.setState({
            serviceProviderTypeIdAdd: value
        })
    }
    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleConnect = () => {
        let data = {
            organizationId: this.state.organizationId,
            serviceProviderTypeId: this.state.serviceProviderTypeId,
            fieldId: this.state.fieldId
        }
        if(this.state.serviceProviderTypeId && this.state.fieldId){
            this.props.connectOrganization(data, this.handleError, this.handleLoading)
            this.setState({
                fieldId: null,
            })
        } else {
            message.error('Заполните все поля!')
        }

    }
    handleOkModal = () => {
        let data = {
            serviceProviderTypeId: this.state.serviceProviderTypeIdAdd,
            labelRu: this.state.labelRu,
            labelKz: this.state.labelKz,
            required: this.state.required,
            name: this.state.name,
            type: this.state.type
        }
        if(data.labelRu && data.labelKz){
            this.props.createFieldOrganization(this.state.organizationId, data, this.handleOkCancel, this.handleError, this.handleLoading)
        }

    }
    onChangeSwitch = value => {
        this.setState({
            required: value
        })
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

    render(){
        const {span, addVisible, labelRu ,visible, labelKz, name, type} = this.state;
        const {serviceTypesById} = this.props.serviceType;
        const {fields, fieldsOspt} = this.props.field;
        let listRu=[];
        let listKz=[];

        if(fieldsOspt && fieldsOspt.length>0){
            for (let i = 0; i < fieldsOspt.length; i++) {
                listRu.push({text: fieldsOspt[i].labelRu, value: i})
                listKz.push({text: fieldsOspt[i].labelKz, value: i})
            }
        }
        let options = [], optionsField = []
        if(serviceTypesById && serviceTypesById.spts && serviceTypesById.spts.length>0){
            options = serviceTypesById.spts.map((item,i) => (
                <Option key={i} value={item.id}>{item.nameRu}</Option>
            ))
        }
        if(fields.fields  && fields.fields.length > 0){
            optionsField = fields.fields.map((item,i) => (
                <Option key={i} value={item._id}>{item.name}</Option>
            ))
        }
        console.log(optionsField)

        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p style={{border:"none",outline:"none",cursor:"pointer"}} onClick={this.handleClose} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-add">
                        <div className="add-inner">
                            <h2 className="h5-title">Шаг 4/8. Дополнительные поля</h2>
                            <p className="title-text">Пожалуйста, введите дополнительные поля данной организации</p>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                <Form.Item label="Тип услугодателя">
                                    <Select
                                        style={{ width: 600 }}
                                        placeholder="Выберите тип услугодателя"
                                        optionFilterProp="children"
                                        onChange={this.onChangeType}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {options}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Дополнительные поля">
                                    <Select
                                        showSearch
                                        style={{ width: 600 }}
                                        value={this.state.fieldId}
                                        placeholder="Выберите дополнительное поле"
                                        optionFilterProp="children"
                                        onChange={this.onChangeField}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {optionsField}
                                    </Select>
                                </Form.Item>
                                <Form.Item style={{display:"flex",justifyContent:"center"}}>
                                    <Button onClick={this.handleConnect}  type="primary"><Icon type="plus-circle"/>Связать с организацией</Button>
                                </Form.Item>
                                <Form.Item style={{display:"flex",justifyContent:"center"}}>
                                    <Button onClick={this.openModal}  type="primary"><Icon type="plus-circle" />Добавить новое поле</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <p>Добавленные поля на <span className={classnames("span", {'span-active': span})} onClick={this.onClickRus}>Русском</span>  <span className={classnames("span", {'span-active': !span})}  onClick={this.onClickKaz} >Казахском</span></p>
                        <div className="list">
                            {span ? <List
                                className="list"
                                size="small"
                                bordered
                                dataSource={listRu}
                                renderItem={(item) =>
                                    <List.Item  className="list-item-basic">
                                        {item.text}<Icon type="delete" onClick={()=>this.handleDelete(item.value)} />
                                    </List.Item>
                                }
                            /> : <List
                                className="list"
                                size="small"
                                bordered
                                dataSource={listKz}
                                renderItem={(item) => <List.Item className="list-item-basic">
                                    {item.text}<Icon type="delete" onClick={()=>this.handleDelete(item.value)} />
                                </List.Item>}
                            />}
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"80px 0"}} >
                        <div>
                            <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                            <span>Шаг 3. Навигация</span>
                        </div>
                        <Button onClick={()=>this.onNext()}  type="primary">Далее<Icon type="right-circle" /></Button>
                        <Modal
                            title="Предупреждение"
                            visible={visible}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="ok" onClick={this.handleOkClose}>
                                    Да
                                </Button>,

                                <Button key="no" onClick={this.handleCancel}>
                                    Нет
                                </Button>,
                            ]}
                        >
                            <p>Вы уверены, что хотите остановить?</p>
                        </Modal>
                        <Modal
                            visible={addVisible}
                            title="Добавить поле"
                            onCancel={this.handleOkCancel}
                            closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                                type="close-circle"/><span
                                style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                            footer={[
                                <Button key="edit" onClick={this.handleOkModal}>
                                    Сохранить
                                </Button>,
                                <Button key="back" onClick={this.handleOkCancel}>
                                    Отменить
                                </Button>,
                            ]}
                        >
                            <Form layout={"vertical"}>
                                <Form.Item label="Тип услугодателя">
                                    <Select
                                        value={this.state.serviceProviderTypeIdAdd}
                                        placeholder="Выберите типа услугодателя"
                                        optionFilterProp="children"
                                        onChange={this.onChangeTypeAdd}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {options}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Метка на русском">
                                    <Input value={labelRu} name="labelRu" onChange={this.onChange} placeholder="Введите на русском"/>
                                </Form.Item>
                                <Form.Item label="Метка на казахском">
                                    <Input value={labelKz} name="labelKz" onChange={this.onChange} placeholder="Введите на казахском"/>
                                </Form.Item>
                                <Form.Item label="Название">
                                    <Input value={name} name="name" onChange={this.onChange} placeholder="Имя"/>
                                </Form.Item>
                                <Form.Item label="Тип">
                                    <Input value={type} name="type" onChange={this.onChange} placeholder="Тип"/>
                                </Form.Item>
                                <Form.Item label="Обязательное поле">
                                    <Switch  onChange={this.onChangeSwitch} />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    serviceType: state.serviceType,
    organization:state.organization,
    field: state.field
});
export default connect(mapStateToProps,{getServiceTypesByOrganization, getFieldsOspt, connectOrganization, createFieldOrganization, deleteConnect, getFields}) (withRouter(AddFieldOrganization));
