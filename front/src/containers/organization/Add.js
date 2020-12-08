import React,{Component} from "react";
import {Button, Form, Input, Icon, Row, Col, Upload, message, Spin} from 'antd';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'

import {getOrganizationById, saveOrganization} from "../../actions/organizationActions";
import Modal from "antd/es/modal";
import {IP} from "../../actions/types";

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

class AddOrganization extends Component{
    constructor(){
        super();
        this.state={
            img:'',
            nameKz:'',
            nameRu:'',
            organizationId:null,
            changed:false,
            visible:false,
            disabled: false,
            loading: false,
        }
    }
    onUpload = (img) => {
        this.setState({img: img})
    }
    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleOk = e => {
        const {nameRu, nameKz, img} = this.state;
        e.preventDefault();
        let data = {
            nameKz: this.state.nameKz,
            nameRu: this.state.nameRu,
            image: this.state.img
        };
        if(this.state.img === this.props.organization.organizationItem.image){
            data.image = null
        }
        else{
            data.image=this.state.img
        }
        let id = localStorage.getItem('organization_id')
        this.setState({
            organizationId:id,
        })
        if(nameRu && nameKz) {
            this.props.saveOrganization(data, id, this.props.history, this.handleError);
        }
        else {
            message.error("Заполните все поля!");
        }
    };

    componentDidMount() {
        if(localStorage.getItem('organization_id')) {
            this.props.getOrganizationById(localStorage.getItem('organization_id'));
        }
        else if(this.props.location.data){
            this.props.getOrganizationById(this.props.location.data);
        }
    }
    handleClose = ( )=> {
        this.setState({
            visible: true,
        })
    }
    handleCancel = ( )=> {
        this.setState({
            visible: false,
        })
    }
    handleOkClose = () => {
        this.props.history.push('/dashboard/organizations');
        localStorage.removeItem('organization_id')
    }
    handleError = () => {
        this.setState({
            loading: true,
        })
    }
    componentWillReceiveProps(props) {
        if(localStorage.getItem('organization_id')===props.organization.organizationItem._id){

            this.setState({
                nameKz:props.organization.organizationItem.nameKz,
                nameRu:props.organization.organizationItem.nameRu,
                imageUrl:IP+props.organization.organizationItem.image,
                img:props.organization.organizationItem.image
            })
        }
        else if(props.location.data){
            this.setState({
                nameKz:props.organization.organizationItem.nameKz,
                nameRu:props.organization.organizationItem.nameRu,
                imageUrl:IP+props.organization.organizationItem.image,
                img:props.organization.organizationItem.image
            })
      }

        else{
            this.setState({
                nameKz:this.state.nameKz,
                nameRu:this.state.nameRu,
                img:this.state.img
            })
        }
    }
    handleChange = info => {
            getBase64(info.file.originFileObj, imageUrl =>
                (this.setState({
                        imageUrl,
                        loading: false,
                        img:info.file.originFileObj,
                        changed: true,
                    })

                ))
    };
    render(){
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const {nameKz,nameRu,visible}=this.state;

        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p style={{border:"none",outline:"none",cursor:"pointer"}} onClick={this.handleClose} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-add">

                        <div className="add-inner">
                            <h2 className="h5-title">Шаг 1/7. Наименование организации</h2>
                            <p className="title-text">Пожалуйста, введите наименование организации на двух языках.</p>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                <Form.Item >
                                    <Row>
                                        <Col span={6}>
                                            <Upload
                                                name="img"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                customRequest={() => {}}
                                                beforeUpload={beforeUpload}
                                                onUpload={this.onUpload}
                                                onChange={this.handleChange}
                                            >
                                                {imageUrl ? <img className="avatar-default" src={imageUrl} alt="avatar" />  : uploadButton}
                                            </Upload>
                                        </Col>
                                        <Col span={8}>
                                            <span className="title-text">Логотип организации</span>
                                            <p className="title-text">Размер картинки не должен превышать 2 МБ!</p>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item label="Наименование организации">
                                    <Input value={nameRu}  name="nameRu" onChange={this.onChange} placeholder="Введите на русском" required/>
                                </Form.Item>
                                <Form.Item >
                                    <Input value={nameKz}  name="nameKz" onChange={this.onChange}   placeholder="Введите на казахском" required/>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"flex-end",alignItems:"flex-end",padding:"80px 0"}} >
                        <Button onClick={this.handleOk} disabled={this.state.disabled} type='primary' to={'/dashboard/service-type/add'} >Далее<Icon type="right-circle" /></Button>
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
    organization:state.organization
});
export default connect(mapStateToProps,{saveOrganization,getOrganizationById}) (withRouter(AddOrganization))
