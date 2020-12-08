import React, { Component } from 'react'
import {Table, Divider, Button, Icon, Row, Col, Input} from 'antd';
import {connect} from 'react-redux';
import Common from "../../components/common";
import Modal from "antd/es/modal";
import {IP} from "../../actions/types";
import {
    deleteServiceProvider,
    getExcelServiceProvider,
    getServiceProviders, getTemplateServiceProvider, uploadServiceProvider
} from "../../actions/serviceProviderActions";
import Spin from "antd/es/spin";
import {Link} from "react-router-dom";
import Progress from "antd/es/progress";
import Upload from "antd/es/upload";

class ServiceProvider extends Component {
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
            loading: false,
            infoVisible: false,
            address: '',
            display: 'none'
        }
    }

    openDeleteModal = id => {
        this.setState({
            deleteVisible:true,
            deleteId:id
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
    handleDelete=()=>{
        if(this.state.deleteId){
            this.props.deleteServiceProvider(this.state.deleteId, this.state, this.handleDeleteCancel, this.handleError, this.handleLoading)
        }
        this.setState({
            deleteVisible:this.props.service.modal,
        })
    }
    onKeyUp=(e)=> {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getServiceProviders({query: e.target.value, page: 1}, this.handleLoading, this.handleError);

    }
    onChangePage=(page,pageSize)=>{
        console.log(page)
        this.setState({
            page:page.current
        })
        this.props.getServiceProviders({query: this.state.query, page: page.current}, this.handleLoading, this.handleError);
    }

    componentDidMount() {
        this.props.getServiceProviders({query: '', page: 1}, this.handleLoading, this.handleError);
    }

    openModal = (record) => {
        this.setState({
            infoVisible: true,
            nameKz: record.nameKz,
            nameRu: record.nameRu,
            img: record.img,
            address: record.address,
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
    handleOpenOrganization=(id)=>{
        localStorage.removeItem('serviceProvider');
        this.props.history.push({
            pathname: '/dashboard/provider/add',
            data: id,
        })
        localStorage.setItem("serviceProvider",id);
    };

    openEdit = (id) => {
        this.setState({
            id:id
        });
        if(localStorage.getItem('serviceProvider')===id){
            this.props.history.push('/dashboard/provider/add');

        } else if (localStorage.getItem('serviceProvider')) {
            this.handleOkDialog();
        } else {
            this.props.history.push({
                pathname: '/dashboard/provider/add',
                data: id,
            })
            localStorage.setItem('serviceProvider',id)
        }
    }
    onNext=()=>{
        this.props.history.push('/dashboard/provider/add')
    }
    getExportServiceProvider = () => {
        this.props.getExcelServiceProvider(this.handleErrorReview, this.handleLoadingReview);
    }
    handleErrorReview = () => {
        this.setState({
            loading: true,
            display: 'flex'
        })
    }
    handleLoadingReview = () => {
        this.setState({
            loading: false,
            display: 'none'
        })
    }
    handleCancelInfo = () => {
        this.setState({
            infoVisible: false
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
                this.props.uploadServiceProvider(this.handleError, this.handleLoading, info.file.originFileObj)
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
    downloadTemplate = () => {
        this.props.getTemplateServiceProvider(this.handleError, this.handleLoading)
    }
    render() {
        let actionColumn={}, addButton='', reportButton = '', uploadButton = '', downloadButton = '';
        const {user}=this.props;
        if (user.profile.role === 'superadmin') {
            uploadButton =  <div className="org-link" >
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
        }
        if(user.profile.role === 'superadmin' || user.profile.role === 'supervisor') {
            reportButton = <div className="org-link">
                <Button onClick={this.getExportServiceProvider} style={{width: '100%'}}  type="primary" download>Выгрузка в Excel</Button>
            </div>
            downloadButton =  <div className="org-link" >
                <Button onClick={this.downloadTemplate} type="primary">
                    <Icon type="download"/>
                    Скачать шаблон
                </Button>
            </div>
        }
        if(user.profile.role === "superadmin" || user.profile.role === "admin"){
            actionColumn =   {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <Button type="link" onClick={() => this.openEdit(record._id)}><Icon type="edit"/>Редактировать</Button>
        <Divider type="vertical"/>
        <Button type="link" onClick={() => this.openDeleteModal(record._id)}> <Icon type="delete"/>Удалить</Button>
      </span>
                ),
            }
            addButton=<Button onClick={this.onNext} type="primary"><Icon type="plus-circle"/>Добавить
                услугодателя</Button>
        }

        const columns = [
            {
                title: 'Логотоип',
                dataIndex: 'image',
                key: 'image',
                render: image => <img src={IP+image} style={{width:'40px'}} alt="img"/>,

            },
            {
                title: 'Наименование услугодателя',
                key: 'nameRu',
                render: (record) => <p style={{cursor: "pointer"}}
                                       onClick={() => this.openModal(record)}>{record.nameRu}</p>,

            },
            {
                title: 'Адрес',
                key: 'address',
                dataIndex:"address",

            },
            {
                title: 'Регион',
                key: 'region',
                render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                          style={{cursor: "pointer", color: "#000"}}
                >{record.region}</Link>,
            },
            {
                title: 'Район',
                key: 'raion',
                render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                          style={{cursor: "pointer", color: "#000"}}
                >{record.raion}</Link>,
            },
            actionColumn
        ];
        const {serviceProviders}=this.props.serviceProvider;
        let  data=[]
        if(serviceProviders && serviceProviders.serviceProviders && serviceProviders.serviceProviders.length>0 ) {
            data= serviceProviders.serviceProviders.map((item, i) => {
                return {
                    ...item,
                    key: i,
                    region: item.region ? item.region.nameRu : '',
                    raion: item.raion ? item.raion.nameRu : '',
                }
            })
        }
        const { visibleDialog,deleteVisible, infoVisible, nameKz, nameRu, img, address} = this.state;
        return (
            <div className="organization">
                <div style={{display: this.state.display, width: '40%', margin: '0 auto', fontSize: '16px', flexDirection: 'column', alignItems: 'center'}}>
                    <p style={{fontWeight: 500, color: '#000', textAlign: 'center'}}>Экспорт данных может занять несколько минут. Подождите, пожалуйста...</p>
                    <Progress  percent={50} showInfo={false} status="active" />
                </div>
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Услугодатели</h5>
                                <p className="title-text">Список услугодателей который был добавлен в систему</p>
                                <Input onChange={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите  услугодателя" prefix={<Icon type="search"/>} />
                            </div>
                            <div style={{display: 'flex'}}>
                                <div className="org-link">
                                    {addButton}
                                </div>
                                    {reportButton}
                                    {downloadButton}
                                    {uploadButton}
                            </div>
                        </div>
                        <Modal
                            visible={infoVisible}
                            title="Информация об услугодателе"
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
                                        <label className="info-label">Наименование услугодателя на русском: </label>
                                        <p>{nameRu}</p>
                                    </div>
                                    <div className="operator-info">
                                        <label className="info-label">Наименование услугодателя на казахском: </label>
                                        <p>{nameKz}</p>
                                    </div>
                                    <div className="operator-info">
                                        <label className="info-label">Адрес: </label>
                                        <p>{address}</p>
                                    </div>
                                </Col>
                            </Row>

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
                            <p>У вас есть незавершенный услугодатель. Вы уверены, что хотите остановить добавление услугодателя и  редактировать данные другого услугодателя</p>
                        </Modal>
                        <Modal
                            title="Удалить"
                            visible={deleteVisible}
                            closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                                type="close-circle"/><span
                                style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                            onCancel={this.handleDeleteCancel}
                            footer={[
                                <Button style={{background:"#000",color:"#fff"}} key="ok" onClick={()=>this.handleDelete(this.state.id)}>
                                    <Icon type="check-circle" />Да, удалить
                                </Button>,

                                <Button key="no" onClick={this.handleDeleteCancel}>
                                    <Icon type="close-circle" /> Нет, не удалять
                                </Button>,

                            ]}
                        >
                            <p>Вы уверены что хотите удалить услугодателя?</p>
                        </Modal>
                        {data.length === 0 ? <Common/> : <Table columns={columns} pagination={{total:serviceProviders ? serviceProviders.total : 0,pageSize:serviceProviders ? serviceProviders.pageSize : 0,current:this.state.page}} onChange={this.onChangePage} dataSource={data}/>}
                    </div>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    serviceProvider: state.serviceProvider,
    service: state.service,
    user: state.user
});

export  default connect(mapStateToProps,{getServiceProviders, deleteServiceProvider, getExcelServiceProvider, getTemplateServiceProvider, uploadServiceProvider}) (ServiceProvider);