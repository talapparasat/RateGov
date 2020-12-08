import React,{Component} from 'react'
import './settings.css'
import {Button, Icon, Col, Form, Input, Upload, message} from "antd";
import Row from "antd/es/grid/row";
import Modal from "antd/es/modal";
import FormItem from "antd/es/form/FormItem";
import {connect} from "react-redux";
import { getConfirm, getProfile} from "../../actions/userActions";
import { IP} from "../../actions/types";
import MaskedInput from "antd-mask-input";
import {clearErrors} from "../../actions/authActions";
import axios from "axios";
import Switch from "antd/es/switch";
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Размер картинки не должен превышать 2МБ!');
    }
}
class SettingsForm extends  Component{
    constructor(){
        super();
        this.state={
            password:'•',
            length:6,
            emailVisible:false,
            passwordVisible:false,
            email:"",
            profileVisible:false,
            oldPassword:"",
            newPassword:"",
            name:'',
            mobileCode:'',
            workCode:"",
            inner:"",
            mobilePhone:"",
            workPhone:"",
            img:'',
            errors:[],
            newPassword2:"",
        }
    }
    openEmailModal=(profile)=>{
        this.setState({
            emailVisible:true,
            email:profile.email,
            errors:[],
        })
    }
    openPasswordModal=()=>{
        this.setState({
            passwordVisible:true
        })
    }
    openProfileModal=(profile)=>{
        this.setState({
            profileVisible:true,
            name:profile.name,
            imageUrl:IP+profile.image,
            img:profile.image,
            inner:profile.phone.inner,
            workCode:profile.phone.work ? profile.phone.work.substring(2,6) : '',
            workPhone:profile.phone.work ? profile.phone.work.substring(6) : '',
            mobileCode: profile.phone.mobile && profile.phone.mobile[0] ? profile.phone.mobile[0].substring(2,6) : '',
            mobilePhone: profile.phone.mobile && profile.phone.mobile[0] ? profile.phone.mobile[0].substring(8) : '',
        })
    }
    onUpload = (img) => {
        this.setState({img: img})
    };
    cancelEmailModal=()=>{
        this.setState({
            emailVisible:false
        })
    }
    cancelPasswordModal=()=>{
        this.setState({
            passwordVisible:false
        })
    }
    cancelProfileModal=()=>{
        this.setState({
            profileVisible:false
        })
    }
    componentDidMount() {
        this.props.getProfile()
        this.props.clearErrors();
    }
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }


    handleOkEmail=()=>{
        if(this.state.email.length>0) {
            axios.put(IP + 'api/profile/email', {email: this.state.email})
                .then(res => {
                    this.setState({
                        emailVisible:false
                    })
                        this.props.getProfile()
                        this.props.clearErrors()
                    }
                )
                .catch(err => {
                      alert(err)
                    }
                );
        }
    }

    handleOkProfile=()=>{
        let data={
            image:this.state.img,
            name:this.state.name,
            phone:{work:"+7"+this.state.workCode+this.state.workPhone,inner:this.state.inner,mobile:["8 "+this.state.mobileCode+')-'+this.state.mobilePhone]},
        }
        if(this.props.user.profile && (this.state.img === this.props.user.profile.image)){
            data.image = null
        }
        else{
            data.image=this.state.img
        }
        let fm = new FormData();

        fm.append('name', data.name);
        fm.append('image',data.image);
        fm.append('phone', JSON.stringify(data.phone) );
        axios.put(IP+'api/profile',fm,{
            headers: {
                'Content-Type' : false,
                'Process-Data' : false
            }
        })
            .then(res=> {
                this.setState({
                    profileVisible:false
                })
                this.props.getProfile()
                }
            )
            .catch(err=> {
                  alert(err.response)
                }
            );

    }
    componentWillReceiveProps(props) {
        if(props.error && props.error.error && props.error.error.errors && props.error.error.errors.length>0) {
            this.setState({errors: props.error.error.errors, emailVisible:true});
        }
        // if(this.props.error.error && this.props.error.error.errors && this.props.error.error.errors.length>0){
        //     this.setState({
        //
        //     })
        // }
        else{
            this.setState({
                emailVisible:false,
            })
        }
    }

    handleChange = info => {
        console.log(info.file.originFileObj)
        getBase64(info.file.originFileObj, imageUrl =>
            (this.setState({
                    imageUrl,
                    loading: false,
                    img:info.file.originFileObj
                })

            ))

    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('Пароли не одинаковы');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err,values) => {
            if (!err) {
                const password1 = this.props.form.getFieldValue("newPassword");
                const password2 = this.props.form.getFieldValue("oldPassword");
                const passwords = {
                    oldPassword: password2,
                    newPassword: password1
                }
                axios.put(IP+'api/profile/password',passwords)
                    .then(res=> {
                        this.setState({
                            passwordVisible:false,
                        })
                            this.props.getProfile()
                        }
                    )
                    .catch(err=> {
                           alert(err)
                        }
                    )}
        } );
    };

    onChangeSwitch = (checked) => {
        console.log(checked)

    }
    handleChangeInput(evt) {
        const inner = (evt.target.validity.valid) ? evt.target.value : this.state.inner;
        this.setState({
            inner
        })
    }
    render(){
        const {password,errors,length,emailVisible,passwordVisible,email,profileVisible,name,workCode,workPhone,mobilePhone,mobileCode,inner}=this.state;
        const {profile}=this.props.user;
        console.log(this.props.user.profile)
        const { getFieldDecorator } = this.props.form;
        let passwordItem=password+' ';
        for(let i=0;i<length;i++){
           passwordItem+=password+' ';
        }
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        let errorMessage='',serviceProviderTitle='',serviceProviderName='';
        if(errors){
            for(let i=0;i<errors.length;i++){
                errorMessage=errors.map((item,i)=>(
                    <p key={i} style={{color:"red",fontSize:'14px'}}>{item.msg ? item.msg : ''}</p>
                ))
            }
        }
        if(this.props.user.profile.role==='operator'){
            serviceProviderTitle= <Col span={8}>
                <span className="basic-title">Наименование услугодателя</span>
            </Col>
            serviceProviderName=<Col span={8}>
                <span  className="basic-title">{(profile && profile.serviceProvider && profile.serviceProvider.nameRu) ? profile.serviceProvider.nameRu : ''}</span>
            </Col>
        }
        const imageUrl = this.state.imageUrl;
        return(
            <div className="settings">
                <div className="container-settings">
                   <div className="settings-inner">
                       <div className="main-info--title">
                           <p style={{padding:'0'}} className="title ">Настройки личного кабинета<span style={{paddingLeft:"5px"}} className="title-text">обновление было 13 минут назад</span></p>
                           <Button onClick={()=>this.openProfileModal(profile)} style={{border:"none",outline:"none",color:"#212121"}}><Icon type="edit"/>Редактировать</Button>
                       </div>
                       <div className="user-info">
                           <div className="img-avatar">
                               <img className="img-avatar" src={profile ? IP+profile.image : ''} alt='avatar'/>
                           </div>
                           <div className="user-info-title">
                               <h2 className="h6-title">{profile ? profile.name : ''}</h2>
                               <p className="title-text">{profile ? profile.position : ''}</p>
                           </div>
                       </div>
                       <div className="main-info--title">
                           <p style={{padding:'0',fontSize:"18px"}} className="title ">Основые данные </p>
                       </div>
                       <Row  gutter={[12,12]}>
                           <Col  span={8}>
                               <span className="basic-title">Рабочий телефон</span>
                           </Col>
                           <Col span={8}>
                               <span  className="basic-title">{profile && profile.phone && profile.phone.work ? profile.phone.work.substring(0,2)+' ('+profile.phone.work.substring(2,6)+') '+profile.phone.work.substring(6) + ' внутренний: '+ `${ profile.phone.inner}`: ''}</span>
                           </Col>
                       </Row>
                       <div className="main-info--title"/>
                       <Row gutter={[12,12]}>
                           <Col span={8}>
                               <span className="basic-title">Мобильный телефон</span>
                           </Col>
                           <Col span={8}>
                               <span  className="basic-title">{profile && profile.phone && profile.phone.mobile && profile.phone.mobile[0] ? profile.phone.mobile[0].substring(0,2)+' '+profile.phone.mobile[0].substring(2,6)+') '+profile.phone.mobile[0].substring(8) : ''}</span>
                           </Col>

                       </Row>
                       <div className="main-info--title"/>
                       <Row gutter={[12,12]}>
                           <Col span={8}>
                               <span className="basic-title">Наименование организации</span>
                           </Col>
                           <Col span={8}>
                               <span  className="basic-title">{(profile && profile.organization && profile.organization.nameRu) ? profile.organization.nameRu : ''}</span>
                           </Col>
                           </Row>
                       <Row   gutter={[12,12]}>
                           <Col offset={8} span={16}>
                               <span  className="basic-title">{(profile && profile.organization && profile.organization.nameKz) ? profile.organization.nameKz : ''}</span>
                           </Col>
                       </Row>
                       <div className="main-info--title"/>
                       <Row gutter={[12,12]}>
                           {serviceProviderTitle}
                           {serviceProviderName}
                       </Row>

                       <div className="main-info--title"/>
                       <div className="main-info--title">
                           <p style={{padding:'0',fontSize:"18px"}} className="title ">Пароль и безопасность</p>
                       </div>
                       <Row type="flex" justify="space-between" gutter={[12,12]}>
                           <Col  span={8}>
                               <span className="basic-title">Электронная почта</span>
                           </Col>
                           <Col span={8}>
                               <span  className="basic-title">{profile && profile.email ? profile.email : ''}</span>
                           </Col>
                           <Col span={8}>
                               <Button onClick={()=>this.openEmailModal(profile)} style={{border:"none",outline:"none",color:"#212121"}}><Icon type="edit"/>Редактировать e-mail</Button>
                           </Col>
                           <Col span={8}>
                               <span className="basic-title">Пароль</span>
                           </Col>

                           <Col span={8}>
                               <span  className="basic-title">{passwordItem}</span>
                           </Col>
                           <Col span={8}>
                              <Button onClick={this.openPasswordModal} style={{border:"none",outline:"none",color:"#212121"}}><Icon type="edit"/>Редактировать пароль</Button>
                           </Col>
                       </Row>
                       <div className="main-info--title">
                           <p style={{padding:'0',fontSize:"18px"}} className="title ">Дополнительные настройки</p>
                           <Button style={{border:"none",outline:"none",color:"#212121"}}><Icon type="edit"/>Редактировать</Button>
                       </div>

                       <Row  gutter={[12,12]}>
                           <Col span={8}>
                               <span className="basic-title">Уведомления</span>
                           </Col>
                           <Col span={8}>
                               <Switch defaultChecked onChange={this.onChangeSwitch} />
                           </Col>
                       </Row>
                       <div className="main-info--title"/>
                       <Row gutter={[12,12]}>
                           <Col span={8}>
                               <span className="basic-title">Новости и рассылки</span>
                           </Col>
                           <Col span={8}>
                               <span  >Не разрешено</span>
                           </Col>
                       </Row>
                       <div className="main-info--title"/>
                       <div className="main-info--title">
                           <p style={{padding:'0',fontSize:"18px"}} className="title ">Удалить аккаунт</p>
                       </div>
                       <p>При удалении аккаунта будут потеряны все данные, Вы уверены что хотите <span style={{color:"#212121",fontWeight:600}}>Удалить аккаунт?</span></p>
                   </div>
                </div>
                <Modal
                    title="Смена e-mail"
                    visible={emailVisible}
                    closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                        type="close-circle"/><span
                        style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                    onCancel={this.cancelEmailModal}
                    footer={[
                        <Button style={{background:"#000",color:"#fff"}} key="ok" onClick={this.handleOkEmail}>
                            <Icon type="check-circle" />Сменить
                        </Button>,
                    ]}
                >
                    <Form>
                        <FormItem>
                            <Input onChange={this.onChange} value={email} name="email" placeholder="Введите e-mail"/>
                        </FormItem>

                    </Form>
                    {errorMessage ? errorMessage  : ""}
                </Modal>
                <Modal
                    title="Смена пароля"
                    visible={passwordVisible}
                    closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                        type="close-circle"/><span
                        style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                    onCancel={this.cancelPasswordModal}
                    footer={[
                        <Button style={{background:"#000",color:"#fff"}} key="ok" onClick={this.handleSubmit}>
                            <Icon type="check-circle" />Сменить
                        </Button>,
                    ]}
                >
                    <Form onSubmit={this.handleSubmit}  >
                        <Form.Item hasFeedback>
                            {getFieldDecorator('oldPassword', {
                                rules: [
                                    {
                                        required: true,
                                    },

                                ],
                            })(<Input.Password style={{width:"100%"}} placeholder="Старый пароль" />)}

                        </Form.Item>
                        {errors ? errors.password : null}
                        <Form.Item hasFeedback >
                            {getFieldDecorator ('newPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Длина пароля не должна быть меньше 6 символов',
                                        min:6
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    }
                                ],
                            })(<Input.Password style={{width:"100%"}} placeholder="Новый пароль"/>)}

                        </Form.Item>
                        <Form.Item hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    }
                                ],
                            })(<Input.Password style={{width:"100%"}} placeholder="Введите еще раз"/>)}
                        </Form.Item>
                    </Form>
                    {errorMessage}
                </Modal>
                <Modal
                    title="Изменить профиль"
                    visible={profileVisible}
                    closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                        type="close-circle"/><span
                        style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                    onCancel={this.cancelProfileModal}
                    footer={[
                        <Button style={{background:"#000",color:"#fff"}} key="ok" onClick={this.handleOkProfile}>
                            <Icon type="check-circle" />Сменить
                        </Button>,
                    ]}
                >
                    <Form>
                        <FormItem label="ФИО">
                            <Input onChange={this.onChange} value={name} name="name" placeholder="Введите ФИО"/>
                        </FormItem>
                        <FormItem label="Телефон">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item className="" label="Рабочий телефон">
                                        <Row gutter={12}>
                                            <Col span={5}>
                                                <Input value={"+7"}  name=""  placeholder=""/>
                                            </Col>
                                            <Col span={7}>
                                                <MaskedInput mask="1111"  value={workCode}  name="workCode" onChange={this.onChange} placeholder="7272"/>
                                            </Col>
                                            <Col span={12}>
                                                <MaskedInput mask="11-11-11" value={workPhone}  name="workPhone" onChange={this.onChange} placeholder="12-34-56"/>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>

                                <Col span={4}>
                                    <Form.Item label="Внутренний">
                                        <Input value={inner} pattern="[0-9]*" onInput={this.handleChangeInput.bind(this)}   placeholder="123"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Мобильный телефон">
                                        <Row gutter={12}>
                                            <Col span={5}>
                                                <Input value={"8"}  name=""  placeholder=""/>
                                            </Col>
                                            <Col span={7}>
                                                <MaskedInput mask="(111)"  value={mobileCode}  name="mobileCode" onChange={this.onChange} placeholder="(727)"/>
                                            </Col>
                                            <Col span={12}>
                                                <MaskedInput mask="111-11-11" value={mobilePhone}  name="mobilePhone" onChange={this.onChange} placeholder="123-45-67"/>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </FormItem>
                        <Form.Item label="Данные оператора">
                            <Upload
                                name="img"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                customRequest={()=>{}}
                                beforeUpload={beforeUpload}
                                onUpload={this.onUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img className="avatar-default" src={imageUrl} alt="avatar" />  : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                    {errorMessage}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    user:state.user,
    error:state.error
});
const Settings = Form.create({ name: 'normal_settings' })(SettingsForm);
export  default connect(mapStateToProps,{clearErrors,getProfile,getConfirm}) (Settings);