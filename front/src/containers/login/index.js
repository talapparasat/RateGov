import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';
import {connect} from 'react-redux';
import {clearErrors, loginUser} from "../../actions/authActions";
import Footer from "../../components/footer/";
import './login.css'
import { withSocketContext } from '../../components/SocketContext';
import Spin from "antd/es/spin";
import Alert from "antd/es/alert";

class Login extends Component{
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        loading: false,
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let userData ={
                email:values.email,
                password:values.password
            };
            if(values.remember){
                localStorage.setItem('email',values.email)
            }
            else{
                localStorage.removeItem('email')
            }
            const { socket } = this.props;

            if (!err) {
                console.log('Received values of form: ', userData);
                this.props.loginUser(userData,this.props.history,socket, this.handleLoading, this.handleError)
            }
        })
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
    };
    componentDidMount() {
        this.props.form.setFieldsValue({ ["email"]:localStorage.getItem('email')})
        this.props.clearErrors();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { error } = this.props;
        return (
            <div className="login">
                <Spin style={{height: "100%"}} spinning={this.state.loading}>
                    <div className="container">
                        <div className="login-inner">
                            <div className="login-form--inner">
                                <div className="logo">
                                    {/* <img src="/assets/logo.png" alt="logo"/> */}
                                    <h2>Rate Gov</h2>
                                </div>
                                <p className="title">Войти в матрицу</p>
                                <Form  onSubmit={this.handleSubmit} className="login-form">
                                    <Form.Item hasFeedback>
                                        {getFieldDecorator('email', {
                                            rules: [{
                                                type: 'email',
                                                message: 'E-mail неправильный!',
                                            },
                                                {
                                                    required: true,
                                                    message: 'Введите e-mail!',
                                                },],
                                        })(
                                            <Input placeholder="Введите электронную почту"
                                            />,
                                        )}
                                    </Form.Item>
                                    <Form.Item >
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: 'Введите пароль!' },{
                                            },],
                                        })(
                                            <Input.Password type="password" placeholder="Введите пароль"/>,
                                        )}
                                    </Form.Item>
                                    {error && error.error ? error.error.code : ''}
                                    <Form.Item >
                                        <Button  type="primary" htmlType="submit" className="login-form-button">
                                            Войти
                                        </Button>
                                        <div className="form-items">
                                            {getFieldDecorator('remember', {
                                                valuePropName: 'checked',
                                                initialValue: true,
                                            })(<Checkbox style={{color:"#212121"}}>Запомнить меня</Checkbox>)}
                                            <Link to={'/forgot'} className="login-form-forgot">
                                                Забыли пароль?
                                            </Link>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                            <Footer/>
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    auth:state.auth,
    error:state.error,
})
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);
export default connect(mapStateToProps,{loginUser,clearErrors}) (withRouter(withSocketContext(WrappedNormalLoginForm)));