import React, { Component } from 'react'
import {Table, Divider, Button, Icon, Input, Form, Upload, message} from 'antd';
import {connect} from 'react-redux';
import Common from "../../components/common";

import Modal from "antd/es/modal";
import Select from "antd/es/select";
import { getAllCategories} from "../../actions/categoryCriteriaActions";
import { IP} from "../../actions/types";
import axios from "axios";
import Spin from "antd/es/spin";

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
    return  isLt2M;
}

class CategoryCriteria extends Component {
    constructor(){
        super();
        this.state={
            img:null,
            visible:false,
            editvisible:false,
            nameKz:'',
            nameRu:'',
            editnameRu:'',
            editnameKz:'',
            service_type:null,
            query:"",
            page:1,
            deleteVisible:false,
            id:null,
            deleteId:null,
            editid:null,
            loading: false,
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
    openModal=()=>{
        this.setState({
            visible:true,
            nameRu:'',
            nameKz:'',
            img:null,
            imageUrl:null,
        })
    }
    handleCancel=()=>{
        this.setState({
            visible:false
        })
    }
    openEditModal=(record)=>{
        console.log(record)
        this.setState({
            editvisible:true,
            editnameRu:record.nameRu,
            editnameKz:record.nameKz,
            imageUrl:IP+record.image,
            editid:record._id
        })
    }
    handleOk=()=>{
        if(this.state.nameRu.length > 0 && this.state.nameKz.length > 0) {
            let fm = new FormData();
            fm.append('nameRu', this.state.nameRu);
            fm.append('nameKz', this.state.nameKz);
            fm.append('image',this.state.img);
            this.handleError()
            axios.post(IP+'api/service-categories/', fm, {
                headers: {
                    'Content-Type' : false,
                    'Process-Data' : false
                }
            }).then(res => {
                this.handleLoading()
                message.success("Категория успешно добавлена!")
                this.setState({
                    visible: false,
                });
                this.props.getAllCategories(this.state, this.handleLoading, this.handleError);
            }).catch(err => {
                this.handleLoading()
                message.error("Ошибка при добавлении!")
            })
        } else {
            message.error('Заполните все поля!')
        }
    }
    handleEditCancel=()=>{
        this.setState({
            editvisible:false
        })
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleDelete=(id)=>{
        this.handleError()
        axios.put(IP + 'api/service-categories/'+id+'/suspend')
            .then(res=>  {
                this.handleLoading()
                message.success("Категория успешно удалена!")
                this.setState({
                    deleteVisible:false
                })
                    this.props.getAllCategories(this.state, this.handleLoading, this.handleError)
                }
            )
            .catch(err=> {
                this.handleLoading()
                message.error("Ошибка при удалении!")
                }
            );
    }
    handleEditOk = () => {
        if(this.state.editnameRu.length > 0 && this.state.editnameKz.length > 0) {
            let fm = new FormData();
            fm.append('nameRu', this.state.editnameRu);
            fm.append('nameKz', this.state.editnameKz);
            fm.append('image',this.state.img);
            this.handleError()
            axios.put(IP+'api/service-categories/'+this.state.editid, fm, {
                headers: {
                    'Content-Type' : false,
                    'Process-Data' : false
                }
            }).then(res => {
                this.handleLoading()
                message.success('Категория успешно изменена!')
                console.log(res);
                this.setState({
                    editvisible: false,
                });
                this.props.getAllCategories(this.state, this.handleLoading, this.handleError);
            }).catch(err => {
                this.handleLoading()
                message.error('Ошибка при редактировании!')
            })
        } else {
            message.error('Заполните все поля!')
        }
    }
    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false
        })
    };
    openDeleteModal = id => {
        console.log(id)
        this.setState({
            deleteVisible:true,
            deleteId:id
        })
    }
    componentDidMount() {
        this.props.getAllCategories(this.state, this.handleLoading, this.handleError)
    }
    handleChange = info => {
        getBase64(info.file.originFileObj, imageUrl =>
            (this.setState({
                    imageUrl,
                    loading: false,
                    img:info.file.originFileObj
                })
            ))
    };
    onKeyUp=(e)=> {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getAllCategories({query: e.target.value, page: this.state.page}, this.handleLoading, this.handleError);
    }
    onChangePage=(page,pageSize)=>{
        console.log(page)
        this.setState({
            page:page.current
        })
        this.props.getAllCategories({query: this.state.query, page: page.current}, this.handleLoading, this.handleError);
    }
    render() {
        const columns = [
            {
                title: 'Логотип',
                dataIndex: 'image',
                key: 'image',
                render: image => <img src={IP+image} style={{width:"40px"}}  alt="img"/>,

            },
            {
                title: 'Название категории на русском',
                dataIndex: 'nameRu',
                key: 'nameRu',

            },
            {
                title: 'Название категории на казахском',
                dataIndex: 'nameKz',
                key: 'nameKz',

            },
            {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <a onClick={()=>this.openEditModal(record)}><Icon type="edit"/>Редактировать </a>
        <Divider type="vertical" />
        <a onClick={()=>this.openDeleteModal(record._id)}> <Icon type="delete" />Удалить</a>
      </span>
                ),
            },
        ];
        const {categoriesAll}=this.props.categoryCriteria
        let  data;
        if(categoriesAll.serviceCategories) {
            data= categoriesAll.serviceCategories.map((item, i) => {
                return {
                    ...item,
                    key: i,
                }
            })
        }
        else {
            data=[]
        }
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const {visible,editvisible,nameKz,nameRu,editnameRu,editnameKz,deleteVisible}=this.state;

        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Категорий оценок</h5>
                                <p className="title-text">Список категории который был добавлен в систему</p>
                                <Input onKeyUp={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите русское название категории" prefix={<Icon type="search"/>} />

                            </div>
                            <div className="org-link" >
                                <Button onClick={this.openModal} type="primary"><Icon type="plus-circle"/>Добавить категорию</Button>
                            </div>
                        </div>
                        {data.length===0 ? <Common/> : <Table columns={columns} pagination={{total:categoriesAll ? categoriesAll.total : 0,pageSize:categoriesAll ? categoriesAll.pageSize : 0,current:this.state.page}} onChange={this.onChangePage}  dataSource={data} />}
                    </div>
                    <Modal
                        visible={visible}
                        title="Добавить категорию"
                        onCancel={this.handleCancel}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        footer={[
                            <Button key="edit" onClick={this.handleOk}>
                                Сохранить
                            </Button>,
                            <Button key="back" onClick={this.handleCancel}>
                                Отменить
                            </Button>,

                        ]}
                    >
                        <Form layout={"vertical"}>
                            <Form.Item label="Категорий оценок">
                                <Input value={nameRu} name="nameRu" onChange={this.onChange} placeholder="Введите на русском" />
                            </Form.Item>
                            <Form.Item>
                                <Input value={nameKz} name="nameKz" onChange={this.onChange} placeholder="Введите на казахском" />
                            </Form.Item>
                            <Form.Item>
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
                                    {imageUrl ? <img  className="avatar-default" src={imageUrl} alt="avatar" />  : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        visible={editvisible}
                        title="Редактировать категории"
                        onCancel={this.handleEditCancel}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        footer={[
                            <Button key="edit" onClick={this.handleEditOk}>
                                Сохранить
                            </Button>,
                            <Button key="back" onClick={this.handleEditCancel}>
                                Отменить
                            </Button>,

                        ]}
                    >

                        <Form layout={"vertical"}>
                            <Form.Item label="Категорий оценок">
                                <Input value={editnameRu} name="editnameRu" onChange={this.onChange} placeholder="Введите на русском" />
                            </Form.Item>
                            <Form.Item>
                                <Input value={editnameKz} name="editnameKz" onChange={this.onChange} placeholder="Введите на казахском" />
                            </Form.Item>
                            <Form.Item>
                                <Upload
                                    name="img"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    customRequest={()=>{}}
                                    beforeUpload={beforeUpload}
                                    onChange={this.handleChange}
                                >
                                    {imageUrl ? <img className="avatar-default" src={imageUrl} alt="avatar" />  : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Form>
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
                        <p>Вы уверены что хотите удалить категорию?</p>
                    </Modal>
                </Spin>
            </div>

        )
    }
}
const mapStateToProps=(state)=>({
    categoryCriteria:state.categoryCriteria,
});

export  default connect(mapStateToProps,{getAllCategories}) (CategoryCriteria);