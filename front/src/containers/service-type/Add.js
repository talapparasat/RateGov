import React,{Component} from "react";
import {Button, Form, Icon, List, Upload, message, InputNumber, Checkbox, Spin} from 'antd';
import classnames from "classnames";
import {withRouter} from "react-router-dom";
import './serviceType.css'
import {connect} from 'react-redux'
import AutoComplete from "antd/es/auto-complete";
import {
    addServiceType,
    addServiceTypeConnect, addSurvey,
    deleteServiceType, deleteSurvey,
    getServiceType, getServiceTypesByOrganization
} from "../../actions/serviceTypeActions";
import {getOrganizationById} from "../../actions/organizationActions";
import Modal from "antd/es/modal";
import Select from "antd/es/select";
import Tooltip from "antd/es/tooltip";
const {Option} = Select

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Размер картинки не должен превышать 2МБ!');
    }
}
class AddServiceType extends Component{
    constructor(){
        super();
        this.state={
            nameKz: '',
            span: true,
            nameRu: '',
            selected: false,
            organizationId: null,
            service_provider_type_id: null,
            visible: false,
            disabled: false,
            isGovernment: true,
            order: null,
            editOrder: null,
            loading: false,
        }
    }

     onChangeAuto1=(value)=> {
        console.log(value);
        this.setState({
            nameRu:value,
        });

    };
    onSelect=(value)=>{
        this.setState({
            selected:true,
            disabled:true,
            service_provider_type_id:this.props.serviceType.serviceTypes[value]._id,
            nameKz: this.props.serviceType.serviceTypes[value].nameKz,
            nameRu: this.props.serviceType.serviceTypes[value].nameRu
        })
    }
    handleSearch1 = value => {

        this.props.getServiceType({query: value, lang:'ru'});
    };
    handleSearch2 = value => {

        this.props.getServiceType({query: value, lang:'kz'});
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
    };
    handleOk=e=>{
        e.preventDefault();
        let data = {
            nameKz: this.state.nameKz,
            nameRu: this.state.nameRu,
            image: this.state.img,
            isGovernment: this.state.isGovernment,
            organization_id: this.state.organizationId
        };
        let dataConnect={
            organizationId: this.state.organizationId,
            serviceProviderTypeId: this.state.service_provider_type_id,
        };
        if (this.state.nameKz && this.state.nameRu) {
            if (this.state.selected) {
                this.props.addServiceTypeConnect(dataConnect, this.handleError, this.handleLoading);
            } else {
                this.props.addServiceType(data, this.handleError, this.handleLoading);
            }
        } else {
            message.error('Заполните все поля!')
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
    handleDelete=value=>{
     let serviceType = this.props.serviceType.serviceTypesById.spts[value].id;
     let data ={
         serviceType:serviceType,
         organizationId: this.state.organizationId
     }
     this.props.deleteServiceType(data, this.handleError, this.handleLoading);
    };
    onPrev=()=>{
        this.props.history.push('/dashboard/organizations/add');
    };
    onNext=()=>{
       this.props.history.push('/dashboard/navigation/add');
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

    componentDidMount() {
       let id = localStorage.getItem('organization_id');
       this.setState({
        organizationId:id
       });
       this.props.getServiceType();
        this.props.getServiceTypesByOrganization(id, this.handleError, this.handleLoading);
    }
    handleClose=()=>{
        this.setState({
            visible:true,
        })
    }
    handleLoading = () => {
        this.setState({
            loading: false
        })
    }
    onChangeType = (value) => {
        console.log(value)
        if(value === 'business'){
            this.setState({
                isGovernment: false
            })
        }
        else {
            this.setState({
                isGovernment: true
            })
        }
    }
    handleChange = info => {
        console.log(info.file.originFileObj)
        getBase64(info.file.originFileObj, imageUrl =>
            (this.setState({
                    imageUrl,
                    loading: false,
                    img:info.file.originFileObj
                })
            ))
    };
    handleError = () => {
        this.setState({
            loading: true,
        })
    }
    resetInput=()=>{
        this.setState({
            nameRu:'',
            nameKz:'',
            disabled:false,
        })
    }
    onChangeOrder = value => {
        console.log(value)
        this.setState({
            order: value
        })
    }
    onChangeSurvey = (e) => {
        let id = Number(e.target.name)
        let serviceType = this.props.serviceType.serviceTypesById.spts[id].id;
        let data = {
            organizationId: this.state.organizationId,
            serviceProviderTypeId: serviceType
        }
        if(data.organizationId && data.serviceProviderTypeId) {
            if(e.target.checked) {
                this.props.addSurvey(data, this.handleError, this.handleLoading)
            }
            else {
                this.props.deleteSurvey(data, this.handleError, this.handleLoading)
            }
        }
        this.setState({
            surveyValue: e.target.value
        })
    }
    // componentWillReceiveProps(props) {
    //     let surveyValue = false;
    //     if(this.props.serviceType.serviceTypesById && this.props.serviceType.serviceTypesById.spts &&  this.props.serviceType.serviceTypesById.spts.length>0){
    //         for(let i = 0;i < this.props.serviceType.serviceTypesById.spts.length;i++){
    //             surveyValue = this.props.serviceType.serviceTypesById.spts[i].survey;
    //         }
    //     }
    //     this.setState({
    //         surveyValue: surveyValue
    //     })
    // }

    render(){
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const {span,nameKz,nameRu,visible,disabled, editOrder} = this.state;
        const {serviceTypes,serviceTypesById} = this.props.serviceType;
        let dataRu = [];
        let dataKz = [];
        let listRu=[];
        let listKz=[];
        let max = serviceTypesById ? serviceTypesById.total+1 : 0
        if(serviceTypes && serviceTypes.length>0){
            for(let i=0;i<serviceTypes.length;i++){
                dataRu.push({text: serviceTypes[i].nameRu, value: i});
                dataKz.push({text: serviceTypes[i].nameKz, value: i});
            }
        }
        if(serviceTypesById && serviceTypesById.spts &&  serviceTypesById.spts.length>0){
            for(let i = 0;i < serviceTypesById.spts.length;i++){
                listRu.push({text: serviceTypesById.spts[i].nameRu, value: i, survey: serviceTypesById.spts[i].survey});
                listKz.push({text: serviceTypesById.spts[i].nameKz, value: i, survey: serviceTypesById.spts[i].survey});
            }
        }
        let loadingComponent = ''
        if (!this.state.loading) {
            loadingComponent  =  <div style={{width: "100%", height: "100%", background: "#000", opacity: 0.1, position: "absolute", zIndex: '2'}}>
               <Spin />
           </div>
        }
        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p style={{border:"none",outline:"none",cursor:"pointer"}} onClick={this.handleClose} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-add">
                        <div className="add-inner">
                            <h2 className="h5-title">Шаг 2/7. Тип услугодателя</h2>
                            <p className="title-text">Пожалуйста, введите тип услугодателя данной организации</p>

                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                <div style={{display:"flex"}}>
                                    <Form.Item label="Тип услугодателя">
                                        <div style={ disabled ? { background:"#f5f5f5"} : { background:"#fff"} }>
                                            <AutoComplete
                                                disabled={disabled}
                                                value={nameRu}
                                                style={{ width: 600 }}
                                                onSelect={this.onSelect}
                                                onChange={this.onChangeAuto1}
                                                onSearch={this.handleSearch1}
                                                dataSource={dataRu}
                                                placeholder="Введите на русском"
                                                filterOption={(inputValue, option) =>
                                                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                }
                                            />
                                        </div>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button style={{marginTop: "25px", marginLeft: "10px", border: "none", outline: "none"}}  onClick={this.resetInput}><Icon type="close"/></Button>
                                    </Form.Item>
                                </div>
                                <Form.Item>
                                    <div style={ disabled ? { background:"#f5f5f5"} : { background:"#fff"} }>
                                        <AutoComplete
                                            disabled={disabled}
                                            value={nameKz}
                                            onSelect={this.onSelect}
                                            style={{ width: 600 }}
                                            onChange={this.onChangeAuto2}
                                            onSearch={this.handleSearch2}
                                            dataSource={dataKz}
                                            placeholder="Введите на казахском"
                                            filterOption={(inputValue, option) =>
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />
                                    </div>
                                </Form.Item>
                                <Form.Item label="Тип">
                                    <Select
                                        defaultValue="government"
                                        style={{ width: 600 }}
                                        placeholder="Выберите тип"
                                        optionFilterProp="children"
                                        onChange={this.onChangeType}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option value="government">Государственный</Option>
                                        <Option value="business">Бизнес</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Последовательность">
                                    <InputNumber style={{width: "100%"}}  min={1} max={max ? max : 1} value={max ? max : 1} onChange={this.onChangeOrder} />
                                </Form.Item>
                                <Form.Item label="Загрузите изображение">
                                    <Upload
                                        name="img"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        customRequest={()=>{}}
                                        beforeUpload={beforeUpload}
                                        onUpload={this.onUpload}
                                        onChange={this.handleChange}
                                    >
                                        {imageUrl ? <img className="avatar-default" src={imageUrl} alt="avatar" />  : uploadButton}
                                    </Upload>
                                    <p className="title-text">Размер картинки не должен превышать 2 МБ!</p>
                                </Form.Item>
                                <Form.Item style={{display:"flex",justifyContent:"center"}}>
                                    <Button onClick={this.handleOk}  type="primary"><Icon type="plus-circle" />Добавить тип</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <p>Добавленные типы услугодателей на <span className={classnames("span", {'span-active': span})} onClick={this.onClickRus} >Русском</span>  <span className={classnames("span", {'span-active': !span})}  onClick={this.onClickKaz} >Казахском</span></p>
                        <div className="list">
                            {span ? <List
                                className="list"
                                size="small"
                                bordered
                                dataSource={listRu}
                                renderItem={(item, i) =>
                                    <List.Item  className="list-item-basic">
                                        {item.text}
                                        <span style={{ display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                                            <Tooltip title="Опросник">
                                                 <Checkbox checked={item.survey}  onChange={this.onChangeSurvey} name={String(i)}  style={{marginRight: '20px'}}/>
                                            </Tooltip>
                                            <Icon type="delete" onClick={()=>this.handleDelete(item.value)} />
                                        </span>
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
                        <span>Шаг 1. Наименование организации</span>
                        </div>
                        <Button onClick={()=>this.onNext(this.state.organization_id)}  type="primary">Далее<Icon type="right-circle" /></Button>
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
                    </div>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    serviceType: state.serviceType,
    organization:state.organization,

});
export default connect(mapStateToProps,{getServiceType, addServiceType, deleteServiceType, addServiceTypeConnect, getServiceTypesByOrganization, getOrganizationById, addSurvey, deleteSurvey}) (withRouter(AddServiceType));
