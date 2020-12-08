import React, {Component} from 'react'
import {Button, Col, Divider, Icon, Input, Row, Table} from 'antd';
import {connect} from 'react-redux';
import './organization.css'
import Common from "../../components/common";
import {deleteOrganization,  getOrganizations} from "../../actions/organizationActions";
import Modal from "antd/es/modal";
import {IP} from "../../actions/types";
import Spin from "antd/es/spin";

class Organization extends Component {
    constructor() {
        super();
        this.state = {
            nameKz: '',
            nameRu: '',
            img: '',
            visible: false,
            visibleDialog: false,
            deleteVisible:false,
            id:null,
            deleteId:null,
            query:'',
            page:1,
            adminName:[],
            loading: false,
        }
    }

    openDeleteModal = id => {
        this.setState({
            deleteVisible: true,
            deleteId: id
        })
    }
    handleDelete = id => {
        if (id) {
            this.props.deleteOrganization(id,this.state,this.handleDeleteCancel, this.handleError, this.handleLoading)
        }
    };
    componentDidMount() {
        this.props.getOrganizations({query: '', page: 1}, this.handleError, this.handleLoading);
    }
    openModal = (record) => {
        this.setState({
            visible: true,
            nameKz: record.nameKz,
            nameRu: record.nameRu,
            img:record.image,
            admins:record.admins
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }
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
    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false
        })
    };
    handleOpenOrganization = id => {
        localStorage.removeItem('organization_id');
        this.props.history.push({
            pathname: '/dashboard/organizations/add',
            data: id,
        });
        localStorage.setItem("organization_id", id);
    };
    openEdit = id => {
        this.setState({
            id:id
        });
        if (localStorage.getItem('organization_id') === id) {
            this.props.history.push('/dashboard/organizations/add');
        } else if (localStorage.getItem('organization_id')) {
            this.handleOkDialog();
        } else {
            this.props.history.push({
                pathname: '/dashboard/organizations/add',
                data: id,
            });
            localStorage.setItem('organization_id',id)
        }
    };
    onNext = () => {
        this.props.history.push('/dashboard/organizations/add')
    };
    onKeyUp = e => {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getOrganizations({query: e.target.value, page: this.state.page}, this.handleError, this.handleLoading);
    }
    onChangePage = page => {
        this.setState({
            page:page.current
        });
        this.props.getOrganizations({query: this.state.query, page: page.current});
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

    render() {
        const columns = [
            {
                title: 'Логотип',
                dataIndex: 'image',
                key: 'image',
                render: image => <img src={IP+image} style={{width:'40px'}} alt="img"/>,
            },
            {
                title: 'Наименование организаций',
                key: 'nameRu',
                render: (record) => <p style={{cursor: "pointer"}}
                                       onClick={() => this.openModal(record)}>{record.nameRu}</p>,
            },
            {
                title: 'Количество услуг',
                dataIndex: 'totalServiceCount',
                key: 'totalServiceCount',
            },
            {
                title: 'Администратор',
                key: 'admins',
                dataIndex: 'admins',
                render: admins => (
                      <span>
                          {admins.map((admin,i) => {
                              return (
                                  <p key={i}>{admin.name}</p>
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
        <Button type="link" onClick={() => this.openEdit(record._id)}><Icon type="edit"/>Редактировать</Button>
        <Divider type="vertical"/>
        <Button type="link" onClick={() => this.openDeleteModal(record._id)}> <Icon type="delete"/>Удалить</Button>
      </span>
                ),
            },
        ];
        let data = [];
        const {organizations} = this.props.organization;
        if(organizations && organizations.organizations && organizations.organizations.length){
         data = organizations.organizations.map((item, i) => {
            return {
                ...item,
                key: i,
            }
        });}

        let admins = []
        if(this.state.admins){
            admins = this.state.admins.map((item,i)=>
                <div key={i} style={{borderBottom:"1px solid #e7e7e7"}}>
                    {/*<img className="avatar-default" src={.image : ''} alt="qwe"/>*/}
                    {/*<br/>*/}
                    <span className="title-text">ФИО</span>
                    <h5  className="title-p">{item.name}</h5>
                    {/*<span className="title-text">Должность</span>*/}
                    {/*<h5 className="title-p">{ confirm.User ? confirm.User.position : ''}</h5>*/}
                    {/*<span className="title-text">Рабочий телефон</span>*/}
                    {/*<h5  className="title-p">{ confirm.User ? confirm.User.phone.work + ' внутренний: '+ `${ confirm.User.phone.inner}`: null}</h5>*/}
                    {/*<span className="title-text">Мобильный телефон</span>*/}
                    {/*<h5 className="title-p">{confirm.User ? confirm.User.phone.mobile[0] : null}</h5>*/}
                    {/*<span className="title-text">Электронная почта</span>*/}
                    {/*<h5 className="title-p">{confirm.User ? confirm.User.email : ''}</h5>*/}
                </div>
            )
        }
        const {visible, nameKz, nameRu, visibleDialog,deleteVisible,img} = this.state;
        return (
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Организации</h5>
                                <p className="title-text">Список организации который был добавлен в систему</p>
                                <Input onKeyUp={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите  наименование организации" prefix={<Icon type="search"/>} />

                            </div>
                            <div className="org-link">
                               <Button onClick={this.onNext} type="primary"><Icon type="plus-circle"/>Добавить
                                    организацию</Button>
                            </div>
                        </div>
                        <Modal
                            visible={visible}
                            title="Информация об организации"
                            onCancel={this.handleCancel}
                            closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                                type="close-circle"/><span
                                style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                            footer={[
                                <Button key="back" onClick={this.handleCancel}>
                                    Закрыть
                                </Button>,

                            ]}
                        >
                            <Row gutter={16}>
                                <Col span={6}>
                                    <img src={IP+img} style={{width:"100px"}} alt="logo"/>
                                </Col>
                                <Col span={8}>
                                    <p className="basic-text">{nameRu}</p>
                                    <p>{nameKz}</p>
                                </Col>
                            </Row>
                            <div style={{margin:"10px 0"}}>
                                <p>Администраторы</p>
                                {admins}
                            </div>
                        </Modal>

                        <Modal
                            title="Предупреждение"
                            visible={visibleDialog}
                            onOk={this.handleOkDialog}
                            onCancel={this.handleCancelDialog}
                            footer={[
                                <Button key="ok" onClick={()=>this.handleOpenOrganization(this.state.id)}>
                                    Да
                                </Button>,

                                <Button key="no" onClick={this.handleCancelDialog}>
                                    Нет
                                </Button>,

                            ]}
                        >
                            <p>У вас есть незавершенная организация. Вы уверены, что хотите остановить добавление организации и  редактировать данные другой организации</p>
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
                            <p>Вы уверены что хотите удалить организацию?</p>
                        </Modal>
                        {data.length === 0 ? <Common/> : <Table columns={columns} pagination={{total:organizations ? organizations.total : 0,pageSize:organizations ? organizations.pageSize : 0,current:this.state.page}} onChange={this.onChangePage} dataSource={data}/>}
                    </div>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    organization: state.organization,
    service:state.service,
});

export  default connect(mapStateToProps,{getOrganizations,deleteOrganization}) (Organization);