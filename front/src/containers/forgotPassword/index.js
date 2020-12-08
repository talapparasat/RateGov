import React, { Component } from 'react'
import {Link,withRouter } from 'react-router-dom';
import { Form, Input, Button,  } from 'antd';
import Footer from "../../components/footer";
import './forgot.css'
import {connect} from 'react-redux'
import {resetPassword} from "../../actions/userActions";

class ForgotPassword extends Component{
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        recover:false,
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.resetPassword(values,this.props.history)
            }
        })
    };

    handleOk=()=>{
        this.setState({
            recover:true,
        });
        if(this.state.recover){
            this.setState({
                recover:false,
            })
        }
    };

    render() {
        console.log(this.state.recover)
        const { getFieldDecorator } = this.props.form;

        return(

            <div className="forgot-password">
                <div className="container">
                    <div className="forgot-password--inner">
                        <div className="forgot-password--form">
                            <div className="logo">
                                <p>Rate Gov</p>
                                {/* <img src="/assets/logo.png" alt="logo"/> */}
                            </div>
                            <p className="title">Забыли пароль?</p>
                            <p className="forgot-text">Введите электронную почту чтобы восстановить пароль</p>

                            <Form  onSubmit={this.handleSubmit} className="login-form">
                                <Form.Item hasFeedback>
                                    {getFieldDecorator('email', {
                                        rules: [{
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        },
                                            {
                                                required: true,
                                                message: 'Please input your E-mail!',
                                            },],
                                    })(
                                        <Input

                                            placeholder="Введите электронную почту"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item >
                                    <Button onClick={this.handleOk}  type="primary" htmlType="submit" className="login-form-button">
                                        Восстановить пароль
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Link to={'/'}>Вернуться на главную</Link>

                        </div>
                        <Footer/>
                    </div>
                </div>
            </div>
        )
    }
}
const WrappedForgotForm = Form.create({ name: 'normal_forgot' })(ForgotPassword);
export default connect(null,{resetPassword}) (withRouter(WrappedForgotForm));