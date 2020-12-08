import React, { Component } from 'react'
import {Table, Divider, Button, Icon, Input, Form, message} from 'antd';
import {connect} from 'react-redux';
import Common from "../../components/common";
import {getAllServiceSearch} from "../../actions/serviceActions";
import Modal from "antd/es/modal";
import axios from "axios";
import {IP} from "../../actions/types";
import TextArea from "antd/es/input/TextArea";
import Spin from "antd/es/spin";

class Service extends Component {
    constructor(){
        super();
        this.state={
            service_type_id:null,
            page:1,
            query:"",
            visible: false,
            editvisible:false,
            nameRu:"",
            nameKz:"",
            img:'',
            editnameRu:"",
            editnameKz:"",
            deleteVisible:false,
            id:null,
            deleteId:null,
            loading: false,
        }
    }
    openDeleteModal = id => {
        console.log(id)
        this.setState({
            deleteVisible:true,
            deleteId:id
        })
    }

    onChange=(e)=> {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    componentDidMount() {
        this.props.getAllServiceSearch(this.state, this.handleLoading, this.handleError);
    }
    openModal=()=>{
        this.setState({
            visible:true,
            nameRu:'',
            nameKz:''
        })
    }
    handleCancel=()=>{
        this.setState({
            visible:false
        })
    }
    openEditModal=(record)=>{
        console.log(record)
        this.setState({
            editvisible:true,
            editnameRu:record.nameRu,
            editnameKz:record.nameKz,
            editid:record._id
        })
    }
    handleEditCancel=()=>{
        this.setState({
            editvisible:false
        })
    }

    handleDelete=(id)=>{
        this.handleError()
        axios.put(IP + 'api/service-names/'+id+'/suspend')
            .then(res=>  {
                this.handleLoading()
                message.success('Услуга успешно удалена!')
                    this.setState({
                        deleteVisible:false
                    })
                    this.props.getAllServiceSearch(this.state, this.handleLoading, this.handleError)
                }
            )
            .catch(err=> {
                this.handleLoading()
                message.error('Ошибка при удалении!')
                }
            );
    }
    handleEditOk = ()=>{
        let data ={
            nameRu:this.state.editnameRu,
            nameKz:this.state.editnameKz,
        }
        this.handleError()
        if (this.state.editnameRu.length > 0 && this.state.editnameKz.length > 0) {
            axios.put(IP + 'api/service-names/' + this.state.editid, data)
                .then(res => {
                        this.handleLoading()
                        message.success('Услуга успешно изменена!')
                        this.setState({
                            editvisible: false,
                        });
                        this.props.getAllServiceSearch(this.state, this.handleLoading, this.handleError)
                    }
                )
                .catch(err => {
                        this.handleLoading()
                        message.success('Ошибка при изменении!')
                        alert(err);
                    }
                );
        } else {
            message.error('Заполните все поля!');
        }

    }
    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false
        })
    };
    handleOk=()=>{
        let data ={
            nameRu:this.state.nameRu,
            nameKz:this.state.nameKz,
        }
        if (this.state.nameRu.length > 0 && this.state.nameKz.length > 0) {
            this.handleError()
            axios.post(IP + 'api/service-names/', data)
                .then(res => {
                        this.handleLoading()
                        message.success('Услуга успешно добавлена!');
                        this.setState({
                            visible: false,
                        });
                        this.props.getAllServiceSearch(this.state, this.handleLoading, this.handleError)
                    }
                )
                .catch(err => {
                        this.handleLoading()
                        message.error('Ошибка при добавлении!')
                    }
                );
            } else {
                 message.error('Заполните все поля!')
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
    onKeyUp=(e)=> {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getAllServiceSearch({query: e.target.value, page: this.state.page}, this.handleLoading, this.handleError);
    }

    onChangePage=(page,pageSize)=>{
        console.log(page)
        this.setState({
            page:page.current
        })
        this.props.getAllServiceSearch({query: this.state.query, page: page.current}, this.handleLoading, this.handleError);
    }
    render() {
        const {visible,editvisible,editnameRu,editnameKz,nameRu,nameKz,deleteVisible}=this.state;
        let actionColumn={},addButton='';
        const {user}=this.props

        if(user.profile.role === "superadmin" || user.profile.role==="admin"){
            console.log(1)
            actionColumn =   {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <Button type="link" onClick={() => this.openEditModal(record)}><Icon type="edit"/>Редактировать</Button>
        <Divider type="vertical"/>
        <Button type="link" onClick={() => this.openDeleteModal(record._id)}> <Icon type="delete"/>Удалить</Button>
      </span>
                ),
            }
            addButton=<Button onClick={this.openModal} type="primary"><Icon type="plus-circle"/>Добавить услугу</Button>
        }

        const columns = [
            {
                title: 'Название  услуги на русском',
                dataIndex: 'nameRu',
                key: 'nameRu',
            },
            {
                title: 'Название услуги на казахском',
                dataIndex: 'nameKz',
                key: 'nameKz',

            },
            actionColumn
        ];

        const {allServices}=this.props.service;
        let  data;
        if(allServices.serviceNames) {
            data= allServices.serviceNames.map((item, i) => {
                return {
                    ...item,
                    key: i,
                }
            })
        }
        else {
            data=[]
        }


        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Услуги</h5>
                                <p className="title-text">Список услуг который был добавлен в систему</p>
                                <Input  onKeyUp={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите русское название услуги" prefix={<Icon type="search"/>}/>
                            </div>
                            <div className="org-link" >
                               {addButton}
                            </div>
                        </div>
                        {data.length===0 ? <Common/> : <Table pagination={{total:allServices ? allServices.total : 0,pageSize:allServices ? allServices.pageSize : 0,current:this.state.page}} onChange={this.onChangePage}    columns={columns} dataSource={data} />}
                    </div>
                    <Modal
                        visible={visible}
                        title="Добавить услуги"
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
                            <Form.Item label="Услуги">
                                <TextArea value={nameRu} name="nameRu" onChange={this.onChange} placeholder="Введите на русском"/>
                            </Form.Item>
                            <Form.Item>
                                <TextArea value={nameKz} name="nameKz" onChange={this.onChange} placeholder="Введите на казахском"/>
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
                            <Form.Item label="Услуги">
                                <TextArea value={editnameRu} name="editnameRu" onChange={this.onChange} placeholder="Введите на русском"/>
                            </Form.Item>
                            <Form.Item>
                                <TextArea value={editnameKz} name="editnameKz" onChange={this.onChange} placeholder="Введите на казахском" />
                            </Form.Item>
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
                            <Button style={{background:"#000",color:"#fff"}} key="ok" onClick={()=>this.handleDelete(this.state.deleteId)}>
                                <Icon type="check-circle" />Да, удалить
                            </Button>,
                            <Button key="no" onClick={this.handleDeleteCancel}>
                                <Icon type="close-circle" /> Нет, не удалять
                            </Button>,
                        ]}
                    >
                        <p>Вы уверены что хотите удалить услугу?</p>
                    </Modal>
                </Spin>
            </div>

        )
    }
}
const mapStateToProps=(state)=>({
    service: state.service,
    user:state.user
});

export  default connect(mapStateToProps,{getAllServiceSearch}) (Service);