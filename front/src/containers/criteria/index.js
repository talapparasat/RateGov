import React, { Component } from 'react'
import {Table, Divider, Button, Icon, Input, Form, message,} from 'antd';
import {connect} from 'react-redux';
import Common from "../../components/common";
import Modal from "antd/es/modal";
import { getAllCriteriaSearch} from "../../actions/criteriaActions";
import axios from "axios";
import {IP} from "../../actions/types";
import Spin from "antd/es/spin";

class Criteria extends Component {
    constructor(){
        super();
        this.state={
            visible: false,
            editvisible:false,
            nameRu:"",
            nameKz:"",
            img:'',
            editnameRu:"",
            editnameKz:"",
            query:"",
            page:1,
            deleteVisible:false,
            id:null,
            deleteId:null,
            editid:null,
            loading: false,
        }
    }
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    handleDelete = (id) => {
        this.handleError()
        axios.put(IP + 'api/service-criterias/'+id+'/suspend')
            .then(res=>  {
                this.handleLoading()
                message.success("Критерий успешно удален!")
                this.setState({
                    deleteVisible:false
                })
                    this.props.getAllCriteriaSearch(this.state, this.handleLoading, this.handleError)
                }
            )
            .catch(err=> {
                this.handleLoading()
                message.error("Ошибка при удалении!")
                }
            );
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
    handleEditOk = ()=>{
        let data ={
            nameRu:this.state.editnameRu,
            nameKz:this.state.editnameKz,
        }
        if(this.state.editnameRu.length > 0 && this.state.editnameKz.length > 0) {
            this.handleError();
            axios.put(IP + 'api/service-criterias/' + this.state.editid, data)
                .then(res => {
                    this.handleLoading()
                    message.success('Критерий успешно изменен!')
                        this.setState({
                            editvisible: false,
                        });
                        this.props.getAllCriteriaSearch(this.state, this.handleLoading, this.handleError)
                    }
                )
                .catch(err => {
                    this.handleLoading()
                    message.error('Ошибка при редактировании!')
                    }
                );
        } else {
            message.error('Заполните все поля!')
        }
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
        this.props.getAllCriteriaSearch(this.state, this.handleLoading, this.handleError)
    }

    openModal=()=>{
        this.setState({
            visible:true,
            nameKz:'',
            nameRu:'',
        })
    }
    handleCancel=()=>{
        this.setState({
            visible:false
        })
    }
    openEditModal=(record)=>{
        this.setState({
            editvisible:true,
            editnameRu:record.nameRu,
            editnameKz:record.nameKz,
            editid:record._id,
        })
    }
    handleEditCancel=()=>{
        this.setState({
            editvisible:false
        })
    }
    onKeyUp=e=> {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getAllCriteriaSearch({query: e.target.value, page: this.state.page}, this.handleLoading, this.handleError);
    }
    onChangePage=(page,pageSize)=>{
        console.log(page)
        this.setState({
            page:page.current
        })
        this.props.getAllCriteriaSearch({query: this.state.query, page: page.current}, this.handleLoading, this.handleError);
    }
    handleOk=()=>{
        let data ={
            nameRu:this.state.nameRu,
            nameKz:this.state.nameKz,
        }
        if(this.state.nameRu.length > 0 && this.state.nameKz.length > 0) {
            this.handleError()
            axios.post(IP + 'api/service-criterias/', data)
                .then(res => {
                    this.handleLoading()
                    message.success("Критерий успешно добавлен!")
                        this.setState({
                            visible: false,
                        });
                        this.props.getAllCriteriaSearch(this.state, this.handleLoading, this.handleError)
                    }
                )
                .catch(err => {
                    this.handleLoading()
                    message.error("Ошибка при добавлении!")
                    }
                );
        } else {
            message.error('Заполните все поля!')
        }
    }
    render() {
        const columns = [
            {
                title: 'Название критерии на русском',
                dataIndex: 'nameRu',
                key: 'nameRu',
            },
            {
                title: 'Название критерии на казахском',
                dataIndex: 'nameKz',
                key: 'nameKz',
            },
            {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <Button type="link" onClick={()=>this.openEditModal(record)}><Icon type="edit"/>Редактировать </Button>
        <Divider type="vertical" />
        <Button type="link" onClick={()=>this.openDeleteModal(record._id)}> <Icon type="delete" />Удалить</Button>
      </span>
                ),
            },
        ];

        const {criteriasAll}=this.props.criteria;
        let  data=[]
        if(criteriasAll.serviceCriterias) {
            data= criteriasAll.serviceCriterias.map((item, i) => {
                return {
                    ...item,
                    key: i,
                }
            })
        }
        const {visible, editvisible, nameRu, nameKz, editnameRu, editnameKz,deleteVisible}=this.state;
        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Критерий оценок</h5>
                                <p className="title-text">Список критерии который был добавлен в систему</p>
                                <Input onKeyUp={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите русское название критерии" prefix={<Icon type="search"/>} />

                            </div>
                            <div className="org-link" >
                                <Button onClick={this.openModal} type="primary"><Icon type="plus-circle"/>Добавить критерий</Button>
                            </div>
                        </div>
                        {data.length===0 ? <Common/> : <Table pagination={{total:criteriasAll ? criteriasAll.total : 0,pageSize:criteriasAll ? criteriasAll.pageSize : 0,current:this.state.page}} onChange={this.onChangePage} columns={columns} dataSource={data} />}
                    </div>
                    <Modal
                        visible={visible}
                        title="Добавить критерий"
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
                            <Form.Item label="Название критерий">
                                <Input value={nameRu} name="nameRu" onChange={this.onChange} placeholder="Введите на русском" />
                            </Form.Item>
                            <Form.Item>
                                <Input value={nameKz} name="nameKz" onChange={this.onChange} placeholder="Введите на казахском" />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        visible={editvisible}
                        title="Редактировать критерий"
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
                            <Form.Item label="Критерий">
                                <Input value={editnameRu} name="editnameRu" onChange={this.onChange} placeholder="Введите на русском" />
                            </Form.Item>
                            <Form.Item>
                                <Input value={editnameKz} name="editnameKz" onChange={this.onChange} placeholder="Введите на казахском" />
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
                        <p>Вы уверены что хотите удалить критерий?</p>
                    </Modal>
                </Spin>
            </div>

        )
    }
}
const mapStateToProps=(state)=>({
    criteria:state.criteria,
});

export  default connect(mapStateToProps,{getAllCriteriaSearch}) (Criteria);