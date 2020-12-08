import React,{Component} from "react";
import {Button, Form, Icon, message} from 'antd';
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import Modal from "antd/es/modal";
import {getOrganizationsAuto} from "../../actions/organizationActions";
import {clearErrors} from "../../actions/authActions";
import {addOrganizationToUser, getConfirm, getProfile, getUserById} from "../../actions/userActions";
import AutoComplete from "antd/es/auto-complete";
import {connectOperator, getServiceProviderByOrganization} from "../../actions/serviceProviderActions";
import Spin from "antd/es/spin";


class ConnectOperator extends Component{
    constructor(){
        super();
        this.state = {
            organizationId: null,
            organizationName: '',
            error: {},
            query: '',
            page: '',
            serviceProviderId: '',
            didMount: false,
            didUpdate:false,
            didMountServiceProvider: false,
            loading: false,
        }
    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/operator');
        localStorage.removeItem('user')
    }
    handleClose=()=>{
        this.setState({
            visible:true,
        })
    }
    onNext=()=>{
        this.props.history.push('/dashboard/operator/confirm')
    };
    onPrev=()=>{
        this.props.history.push('/dashboard/operator/add');
    };
    handleOk=()=>{
        let data = {
            id:this.state.serviceProviderId,
            userId:localStorage.getItem("user"),
            organizationId: this.state.organizationId ? this.state.organizationId : '',
            text:"/service-providers/",
            user:'operators/',
            history:'/dashboard/operator/confirm'
        }

        if(!this.state.serviceProviderId){
            this.setState({
                error:{message:"Выберите услугодателя"}
            })
        }
        console.log(data);
        if (localStorage.getItem('role') === 'superadmin') {
            if (this.state.organizationId && this.state.serviceProviderId) {
                this.props.addOrganizationToUser(data,this.props.history, this.handleError, this.handleLoading);
            } else {
                message.error('Заполните все поля!')
            }
        } else if (localStorage.getItem('role') === 'admin') {
            if (this.state.serviceProviderId) {
                this.props.addOrganizationToUser(data,this.props.history, this.handleError, this.handleLoading);
            } else {
                message.error('Заполните все поля!')
            }
        }

    }
    handleSearch1 = value => {
        this.props.getOrganizationsAuto({query: value});
    };
    onSelect1 = (value) => {
        this.setState({
            organizationId: value,
            didUpdate: true,
        })
        this.props.getServiceProviderByOrganization(value,this.state.query, this.handleError, this.handleLoading)
    }
    handleSearch2 = value => {
        this.props.getServiceProviderByOrganization(this.state.organizationId, value, this.handleError, this.handleLoading);
    };
    onSelect2 = (value) => {
        this.setState({
            serviceProviderId: value
        })
    }
    onChangeAuto1 = (value) => {
        this.setState({
            organizationName: value,
        });
        if(this.state.didUpdate) {
            this.setState({
                serviceProviderName: '',
                serviceProviderId: null
            })
        }
    };
    onChangeAuto2=(value)=> {
        this.setState({
            serviceProviderName:value,
        });
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
    componentDidMount() {
        let data ={
            id: localStorage.getItem("user"),
            text:'Operator'
        }
        if(data.id) {
            this.props.getConfirm(data, this.handleError, this.handleLoading);
        }
        this.props.clearErrors();

        if (localStorage.role === 'superadmin'){
            this.props.getOrganizationsAuto(this.state, this.handleError, this.handleLoading);

        }
        else if(localStorage.role === 'admin'){
            this.props.getServiceProviderByOrganization(localStorage.organizationId, this.state.query,  this.handleError, this.handleLoading)
        }

        // if(this.props.user.confirm && this.props.user.confirm.ServiceProvider){
        //
        //     this.props.getServiceProviderByOrganization(this.state.organizationName,this.state)
        // }
    }
    componentWillReceiveProps(props) {
        if(props.error && props.error.error && !this.state.error)
            this.setState({error: props.error.error});
        let serviceProvider={};
        if(!this.state.didMount && props.user.confirm.User && (props.user.confirm.User._id === localStorage.getItem('user')) && props.user.confirm.Organization && props.organization.organizations.length > 0) {
            // let org = {};
            let org = props.user.confirm.Organization
            // for (let i = 0; i < props.organization.organizations.length; i++) {
            //     if (props.user.confirm && props.user.confirm.Organization && (props.organization.organizations[i]._id === props.user.confirm.Organization._id)) {
            //         org = props.organization.organizations[i]
            //     }
            // }
            console.log(props.user.confirm,org, this.state.didMount , this.props.organization.organizations.length , props.organization.organizations.length, "asd")
            this.setState({
                organizationId:org._id,
                organizationName:org.nameRu,
                didMount: true,
                didUpdate:true
            })
            console.log(org._id)
            this.props.getServiceProviderByOrganization(org._id, this.state.query, this.handleError, this.handleLoading)
        }
        if (!this.state.didMountServiceProvider && props.user.confirm.User &&  (props.user.confirm.User._id === localStorage.getItem('user')) && props.user.confirm.ServiceProvider && props.serviceProvider.serviceProviders.length>0){
                serviceProvider = props.user.confirm.ServiceProvider
            this.setState({
                serviceProviderId: serviceProvider._id,
                serviceProviderName:serviceProvider.nameRu,
                didMountServiceProvider:true
            })
        }
    }
    render(){
        const {organizations} = this.props.organization;
        const {user}=this.props
        const {serviceProviderName,visible,organizationName,error}=this.state
        const {serviceProviders}=this.props.serviceProvider;
        let errorMessage='';
        console.log(user)
        if(error){
            errorMessage =
                <p style={{color:"red",fontSize:'14px', textAlign: "center"}}>{error ? error.message : {}}</p>
        }
        else{
            errorMessage='';
        }
        let serviceProvidersOfOrganization=[];
        let organizationsAuto=[];
        if ( serviceProviders && serviceProviders.length > 0) {
            for(let i=0;i<serviceProviders.length;i++) {
                serviceProvidersOfOrganization.push({value: serviceProviders[i]._id, text: serviceProviders[i].nameRu})
            }
        }
            if(organizations && organizations.length>0 ){
                for (let i = 0; i < organizations.length; i++) {
                    organizationsAuto.push({
                        text: organizations[i].nameRu,
                        value: organizations[i]._id
                    })
                }
            }
            // if(optionsRadio.length===0){
            //     isEmpty = <div className="is-empty">У вас нет добавленных услугодателей</div>;
            // }
            // else{
            //     isEmpty =optionsRadio.map((item,i)=>
            //         <Radio key={i} checked={item.checked} value={item.value}>{item.label}</Radio>
            //     )
            //
            // }
        let isEmptyRadio=''
        if(serviceProviders && serviceProviders.length === 0 && serviceProviderName === ''){
            isEmptyRadio =  <p align="center">В данной организации нету услугодателй</p>
        }
        console.log(isEmptyRadio)
        let titleStep='',paragraphStep=''
        if(user.profile && user.profile.role==='superadmin'){
            titleStep=<h2 className="h5-title">Шаг 2/2. Выбрать организацию и услугодателя</h2>
            paragraphStep=<p className="title-text">Прикрепите организацию и услугодателя к оператору</p>
        }
        else if(user.profile && user.profile.role==='admin'){
            titleStep=<h2 className="h5-title">Шаг 2/2. Выбрать услугодателя</h2>
            paragraphStep=<p className="title-text">Прикрепите  услугодателя к оператору</p>
        }

        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p style={{border:"none",outline:"none",cursor:"pointer"}} onClick={this.handleClose} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-add">
                        <div className="add-inner">
                            {titleStep}
                            {paragraphStep}
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                {this.props.user.profile.role==='superadmin' ? <Form.Item label="Организация">
                                    <AutoComplete
                                        value={organizationName}
                                        style={{ width: 600 }}
                                        onSelect={this.onSelect1}
                                        onSearch={this.handleSearch1}
                                        onChange={this.onChangeAuto1}
                                        dataSource={organizationsAuto}
                                        placeholder="Введите организацию"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />

                                </Form.Item > : ''}
                                {isEmptyRadio  ? isEmptyRadio :  <Form.Item label="Услугодатели">
                                    <AutoComplete
                                        value={serviceProviderName}
                                        style={{ width: 600 }}
                                        onSelect={this.onSelect2}
                                        onSearch={this.handleSearch2}
                                        onChange={this.onChangeAuto2}
                                        dataSource={serviceProvidersOfOrganization}
                                        placeholder="Введите услугодателя"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                </Form.Item>}
                                {errorMessage}
                            </Form>
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"80px 0"}} >
                        <div>
                            <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                            <span>Шаг 1.Добавить оператора</span>
                        </div>
                        <Button onClick={this.handleOk}  type="primary">Далее<Icon type="right-circle" /></Button>
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
                    </div>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    organization:state.organization,
    serviceProvider:state.serviceProvider,
    user:state.user,
    error:state.error,
})

export default connect(mapStateToProps,{getProfile,connectOperator,getOrganizationsAuto,getServiceProviderByOrganization,clearErrors,getConfirm,addOrganizationToUser,getUserById}) (withRouter(ConnectOperator));
