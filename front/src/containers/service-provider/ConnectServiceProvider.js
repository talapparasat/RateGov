import React,{Component} from "react";
import {Button, Form, Icon, message} from 'antd';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import AutoComplete from "antd/es/auto-complete";
import Select from "antd/es/select";
import { getServiceTypesByOrganization} from "../../actions/serviceTypeActions";
import Modal from "antd/es/modal";
import {getOrganizationsAuto} from "../../actions/organizationActions";
import {
    connectServiceProvider, getProviderConfirm,
    getServiceProviderById,getSupervisorsByOrganization
} from "../../actions/serviceProviderActions";
import {getNavigationByOspt} from "../../actions/navigationActions";
import {getProfile} from "../../actions/userActions";
import Spin from "antd/es/spin";

const { Option } = Select;


class ConnectServiceProvider extends Component{
    constructor(){
        super();
        this.state={
            selected:false,
            organizationId:null,
            serviceProviderTypeId:null,
            visible:false,
            organizationName:"",
            supervisorName:'',
            query:'',
            page:'',
            didMount:false,
            didMountSupervisor:false,
            didUpdate:false,
            didMountServiceProvider:false,
            didMountNav: false,
            didMountPrev: false,
            prevId: null,
            loading: false,
        }
    }

    handleClose=()=>{
        this.setState({
            visible:true,
        })
    }
    onChangeAuto1=(value)=> {
        console.log(value);
        if(this.state.didUpdate){
            this.setState({
                supervisorName:'',
                supervisorId: null,
                prevId: null,
                navId: null,
                serviceProviderTypeId:null
            })
        }
        this.setState({
            organizationName:value,
        });
    };
    onChangeAuto2=(value)=> {
        this.setState({
            supervisorName:value,
        });
    };
    onChange=(value)=>{
        // this.setState({
        //     serviceProviderTypeId: value
        // })

    }
    onChangePrev = value => {
        console.log(value)
        this.setState({
            prevId: value,
        })
        this.props.getNavigationByOspt({organizationId: this.state.organizationId, serviceProviderTypeId: this.state.serviceProviderTypeId, prevId: value})
    }
    onChangeNav = value => {
        this.setState({
            navId: value
        })
    }
    onSelect1=(value)=>{
        this.setState({
            selected:true,
            organizationId:value
        })
        let data ={
            id:value,
            ...this.state
        }
        if (value){
            console.log(2)
            this.props.getServiceTypesByOrganization(value, this.handleError, this.handleLoading)
            this.props.getSupervisorsByOrganization(data, this.handleError, this.handleLoading);
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
    onSelect2=(value)=>{
        this.setState({
            supervisorId:value
        })
    }
    onSelectType = value => {
        this.setState({
            serviceProviderTypeId: value
        })
        if (localStorage.role === 'superadmin') {
            this.props.getNavigationByOspt({organizationId: this.state.organizationId, serviceProviderTypeId: value, prevId: null})
        }
    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/provider');
        localStorage.removeItem('serviceProvider');
    }
    handleOk=()=>{
        let data = {
            organizationId: this.state.organizationId ? this.state.organizationId : localStorage.organizationId,
            serviceProviderTypeId: this.state.serviceProviderTypeId,
            supervisorId: this.state.supervisorId,
            serviceProviderId: localStorage.getItem('serviceProvider'),
            navId: this.state.navId,
        };
        // if (this.props.user.confirm) {
        //     this.props.user.confirm.serviceProvider.serviceProviderTypeId = null
        //     this.props.user.confirm.organization._id = null
        // }
        if (localStorage.role === 'superadmin') {
            if(this.state.organizationId && this.state.serviceProviderTypeId) {
                this.props.connectServiceProvider(this.handleError, this.handleLoading, data,this.props.history)
            } else {
                message.error('Выберите организацию и типа услугодателя!')
            }
        } else if (localStorage.role === 'admin') {
            if(this.state.serviceProviderTypeId) {
                this.props.connectServiceProvider(this.handleError, this.handleLoading, data,this.props.history)
            } else {
                message.error('Выберите типа услугодателя!')
            }
        }


    };

    onPrev=()=>{
        this.props.history.push('/dashboard/provider/add');
    }
    handleSearch1 = value => {
        this.props.getOrganizationsAuto({query: value});
    };
    handleSearch2 = value => {
        if(this.props.user.profile.role === 'superadmin'){
            this.props.getSupervisorsByOrganization({query: value,id:this.state.organizationId}, this.handleError, this.handleLoading);
        }
        else if(this.props.user.profile.role === 'admin'){
            this.props.getSupervisorsByOrganization({query: value, id: localStorage.organizationId}, this.handleError, this.handleLoading);
        }
    };
    componentDidMount() {

        let id = localStorage.getItem('serviceProvider')
        this.props.getProviderConfirm(id,  this.handleError, this.handleLoading)
        let data = {
            id: localStorage.organizationId,
            ...this.state
        }
        if(localStorage.role === 'superadmin') {
            this.props.getOrganizationsAuto({query: ''});
        }
        else if(localStorage.role === 'admin') {
            this.props.getServiceTypesByOrganization(localStorage.organizationId, this.handleError, this.handleLoading)
            this.props.getSupervisorsByOrganization(data, this.handleError, this.handleLoading);
        }

    }
    componentWillReceiveProps(props) {
        let org = {}
        if(!this.state.didMount && props.user.confirm.organization   &&  props.user.confirm && props.user.confirm.serviceProvider && (props.user.confirm.serviceProvider._id === localStorage.getItem('serviceProvider'))) {
                console.log(props.user.confirm.organization)
                    org = props.user.confirm.organization

            this.setState({
                organizationId:org._id,
                organizationName:org.nameRu,
                didMount: true,
                didUpdate:true
            })
            let data ={
                id:org._id,
                ...this.state
            }
            this.props.getServiceTypesByOrganization(org._id, this.handleError, this.handleLoading)
            this.props.getSupervisorsByOrganization(data, this.handleError, this.handleLoading);
        }
        // if(!this.state.didMount && props.user.confirm.user && (props.user.confirm.serviceProvider._id === localStorage.getItem('serviceProvider')) && props.user.confirm.organization && props.organization.organizations.length > 0) {
        //     let org={}
        //     for (let i = 0; i < props.organization.organizations.length; i++) {
        //         if (props.user.confirm && props.user.confirm.organization && (props.organization.organizations[i]._id === props.user.confirm.organization._id)) {
        //             org = props.organization.organizations[i]
        //         }
        //     }
        //     console.log(props.user.confirm,org, this.state.didMount , this.props.organization.organizations.length , props.organization.organizations.length, "asd")
        //     this.setState({
        //         organizationId:org._id,
        //         organizationName:org.nameRu,
        //         didMount: true,
        //         didUpdate:true
        //     })
        //
        //     this.props.getServiceProviderByOrganization(org._id, this.state.query)
        // }

        let serviceType = null

        if(localStorage.role === 'superadmin' && !this.state.didMountServiceProvider &&  props.user.confirm.serviceProvider && (props.user.confirm.serviceProvider._id === localStorage.getItem('serviceProvider'))) {
            serviceType = props.user.confirm.serviceProvider.serviceProviderTypeId
            this.setState({
                serviceProviderTypeId: serviceType,
                didMountServiceProvider:true,
            })
            this.props.getNavigationByOspt({organizationId: org._id, serviceProviderTypeId: serviceType, prevId: null})
        }
        let prev = null

        if(!this.state.didMountPrev &&  props.user.confirm.region && (props.user.confirm.serviceProvider._id === localStorage.getItem('serviceProvider'))) {
            prev = props.user.confirm.region._id
            this.setState({
                prevId: prev,
                didMountPrev:true,
            })
            this.props.getNavigationByOspt({organizationId: org._id, serviceProviderTypeId: serviceType, prevId: prev})
        }
        let nav = null

        if(!this.state.didMountNav &&  props.user.confirm.raion && (props.user.confirm.serviceProvider._id === localStorage.getItem('serviceProvider'))) {
            nav = props.user.confirm.raion._id
            this.setState({
                navId: nav,
                didMountNav:true,
            })
        }
        let supervisor={};
        if(!this.state.didMountSupervisor && props.user.confirm.supervisor && props.user.confirm.serviceProvider && (props.user.confirm.serviceProvider._id===localStorage.getItem('serviceProvider')) && props.serviceProvider.supervisors.length > 0) {
            supervisor = props.user.confirm.supervisor
            this.setState({
                supervisorId:supervisor._id,
                supervisorName:supervisor.name,
                didMountSupervisor:true,
            })
        }
    }

    render(){
        const {visible, prevId, navId, serviceProviderTypeId, organizationName, supervisorName} = this.state;
        const {navs, prevs} = this.props.navs;
        console.log(navs, prevs);
        const {serviceTypesById} = this.props.serviceType;
        const {organization,serviceProvider} = this.props;
        let organizations = [], supervisors = [];
        if(organization && organization.organizations && organization.organizations.length>0 ){
            for (let i = 0; i < organization.organizations.length; i++) {
                organizations.push({
                    text: organization.organizations[i].nameRu,
                    value: organization.organizations[i]._id
                })
            }
        }
        if(organizations &&   serviceProvider && serviceProvider.supervisors && serviceProvider.supervisors.length>0){
            for (let i = 0; i < serviceProvider.supervisors.length; i++) {
                supervisors.push({
                    text: serviceProvider.supervisors[i].name,
                    value: serviceProvider.supervisors[i]._id
                })
            }
        }
        else{
            supervisors=[]
        }
        let optionsSelect=[];
        if(serviceTypesById && serviceTypesById.spts &&  serviceTypesById.spts.length>0) {
            for (let i = 0; i < serviceTypesById.spts.length; i++) {
                optionsSelect.push({
                    text: serviceTypesById.spts[i].nameRu,
                    value: serviceTypesById.spts[i].id
                })
            }
        }
        let options=[];
        if(optionsSelect && optionsSelect.length>0){
            options = optionsSelect.map((item,i)=>(
                item ?
                <Option key={i} value={item.value}>{item.text}</Option> : null
            ))
        }
        let optionPrevsArray = []
        if(prevs && prevs.length>0) {
            for (let i = 0; i < prevs.length; i++) {
                optionPrevsArray.push({
                    text: prevs[i].nameRu,
                    value: prevs[i]._id
                })
            }
        }
        let optionNavsArray = []
        if(navs && navs.length>0) {
            for (let i = 0; i < navs.length; i++) {
                optionNavsArray.push({
                    text: navs[i].nameRu,
                    value: navs[i]._id
                })
            }
        }

        let optionNavs = optionNavsArray.map((item, i) => (
            <Option key={i}  value={item.value}>{item.text}</Option>
        ))


        let optionPrevs = optionPrevsArray.map((item, i) => (
            <Option key={i}  value={item.value}>{item.text}</Option>
        ))


        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p style={{border:"none",outline:"none",cursor:"pointer"}} onClick={this.handleClose} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-add">
                        <div className="add-inner">
                            {this.props.user.profile.role==='superadmin' ?  <h2 style={{textAlign:"center"}} className="h5-title">Шаг 2/3.Прикрепение организации и супервайзера</h2> : <h2 style={{textAlign:"center"}} className="h5-title">Шаг 2/3.Прикрепение типов услуг и супервайзера</h2> }
                            <p className="title-text">Прикрепите услугодателя к организации и супервайзера</p>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                {this.props.user.profile.role==='superadmin' ? <Form.Item label="Организация">
                                    <AutoComplete
                                        value={organizationName}
                                        style={{ width: 600 }}
                                        onSelect={this.onSelect1}
                                        onSearch={this.handleSearch1}
                                        onChange={this.onChangeAuto1}
                                        dataSource={organizations}
                                        placeholder="Введите наименование организации"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />

                                </Form.Item> : '' }
                                <Form.Item label="Тип услуги">
                                    <Select
                                        showSearch
                                        style={{ width: 600 }}
                                        placeholder="Выберите тип услуги"
                                        optionFilterProp="children"
                                        onChange={this.onChange}
                                        onSelect={this.onSelectType}
                                        value={serviceProviderTypeId}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {options}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Супервайзер">
                                    <AutoComplete
                                        value={supervisorName}
                                        style={{ width: 600 }}
                                        onSelect={this.onSelect2}
                                        onSearch={this.handleSearch2}
                                        onChange={this.onChangeAuto2}
                                        dataSource={supervisors}
                                        placeholder="Введите супервайзера"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                </Form.Item>
                                {this.props.user.profile.role === 'superadmin' ?  <Form.Item label="Регион">
                                        <Select
                                            showSearch
                                            style={{ width: 600 }}
                                            placeholder="Выберите регион"
                                            optionFilterProp="children"
                                            onChange={this.onChangePrev}
                                            value={prevId}
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {optionPrevs}
                                        </Select>
                                    </Form.Item>
                                    : ''}
                                {this.props.user.profile.role === 'superadmin' ? <Form.Item label="Район">
                                    <Select
                                        showSearch
                                        style={{ width: 600 }}
                                        placeholder="Выберите район"
                                        optionFilterProp="children"
                                        onChange={this.onChangeNav}
                                        value={navId}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {optionNavs}
                                    </Select>
                                </Form.Item> : ''}
                            </Form>
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end", padding:"80px 0"}} >
                        <div>
                            <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                            <span>Шаг 1. Добавить услугодателя</span>
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
    serviceType:state.serviceType,
    serviceProvider:state.serviceProvider,
    user:state.user,
    navs: state.navs,
});

export default connect(mapStateToProps,{getProfile,getProviderConfirm,connectServiceProvider,getOrganizationsAuto,getServiceTypesByOrganization,getSupervisorsByOrganization,getServiceProviderById, getNavigationByOspt}) (withRouter(ConnectServiceProvider));
