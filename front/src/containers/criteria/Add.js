import React,{Component} from "react";
import {Button, Form, Icon, List} from 'antd';
import classnames from "classnames";
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import AutoComplete from "antd/es/auto-complete";
import Select from "antd/es/select";
import {getServiceType, getServiceTypesByOrganization} from "../../actions/serviceTypeActions";
import './criteria.css'
import {
    addCriteria,
    addCriteriaConnect, deleteCriteriaOrganization,
    getCategoriesOfCriteriaByOrganization,
    getCriterias,
    getCriteriasByOrganization
} from "../../actions/criteriaActions";
import Modal from "antd/es/modal";
import Spin from "antd/es/spin";

const { Option } = Select;
class AddCriteria extends Component{
    constructor(){
        super();
        this.state={
            nameKz:'',
            span:true,
            nameRu:'',
            selected:false,
            organization_id:null,
            service_type_id:null,
            category_id:null,
            criteria_id:null,
            visible:false,
            disabled:false,
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
        this.setState({
            nameRu:value,
        });

    };
    onChangeType=(value)=> {
        this.setState({
            service_type_id:value,
        })
        let data ={
            organizationId:localStorage.getItem('organization_id'),
            service_type_id: value,
        }
        this.props.getCategoriesOfCriteriaByOrganization(data)
    };
    onChangeCategory=(value)=>{
        console.log(`selected ${value}`);
        this.setState({
            category_id:value,
        })
        this.setState({
            nameKz:'',
            nameRu:''
        })
    };

    onSelect=(value,option)=>{
        this.setState({
            selected:true,
            disabled:true,
            service_id:this.props.criteria.criterias[value]._id,
            nameKz: this.props.criteria.criterias[value].nameKz,
            nameRu: this.props.criteria.criterias[value].nameRu
        })

    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/organizations');
        localStorage.removeItem('organization_id')
    }
    handleOk=e=>{
        e.preventDefault();
        let data = {
            nameKz:this.state.nameKz,
            nameRu:this.state.nameRu,
            organizationId:this.state.organization_id,
            serviceProviderTypeId:this.state.service_type_id,
            serviceCategoryId:this.state.category_id,
        };
        let dataConnect={
            organizationId:this.state.organization_id,
            serviceId: this.state.service_id,
            serviceProviderTypeId: this.state.service_type_id,
            serviceCategoryId:this.state.category_id,
            criteriaId:this.state.service_id
        }

        if(this.state.selected  && this.state.service_type_id && this.state.category_id && this.state.criteriaId){
            this.props.addCriteriaConnect(dataConnect, this.handleError, this.handleLoading)
        } else if (this.state.service_type_id && this.state.category_id && this.state.nameKz && this.state.nameRu) {
            this.props.addCriteria(data, this.handleError, this.handleLoading);
        }
        this.setState({
            nameKz:"",
            nameRu:"",
            selected:false,
            disabled:false
        })
        this.props.getCriterias({query:'', lang:'ru',service_type_id:this.state.service_type_id,category_id:this.state.category_id});
        this.props.getCriterias({query: '', lang:'kz',service_type_id:this.state.service_type_id,category_id:this.state.category_id})
    };
    onChangeAuto2=(value)=> {
        this.setState({
            nameKz:value,
        });
    };

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
    }
    onNext=()=>{
        this.props.history.push('/dashboard/admin/choose');
        this.props.criteria.criterias=[]
    };
    onSelectType=(e)=>{
        this.props.getCriterias({query: '', lang:'ru',service_type_id:this.state.service_type_id,category_id:e});
        this.props.getCriterias({query: '', lang:'kz',service_type_id:this.state.service_type_id,category_id:e});
    }
    handleDelete=(value,categoryId,serviceTypeId)=>{
        this.props.deleteCriteriaOrganization({organizationId:localStorage.getItem('organization_id'),criteriaId:value,categoryId:categoryId,serviceTypeId:serviceTypeId}, this.handleError, this.handleLoading);
    };
    onPrev=()=>{
        this.props.history.push('/dashboard/category/add');
        this.props.criteria.criterias=[]
    }
    handleSearch1 = value => {
        this.props.getCriterias({query: value, lang:'ru',service_type_id:this.state.service_type_id,category_id:this.state.category_id});
    };
    handleSearch2 = value => {

        this.props.getCriterias({query: value, lang:'kz',service_type_id:this.state.service_type_id,category_id:this.state.category_id});
    };
    componentDidMount() {
        let id = localStorage.getItem('organization_id');
        this.setState({
            organization_id:id
        });
        this.props.getServiceTypesByOrganization(id, this.handleError, this.handleLoading);
        this.props.getCriteriasByOrganization(id);
    }
    resetInput=()=>{
        this.setState({
            nameRu:'',
            nameKz:'',
            disabled:false,
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

    render(){
        const {visible}=this.state;
        const {span,nameKz,nameRu,disabled}=this.state;
        const {criterias,criteriasAll,criteriaCategories}=this.props.criteria;
        const {serviceTypesById}=this.props.serviceType;
        let optionsSelect=[], dataRu = [],listRu=[];
        let dataKz = [],listKz=[];

        if(serviceTypesById && serviceTypesById.spts && serviceTypesById.spts.length>0) {
            for (let i = 0; i < serviceTypesById.spts.length; i++) {
                optionsSelect.push({
                    text: serviceTypesById.spts[i].nameRu,
                    value: serviceTypesById.spts[i].id
                })
            }
        }

        let optionsCategory=[];
        if(criteriaCategories && criteriaCategories[0] && criteriaCategories[0].categories && criteriaCategories[0].categories.length>0){
            for(let i=0;i<criteriaCategories[0].categories.length;i++){
                optionsCategory.push({
                    text: criteriaCategories[0].categories[i].nameRu,
                    value: criteriaCategories[0].categories[i].id
                })
            }

        }
        else{
            optionsCategory=[];
        }
        if(criteriasAll && criteriasAll.length>0){
            for(let i=0;i<criteriasAll.length;i++) {
                dataRu.push({text: criteriasAll[i].serviceProviderType.nameRu, value: i,id:"serviceType"});
                dataKz.push({text: criteriasAll[i].serviceProviderType.nameKz, value: i,id:"serviceType"});
                for(let j=0;j<criteriasAll[i].categories.length;j++) {
                    dataRu.push({text: criteriasAll[i].categories[j].nameRu, value: i,id:"category"});
                    dataKz.push({text: criteriasAll[i].categories[j].nameKz, value: i,id:"category"});
                    for(let k=0;k<criteriasAll[i].categories[j].criterias.length;k++){
                        dataRu.push({text: criteriasAll[i].categories[j].criterias[k].nameRu, value:  criteriasAll[i].categories[j].criterias[k].id,categoryId:criteriasAll[i].categories[j].id,serviceTypeId:criteriasAll[i].serviceProviderType._id});
                        dataKz.push({text: criteriasAll[i].categories[j].criterias[k].nameKz, value: criteriasAll[i].categories[j].criterias[k].id,categoryId:criteriasAll[i].categories[j].id,serviceTypeId:criteriasAll[i].serviceProviderType._id});
                    }
                }
            }
        }
        if(criterias && criterias.length>0){
            for(let i=0;i<criterias.length;i++){
                listRu.push( {text: criterias[i].nameRu, value: i})
                listKz.push( {text: criterias[i].nameKz, value:i})
            }
        }

        let options;
        if(optionsSelect && optionsSelect.length>0){
            options = optionsSelect.map((item,i)=>(
                <Option key={i} value={item.value}>{item.text}</Option>
            ))
        }
        let optionsCat;
        if(optionsCategory && optionsCategory.length>0){
            optionsCat = optionsCategory.map((item,i)=>(
                <Option key={i} value={item.value}>{item.text}</Option>
            ))
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
                            <h2 className="h5-title">Шаг 7/8. Критерий оценок</h2>
                            <p className="title-text">Добавьте критерию оценок которая предоставляет данная организация на двух языках.</p>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                <Form.Item label="Тип услуги">
                                    <Select
                                        style={{ width: 600 }}
                                        placeholder="Выберите тип услуги"
                                        optionFilterProp="children"
                                        onChange={this.onChangeType}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {options}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Категорий">
                                    <Select
                                        showSearch
                                        style={{ width: 600 }}
                                        placeholder="Выберите категорию"
                                        optionFilterProp="children"
                                        onChange={this.onChangeCategory}
                                        onSelect={this.onSelectType}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {optionsCat}
                                    </Select>
                                </Form.Item>
                                <div style={{display:"flex"}}>
                                    <Form.Item label="Критерий оценок ">
                                        <div style={ disabled ? { background:"#f5f5f5"} : { background:"#fff"} }>
                                            <AutoComplete
                                                value={nameRu}
                                                style={{ width: 600 }}
                                                onSelect={this.onSelect}
                                                onSearch={this.handleSearch1}
                                                disabled={disabled}
                                                onChange={this.onChangeAuto1}
                                                dataSource={listRu}
                                                placeholder="Введите на русском"
                                                filterOption={(inputValue, option) =>
                                                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                }
                                            />
                                        </div>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button style={{marginTop:"25px",marginLeft:"10px",border:"none",outline:"none"}}  onClick={this.resetInput}><Icon type="close"/></Button>
                                    </Form.Item>
                                </div>
                                <Form.Item>
                                    <div style={ disabled ? { background:"#f5f5f5"} : { background:"#fff"} }>
                                        <AutoComplete
                                            value={nameKz}
                                            disabled={disabled}
                                            onSelect={this.onSelect}
                                            onSearch={this.handleSearch2}
                                            style={{ width: 600 }}
                                            onChange={this.onChangeAuto2}
                                            dataSource={listKz}
                                            placeholder="Введите на казахском"
                                            filterOption={(inputValue, option) =>
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />
                                    </div>
                                </Form.Item>
                                <Form.Item style={{display:"flex",justifyContent:"center"}}>
                                    <Button onClick={this.handleOk}  type="primary"><Icon type="plus-circle" />Добавить оценку</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="block-title">
                        <p>Добавленные критерий на <span className={classnames("span", {'span-active': span})} onClick={this.onClickRus} >Русском</span>  <span className={classnames("span", {'span-active': !span})}  onClick={this.onClickKaz} >Казахском</span></p>
                        <div className="colors">
                            <div className="serviceType">
                                <div className="service-type-color"/>
                                <span> - Тип услуги</span>
                            </div>
                            <div className="serviceType">
                                <div className="category-color"/>
                                <span> - Категорий оценок</span>
                            </div>
                            <div className="serviceType">
                                <div className="criteria-color"/>
                                <span> - Критерий оценок</span>
                            </div>
                        </div>
                        </div>
                        <div className="list">

                            {span ? <List
                                className="list"
                                size="small"
                                bordered
                                dataSource={dataRu}
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
                                            <Icon type="delete" onClick={() => this.handleDelete(item.value,item.categoryId,item.serviceTypeId)}/>
                                        </List.Item>
                                }
                                }
                            /> : <List
                                className="list"
                                size="small"
                                bordered
                                dataSource={dataKz}
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
                                            <Icon type="delete" onClick={() => this.handleDelete(item.value,item.categoryId,item.serviceTypeId)}/>
                                        </List.Item>

                                }}
                            />}
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end", padding:"80px 0"}} >
                        <div>
                        <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                        <span>Шаг 6. Категорий оценок</span>
                        </div>
                        <Button onClick={this.onNext}  type="primary">Далее<Icon type="right-circle" /></Button>
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
    criteria: state.criteria,
    categoryCriteria:state.categoryCriteria,
    serviceType:state.serviceType,
});

export default connect(mapStateToProps,{deleteCriteriaOrganization,getServiceTypesByOrganization,getCategoriesOfCriteriaByOrganization,getCriterias,getCriteriasByOrganization,getServiceType,addCriteria,addCriteriaConnect}) (withRouter(AddCriteria));
