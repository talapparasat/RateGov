import {Icon, Button, Divider, Table, Input, Modal, Select, message, Col,} from 'antd';
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import Common from "../../components/common";
import {IP} from "../../actions/types";
import {getTemplateSupervisor, getUsers, uploadSupervisor} from "../../actions/userActions";
import axios from "axios";
import Pagination from "antd/es/pagination";
import Spin from "antd/es/spin";
import Upload from "antd/es/upload";
const {Option} = Select
class Supervisor extends Component {
    state = {
        query:'',
        user:"supervisors",
        page:1,
        deleteVisible:false,
        id:null,
        deleteId:null,
        visible: false,
        visibleDialog: false,
        supervisorId: null,
        deleteVisibleSuspend: false,
        loading: false,
        selectedFile: null,
        selectedFileList: []
    };
    handleOkDialog = () => {
        this.setState({
            visibleDialog: true
        })
    }
    openDeleteModal = id => {
        this.setState({
            deleteVisible:true,
            deleteId:id,
            supervisorId: null,
        })
        let options = this.props.user.users.users.map((item,i) => (
            <Option key={i} value={item.id}>{item.name}</Option>
        ));
        this.setState({
            options: options
        })
    }
    openDeleteModalSuspend = id => {
        this.setState({
            deleteVisibleSuspend: true,
            deleteId: id,
        })
    };
    handleDeleteSuspend = id => {
        this.handleError()
        axios.put(IP + 'api/users/'+id+'/suspend')
            .then(res => {
                this.handleLoading()
                    this.setState({
                        deleteVisibleSuspend: false,
                    });
                this.props.getUsers(this.state, this.handleLoading, this.handleError);
                if (res.data.suspended === false) {
                    this.openDeleteModal(id);
                }}
            )
            .catch(err => {
                this.handleLoading()
                    alert(err)
                }
            );
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
    handleDelete = id => {
        this.handleError()
        axios.put(IP + 'api/users/'+id+'/suspend/confirmed', {to: this.state.supervisorId})
            .then(res =>  {
                this.handleLoading()
                    this.setState({
                        deleteVisibleSuspend: false,
                        deleteVisible: false
                    })
                    this.props.getUsers(this.state, this.handleLoading, this.handleError)
                }
            )
            .catch(err=> {
                this.handleLoading();
                    alert(err)
                }
            );
    }
    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false,
            supervisorId: null
        })
    };
    handleDeleteCancelSuspend = () => {
        this.setState({
            deleteVisibleSuspend: false,
        })
    };
    componentDidMount() {
        this.props.getUsers(this.state, this.handleLoading, this.handleError);
    }

    openEdit = (id) => {
        this.setState({
            id:id
        });
        if(localStorage.getItem('user')===id){
            this.props.history.push('/dashboard/supervisor/add');
        }
        else if (localStorage.getItem('user')) {
            this.handleOkDialog();
        }
        else{
            this.props.history.push({
                pathname: '/dashboard/supervisor/add',
                data: id,
            });
            localStorage.setItem('user',id)
        }
    };
    handleCancelDialog = () => {
        this.setState({
            visibleDialog: false
        })
    };
    onChange=(page,pageSize)=>{
        console.log(page)
        this.setState({
            page:page.current
        })
        this.props.getUsers({query: this.state.query, page: page.current,user:"supervisors"}, this.handleLoading, this.handleError);
    }
    handleOpen=()=>{
        localStorage.removeItem('user');
        this.props.history.push({
            pathname: '/dashboard/supervisor/add',
            data: this.state.id,
        });
        localStorage.setItem("user",this.state.id);
    };
    onKeyUp=(e)=> {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getUsers({query: e.target.value, page: 1,user:"supervisors"}, this.handleLoading, this.handleError);
    }
    downloadTemplate = () => {
        this.props.getTemplateSupervisor(this.handleError, this.handleLoading)
    }
    onSelectSupervisor = e => {
        console.log(e)
        this.setState({
            supervisorId: e
        })
    }
    dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    onChangeImg = info => {
        const nextState = {};
        switch (info.file.status) {
            case "uploading":
                nextState.selectedFileList = [info.file];
                break;
            case "done":
                nextState.selectedFile = info.file;
                nextState.selectedFileList = [info.file];
                this.props.uploadSupervisor(this.handleError, this.handleLoading, info.file.originFileObj)
                this.setState({
                    selectedFile: info.file.originFileObj
                })
                break;

            default:
                // error or removed
                nextState.selectedFile = null;
                nextState.selectedFileList = [];
        }
        this.setState(() => nextState);
    };
    render() {
        const {deleteVisible, visibleDialog, options, supervisorId, deleteVisibleSuspend} = this.state;
        const {user} = this.props;
        let organizationColumn = {};
        console.log(this.state.selectedFile)
        if(user.profile.role === "superadmin") {
            organizationColumn =   {
                title: 'Наименование организации',
                dataIndex: 'Organization',
                key: 'Organization',
                render: organization  => <p >{ organization && organization[0] && organization[0].nameRu ? organization[0].nameRu : ''}</p>,

            }
        } else {
            organizationColumn={};
        }
        const columns = [
            {
                title: 'Фото',
                dataIndex: 'image',
                key: 'image',
                    render: image => <img style={{width:"40px"}} src={IP+image} alt="img"/>,
            },
            {
                title: 'Супервайзер',
                key: 'name',
                dataIndex: 'name',
            },
            organizationColumn,
            {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <Button type="link" onClick={()=>this.openEdit(record.id)}><Icon type="edit"/>Редактировать </Button>
        <Divider type="vertical" />
        <Button type="link" onClick={()=>this.openDeleteModalSuspend(record.id)}> <Icon type="delete" />Удалить</Button>
      </span>
                ),
            },
        ];

        let  data = []
        if(user.users && user.users.users && user.users.users.length>0) {
            data= user.users.users.map((item, i) => {
                return {
                    ...item,
                    key: i,
                }
            })
        }
        const props = {
            name: 'file',
            customRequest: () => {},
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Супервайзеры</h5>
                                <p className="title-text">Функции: модерирование услугодателей</p>
                                <Input onKeyUp={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите  супервайзера" prefix={<Icon type="search"/>} />
                            </div>
                            <div style={{display: 'flex'}}>
                                <div className="org-link" >
                                    <Link to={'/dashboard/supervisor/add'}><Button type="primary"><Icon type="plus-circle"/>Добавить супервайзера</Button></Link>
                                </div>
                                <div className="org-link" >
                                    <Upload
                                        onPreview={() => {}}
                                            customRequest={this.dummyRequest}
                                            onChange={this.onChangeImg}>
                                        <Button type="primary">
                                            <Icon type="upload"/>
                                             Загрузить Excel
                                        </Button>
                                    </Upload>
                                </div>
                                <div className="org-link" >
                                    <Button onClick={this.downloadTemplate} type="primary">
                                        <Icon type="download"/>
                                       Скачать шаблон
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {data.length===0 ? <Common/> : <Table columns={columns} dataSource={data} pagination={{total:user.users ? user.users.total : 0,pageSize:user.users ? user.users.pageSize : 0,current:this.state.page}} onChange={this.onChange}/> }

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
                        <p>У вас есть незавершенные данные супервайзера. Вы уверены, что хотите остановить добавление супервайзера и  редактировать данные другого супервайзера</p>
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
                        <p>Супервайзер управляет несколькими операторами. Вы можете прикрепить их к другому супервайзеру</p>
                        <Select
                            showSearch
                            style={{width: 450}}
                            value={this.state.supervisorId}
                            placeholder="Выберите супервазйера"
                            optionFilterProp="children"
                            onSelect={this.onSelectSupervisor}
                            filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                            >
                            {options}
                         </Select>

                    </Modal>
                    {/*<Modal*/}
                    {/*    visible={infoVisible}*/}
                    {/*    title="Информация о супервайзере"*/}
                    {/*    onCancel={this.handleCancelInfo}*/}
                    {/*    closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}*/}
                    {/*                                                        type="close-circle"/><span*/}
                    {/*        style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}*/}
                    {/*    footer={[*/}
                    {/*        <Button key="back" onClick={this.handleCancelInfo}>*/}
                    {/*            Закрыть*/}
                    {/*        </Button>,*/}

                    {/*    ]}*/}
                    {/*>*/}
                    {/*    <Row gutter={16}>*/}
                    {/*        <Col span={6}>*/}
                    {/*            <img src={IP+img} style={{width:"100px"}} alt="logo"/>*/}
                    {/*        </Col>*/}
                    {/*        <Col span={12}>*/}
                    {/*            <div className="operator-info">*/}
                    {/*                <label className="info-label">Оператор: </label>*/}
                    {/*                <p className="basic-text">{name}</p>*/}
                    {/*            </div>*/}
                    {/*            <div className="operator-info">*/}
                    {/*                <label className="info-label">Email: </label>*/}
                    {/*                <p>{email}</p>*/}
                    {/*            </div>*/}
                    {/*            <div className="operator-info">*/}
                    {/*                <label className="info-label">Мобильный телефон: </label>*/}
                    {/*                <p>{mobilePhone}</p>*/}
                    {/*            </div>*/}
                    {/*            <div className="operator-info">*/}
                    {/*                <label className="info-label">Наименование услугодателя: </label>*/}
                    {/*                <p>{nameRu}</p>*/}
                    {/*            </div>*/}
                    {/*        </Col>*/}
                    {/*    </Row>*/}

                    {/*</Modal>*/}
                    <Modal
                        title="Удалить"
                        visible={deleteVisibleSuspend}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        onCancel={this.handleDeleteCancelSuspend}
                        footer={[
                            <Button style={{background:"#000",color:"#fff"}} key="ok" onClick={()=>this.handleDeleteSuspend(this.state.deleteId)}>
                                <Icon type="check-circle" />Да, удалить
                            </Button>,
                            <Button key="no" onClick={this.handleDeleteCancelSuspend}>
                                <Icon type="close-circle" /> Нет, не удалять
                            </Button>,
                        ]}
                    >
                        <p>Вы действительно хотите удалить супервайзера?</p>
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
export  default connect(mapStateToProps,{getUsers, uploadSupervisor, getTemplateSupervisor}) (Supervisor);