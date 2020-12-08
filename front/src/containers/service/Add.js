import React,{Component} from "react";
import {Button, Form,  Icon, List, message} from 'antd';
import classnames from "classnames";
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import AutoComplete from "antd/es/auto-complete";
import Select from "antd/es/select";
import {getServiceTypesByOrganization} from "../../actions/serviceTypeActions";
import {
    addService,
    addServiceConnect,
    deleteServiceOrganization,
    getAllServices,
    getServices
} from "../../actions/serviceActions";
import './service.css'
import Modal from "antd/es/modal";
import TextArea from "antd/es/input/TextArea";
import Spin from "antd/es/spin";
const { Option } = Select;


class AddService extends Component{
    constructor(){
        super();
        this.state={
            nameKz:'',
            span:true,
            nameRu:'',
            selected:false,
            organization_id:null,
            service_type_id:null,
            service_id:null,
            query:[],
            visible: false,
            selectedType:'',
            disabled: false,
            loading: false,
        }
    }

    onChangeAuto1=(value)=> {
        this.setState({
            nameRu:value,
        });
        console.log(this.state.nameRu)

    };
     onChange=(value)=> {
         this.setState({
             service_type_id:value,
         })
         this.setState({
             nameKz:'',
             nameRu:''
         })
     }
    onSelect=(value)=>{
        this.setState({
            selected:true,
            disabled:true,
            service_id:this.props.service.services[value]._id,
            nameKz: this.props.service.services[value].nameKz,
            nameRu: this.props.service.services[value].nameRu
        })
    }
    handleOk=e=>{
        e.preventDefault();
        let data = {
            nameKz: this.state.nameKz,
            nameRu: this.state.nameRu,
            organizationId: this.state.organization_id,
            serviceProviderTypeId: this.state.service_type_id,
            
        };
        let dataConnect={
            organizationId:this.state.organization_id,
            serviceId: this.state.service_id,
            serviceProviderTypeId: this.state.service_type_id,
        }

        if(this.state.selected && this.state.service_id && this.state.service_type_id){
            this.props.addServiceConnect(dataConnect, this.handleError, this.handleLoading)

        } else if (this.state.nameKz && this.state.nameRu && this.state.service_type_id) {
            this.props.addService(data, this.handleError, this.handleLoading);
        }

        this.setState({
            nameKz:"",
            nameRu:"",
            selected:false,
            disabled:false
        })
        this.props.getServices({query:'', lang:'ru',service_type_id: this.state.service_type_id});
        this.props.getServices({query:'', lang:'kz',service_type_id: this.state.service_type_id});
    };
    onChangeAuto2=(value)=> {
        this.setState({
            nameKz:value,
        });
    };

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
    }
    onNext=()=>{
        this.props.history.push('/dashboard/category/add');
        this.props.service.services=[]
    };

    onPrev=()=>{
        this.props.history.push('/dashboard/field/add');
        this.props.service.services=[]
    }
    onSelectType = e => {
        this.props.getServices({query:'', lang:'ru', service_type_id:e});
        this.props.getServices({query: '', lang:'kz', service_type_id:e});
    }

    handleSearch1 = value => {
       this.props.getServices({query:value, lang:'ru',service_type_id:this.state.service_type_id});
    };
    handleSearch2 = value => {
        this.props.getServices({query: value, lang:'kz',service_type_id:this.state.service_type_id});
    };
    componentDidMount() {
        let id = localStorage.getItem('organization_id');
        this.setState({
            organization_id:id
        })
        this.props.getAllServices(id);
        this.props.getServiceTypesByOrganization(id, this.handleError, this.handleLoading);
    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/organizations');
        localStorage.removeItem('organization_id')
    }
    handleClose = () => {
        this.setState({
            visible: true,
        })
    }
    handleDelete = (value, serviceProviderTypeId) => {
        this.props.deleteServiceOrganization({organizationId:localStorage.getItem('organization_id'),serviceId:value,serviceProviderTypeId:serviceProviderTypeId},
            this.handleError, this.handleLoading);
    };
    resetInput=()=>{
        this.setState({
            nameRu: '',
            nameKz: '',
            disabled: false,
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
        const {span,nameKz,nameRu,visible,disabled}=this.state;
        const {serviceTypesById}=this.props.serviceType;
        const {services,allServices} = this.props.service;
        let dataRu = [],listRu=[],optionsSelect=[];
        let dataKz = [],listKz=[];

        if(serviceTypesById && serviceTypesById.spts && serviceTypesById.spts.length>0){
            for(let i=0;i<serviceTypesById.spts.length;i++) {
                optionsSelect.push({
                    text: serviceTypesById.spts[i].nameRu,
                    value: serviceTypesById.spts[i].id
                });
            }
        }
        if(services && services.length>0){
            for (let i = 0; i < services.length; i++) {
                    if(services[i]) {
                        listRu.push({text: services[i].nameRu, value: i})
                        listKz.push({text: services[i].nameKz, value: i})
                    }
            }
        }
        if(allServices && allServices.length>0){
            for (let i = 0; i < allServices.length; i++) {
                dataRu.push({text: allServices[i].serviceProviderType.nameRu, value: i,id:"serviceType"});
                dataKz.push({text: allServices[i].serviceProviderType.nameKz, value: i,id:"serviceType"});

                for(let j=0;j<allServices[i].services.length;j++) {
                    dataRu.push({text: allServices[i].services[j].nameRu, value: allServices[i].services[j].id,serviceProviderTypeId:allServices[i].serviceProviderType._id });
                    dataKz.push({text: allServices[i].services[j].nameKz, value: allServices[i].services[j].id,serviceProviderTypeId:allServices[i].serviceProviderType._id});
                }
            }
        }

        let options;
        if(optionsSelect && optionsSelect.length>0){
            options = optionsSelect.map((item,i)=>(
                <Option key={i} value={item.value}>{item.text}</Option>
            ))
        }

        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p onClick={this.handleClose} style={{border:"none",outline:"none",cursor:"pointer"}} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-add">

                        <div className="add-inner">
                            <h2 className="h5-title">Шаг 5/8. Услуги</h2>
                            <p className="title-text">Добавьте услуги которая предоставляет данная организация на двух языках.</p>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                <Form.Item label="Тип услугодателя ">
                                    <Select
                                        style={{ width: 600 }}
                                        placeholder="Выберите тип услугодателя"
                                        optionFilterProp="children"
                                        onChange={this.onChange}
                                        onSelect={this.onSelectType}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                       {options}
                                    </Select>
                                </Form.Item>

                               <div style={{display:"flex"}}>
                                <Form.Item label="Вид услуги "  >
                                    <div style={ disabled ? { background:"#f5f5f5"} : { background:"#fff"} }>
                                    <AutoComplete
                                        value={nameRu}
                                        disabled={disabled}
                                        style={{ width: 600 }}
                                        onSelect={this.onSelect}
                                        onSearch={this.handleSearch1}
                                        onChange={this.onChangeAuto1}
                                        dataSource={listRu}
                                        placeholder="Введите на русском"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    >
                                        <TextArea
                                            style={{ height: 50 }}

                                        />
                                    </AutoComplete>
                                    </div>

                                </Form.Item>
                                    <Form.Item>
                                        <Button style={{marginTop:"35px",marginLeft:"10px",border:"none",outline:"none"}}  onClick={this.resetInput}><Icon type="close"/></Button>
                                    </Form.Item>
                               </div>
                                <Form.Item>
                                    <div style={ disabled ? { background:"#f5f5f5"} : { background:"#fff"} }>
                                    <AutoComplete
                                        disabled={disabled}
                                        value={nameKz}
                                        onSelect={this.onSelect}
                                        onSearch={this.handleSearch2}
                                        style={{ width: 600 }}
                                        onChange={this.onChangeAuto2}
                                        dataSource={listKz}
                                        placeholder="Введите на казахском"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    >
                                        <TextArea
                                            style={{ height: 50 }}
                                        />
                                    </AutoComplete>
                                    </div>
                                </Form.Item>
                                <Form.Item style={{display:"flex",justifyContent:"center"}}>
                                    <Button onClick={this.handleOk}  type="primary"><Icon type="plus-circle" />Добавить услугу</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="block-title">
                            <p>Добавленные услуги на <span className={classnames("span", {'span-active': span})} onClick={this.onClickRus} >Русском</span>  <span className={classnames("span", {'span-active': !span})}  onClick={this.onClickKaz} >Казахском</span></p>
                            <div className="colors">
                                <div className="serviceType">
                                    <div className="service-type-color"/>
                                    <span> - Тип услуги</span>
                                </div>
                                <div className="serviceType">
                                    <div className="category-color"/>
                                    <span> - Услуги </span>
                                </div>
                            </div>
                        </div>
                        <div className="list">
                            {span ? <List
                                className="list"
                                size="small"
                                bordered
                                dataSource={dataRu}
                                renderItem={(item) => {
                                    return item.id === 'serviceType' ?
                                        <List.Item className="list-item-service">
                                            {item.text}
                                        </List.Item>
                                        :
                                        <List.Item className="list-item-category">
                                            {item.text}
                                            <Icon type="delete"
                                                  onClick={() => this.handleDelete(item.value, item.serviceProviderTypeId)}/>
                                        </List.Item>
                                }}
                            /> : <List
                                className="list"
                                size="small"
                                bordered
                                dataSource={dataKz}
                                renderItem={
                                    (item) =>
                                    {
                                        return item.id === 'serviceType' ?
                                            <List.Item className="list-item-service">
                                                {item.text}
                                            </List.Item>
                                            :
                                            <List.Item className="list-item-category">
                                                {item.text}
                                                <Icon type="delete" onClick={() => this.handleDelete(item.value,item.serviceProviderTypeId)}/>
                                            </List.Item>
                                    }}
                            />}
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end", padding:"80px 0"}} >
                        <div>
                        <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                        <span>Шаг 4. Дополнительные поля</span>
                        </div>
                        <Button onClick={this.onNext}  type="primary">Далее<Icon type="right-circle" /></Button>
                    </div>
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
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    service: state.service,
    serviceType: state.serviceType,
});

export default connect(mapStateToProps,{deleteServiceOrganization,getServiceTypesByOrganization,getServices,addService,addServiceConnect,getAllServices}) (withRouter(AddService));
