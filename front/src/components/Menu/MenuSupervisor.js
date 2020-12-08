import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon, Menu } from "antd";
import { getProfile } from "../../actions/userActions";
import { connect } from "react-redux";

class MenuSuperAdmin extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    console.log(this.props.profile);
    const { locationKey } = this.props;
    let selectedKey = "1";

    if (locationKey.startsWith("operator")) {
      selectedKey = "2";
    } else if (locationKey.startsWith("provider")) {
      selectedKey = "3";
    } else if (locationKey.startsWith("service")) {
      selectedKey = "4";
    } else if (locationKey.startsWith("reviews")) {
      selectedKey = "5";
    } else if (locationKey.startsWith("analytics")) {
      selectedKey = "6";
    }

    //============Новая вкладка/страница CALL-CENTER================
    else if (locationKey.startsWith("callcenter")) {
      selectedKey = "7";
    }
    //==============END Новая вкладка/страница CALL-CENTER================
    else if (locationKey.startsWith("settings")) {
      selectedKey = "8";
    } else if (locationKey.startsWith("help")) {
      selectedKey = "9";
    }
    return (
      <Menu
        mode="inline"
        style={{ textAlign: "left" }}
        defaultSelectedKeys={[selectedKey]}
      >
        <div style={{ padding: "20px 0" }} className="logo">
          <img src="/assets/logo.png" alt="logo" />
        </div>
        <Menu.Item key="1">
          <Link to={"/dashboard"}>
            <Icon type="home" />
            <span>Главная страница</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to={"/dashboard/operator"}>
            <Icon type="up-circle" />
            <span>Операторы</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to={"/dashboard/provider"}>
            <Icon type="plus-circle" />
            <span>Услугодатели</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to={"/dashboard/service"}>
            <Icon type="down-circle" />
            <span>Услуги</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to={"/dashboard/reviews"}>
            <Icon type="mail" />
            <span>Отзывы</span>
          </Link>
        </Menu.Item>

        {this.props.profile &&
        this.props.profile.email === "supervisor@gmail.com" ? (
          <Menu.Item key="6">
            <Link to={"/dashboard/analytics"}>
              <Icon type="line-chart" />
              <span>Аналитика</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {/*======Новая вкладка/страница CALL-CENTER==============*/}

        <Menu.Item key="7">
          <Link to={"/dashboard/callcenter"}>
            <Icon type="phone" />

            <span>Call-центр</span>
          </Link>
        </Menu.Item>

        {/*======Новая вкладка/страница CALL-CENTER==============*/}

        {this.props.profile &&
        this.props.profile.istszn ? (
        <Menu.Item key="10">
          <Link to={"/dashboard/bi-analytics"}>
            <Icon type="area-chart" />

            <span>BI Аналитика</span>
            
          </Link>
        </Menu.Item>
        ) : (
          ""
        )}

        <hr style={{ width: "80%", margin: "40px auto" }} />
        <Menu.Item key="8">
          <Link to={"/dashboard/settings"}>
            <Icon type="setting" />
            <span>Настройки</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="9">
          <Link to={"/dashboard/help"}>
            <Icon type="question-circle" />
            <span>Помощь</span>
          </Link>
        </Menu.Item>
      </Menu>
    );
  }
}

export default MenuSuperAdmin;
