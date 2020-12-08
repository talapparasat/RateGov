import React, { Component } from "react";
import { Form, Button, message, Icon, Input } from "antd";
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";
import { getReviewById } from "../../actions/reviewActions";
import { IP } from "../../actions/types";
import moment from "moment";
import { withSocketContext } from "../../components/SocketContext";
import Spin from "antd/es/spin";
import Axios from "axios";

class ReviewPage extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }
  componentDidMount() {
    this.props.getReviewById(
      this.props.match.params.id,
      this.handleError,
      this.handleLoading
    );
    const { socket } = this.props;
    if (socket) {
      socket.on("Review.resolved", (data) => {
        console.log(data);
        message.success(`Жалоба ${data.review ? data.review.text : ""} решена`);
      });
      socket.on("Review.not.resolved", (data) => {
        console.log(data);
        message.error(
          `Жалоба ${data.review ? data.review.text : ""} не решена`
        );
      });
      socket.on("confirmation sent", function (err) {
        message.success("Отправлено на подтверждение");
        console.log("sent", err);
      });
    }
  }
  handleError = () => {
    this.setState({
      loading: true,
    });
  };
  handleLoading = () => {
    this.setState({
      loading: false,
    });
  };
  sendNotification = () => {
    const { socket } = this.props;
    socket.emit("send confirmation", { reviewId: this.props.match.params.id });
    // socket.on('confirmation sent', function(err) {
    //     message.success('Отправлено на подтверждение');
    //     console.log('sent',err)
    // });
    socket.on("Authentication required", function (err) {
      console.log("sent", err);
    });

    socket.on("Permission required", function (err) {
      console.log("sent", err);
    });

    socket.on("Review Id cannot be empty", function (err) {
      console.log("sent", err);
    });

    socket.on("Not allowed", function (err) {
      console.log("sent", err);
    });
  };
  handleDate = (date) => {
    let createdAt = new Date(date);
    return `${createdAt.getDate().toString().padStart(2, "0")}.${(
      createdAt.getMonth() + 1
    )
      .toString()
      .padStart(
        2,
        "0"
      )}.${createdAt.getFullYear()} ${createdAt.getHours()}:${createdAt
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${createdAt.getSeconds().toString().padStart(2, "0")}`;
  };

  handlePhone = (phone) => {
    return phone.substring(0, 2) + phone.substring(2, 6) + phone.substring(5);
  };
  download = (img) => {
    Axios({
      url: img,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.jpg");
      document.body.appendChild(link);
      link.click();
    });
  };
  render() {
    const { review } = this.props.review;
    const { profile } = this.props.user;
    let userInfo = "",
      reviewInfo = "",
      serviceProviderInfo = "",
      operatorInfo = "",
      organizatinoInfo = "",
      buttonConfirm = "",
      catInfo = "";
    if (
      profile &&
      profile.role === "operator" &&
      review.review &&
      review.review.rate <= 3 &&
      review.review.operatorId === profile._id
    ) {
      buttonConfirm = (
        <Button
          type="primary"
          style={{ margin: "20px 0" }}
          onClick={this.sendNotification}
        >
          Отправить на подтверждение
        </Button>
      );
    }
    if (review && review.User) {
      userInfo = (
        <div className="main-info">
          <p align="center">Информация о пользователе</p>
          <span className="title-text">ФИО</span>
          <h5 className="title-p">
            {review.User.name ? review.User.name : "Неизвестно"}
          </h5>
          <span className="title-text">Email</span>
          <h5 className="title-p">{review.User.email}</h5>
          <span className="title-text">Мобильный телефон</span>
          <h5 className="title-p">
            {review.User.phone &&
            review.User.phone.mobile &&
            review.User.phone.mobile[0]
              ? review.User.phone.mobile[0]
              : "Неизвестно"}
          </h5>
        </div>
      );
    } else if (review && review.phone) {
      userInfo = (
        <div>
          <span className="title-text">Мобильный телефон</span>
          <h5 className="title-p">
            {review.User.phone &&
            review.User.phone.mobile &&
            review.User.phone.mobile[0]
              ? review.User.phone.mobile[0]
              : "Неизвестно"}
          </h5>
        </div>
      );
    } else if (review && review.email) {
      userInfo = (
        <div>
          <span className="title-text">Email</span>
          <h5 className="title-p">{review.User.email}</h5>
        </div>
      );
    }
    if (
      review &&
      review.review &&
      review.review.categories &&
      review.review.categories.length > 0
    ) {
      catInfo = (
        <div style={{ width: "100%", margin: "20px 0" }}>
          <p align="center">Информация о категориях и критериях</p>
          <div className="review-cat-container">
            {review.review.categories.map((item, i) => {
              return (
                <div className="review-cat" key={i}>
                  <p className="title-text gen" key={i}>
                    {item.nameRu}:{" "}
                  </p>
                  {item.criterias.map((itemCri, j) => {
                    return (
                      <p className="title-p gen" key={i + "" + j}>
                        {itemCri.nameRu}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/*=====================ДОПОЛНИТЕЛЬНОЕ ПОЛЕ ДЛЯ ПОДТВЕРЖДЕНИЕ===================================*/}

          <h1 className="title-text">ИНФОРМАЦИЯ О ЗАКРЫТИЕ ЖАЛОБЫ:</h1>
          <h1 className="title-text">Описание:</h1>
          <Form>
            <Form.Item name={["user", "introduction"]}>
              <Input.TextArea />
            </Form.Item>
          </Form>

          {/*===========================ДОПОЛНИТЕЛЬНОЕ ПОЛЕ ДЛЯ ПОДТВЕРЖДЕНИЕ=============================*/}
        </div>
      );
    }

    if (review && review.review) {
      reviewInfo = (
        <div className="main-info">
          <span className="title-text">Текст</span>
          <h5 style={{ wordBreak: "break-word" }} className="title-p">
            {review.review.text}
          </h5>
          <span className="title-text">Изображение</span>
          {review.review.image ? (
            <div className="review-img">
              <div className="review-img--item">
                <img
                  alt="review"
                  src={review.review.image ? `${IP}${review.review.image}` : ""}
                />
              </div>
              <Button
                type="link"
                onClick={() =>
                  this.download(
                    `https://api2.digitalagent.kz/${review.review.image}`
                  )
                }
              >
                <Icon type="download" />
                Скачать
              </Button>
            </div>
          ) : (
            <h5 style={{ wordBreak: "break-word" }} className="title-p">
              Нет
            </h5>
          )}
          <span className="title-text">Оценка</span>
          <h5 className="title-p">{review.review.rate}</h5>
          <span className="title-text">Дата поступления</span>
          <h5 className="title-p">
            {review.review.createdAt
              ? this.handleDate(review.review.createdAt)
              : "Неизвестно"}
          </h5>
        </div>
      );
    }
    if (review && review.ServiceProvider) {
      serviceProviderInfo = (
        <div className="main-info">
          <p align="center">Информация об услугодателе</p>
          <span className="title-text">Наименование на казахском</span>
          <h5 className="title-p">{review.ServiceProvider.nameKz}</h5>
          <span className="title-text">Наименование на русском</span>
          <h5 className="title-p">{review.ServiceProvider.nameRu}</h5>
          <span className="title-text">Адрес</span>
          <h5 className="title-p">{review.ServiceProvider.address}</h5>
        </div>
      );
    }
    if (review && review.Operator) {
      operatorInfo = (
        <div className="main-info">
          <p align="center">Информация об операторе</p>
          <span className="title-text">ФИО</span>
          <h5 className="title-p">{review.Operator.name}</h5>
          <span className="title-text">Email</span>
          <h5 className="title-p">{review.Operator.email}</h5>
          <span className="title-text">Мобильный телефон</span>
          <h5 className="title-p">
            {review.Operator.phone &&
            review.Operator.phone.mobile &&
            review.Operator.phone.mobile[0]
              ? review.Operator.phone.mobile[0]
              : "Неизвестно"}
          </h5>
        </div>
      );
    }
    if (review && review.Organization) {
      organizatinoInfo = (
        <div className="main-info">
          <p align="center">Информация об организации</p>
          <span className="title-text">Наименование на казахском</span>
          <h5 className="title-p">{review.Organization.nameKz}</h5>
          <span className="title-text">Наименование на русском</span>
          <h5 className="title-p">{review.Organization.nameRu}</h5>
          {/*<span className="title-text">Адрес</span>*/}
          {/*<h5 className="title-p">{reviews.Organization.address}</h5>*/}
        </div>
      );
    }
    return (
      <div className="organization">
        <Spin spinning={this.state.loading}>
          <div className="container-confirm">
            <div className="add-inner">
              <h2 className="h5-title">Отзыв</h2>
              {reviewInfo}
              {userInfo}
              {serviceProviderInfo}
              {operatorInfo}
              {organizatinoInfo}
              {catInfo}
              {buttonConfirm}
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  review: state.review,
  user: state.user,
});
export default connect(mapStateToProps, { getReviewById })(
  withSocketContext(ReviewPage)
);
