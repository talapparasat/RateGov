import React,{Component} from "react";
import {Button, Form,Icon, Radio} from 'antd';
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import Modal from "antd/es/modal";
import {getOrganizations} from "../../actions/organizationActions";
import {clearErrors} from "../../actions/authActions";
import {addOrganizationToUser, getConfirm} from "../../actions/userActions";
import AutoComplete from "antd/es/auto-complete";
import Spin from "antd/es/spin";

class ConnectSupervisor extends Component{
    constructor(){
        super();
        this.state={
            visible:false,
            checked:false,
            error:{},
            query:'',
            page:'',
            editValues:'',
            didMount:false,
            orgName:'',
            loading: false,
        }
    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/supervisor');
        localStorage.removeItem('user')
    }

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
    onNext=()=>{
        this.props.history.push('/dashboard/supervisor/confirm')
        this.setState({
            editValues:''
        })

    };
    onPrev=()=>{
        this.props.history.push('/dashboard/supervisor/add');
        this.setState({
            editValues:''
        })

    };
    handleOk=()=>{
        let data={
            id:this.state.editValues,
            userId:localStorage.getItem("user"),
            text:"/organizations/",
            user:'',
            history:'/dashboard/supervisor/confirm'
        }
        this.props.addOrganizationToUser(data,this.props.history,  this.handleError, this.handleLoading);
        if(!this.state.editValues){
            this.setState({
                error:{message:"Выберите организацию"}
            })
        }
    }
    componentDidMount() {
        this.props.getOrganizations(this.state, this.handleError, this.handleLoading);
        this.props.clearErrors();
        let data = {
            id: localStorage.getItem("user"),
            text:''
        }
        this.props.getConfirm(data,  this.handleError, this.handleLoading);
    }
    componentWillReceiveProps(props) {
        if(props.error && props.error.error && !this.state.error) {
            this.setState({error: props.error.error});
        }
        let values={};
        if (!this.state.didMount && props.user.confirm && props.user.confirm.Organization && props.user.confirm.User._id===localStorage.getItem('user')) {
            values= props.user.confirm.Organization
            this.setState({
                editValues: values._id,
                orgName:values.nameRu,
                didMount:true
            })
        }
    }
    handleSearch = value => {
        this.props.getOrganizations({query: value, page: 1}, this.handleError, this.handleLoading);
    };
    handleSelect = value => {
        this.setState({
            editValues:value,
        });
    };
    onChangeAuto=(value)=> {
        this.setState({
            orgName:value,
        });
    };
    render(){
        const {organizations} = this.props.organization;
        const {error,orgName}=this.state;
        let errorMessage='';
        if(error){
            errorMessage =
                <p style={{color:"red",fontSize:'14px',textAlign: "center"}}>{error ? error.message : {}}</p>
        }
        else{
            errorMessage='';
        }
        const {visible}=this.state;
        let optionsRadio=[];
        if(organizations && organizations.organizations && organizations.organizations.length>0) {
            for (let i = 0; i < organizations.organizations.length; i++) {

                    optionsRadio.push({
                        value: organizations.organizations[i]._id,
                        text: organizations.organizations[i].nameRu
                    })
                }
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
                            <h2 className="h5-title">Шаг 2/2. Выбрать организацию</h2>
                            <p className="title-text">Выберите организацию из списка</p>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                <Form.Item label="Организации">
                                    <AutoComplete
                                        value={orgName}
                                        style={{ width: 600 }}
                                        onSearch={this.handleSearch}
                                        onChange={this.onChangeAuto}
                                        onSelect={this.handleSelect}
                                        dataSource={optionsRadio}
                                        placeholder="Введите организацию"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                </Form.Item>
                                {errorMessage}
                            </Form>
                        </div>


                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"80px 0"}} >
                        <div>
                            <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                            <span>Шаг 1.Добавить супервайзера</span>
                        </div>
                        <Button onClick={this.handleOk}   type="primary">Далее<Icon type="right-circle" /></Button>
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
    user:state.user,
    error:state.error,
})

export default connect(mapStateToProps,{getOrganizations,clearErrors,getConfirm,addOrganizationToUser}) (withRouter(ConnectSupervisor));
