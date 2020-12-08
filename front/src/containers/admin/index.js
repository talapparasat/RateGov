import { Icon, Button,  Divider, Table, Input, message} from 'antd';
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import Common from "../../components/common";
import Modal from "antd/es/modal";
import { IP} from "../../actions/types";
import {getUserById,getUsers} from "../../actions/userActions";
import axios from "axios";
import Spin from "antd/es/spin";

class Admin extends Component {
    state = {
        query: '',
        user: "admins",
        page: 1,
        deleteVisible: false,
        id: null,
        deleteId: null,
        visible: false,
        visibleDialog: false,
        loading: false,
    };
    componentDidMount() {
        this.props.getUsers(this.state, this.handleLoading, this.handleError);
    }

    openDeleteModal = id => {
        this.setState({
            deleteVisible:true,
            deleteId:id
        })
    };

    onChange = (page, pageSize) => {
        console.log(page)
        this.setState({
            page:page.current
        })
        this.props.getUsers({query: this.state.query, page: page.current,user:"admins"}, this.handleLoading, this.handleError);
    }
    onKeyUp=(e)=> {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getUsers({query: e.target.value, page: 1,user:"admins"}, this.handleLoading, this.handleError);

    }
    openEdit = (id) => {
        this.setState({
            id:id
        });
        if(localStorage.getItem('user')===id){
            this.props.history.push('/dashboard/admin/self');
        }
        else if (localStorage.getItem('user')) {
            this.handleOkDialog();
        }
        else{
            this.props.history.push({
                pathname: '/dashboard/admin/self',
                data: id,
            });
            localStorage.setItem('user',id)
        }
    };
    handleOpen=()=>{
        localStorage.removeItem('user');
        this.props.history.push({
            pathname: '/dashboard/admin/self',
            data: this.state.id,
        });
        localStorage.setItem("user",this.state.id);
    };
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

    handleDelete=(id)=>{
        this.handleError()
        this.setState({
            deleteVisible:false
        });
        axios.put(IP + 'api/users/'+id+'/suspend')
            .then(res =>  {
                this.handleLoading()
                message.success('Администратор успешно удален!')
                this.props.getUsers(this.state, this.handleLoading, this.handleError)
                }
            )
            .catch(err=> {
                this.handleLoading()
                message.error('Ошибка при удалении!')
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
    render() {
        const {deleteVisible,visibleDialog}=this.state;
        const columns = [
            {
                title: 'Фото',
                dataIndex: 'image',
                key: 'image',
                render: image => <img style={{width:'40px'}} src={IP+image} alt="img"/>,
            },
            {
                title: 'Администратор',
                key: 'name',
                dataIndex: 'name',
            },
            {
                title: 'Наименование организаций',
                dataIndex: 'Organization',
                key: 'Organization',
                render: Organization => (
                    <span>
                {Organization.map((organization,i) => {
                  return (
                      <p key={i}>
                          {organization.nameRu}
                      </p>
                  );
              })}
            </span>
                ),

            },
            {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
         <Button type="link" onClick={() => this.openEdit(record.id)}><Icon type="edit"/>Редактировать</Button>
        <Divider type="vertical"/>
        <Button type="link" onClick={() => this.openDeleteModal(record.id)}> <Icon type="delete"/>Удалить</Button>
      </span>
                ),
            },
        ];
        const {user}=this.props;
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
                                <h5 className="h5-title">Администраторы</h5>
                                <p className="title-text">Функции: добавление и контроль модераторов</p>
                                <Input onKeyUp={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите  админстратора" prefix={<Icon type="search"/>} />

                            </div>
                            <div className="org-link" >
                                <Link   to={'/dashboard/admin/self'}><Button type="primary"><Icon type="plus-circle"/>Добавить администратора</Button></Link>
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
                        <p>Вы уверены что хотите удалить администратора?</p>
                    </Modal>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    user:state.user,
    service:state.service,
})
export  default connect(mapStateToProps,{getUsers,getUserById}) (Admin);