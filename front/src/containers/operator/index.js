import {Icon, Button, Divider, Table, Input, message, Row, Col,} from 'antd';
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import Common from "../../components/common";
import {getUsers} from "../../actions/userActions";
import Modal from "antd/es/modal";
import {IP} from "../../actions/types";
import axios from "axios";
import Spin from "antd/es/spin";
import './operator.css';
class Operator extends Component {
    state = {
        query:'',
        user:"operators",
        page:1,
        deleteVisible:false,
        id:null,
        deleteId:null,
        visible: false,
        visibleDialog: false,
        loading: false,
        name: '',
        img: '',
        infoVisible: false,
        mobilePhone: '',
        email: '',
    };
    componentDidMount() {
        this.props.getUsers(this.state, this.handleLoading, this.handleError);
    }
    onChange=(page,pageSize)=>{
        console.log(page)
        this.setState({
            page:page.current
        })
        this.props.getUsers({query: this.state.query, page: page.current,user:"operators"}, this.handleLoading, this.handleError);
    }
    handleCancelInfo = () => {
        this.setState({
            infoVisible: false
        })
    }
    onKeyUp=(e)=> {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getUsers({query: e.target.value, page:1,user:"operators"}, this.handleLoading, this.handleError);
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
    openDeleteModal = id => {
        this.setState({
            deleteVisible:true,
            deleteId:id
        })
    }
    openEdit = (id) => {
        console.log(id)
        this.setState({
            id:id
        });
        if(localStorage.getItem('user')===id){
            this.props.history.push('/dashboard/operator/add');
        }
        else if (localStorage.getItem('user')) {
            this.handleOkDialog();
        }
        else{
            this.props.history.push({
                pathname: '/dashboard/operator/add',
                data: id,
            });
            localStorage.setItem('user',id)
        }
    };
    handleOpen=()=>{

        localStorage.removeItem('user');
        this.props.history.push({
            pathname: '/dashboard/operator/add',
            data: this.state.id,
        });
        localStorage.setItem("user",this.state.id);
    };
    handleDelete = id => {
        this.handleError()
        axios.put(IP + 'api/users/'+id+'/suspend')
            .then(res =>  {
                this.handleLoading()
                message.success('Оператор успешно удален!')
                    this.setState({
                        deleteVisible:false
                    })
                    this.props.getUsers(this.state, this.handleLoading, this.handleError)
                }
            )
            .catch(err => {
                this.handleLoading()
                message.error('Ошибка при удалении!')
                    alert(err)
                }
            );
    }
    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false
        })
    };
    handleOkDialog = () => {
        this.setState({
            visibleDialog: true
        })
    }
    handleCancelDialog = () => {
        this.setState({
            visibleDialog: false
        })
    };
    openInfoModal = (record) => {
        this.setState({
            infoVisible: true,
            name: record.name,
            nameRu: record.ServiceProvider ? record.ServiceProvider.nameRu : 'Неизвестно',
            img:record.image,
            mobilePhone: record.phone.mobile[0] ? record.phone.mobile[0] : 'Неизвестно',
            email: record.email
        });
        console.log(record)
    }
    render() {
        const {deleteVisible,visibleDialog, infoVisible, img, nameRu, name, mobilePhone, email}=this.state;
        let organizationColumn={},serviceProviderColumn={};
        const {user}=this.props
        let actionColumn={},addButton='';
        if(user.profile.role === "superadmin" || user.profile.role==="admin"){
            actionColumn =   {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <Button type="link" onClick={() => this.openEdit(record.id)}><Icon type="edit"/>Редактировать</Button>
        <Divider type="vertical"/>
        <Button type="link" onClick={() => this.openDeleteModal(record.id)}> <Icon type="delete"/>Удалить</Button>
      </span>
                ),
            }
            addButton= <Link   to={'/dashboard/operator/add'}><Button type="primary"><Icon type="plus-circle"/>Добавить оператора</Button></Link>
        }

        if(user.profile.role && user.profile.role==='superadmin'){
            organizationColumn =   {
                title: 'Наименование организации',
                dataIndex: 'Organization',
                key: 'Organization',
                render:Organization => (
                    <span>
                        { Organization ?
                Organization.map(organization => (
                            <p key={organization._id}>
                                {organization.nameRu}
                            </p>
                ))
                : ''}
      </span>
                ),
            }
        }

        if(user.profile.role && user.profile.role==='supervisor'){
            serviceProviderColumn= {
                title: 'Наименование услугодателя',
                key: 'ServiceProvider',
                dataIndex: 'ServiceProvider',
                render: serviceProvider => <p>{serviceProvider && serviceProvider.nameRu ? serviceProvider.nameRu : ''}</p>,
            }
        }
        const columns = [
            {
                title: 'Картинка',
                dataIndex: 'image',
                key: 'image',
                render: image => <img  style={{width:"40px"}}    src={IP+image} alt="img"/>,
            },
            {
                title: 'Оператор',
                key: 'name',
                render: (record) => <p style={{cursor: "pointer"}}
                                       onClick={() => this.openInfoModal(record)}>{record.name ? record.name : ''}</p>,
            },
            serviceProviderColumn,
            organizationColumn,
            actionColumn
        ];

        let  data=[]
        if(user.users && user.users.users && user.users.users.length>0) {
            data= user.users.users.map((item, i) => {
                return {
                    ...item,
                    key: i,
                }
            })
        }
        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Операторы</h5>
                                <p className="title-text">Функции: управление услугодателями</p>
                                <Input onKeyUp={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите  оператора" prefix={<Icon type="search"/>} />

                            </div>
                            <div className="org-link" >
                                {addButton}
                            </div>
                        </div>
                        {data.length===0 ? <Common/> : <Table columns={columns} pagination={{total:user.users ? user.users.total : 0,pageSize:user.users ? user.users.pageSize : 0,current:this.state.page}} onChange={this.onChange} dataSource={data} />}
                    </div>
                    <Modal
                        title="Basic Modal"
                        visible={visibleDialog}
                        onOk={this.handleOkDialog}
                        onCancel={this.handleCancelDialog}
                        footer={[
                            <Button key="ok" onClick={this.handleOpen}>
                                Да
                            </Button>,

                            <Button key="no" onClick={this.handleCancelDialog}>
                                Нет
                            </Button>,
                        ]}
                    >
                        <p>У вас есть незавершенные данные администратора. Вы уверены, что хотите остановить добавление администратора и  редактировать данные другого администратора</p>
                    </Modal>
                    <Modal
                        visible={infoVisible}
                        title="Информация об операторе"
                        onCancel={this.handleCancelInfo}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        footer={[
                            <Button key="back" onClick={this.handleCancelInfo}>
                                Закрыть
                            </Button>,

                        ]}
                    >
                        <Row gutter={16}>
                            <Col span={6}>
                                <img src={IP+img} style={{width:"100px"}} alt="logo"/>
                            </Col>
                            <Col span={12}>
                                <div className="operator-info">
                                    <label className="info-label">Оператор: </label>
                                    <p className="basic-text">{name}</p>
                                </div>
                                <div className="operator-info">
                                    <label className="info-label">Email: </label>
                                    <p>{email}</p>
                                </div>
                                <div className="operator-info">
                                    <label className="info-label">Мобильный телефон: </label>
                                    <p>{mobilePhone}</p>
                                </div>
                                <div className="operator-info">
                                    <label className="info-label">Наименование услугодателя: </label>
                                    <p>{nameRu}</p>
                                </div>
                            </Col>
                        </Row>

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
                        <p>Вы уверены что хотите удалить оператора?</p>
                    </Modal>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    user:state.user,
    service:state.service
})
export  default connect(mapStateToProps,{getUsers}) (Operator);