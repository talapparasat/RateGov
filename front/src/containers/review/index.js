import React, {Component} from 'react'
import {Table, Select, Tabs, Button, Icon, Collapse, Input, Row, Col} from 'antd';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import {deleteReview, getExcelReview, getReviews} from "../../actions/reviewActions";
import {withSocketContext} from "../../components/SocketContext";
import './review.css'
import Spin from "antd/es/spin";
import Progress from "antd/es/progress";
import Modal from "antd/es/modal";
import {getNavigation} from "../../actions/navigationActions";
import Menu from "antd/es/menu";
import {getAllServiceTypes} from "../../actions/serviceTypeActions";
import Search from "antd/es/input/Search";

const {TabPane} = Tabs;
const {Option} = Select;
const {Panel} = Collapse;

class Reviews extends Component {
    constructor() {
        super();
        this.state = {
            text: "",
            status: 'ACTIVE',
            whose: "my",
            page: 1,
            response: false,
            loading: false,
            deleteVisible: false,
            display: 'none',
            phone: '',
            region: '',
            raion: '',
            serviceType: '',
            iin: ''
        }
    }


     componentDidMount() {
         this.props.getReviews({
             status: this.state.status,
             page: 1,
             whose: this.state.whose
         }, this.handleLoading, this.handleError);
         const {socket} = this.props;
        this.props.getNavigation(this.handleError, this.handleLoading);
         if (socket) {
             socket.on("Review.created", data => {
                 socket.io.opts.transports = ['polling', 'websocket'];
                 console.log(data);
                 this.setState({response: data})
             })
         }
         this.props.getAllServiceTypes({query: '', page: 1}, this.handleLoading, this.handleError);
     }
    // componentDidMount() {
    //     this.props.getReviews({
    //         status: this.state.status,
    //         page: 1,
    //         whose: this.state.whose
    //     }, this.handleLoading, this.handleError);
    //     const {socket} = this.props;
    //     console.log(socket, "socket review")
    //     if (socket) {
    //         socket.on("Review.created", data => {
    //             console.log(data);
    //             this.setState({response: data})
    //         })
    //     }
    //
    // }
    getExportReview = () => {
        this.props.getExcelReview(this.handleErrorReview, this.handleLoadingReview);
    }
    openDeleteModal = id => {
        this.setState({
            deleteVisible: true,
            deleteId: id
        })
    }
    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false
        })
    };
    handleDelete=()=>{
        const data = {
            id: this.state.deleteId,
            page: this.state.page,
            status: this.state.status,
            whose: this.state.whose
        }
        if(this.state.deleteId){
            this.props.deleteReview(data, this.handleDeleteCancel, this.handleError, this.handleLoading)
        }
    }
    onChangePage = (page) => {
        const {phone, serviceType, region, raion, whose, status, iin} = this.state;
        this.setState({
            page: page.current,
        })
        const data = {
            page: page.current,
            status: status,
            whose: whose,
            raionId : raion,
            regionId: region,
            serviceTypeId: serviceType,
            phone: phone,
            iin: iin
        }
        this.props.getReviews(data, this.handleLoading, this.handleError);
    }
    handleError = () => {
        this.setState({
            loading: true,
        })
    }
    handleLoading = () => {
        this.setState({
            loading: false,
        })
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
    handleChange = (e) => {
        const {phone, serviceType, region, raion, whose, iin} = this.state;
        this.setState({
            status: e,
            page: 1,
        })
        const data = {
            page: 1,
            status: e,
            whose: whose,
            raionId : raion,
            regionId: region,
            serviceTypeId: serviceType,
            phone: phone,
            iin: iin
        }
        this.props.getReviews(data, this.handleLoading, this.handleError);
    }
    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSelect = (e) => {
        this.setState({
            whose: e
        })
        this.props.getReviews({status: this.state.status, page: 1, whose: e}, this.handleLoading, this.handleError);
        this.setState({
            page: 1
        })
    }
    handleDate = (createdAt) => {
        return `${createdAt.getDate().toString().padStart(2, '0')}.${(createdAt.getMonth() + 1).toString().padStart(2, '0')}.${createdAt.getFullYear()} ${createdAt.getHours()}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`
    }
    onSelectRegion = e => {
        this.setState({
           region: e,
           raion: '',
        })
    }
    onSelectRaion = e => {
            this.setState({
            raion: e,
            region: '',
        })
    }
    onSelectServiceType = e => {
        this.setState({
            serviceType: e
        })
    }
    filterReview = () => {
        const {raion, region, phone, page, status, whose, serviceType, iin} = this.state;
        const data = {
            page: page,
            status: status,
            whose: whose,
            raionId : raion,
            regionId: region,
            serviceTypeId: serviceType,
            phone: phone,
            iin: iin
        };
        this.props.getReviews(data, this.handleLoading, this.handleError);
    }
    resetFilter = () => {
        const {page, status, whose} = this.state;
        this.setState({
            raion : '',
            region: '',
            serviceType: '',
            phone: '',
            iin: ''
        })
        const data = {
            page: page,
            status: status,
            whose: whose,
            raionId : '',
            regionId: '',
            serviceTypeId: '',
            phone: '',
            iin: ''
        };
        this.props.getReviews(data, this.handleLoading, this.handleError);
    };
    render() {
        const { response, deleteVisible, phone, serviceType, raion, region, iin } = this.state;
        const {reviews} = this.props.review;
        const { user, navs } = this.props;
        let filter = '';
        let myButton = '';
        const {serviceAllTypes} = this.props.serviceType;
        let  dataServiceTypes = [];
        let columns = [];
        let reportButton = '';
        let districts = [];
        if(serviceAllTypes.serviceProviderTypes) {
            dataServiceTypes = serviceAllTypes.serviceProviderTypes.map((item, i) => {
                return {
                    ...item,
                    key: i,
                }
            })
        } else {
            dataServiceTypes = [];
        }
        const optionTypes = dataServiceTypes.map((item, i) => (
            <Option key={i} value={item._id}>{item.nameRu}</Option>
        ));
        const regions = navs.map((item, i) => (
            <Option key={i} value={item._id}>{item.nameRu}</Option>
        ));
        for ( let i = 0; i < navs.length; i++ ) {
            for( let j = 0; j < navs[i].navs.length; j ++ ) {
                districts.push({
                    id: navs[i].navs[j]._id,
                    name: navs[i].navs[j].nameRu
                })
            }
        }
        const optionDistricts = districts.map((item, i) => (
            <Option key={i} value={item.id}>{item.name}</Option>
        ))
        if (user.profile.role === 'superadmin') {
            reportButton = <Button onClick={this.getExportReview} style={{width: '100%'}}  type="primary" download>Выгрузка в Excel</Button>
            filter =  <Collapse defaultActiveKey={['1']}>
                <Panel header="Фильтр" key="1">
                    <Row >
                        <Col span={8}>
                            <div className="filter-item">
                                <label className="title-text">Регион</label>
                                <Select
                                    value={region}
                                    placeholder="Выберите регион"
                                    onChange={this.onSelectRegion}
                                >
                                    <Option value={''}>Все</Option>
                                    {regions}
                                </Select>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="filter-item">
                                <label className="title-text">Район</label>
                                <Select
                                    value={raion}
                                    placeholder="Выберите район"
                                    onChange={this.onSelectRaion}
                                >
                                    <Option value={''}>Все</Option>
                                    {optionDistricts}
                                </Select>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="filter-item">
                                <label className="title-text">Тип услугодателя</label>
                                <Select
                                    value={serviceType}
                                    placeholder="Выберите тип услугодателя"
                                    onChange={this.onSelectServiceType}
                                >
                                    <Option value={''}>Все</Option>
                                    {optionTypes}
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]}>
                        <Col span={8}>
                            <div className="filter-item">
                                <label className="title-text">Номер телефона</label>
                                <Input
                                    placeholder="Введите номер телефона"
                                    onChange={this.onChange}
                                    value={phone}
                                    name="phone"
                                />
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="filter-item">
                                <label className="title-text">ИИН</label>
                                <Input
                                    placeholder="Введите иин"
                                    onChange={this.onChange}
                                    value={iin}
                                    name="iin"
                                />
                            </div>
                        </Col>
                    </Row>
                    <div className="accept-button">
                        <Button onClick={this.filterReview} type="primary"><Icon type="filter"/>Применить</Button>
                        {raion || region || serviceType || phone || iin ? <Button onClick={this.resetFilter} type="default"><Icon type="close"/>Сбросить</Button> : ''}
                    </div>
                </Panel>
            </Collapse>;
            columns =  [
                {
                    title: 'Отзыв',
                    key: 'text',
                    ellipsis: true,
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.text}</Link>,
                },
                {
                    title: 'Дата поступления',
                    key: 'date',
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.createdAt ? this.handleDate(record.createdAt) : "Неизвестно"}</Link>,
                },
                {
                    title: 'Оценка',
                    key: 'rate',
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.rate}</Link>,
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
                {
                    title: 'Услугодатель',
                    key: 'serviceProvider',
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.ServiceProvider.nameRu}</Link>,
                },
                {
                    title: 'Действия',
                    key: 'action',
                    render: (text, record) => (
                        <span>
        <Button type="link" onClick={() => this.openDeleteModal(record._id)}> <Icon type="delete"/>Удалить</Button>
      </span>
                    ),
                }
            ];
        } else if (user.profile.role === 'supervisor'){
            reportButton = <div style={{marginTop: '20px'}}>
                <Button onClick={this.getExportReview} style={{width: '100%'}}  type="primary" download>Выгрузка в Excel</Button>
            </div>
            columns =  [
                {
                    title: 'Отзыв',
                    key: 'text',
                    ellipsis: true,
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.text}</Link>,
                },
                {
                    title: 'Дата поступления',
                    key: 'date',
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.createdAt ? this.handleDate(record.createdAt) : "Неизвестно"}</Link>,
                },
                {
                    title: 'Оценка',
                    key: 'rate',
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.rate}</Link>,
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
                {
                    title: 'Услугодатель',
                    key: 'serviceProvider',
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.ServiceProvider.nameRu}</Link>,
                },
            ];
        } else {
            myButton =  <Select defaultValue="my" style={{width: 180}} onChange={this.onSelect}>
                <Option value="my">Мои</Option>
                <Option value="">Все</Option>
            </Select>;
            columns =  [
                {
                    title: 'Отзыв',
                    key: 'text',
                    ellipsis: true,
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.text}</Link>,
                },
                {
                    title: 'Дата поступления',
                    key: 'date',
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.createdAt ? this.handleDate(record.createdAt) : "Неизвестно"}</Link>,
                },
                {
                    title: 'Оценка',
                    key: 'rate',
                    render: (record) => <Link to={`/dashboard/reviews/${record._id}`}
                                              style={{cursor: "pointer", color: "#000"}}
                    >{record.rate}</Link>,
                },
            ];
        }
        let data = [];
        if (reviews && reviews.reviews) {
            data = reviews.reviews.map((item, i) => {
                return {
                    ...item,
                    key: item._id,
                    createdAt: new Date(item.createdAt) ,
                    no:i+1,
                    region: item.region ? item.region.nameRu : '',
                    raion: item.raion ? item.raion.nameRu : '',
                }
            })
        }
        if (response) {
            if (data.length === 12) {
                data.pop()
            }
            response.key = response._id;
            response.createdAt = new Date(response.createdAt);
            data.unshift(response);
        }
        return (
            <div className="organization">
                <div style={{display: this.state.display, width: '40%', margin: '0 auto', fontSize: '16px', flexDirection: 'column', alignItems: 'center'}}>
                    <p style={{fontWeight: 500, color: '#000', textAlign: 'center'}}>Экспорт данных может занять несколько минут. Подождите, пожалуйста...</p>
                    <Progress  percent={50} showInfo={false} status="active" />
                </div>
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        {filter}
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Отзывы</h5>
                                <p className="title-text">Список отзывов</p>
                            </div>
                            <div style={{display: 'flex'}}>
                                {myButton}
                                {reportButton}
                            </div>
                        </div>
                        <Tabs defaultActiveKey="1" onChange={this.handleChange}>
                            <TabPane tab="Активные" key="ACTIVE">
                                {data.length === 0 ? <div style={{textAlign: "center", marginTop: "80px"}}>
                                        <p>Отзывов нету</p>
                                    </div> :
                                    <Table rowClassName={(record) => record.ticketNumber === '11' ? 'unRead' : 'read'}
                                           pagination={{
                                               total: reviews ? reviews.total : 0,
                                               pageSize: reviews ? reviews.pageSize : 0,
                                               current: this.state.page
                                           }} onChange={this.onChangePage} columns={columns} dataSource={data}/>}
                            </TabPane>
                            <TabPane tab="Решенные" key="RESOLVED">
                                {data.length === 0 ? <div style={{textAlign: "center", marginTop: "80px"}}>
                                    <p>Отзывов нету</p>
                                </div> : <Table columns={columns} pagination={{
                                    total: reviews ? reviews.total : 0,
                                    pageSize: reviews ? reviews.pageSize : 0,
                                    current: this.state.page
                                }} onChange={this.onChangePage} dataSource={data}/>}
                            </TabPane>
                            <TabPane tab="Положительные" key="POSITIVE">
                                {data.length === 0 ? <div style={{textAlign: "center", marginTop: "80px"}}>
                                    <p>Отзывов нету</p>
                                </div> : <Table columns={columns} pagination={{
                                    total: reviews ? reviews.total : 0,
                                    pageSize: reviews ? reviews.pageSize : 0,
                                    current: this.state.page
                                }} onChange={this.onChangePage} dataSource={data}/>}
                            </TabPane>
                            <TabPane tab="Все" key="ALL">
                                {data.length === 0 ? <div style={{textAlign: "center", marginTop: "80px"}}>
                                    <p>Отзывов нету</p>
                                </div> : <Table columns={columns} pagination={{
                                    total: reviews ? reviews.total : 0,
                                    pageSize: reviews ? reviews.pageSize : 0,
                                    current: this.state.page
                                }} onChange={this.onChangePage} dataSource={data}/>}
                            </TabPane>
                        </Tabs>
                    </div>
                </Spin>
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
                    <p>Вы уверены что хотите удалить отзыв?</p>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    review: state.review,
    user: state.user,
    navs: state.navs.navs,
    serviceType: state.serviceType,
});

export default connect(mapStateToProps, {getReviews, getExcelReview, deleteReview, getNavigation, getAllServiceTypes})(withSocketContext(Reviews));