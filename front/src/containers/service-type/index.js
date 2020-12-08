import React, { Component } from 'react'
import {Table, Divider, Button, Icon, Input, Form, Upload, message, Select, Switch, InputNumber} from 'antd';
import {connect} from 'react-redux';
import Common from "../../components/common";
import {getAllServiceTypes,} from "../../actions/serviceTypeActions";
import Modal from "antd/es/modal";
import {IP} from "../../actions/types";
import axios from "axios";
import './serviceType.css'
import Spin from "antd/es/spin";
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
class ServiceType extends Component {
    constructor(){
        super();
        this.state= {
            visible: false,
            editvisible: false,
            nameRu: "",
            nameKz: "",
            img: null,
            editnameRu: "",
            editid:null,
            editnameKz: "",
            page: 1,
            query: "",
            deleteVisible: false,
            id: null,
            deleteId: null,
            isGovernment: true,
            isActive: true,
            order:null,
            editOrder: null,
            loading: false,
        }
    }

    handleDelete=(id)=>{
        this.handleError()
        axios
            .put(IP + 'api/service-provider-types/'+id+'/suspend')
            .then(res =>  {
                this.handleLoading();
                message.success("Тип услугодателя успешно удален!")
                this.setState({
                    deleteVisible: false,
                });
                this.props.getAllServiceTypes(this.state, this.handleLoading, this.handleError)
                }
            )
            .catch(err => {
                this.handleLoading()
                message.error("Ошибка при удалении!")

                }
            );
    }
    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false
        })
    };
    openDeleteModal = id => {
        this.setState({
            deleteVisible:true,
            deleteId:id
        })
    }
    componentDidMount() {
        this.props.getAllServiceTypes(this.state, this.handleLoading, this.handleError);
    }
    openModal=()=>{
        this.setState({
            visible:true,
            nameRu:"",
            nameKz:"",
            img:null,
            imageUrl:null,
        })
    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    openEditModal=(record)=>{
        this.setState({
            editid:record._id,
            editvisible:true,
            editnameRu:record.nameRu,
            editnameKz:record.nameKz,
            isGovernment: record.isGovernment,
            isActive: record.isActive,
            editOrder: record.order,
            imageUrl:IP+record.image,
        })
    }
    handleEditOk = ()=>{
        if(this.state.editnameRu.length > 0 && this.state.editnameKz.length > 0) {
            let fm = new FormData();
            fm.append('nameRu', this.state.editnameRu);
            fm.append('nameKz', this.state.editnameKz);
            fm.append('image',this.state.img);
            fm.append('isGovernment', this.state.isGovernment)
            fm.append('isActive', this.state.isActive)
            fm.append('order', this.state.editOrder)
            this.handleError()
            axios.put(IP+'api/service-provider-types/'+this.state.editid, fm, {
                headers: {
                    'Content-Type' : false,
                    'Process-Data' : false
                }
            }).then(res => {
                this.handleLoading()
                message.success('Тип услугодателя успешно изменен!')
                console.log(res);
                this.setState({
                    editvisible: false,
                });
                this.props.getAllServiceTypes(this.state, this.handleLoading, this.handleError);
            }).catch(err => {
                this.handleLoading()
                message.error('Ошибка при редактировании!')
            })
        } else {
            message.error('Заполните все поля!')
        }
    }

    handleEditCancel=()=>{
        this.setState({
            editvisible:false,

        })
    }
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    onChangeSwitch = value => {
        this.setState({
            isActive: value
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
    handleOk=()=>{
        if(this.state.nameRu.length > 0 && this.state.nameKz.length > 0) {
            let fm = new FormData();
            fm.append('nameRu', this.state.nameRu);
            fm.append('nameKz', this.state.nameKz);
            fm.append('image',this.state.img);
            fm.append('isGovernment',this.state.isGovernment);
            fm.append('order',this.state.order);
            this.handleError()
            axios.post(IP+'api/service-provider-types/', fm, {
                headers: {
                    'Content-Type' : false,
                    'Process-Data' : false
                }
            }).then(res => {
                this.handleLoading()
                message.success("Тип услугодателя успешно добавлен!")
                this.setState({
                    visible: false,
                });
                this.props.getAllServiceTypes(this.state, this.handleLoading, this.handleError);
            }).catch(err => {
                this.handleLoading()
                message.error("Ошибка при добавлении!")
            })
        } else {
            message.error('Заполните все поля!')
        }
    }
    handleChange = info => {
        getBase64(info.file.originFileObj, imageUrl =>
            (this.setState({
                    imageUrl,
                    loading: false,
                    img:info.file.originFileObj
                })
            ))
    };
    onKeyUp=(e)=> {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getAllServiceTypes({query: e.target.value, page:1}, this.handleLoading, this.handleError);
    }
    onChangeType = (value) => {
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
    onChangePage = (page) => {
        this.setState({
            page:page.current
        })
        this.props.getAllServiceTypes({query: this.state.query, page: page.current}, this.handleLoading, this.handleError);
    }
    onChangeOrderAdd = (value) =>{
        this.setState({
            order: value
        })
    }
    onChangeOrderEdit = (value) =>{
        this.setState({
            editOrder: value
        })
    }
    componentWillReceiveProps(props) {
        if(props.serviceType && props.serviceType.serviceAllTypes){
            this.setState({
                order: props.serviceType.serviceAllTypes.total + 1
            })
        }
    }

    render() {
        const {editOrder, order, isGovernment, visible, editvisible, editnameRu, editnameKz, nameRu, nameKz, deleteVisible, isActive} = this.state;
        const columns = [
            {
                title: 'Логотип',
                dataIndex: 'image',
                key: 'image',
                render: image => <img src={IP+image} style={{width:"40px"}} alt="img"/>,

            },
            {
                title: 'Название типа услугодателя на русском',
                dataIndex: 'nameRu',
                key: 'nameRu',
            },
            {
                title: 'Название типа услугодателя на казахском',
                dataIndex: 'nameKz',
                key: 'nameKz',
            },
            {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <a onClick={()=>this.openEditModal(record)}><Icon type="edit"/>Редактировать </a>
        <Divider type="vertical" />
        <a onClick={()=>this.openDeleteModal(record._id)}> <Icon type="delete" />Удалить</a>
      </span>
                ),
            },
        ];
        const {serviceAllTypes} = this.props.serviceType;
        let  data = [];
            if(serviceAllTypes.serviceProviderTypes) {
               data= serviceAllTypes.serviceProviderTypes.map((item, i) => {
                    return {
                        ...item,
                        key: i,
                    }
                })
            }
            else {
                data=[]
            }


        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Типы услугодателей</h5>
                                <p className="title-text">Список типов услугодателей который был добавлен в систему</p>
                                <Input onKeyUp={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите русское название типа" prefix={<Icon type="search"/>} />
                            </div>
                            <div className="org-link" >
                                <Button onClick={this.openModal} type="primary"><Icon type="plus-circle"/>Добавить типа услугодателя</Button>
                            </div>
                        </div>
                        {data.length===0 ? <Common/> : <Table pagination={{total:serviceAllTypes ? serviceAllTypes.total : 0,pageSize:serviceAllTypes ? serviceAllTypes.pageSize : 0,current:this.state.page}} onChange={this.onChangePage}  columns={columns} dataSource={data} />}
                    </div>
                    <Modal
                        visible={visible}
                        title="Добавить тип услуги"
                        onCancel={this.handleCancel}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        footer={[
                            <Button key="edit" onClick={this.handleOk}>
                                Сохранить
                            </Button>,
                            <Button key="back" onClick={this.handleCancel}>
                                Отменить
                            </Button>,

                        ]}
                    >
                        <Form layout={"vertical"}>
                            <Form.Item label="Тип услуги">
                                 <Input value={nameRu} name="nameRu" onChange={this.onChange} placeholder="Введите на русском" />
                            </Form.Item>
                            <Form.Item>
                                <Input value={nameKz} name="nameKz" onChange={this.onChange} placeholder="Введите на казахском" />
                            </Form.Item>
                            <Form.Item label="Тип">
                                <Select
                                    showSearch
                                    defaultValue="government"
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
                            </Form.Item>
                            <Form.Item label="Последовательность">
                                <InputNumber  min={1} max={serviceAllTypes ? serviceAllTypes.total+1 : 1} value={order} onChange={this.onChangeOrderAdd} />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        visible={editvisible}
                        title="Редактировать тип услуги"
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
                            <Form.Item label="Тип услуги">
                                <Input value={editnameRu} name="editnameRu" onChange={this.onChange} placeholder="Введите на русском" />
                            </Form.Item>
                            <Form.Item>
                                <Input value={editnameKz} name="editnameKz" onChange={this.onChange} placeholder="Введите на казахском" />
                            </Form.Item>
                            <Form.Item label="Тип">
                                <Select
                                    showSearch
                                    defaultValue="government"
                                    placeholder="Выберите тип"
                                    value={isGovernment ? "Государственный" : "Бизнес"}
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
                            <Form.Item label="Загрузите изображение">
                                <Upload
                                    name="img"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    customRequest={()=>{}}
                                    beforeUpload={beforeUpload}
                                    onChange={this.handleChange}
                                >
                                    {imageUrl ? <img className="avatar-default" src={imageUrl} alt="avatar" />  : uploadButton}
                                </Upload>
                            </Form.Item>
                            <div style={{display:"flex"}}>
                                <Form.Item label="Активация">
                                    <Switch checked={isActive}  onChange={this.onChangeSwitch} />
                                </Form.Item><br/>
                                <Form.Item label="Последовательность" style={{marginLeft:"80px"}}>
                                    <InputNumber  min={1} max={serviceAllTypes ? serviceAllTypes.total : 0} value={editOrder} onChange={this.onChangeOrderEdit} />
                                </Form.Item>
                            </div>
                        </Form>
                    </Modal>
                    <Modal
                        title="Удалить"
                        visible={deleteVisible}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}} type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        onCancel={this.handleDeleteCancel}
                        footer={[
                            <Button style={{background:"#000",color:"#fff"}} key="ok" onClick={()=>this.handleDelete(this.state.deleteId)}>
                                <Icon type="check-circle" />Да, удалить
                            </Button>,
                            <Button key="no" onClick={this.handleDeleteCancel}>
                                <Icon type="close-circle" /> Нет, не удалять
                            </Button>,
                        ]}
                    >
                        <p>Вы уверены что хотите удалить тип услугодателя?</p>
                    </Modal>
                </Spin>
            </div>

        )
    }
}
const mapStateToProps=(state)=>({
    serviceType: state.serviceType,
    service: state.service,
});

export  default connect(mapStateToProps,{getAllServiceTypes}) (ServiceType);