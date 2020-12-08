import React,{Component} from 'react';
import {Link} from "react-router-dom";
import {Button,  Form, Icon,  List} from "antd";
import "./confirm.css"
import {connect} from 'react-redux'
import {getOrganizationById} from "../../actions/organizationActions";
import classnames from "classnames";
import {getServiceTypesByOrganization} from "../../actions/serviceTypeActions";
import {getCriteriasByOrganization} from "../../actions/criteriaActions";
import {getCategoriesByOrganization} from "../../actions/categoryCriteriaActions";
import {getAllServices} from "../../actions/serviceActions";
import Modal from "antd/es/modal";
import {IP} from "../../actions/types";
import {getUsersByOrganization} from "../../actions/userActions";
import Spin from "antd/es/spin";
class Confirm extends Component{
    constructor(){
    super();
    this.state = {
        loading: false
    }
    }
     onNext=()=>{

         this.props.history.push('/dashboard/organizations');
         localStorage.removeItem('organization_id');
    };
    onPrev=()=>{

        this.props.history.push('/dashboard/admin/choose')
    };
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
        let id = localStorage.getItem('organization_id')
        this.props.getOrganizationById(id);
        this.props.getAllServices(id);
        this.props.getServiceTypesByOrganization(id, this.handleError, this.handleLoading);
        this.props.getCriteriasByOrganization(id);
        this.props.getCategoriesByOrganization(id);
        this.props.getUsersByOrganization({id:id,role:'admins'});
    }
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
    handleClose=()=>{
        this.setState({
            visible:true,
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

    render() {
        const {span,visible}=this.state;
        const {organizationItem}=this.props.organization;
        const {serviceTypesById}= this.props.serviceType;
        const {criteriasAll}=this.props.criteria;
        const {allServices}=this.props.service;
        const{categoriesAll}=this.props.categoryCriteria;
        const {orgUsers}= this.props.user;
        let adminOrg='';
        if(orgUsers && orgUsers.length>0) {
            adminOrg  = orgUsers.map((item, i) => (
                <div style={{borderBottom:"1px solid #e7e7e7",padding:"20px 0"}} key ={i}>
                    <span className="title-text">ФИО</span>
                    <h5  className="title-p">{item.name}</h5>
                    <span className="title-text">Должность</span>
                    <h5 className="title-p">{item.position}</h5>
                    <span className="title-text">Рабочий телефон</span>
                    <h5  className="title-p">{`${item.phone.work} внутренний: ${item.phone.inner}`}</h5>
                    <span className="title-text">Мобильный телефон</span>
                    <h5 className="title-p">{item.phone.mobile[0]}</h5>
                    <span className="title-text">Электронная почта</span>
                    <h5 className="title-p">{item.email}</h5>
                </div>
            ))
        }
        else{
            adminOrg=''
        }
        let serviceTypeKz=[];
        let serviceTypeRu=[];
        let serviceKz=[];
        let serviceRu=[];
        let categoryKz=[];
        let categoryRu=[];
        let criteriaKz=[];
        let criteriaRu=[];
        if(serviceTypesById && serviceTypesById.spts && serviceTypesById.spts.length>0){
            for(let i=0;i<serviceTypesById.spts.length;i++){
                serviceTypeRu.push({text: serviceTypesById.spts[i].nameRu, value: i});
                serviceTypeKz.push({text: serviceTypesById.spts[i].nameKz, value: i});
            }
        }
        if(allServices && allServices.length>0){
            for (let i = 0; i < allServices.length; i++) {
                serviceRu.push({text: allServices[i].serviceProviderType.nameRu, value: i,id:"serviceType"});
                serviceKz.push({text: allServices[i].serviceProviderType.nameKz, value: i,id:"serviceType"});

                for(let j=0;j<allServices[i].services.length;j++) {
                    serviceRu.push({text: allServices[i].services[j].nameRu, value: i});
                    serviceKz.push({text: allServices[i].services[j].nameKz, value: i});
                }
            }
        }

        if(categoriesAll && categoriesAll.length>0){
            for (let i = 0; i < categoriesAll.length; i++) {
                categoryRu.push({text: categoriesAll[i].serviceProviderType.nameRu, value: i,id:"serviceType"});
                categoryKz.push({text: categoriesAll[i].serviceProviderType.nameKz, value: i,id:"serviceType"});

                for(let j=0;j<categoriesAll[i].categories.length;j++) {
                    categoryRu.push({text: categoriesAll[i].categories[j].nameRu, value: i});
                    categoryKz.push({text: categoriesAll[i].categories[j].nameKz, value: i});
                }
            }
        }
        if(criteriasAll && criteriasAll.length>0){
            for(let i=0;i<criteriasAll.length;i++) {
                criteriaRu.push({text: criteriasAll[i].serviceProviderType.nameRu, value: i,id:"serviceType"});
                criteriaKz.push({text: criteriasAll[i].serviceProviderType.nameKz, value: i,id:"serviceType"});
                for(let j=0;j<criteriasAll[i].categories.length;j++) {
                    criteriaRu.push({text: criteriasAll[i].categories[j].nameRu, value: i,id:"category"});
                    criteriaKz.push({text: criteriasAll[i].categories[j].nameKz, value: i,id:"category"});
                    for(let k=0;k<criteriasAll[i].categories[j].criterias.length;k++){
                        criteriaRu.push({text: criteriasAll[i].categories[j].criterias[k].nameRu, value: i});
                        criteriaKz.push({text: criteriasAll[i].categories[j].criterias[k].nameKz, value: i});
                    }
                }
            }
        }
        return (
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p style={{border:"none",outline:"none",cursor:"pointer"}} onClick={this.handleClose} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-confirm">
                        <div className="add-inner">
                            <h2 className="h5-title">Подтверждение</h2>
                            <p className="title-text">Проверьте, все ли вы правильно заполнили.</p>
                            <div className="main-info">
                                <div className="main-info--title">
                                    <p>Общая информация</p>
                                    <Link to={'/dashboard/organizations/add'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                <Form.Item>
                                    <img className="avatar-default" src={organizationItem ? IP+organizationItem.image : ''} alt="qwe"/>
                                </Form.Item>
                                <Form.Item  label="Наименование организации">
                                    <h1 className="text">{organizationItem ? organizationItem.nameRu : ''}</h1>
                                    <h1 className="text">{organizationItem ? organizationItem.nameKz : ''}</h1>
                                </Form.Item>

                            </Form>
                            </div>
                            <div className="main-info">
                                <div className="main-info--title">
                                    <p>Типы услуг</p>
                                    <Link to={'/dashboard/service-type/add'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                                <p>Добавленные типы услуг на <span className={classnames("span", {'span-active': span})} onClick={this.onClickRus} >Русском</span>  <span className={classnames("span", {'span-active': !span})}  onClick={this.onClickKaz} >Казахском</span></p>
                                <div className="list">

                                    {span ? <List
                                        className="list"
                                        size="small"
                                        bordered
                                        dataSource={serviceTypeRu}
                                        renderItem={(item) =>
                                            <List.Item  className="">
                                                {item.text}

                                            </List.Item>
                                        }
                                    /> : <List
                                        className="list"
                                        size="small"
                                        bordered
                                        dataSource={serviceTypeKz}
                                        renderItem={(item) => <List.Item className="">
                                            {item.text}
                                        </List.Item>}
                                    />}
                                </div>
                            </div>
                            <div className="main-info">
                                <div className="main-info--title">
                                    <p>Услуги</p>
                                    <Link to={'/dashboard/service/add'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                                <p>Добавленные услуги на <span className={classnames("span", {'span-active': span})} onClick={this.onClickRus} >Русском</span>  <span className={classnames("span", {'span-active': !span})}  onClick={this.onClickKaz} >Казахском</span></p>
                                <div className="list">

                                    {span ? <List
                                        className="list"
                                        size="small"
                                        bordered
                                        dataSource={serviceRu}
                                        renderItem={(item) =>
                                        {
                                            return item.id === 'serviceType' ?
                                                <List.Item className="list-item-service">
                                                    {item.text}
                                                </List.Item>
                                                :
                                                <List.Item className="list-item-category">
                                                    {item.text}
                                                    <Icon type="delete" onClick={() => this.handleDelete(item.value)}/>
                                                </List.Item>
                                        }
                                        }
                                    /> : <List
                                        className="list"
                                        size="small"
                                        bordered
                                        dataSource={serviceKz}
                                        renderItem={(item) => {
                                            return item.id === 'serviceType' ?
                                                <List.Item className="list-item-service">
                                                    {item.text}
                                                </List.Item>
                                                :
                                                <List.Item className="list-item-category">
                                                    {item.text}
                                                    <Icon type="delete" onClick={() => this.handleDelete(item.value)}/>
                                                </List.Item>
                                        }}
                                    />}
                                </div>
                            </div>
                            <div className="main-info">
                                <div className="main-info--title">
                                    <p>Категорий оценок</p>
                                    <Link to={'/dashboard/category/add'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                                <p>Добавленные категорий на <span className={classnames("span", {'span-active': span})} onClick={this.onClickRus} >Русском</span>  <span className={classnames("span", {'span-active': !span})}  onClick={this.onClickKaz} >Казахском</span></p>
                                <div className="list">

                                    {span ? <List
                                        className="list"
                                        size="small"
                                        bordered
                                        dataSource={categoryRu}
                                        renderItem={(item) =>
                                        {return item.id === 'serviceType' ?
                                            <List.Item className="list-item-service">
                                                {item.text}
                                            </List.Item>
                                            :
                                            <List.Item className="list-item-category">
                                                {item.text}
                                                <Icon type="delete" onClick={() => this.handleDelete(item.value)}/>
                                            </List.Item>}
                                        }
                                    /> : <List
                                        className="list"
                                        size="small"
                                        bordered
                                        dataSource={categoryKz}
                                        renderItem={(item) => {return item.id === 'serviceType' ?
                                            <List.Item className="list-item-service">
                                                {item.text}
                                            </List.Item>
                                            :
                                            <List.Item className="list-item-category">
                                                {item.text}
                                                <Icon type="delete" onClick={() => this.handleDelete(item.value)}/>
                                            </List.Item>}}
                                    />}
                                </div>
                            </div>
                            <div className="main-info">
                                <div className="main-info--title">
                                    <p>Критерий оценок</p>
                                    <Link to={'/dashboard/criteria/add'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                                <p>Добавленные критерий на <span className={classnames("span", {'span-active': span})} onClick={this.onClickRus} >Русском</span>  <span className={classnames("span", {'span-active': !span})}  onClick={this.onClickKaz} >Казахском</span></p>
                                <div className="list">

                                    {span ? <List
                                        className="list"
                                        size="small"
                                        bordered
                                        dataSource={criteriaRu}
                                        renderItem={(item) =>
                                        {
                                            if(item.id==='serviceType')
                                                return  <List.Item className="list-item-service">
                                                    {item.text}
                                                </List.Item>
                                            else if (item.id==='category')
                                                return  <List.Item className="list-item-category">
                                                    {item.text}
                                                </List.Item>
                                            else return <List.Item className="list-item">
                                                    {item.text}
                                                    <Icon type="delete" onClick={() => this.handleDelete(item.value)}/>
                                                </List.Item>

                                        }
                                        }
                                    /> : <List
                                        className="list"
                                        size="small"
                                        bordered
                                        dataSource={criteriaKz}
                                        renderItem={(item) => {
                                            if(item.id==='serviceType')
                                                return  <List.Item className="list-item-service">
                                                    {item.text}
                                                </List.Item>
                                            else if (item.id==='category')
                                                return  <List.Item className="list-item-category">
                                                    {item.text}
                                                </List.Item>
                                            else return <List.Item className="list-item">
                                                    {item.text}
                                                    <Icon type="delete" onClick={() => this.handleDelete(item.value)}/>
                                                </List.Item>
                                        }}
                                    />}
                                </div>
                            </div>
                            <div style={{width:"100%"}}>
                                <div className="main-info--title">
                                    <p>Администраторы</p>
                                    <Link to={'/dashboard/admin/choose'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                                {adminOrg}


                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"80px 0"}} >
                        <div>
                            <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                            <span>Шаг 6. Добавить администратора</span>
                        </div>
                        <Button onClick={this.onNext}  type="primary">Далее<Icon type="right-circle" /></Button>
                    </div>
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
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    organization:state.organization,
    serviceType:state.serviceType,
    criteria:state.criteria,
    categoryCriteria:state.categoryCriteria,
    service:state.service,
    user:state.user,
})
export default connect(mapStateToProps,{getUsersByOrganization,getCategoriesByOrganization,getCriteriasByOrganization,getOrganizationById,getServiceTypesByOrganization,getAllServices}) (Confirm);
