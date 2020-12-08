import React,{Component} from "react";
import {Button, Form, Input, Icon, Row, Col, Upload, message} from 'antd';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import Modal from "antd/es/modal";
import {IP} from "../../actions/types";
import TextArea from "antd/es/input/TextArea";
import {Map, Placemark, SearchControl, YMaps} from 'react-yandex-maps'
import {getServiceProviderById, saveServiceProvider} from "../../actions/serviceProviderActions";
import Checkbox from "antd/es/checkbox";
import MaskedInput from "antd-mask-input";
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

class AddServiceProvider extends Component{
    constructor(){
        super();
        this.state={
            img:'',
            loading: false,
            nameKz:'',
            nameRu:'',
            visible:false,
            info:'',
            address:'',
            coords:[],
            monStart: null,
            monEnd: null,
            tueStart: null,
            tueEnd: null,
            wedStart: null,
            wedEnd: null,
            thuStart: null,
            thuEnd: null,
            friStart: null,
            friEnd: null,
            satStart: null,
            satEnd: null,
            sunStart: null,
            sunEnd: null,
            days:[],
            checkedMon: false,
            checkedTue: false,
            checkedWed: false,
            checkedThu: false,
            checkedFri: false,
            checkedSat: false,
            checkedSun: false,
            disabledMon: true,
            disabledTue: true,
            disabledWed: true,
            disabledThu: true,
            disabledFri: true,
            disabledSat: true,
            disabledSun: true,
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

    onUpload = (img) => {
        this.setState({img: img})
    }
    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onChangeMask = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
        let data = [
            {start: e.target.name === 'monStart' ? e.target.value : this.state.monStart, end: e.target.name === 'monEnd' ? e.target.value : this.state.monEnd},
            {start: e.target.name === 'tueStart' ? e.target.value : this.state.tueStart, end: e.target.name === 'tueEnd' ? e.target.value : this.state.tueEnd},
            {start: e.target.name === 'wedStart' ? e.target.value : this.state.wedStart, end: e.target.name === 'wedEnd' ? e.target.value : this.state.wedEnd},
            {start: e.target.name === 'thuStart' ? e.target.value : this.state.thuStart, end: e.target.name === 'thuEnd' ? e.target.value : this.state.thuEnd},
            {start: e.target.name === 'friStart' ? e.target.value : this.state.friStart, end: e.target.name === 'friEnd' ? e.target.value : this.state.friEnd},
            {start: e.target.name === 'satStart' ? e.target.value : this.state.satStart, end: e.target.name === 'satEnd' ? e.target.value : this.state.satEnd},
            {start: e.target.name === 'sunStart' ? e.target.value : this.state.sunStart, end: e.target.name === 'sunEnd' ? e.target.value : this.state.sunEnd},
        ]
        this.setState({
            days: data
        })
    }

    handleOk=e=>{
        e.preventDefault();
        let workHours = [
            {start: this.state.monStart, end: this.state.monEnd},
            {start: this.state.tueStart, end: this.state.tueEnd},
            {start: this.state.wedStart, end: this.state.wedEnd},
            {start: this.state.thuStart, end: this.state.thuEnd},
            {start: this.state.friStart, end: this.state.friEnd},
            {start: this.state.satStart, end: this.state.satEnd},
            {start: this.state.sunStart, end: this.state.sunEnd},
        ];
        let data = {
            nameKz:this.state.nameKz,
            nameRu:this.state.nameRu,
            image:this.state.img,
            info:this.state.info,
            address:this.state.address,
            coordinates: this.state.coords,
            workHours: this.state.days.length > 0 ? this.state.days : workHours
        };
        if (this.state.img === this.props.serviceProvider.serviceProvider.image){
            data.image = null
        }
        else {
            data.image = this.state.img
        }
        let id = localStorage.getItem('serviceProvider')
        console.log(this.state.days)
        if (this.state.nameKz && this.state.nameRu && this.state.address && this.state.coords) {
            this.props.saveServiceProvider(data,id,this.props.history, this.handleLoading, this.handleError);
        } else {
            message.error('Заполните все поля!')
        }

    };
    componentDidMount() {
        if(localStorage.getItem('serviceProvider')) {
            this.props.getServiceProviderById(localStorage.getItem('serviceProvider'));
        }
        else if(this.props.location.data){
            this.props.getServiceProviderById(this.props.location.data);
        }
    }
    handleClose=()=>{
        this.setState({
            visible:true,
        })
    }
    clickOnMap = (e) => {
        this.setState({coords: e.get('coords')})
    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleDate = (workHour) => {
        if(workHour) {
            return `${workHour.getHours().toString().padStart(2, '0')}:${workHour.getMinutes().toString().padStart(2, '0')}`
        }
    }
    handleStart = (start) => {
            if(start.start) {
                return new Date(start.start)
            }
          return null
    }
    handleEnd = (end) => {
        if(end.end) {
            return new Date(end.end)
        }
        return null
    }
    handleWorkHour = (workHours) => {
            if(workHours[0].start && workHours[0].end ){
                this.setState({
                    checkedMon: true,
                    disabledMon: false,
                })
            }
            if(workHours[1].start && workHours[1].end ){
                this.setState({
                    checkedTue: true,
                    disabledTue: false,
                })
            }
            if(workHours[2].start && workHours[2].end ){
                this.setState({
                    checkedWed: true,
                    disabledWed: false,
                })
            }
            if(workHours[3].start && workHours[3].end ){
                this.setState({
                    checkedThu: true,
                    disabledThu: false,
                })
            }
            if(workHours[4].start && workHours[4].end ){
                this.setState({
                    checkedFri: true,
                    disabledFri: false,
                })
            }
            if(workHours[5].start && workHours[5].end ){
                this.setState({
                    checkedSat: true,
                    disabledSat: false,
                })
            }
            if(workHours[6].start && workHours[6].end ){
                this.setState({
                    checkedSun: true,
                    disabledSun: false,
                })
            }
    }

    handleOkClose=()=>{
        this.props.history.push('/dashboard/provider');
        localStorage.removeItem('serviceProvider');
    }
    componentWillReceiveProps(props) {
        let monStart = '', monEnd = '', tueStart = '', tueEnd = '',wedStart = '', wedEnd = '', thuStart = '',
            thuEnd = '', friStart = '', friEnd = '', satStart = '', satEnd = '', sunStart = '', sunEnd = ''
        if(localStorage.getItem('serviceProvider') === props.serviceProvider.serviceProvider._id){
            if( props.serviceProvider.serviceProvider.workHours.length > 0) {
                monStart = props.serviceProvider.serviceProvider.workHours[0].start
                monEnd = props.serviceProvider.serviceProvider.workHours[0].end
                tueStart = props.serviceProvider.serviceProvider.workHours[1].start
                tueEnd = props.serviceProvider.serviceProvider.workHours[1].end
                wedStart = props.serviceProvider.serviceProvider.workHours[2].start
                wedEnd = props.serviceProvider.serviceProvider.workHours[2].end
                thuStart = props.serviceProvider.serviceProvider.workHours[3].start
                thuEnd = props.serviceProvider.serviceProvider.workHours[3].end
                friStart = props.serviceProvider.serviceProvider.workHours[4].start
                friEnd = props.serviceProvider.serviceProvider.workHours[4].end
                satStart = props.serviceProvider.serviceProvider.workHours[5].start
                satEnd = props.serviceProvider.serviceProvider.workHours[5].end
                sunStart = props.serviceProvider.serviceProvider.workHours[6].start
                sunEnd = props.serviceProvider.serviceProvider.workHours[6].end
                this.setState({
                    monStart: monStart,
                    monEnd: monEnd,
                    tueStart: tueStart,
                    tueEnd: tueEnd,
                    wedStart: wedStart,
                    wedEnd: wedEnd,
                    thuStart: thuStart,
                    thuEnd: thuEnd,
                    friStart: friStart,
                    friEnd: friEnd,
                    satStart: satStart,
                    satEnd: satEnd,
                    sunStart: sunStart,
                    sunEnd: sunEnd,
                })
                this.handleWorkHour(props.serviceProvider.serviceProvider.workHours)

            }
            this.setState({
                nameKz:props.serviceProvider.serviceProvider.nameKz,
                nameRu:props.serviceProvider.serviceProvider.nameRu,
                address:props.serviceProvider.serviceProvider.address,
                info:props.serviceProvider.serviceProvider.info,
                imageUrl:IP+props.serviceProvider.serviceProvider.image,
                img:props.serviceProvider.serviceProvider.image,
                coords: props.serviceProvider.serviceProvider.coordinates,
            })

        } else if(props.location.data) {
            if(props.serviceProvider.serviceProvider.workHours.length > 0) {
                monStart = props.serviceProvider.serviceProvider.workHours[0].start
                monEnd = props.serviceProvider.serviceProvider.workHours[0].end
                tueStart = props.serviceProvider.serviceProvider.workHours[1].start
                tueEnd = props.serviceProvider.serviceProvider.workHours[1].end
                wedStart = props.serviceProvider.serviceProvider.workHours[2].start
                wedEnd = props.serviceProvider.serviceProvider.workHours[2].end
                thuStart = props.serviceProvider.serviceProvider.workHours[3].start
                thuEnd = props.serviceProvider.serviceProvider.workHours[3].end
                friStart = props.serviceProvider.serviceProvider.workHours[4].start
                friEnd = props.serviceProvider.serviceProvider.workHours[4].end
                satStart = props.serviceProvider.serviceProvider.workHours[5].start
                satEnd = props.serviceProvider.serviceProvider.workHours[5].end
                sunStart = props.serviceProvider.serviceProvider.workHours[6].start
                sunEnd = props.serviceProvider.serviceProvider.workHours[6].end
                this.setState({
                    monStart: monStart,
                    monEnd: monEnd,
                    tueStart: tueStart,
                    tueEnd: tueEnd,
                    wedStart: wedStart,
                    wedEnd: wedEnd,
                    thuStart: thuStart,
                    thuEnd: thuEnd,
                    friStart: friStart,
                    friEnd: friEnd,
                    satStart: satStart,
                    satEnd: satEnd,
                    sunStart: sunStart,
                    sunEnd: sunEnd,
                })
                this.handleWorkHour(props.serviceProvider.serviceProvider.workHours)
            }
            this.setState({
                nameKz:props.serviceProvider.serviceProvider.nameKz,
                nameRu:props.serviceProvider.serviceProvider.nameRu,
                address:props.serviceProvider.serviceProvider.address,
                info:props.serviceProvider.serviceProvider.info,
                imageUrl:IP+props.serviceProvider.serviceProvider.image,
                img:props.serviceProvider.serviceProvider.image,
                coords: props.serviceProvider.serviceProvider.coordinates,
            })

        } else {
            this.setState({
                nameKz:this.state.nameKz,
                nameRu:this.state.nameRu,
                address:this.state.address,
                info:this.state.info,
                img:this.state.img,
                coords: this.state.coords,
                monStart: this.state.monStart,
                monEnd: this.state.monEnd,
                tueStart: this.state.tueStart,
                tueEnd: this.state.tueEnd,
                wedStart: this.state.wedStart,
                wedEnd: this.state.wedEnd,
                thuStart: this.state.thuStart,
                thuEnd: this.state.thuEnd,
                friStart: this.state.friStart,
                friEnd: this.state.friEnd,
                satStart: this.state.satStart,
                satEnd: this.state.satEnd,
                sunStart: this.state.sunStart,
                sunEnd: this.state.sunEnd,
            })
        }
    }
    onNext=()=>{
        this.props.history.push('/dashboard/provider/operator/connect');
    };

    handleChange = info => {
        getBase64(info.file.originFileObj, imageUrl =>
            (this.setState({
                    imageUrl,
                    loading: false,
                    img:info.file.originFileObj,
                    changed:true,
                })
            ))
    };
    onChangeCheckbox = e =>{
        let day = e.target.value
        if(day === 0){
            this.setState({
                disabledMon: !this.state.disabledMon,
                checkedMon: !this.state.checkedMon,
            })
            if(!e.target.checked){
                this.setState({
                    monStart: null,
                    monEnd: null,
                })
            }
        }
        else if(day === 1){
            this.setState({
                disabledTue: !this.state.disabledTue,
                checkedTue: !this.state.checkedTue,
            })
            if(!e.target.checked){
                this.setState({
                    tueStart: null,
                    tueEnd: null,
                })
            }
        }
        else if(day === 2){
            this.setState({
                disabledWed: !this.state.disabledWed,
                checkedWed: !this.state.checkedWed,
            })
            if(!e.target.checked){
                this.setState({
                    wedStart: null,
                    wedEnd: null,
                })
            }
        }
        else if(day === 3){
            this.setState({
                disabledThu: !this.state.disabledThu,
                checkedThu: !this.state.checkedThu,
            })
            if(!e.target.checked){
                this.setState({
                    thuStart: null,
                    thuEnd: null,
                })
            }
        }
        else if(day === 4){
            this.setState({
                disabledFri: !this.state.disabledFri,
                checkedFri: !this.state.checkedFri,
            })
            if(!e.target.checked){
                this.setState({
                    friStart: null,
                    friEnd: null,
                })
            }
        }
        else if(day === 5){
            this.setState({
                disabledSat: !this.state.disabledSat,
                checkedSat: !this.state.checkedSat,
            })
            if(!e.target.checked){
                this.setState({
                    satStart: null,
                    satEnd: null,
                })
            }
        }
        else if(day === 6){
            this.setState({
                disabledSun: !this.state.disabledSun,
                checkedSun: !this.state.checkedSun,
            })
            if(!e.target.checked){
                this.setState({
                    sunStart: null,
                    sunEnd: null,
                })
            }
        }
        let data = [
            {start: day === 0 && !e.target.checked ? null : this.state.monStart, end: day === 0 && !e.target.checked ? null : this.state.monEnd},
            {start: day === 1 && !e.target.checked ? null : this.state.tueStart, end: day === 1 && !e.target.checked ? null : this.state.tueEnd},
            {start: day === 2 && !e.target.checked ? null : this.state.wedStart, end: day === 2 && !e.target.checked ? null : this.state.wedEnd},
            {start: day === 3 && !e.target.checked ? null : this.state.thuStart, end: day === 3 && !e.target.checked ? null : this.state.thuEnd},
            {start: day === 4 && !e.target.checked ? null : this.state.friStart, end: day === 4 && !e.target.checked ? null : this.state.friEnd},
            {start: day === 5 && !e.target.checked ? null : this.state.satStart, end: day === 5 && !e.target.checked ? null : this.state.satEnd},
            {start: day === 6 && !e.target.checked ? null : this.state.sunStart, end: day === 6 && !e.target.checked ? null : this.state.sunEnd},
        ]
        this.setState({
            days: data,
        })
    }
    render(){
        console.log(this.state.monStart)
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const {nameKz,nameRu,visible,info,address}=this.state;

        const data = [{name:'Понедельник', start:'monStart', end:'monEnd', checked: this.state.checkedMon, valueStart: this.state.monStart, valueEnd: this.state.monEnd,disabled:this.state.disabledMon,},
                        {name:'Вторник',start:'tueStart',end:'tueEnd', checked: this.state.checkedTue, valueStart: this.state.tueStart, valueEnd: this.state.tueEnd,disabled:this.state.disabledTue,},
                        {name:'Среда',start:'wedStart',end:'wedEnd', checked: this.state.checkedWed, valueStart: this.state.wedStart, valueEnd: this.state.wedEnd,disabled:this.state.disabledWed,},
                        {name:'Четверг',start:'thuStart',end:'thuEnd', checked: this.state.checkedThu, valueStart: this.state.thuStart, valueEnd: this.state.thuEnd,disabled:this.state.disabledThu,},
                        {name:'Пятница',start:'friStart',end:'friEnd', checked: this.state.checkedFri, valueStart: this.state.friStart, valueEnd: this.state.friEnd,disabled:this.state.disabledFri,},
                        {name:'Суббота',start:'satStart',end:'satEnd', checked: this.state.checkedSat, valueStart: this.state.satStart, valueEnd: this.state.satEnd,disabled:this.state.disabledSat,},
                        {name:'Воскресенье',start:'sunStart',end:'sunEnd', checked: this.state.checkedSun, valueStart: this.state.sunStart, valueEnd: this.state.sunEnd,disabled:this.state.disabledSun,}
                        ]

        const days = data.map((item,i)=>(
            <Row  key={i} type="flex" align="middle">
                <Col span={8}>
                    <Checkbox checked={item.checked} value={i} onChange={this.onChangeCheckbox} style={{color:'#000'}}>{item.name}</Checkbox>
                </Col>
                <Col span={7}>
                    <Form.Item label="Начало">
                         <MaskedInput disabled={item.disabled} value={item.valueStart}  name={item.start} onChange={this.onChangeMask} mask={'11:11'}/>
                    </Form.Item>
                </Col>
                <Col span={7} offset={2}>
                    <Form.Item label="Конец">
                        <MaskedInput disabled={item.disabled} value={item.valueEnd} name={item.end} onChange={this.onChangeMask}  mask={'11:11'}/>
                    </Form.Item>
                </Col>
            </Row>
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
                        <h2 className="h5-title">Шаг 1/3. Наименование услугодателя</h2>
                        <p className="title-text">Пожалуйста, введите информации услугодателя</p>
                        <Form  style={{width:"100%"}}  layout={"vertical"}>
                            <Form.Item>
                                <Row>
                                    <Col span={6}>
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
                                    </Col>
                                    <Col span={8}>
                                        <span className="title-text">Логотип услугодателя</span>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item label="Наименование услугодателя">
                                <Input value={nameKz}  name="nameKz" onChange={this.onChange}   placeholder="Введите на казахском"/>
                            </Form.Item>
                            <Form.Item>
                                <Input value={nameRu}  name="nameRu" onChange={this.onChange} placeholder="Введите на русском"/>
                            </Form.Item>
                            <Form.Item>
                                < TextArea value={info}  name="info" onChange={this.onChange} placeholder="Введите информацию"/>
                            </Form.Item>
                            <Form.Item>
                                <Input value={address}  name="address" onChange={this.onChange} placeholder="Введите адрес"/>
                            </Form.Item>
                            <Form.Item label="Выберите локацию">
                                <YMaps>
                                    <Map width={600} height={400} instanceRef={inst => {
                                        if(!this.state.inst) { console.log("if  one");
                                        this.setState({inst});
                                            inst.events.add('click', this.clickOnMap)} }}
                                      defaultState={{ center: [43.238949, 76.889709], zoom: 9}} >
                                        {this.state.coords ? <Placemark options={{
                                            preset: 'islands#redDotIcon'
                                        }}  geometry={this.state.coords} /> : ''}
                                        {/*<SearchControl onResultShow={this.onResultShow}/>*/}
                                    </Map>
                                </YMaps>
                            </Form.Item>
                            <Form.Item label="График работы">
                                {days}
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",alignItems:"flex-end",padding:"80px 0"}} >
                    <Button onClick={this.handleOk} type='primary'  >Далее<Icon type="right-circle" /></Button>
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
    serviceProvider:state.serviceProvider
});
export default connect(mapStateToProps,{saveServiceProvider,getServiceProviderById}) (withRouter(AddServiceProvider))
