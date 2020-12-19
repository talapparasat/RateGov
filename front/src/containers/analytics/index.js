import React, { Component } from "react";
import { Popover, Spin, Tabs, DatePicker, Select } from "antd";
import "./analytics.css";
import Icon from "antd/es/icon";
import Menu from "antd/es/menu";
import Rating from "../../components/rating";
import BarChart from "../../components/barChart";
import LineChart from "../../components/lineChart";
import ReviewBlock from "../../components/reviewBlock";
import PeopleBlock from "../../components/peopleBlock";
import { connect } from "react-redux";
import { getAnalytics, getAnalyticsExport } from "../../actions/userActions";
import { getNavigation } from "../../actions/navigationActions";
import moment from "moment";
import Progress from "antd/es/progress";
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

let keyIn = "1";

class Analytics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterTitle: "За все время",
            buttonTitle: "",
            textTitle: "Все регионы",
            visible: false,
            keyIn: "all",
            period: "all",
            keyRegion: "1",
            keyRaion: "2",
            startIn: "",
            endIn: "",
            start: "",
            end: "",
            visibleRegion: false,
            loading: false,
            display: "none",
        };
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
    handleErrorReview = () => {
        this.setState({
            loading: true,
            display: "flex",
        });
    };
    handleLoadingReview = () => {
        this.setState({
            loading: false,
            display: "none",
        });
    };
    onSelect = (e) => {
        console.log(e);
        if (e.key !== "period") {
            this.setState({
                buttonTitle: `За ${e.item.props.children.toLowerCase()}`,
                startIn: "",
                endIn: "",
            });
        }
        if (e.key === "week") {
            this.setState({
                buttonTitle: `За неделю`,
            });
        }
        keyIn = e.key;
    };

    onSelectRegion = (e) => {
        this.setState({
            textTitle: e.item.props.children,
            keyRegion: e.key,
            visibleRegion: false,
        });
        const data = {
            period: this.state.period,
            regionId: e.key === "1" ? "" : e.key,
            raionId: "",
            dateFrom: this.state.start,
            dateTo: this.state.end,
        };
        this.props.getAnalytics(this.handleError, this.handleLoading, data);
    };
    onSelectRaion = (e) => {
        this.setState({
            textTitle: e.item.props.children,
            keyRaion: e.key,
            visibleRegion: false,
        });
        const data = {
            period: this.state.period,
            regionId: "",
            raionId: e.key === "2" ? "" : e.key,
            dateFrom: this.state.start,
            dateTo: this.state.end,
        };
        this.props.getAnalytics(this.handleError, this.handleLoading, data);
    };
    handleOkFilter = () => {
        this.setState({
            visible: false,
            filterTitle: this.state.buttonTitle,
            period: keyIn,
            start: this.state.startIn,
            end: this.state.endIn,
        });
        const data = {
            period: keyIn,
            regionId: this.state.keyRegion === "1" ? "" : this.state.keyRegion,
            raionId: this.state.keyRaion === "2" ? "" : this.state.keyRaion,
            dateFrom: moment(this.state.startIn).toISOString(),
            dateTo: moment(this.state.endIn).toISOString(),
        };
        this.props.getAnalytics(this.handleError, this.handleLoading, data);
    };
    onChange = (e) => {
        const monthNames = [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
        ];
        const start = e[0] ? e[0] : null;
        const end = e[1] ? e[1] : null;
        const filterTitle =
            start && end
                ? `${e[0]._d.getDate()} ${
                      monthNames[e[0]._d.getMonth()]
                  }  ${e[0]._d.getFullYear()} - ${e[1]._d.getDate()} ${
                      monthNames[e[1]._d.getMonth()]
                  }  ${e[1]._d.getFullYear()}`
                : "";
        this.setState({
            buttonTitle: filterTitle,
            startIn: start,
            endIn: end,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };
    handleVisibleChangeRegion = (visible) => {
        this.setState({ visibleRegion: visible });
    };
    componentDidMount() {
        const data = {
            period: this.state.period,
            regionId: "",
            raionId: "",
            dateFrom: "",
            dateTo: "",
        };
        this.props.getAnalytics(this.handleError, this.handleLoading, data);
        this.props.getNavigation(this.handleError, this.handleLoading);
    }
    exportAnalytics = () => {
        const data = {
            period: this.state.period,
            regionId: this.state.keyRegion === "1" ? "" : this.state.keyRegion,
            raionId: this.state.keyRaion === "2" ? "" : this.state.keyRaion,
            dateFrom: moment(this.state.startIn).toISOString(),
            dateTo: moment(this.state.endIn).toISOString(),
        };
        this.props.getAnalyticsExport(
            this.handleErrorReview,
            this.handleLoadingReview,
            data
        );
    };
    render() {
        const { analytics, navs } = this.props;
        let districts = [];
        const regions = navs.map((item, i) => {
            return <Menu.Item key={item._id}>{item.nameRu}</Menu.Item>;
        });
        for (let i = 0; i < navs.length; i++) {
            for (let j = 0; j < navs[i].navs.length; j++) {
                districts.push({
                    id: navs[i].navs[j]._id,
                    name: navs[i].navs[j].nameRu,
                });
            }
        }
        const raions = districts.map((item, i) => (
            <Menu.Item key={item.id}>{item.name}</Menu.Item>
        ));
        const textRegion = <span>Выберите регион</span>;
        const textFilter = <span>Выберите период</span>;
        const contentFilter = (
            <Menu onSelect={this.onSelect}>
                <Menu.Item title="Все время" key="all">
                    Все время
                </Menu.Item>
                <Menu.Item title="Сегодня" key="today">
                    Сегодня
                </Menu.Item>
                <Menu.Item title="Неделя" key="week">
                    Неделя
                </Menu.Item>
                <Menu.Item title="Месяц" key="month">
                    Месяц
                </Menu.Item>
                <Menu.Item title="Год" key="year">
                    Год
                </Menu.Item>
                <Menu.Item title="Дата от и до" key="period">
                    <RangePicker onChange={this.onChange} />
                </Menu.Item>
                <Menu.Divider />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "10px 0",
                    }}
                >
                    <button
                        onClick={this.handleOkFilter}
                        style={{
                            padding: `20px 20px`,
                            outline: `none`,
                            cursor: "pointer",
                        }}
                        className="excel-button"
                    >
                        Применить фильтр
                    </button>
                </div>
            </Menu>
        );
        const contentRegion = (
            <Tabs className="analytics-tabs">
                <TabPane tab="Регионы" key="1">
                    <Menu
                        onSelect={this.onSelectRegion}
                        style={{ overflow: "auto", height: "400px" }}
                    >
                        <Menu.Item key={"1"}>Все регионы</Menu.Item>
                        {regions}
                    </Menu>
                </TabPane>
                <TabPane tab="Районы" key="2">
                    <Menu
                        onSelect={this.onSelectRaion}
                        style={{ overflow: "auto", height: "400px" }}
                    >
                        <Menu.Item key={"2"}>Все районы</Menu.Item>
                        {raions}
                    </Menu>
                </TabPane>
            </Tabs>
        );
        return (
            <div>
                <div
                    style={{
                        display: this.state.display,
                        width: "40%",
                        margin: "0 auto",
                        fontSize: "16px",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <p
                        style={{
                            fontWeight: 500,
                            color: "#000",
                            textAlign: "center",
                        }}
                    >
                        Экспорт данных может занять несколько минут. Подождите,
                        пожалуйста...
                    </p>
                    <Progress percent={50} showInfo={false} status="active" />
                </div>
                <Spin spinning={this.state.loading} className="analytics">
                    <div className="container">
                        <div className="analytics-inner">
                            <div className="analytics-top">
                                <div className="filter-region">
                                    <div>
                                        <h2>Аналитика / </h2>
                                        <Popover
                                            onVisibleChange={
                                                this.handleVisibleChangeRegion
                                            }
                                            visible={this.state.visibleRegion}
                                            placement="bottom"
                                            title={textRegion}
                                            content={contentRegion}
                                            trigger="click"
                                        >
                                            <h2 style={{ cursor: "pointer" }}>
                                                {this.state.textTitle}{" "}
                                                <Icon
                                                    style={{ fontSize: "12px" }}
                                                    type="caret-down"
                                                />
                                            </h2>
                                        </Popover>
                                    </div>
                                    <p>
                                        по Механизму обратной связи и разрешения
                                        проблем
                                    </p>
                                </div>
                                <div className="filter-analytics">
                                    <Popover
                                        onVisibleChange={
                                            this.handleVisibleChange
                                        }
                                        visible={this.state.visible}
                                        placement="bottom"
                                        title={textFilter}
                                        content={contentFilter}
                                        trigger="click"
                                    >
                                        <button>
                                            <Icon
                                                style={{ marginRight: "7px" }}
                                                type="filter"
                                            />
                                            {this.state.filterTitle}
                                        </button>
                                    </Popover>
                                    <button
                                        className="excel-button"
                                        onClick={this.exportAnalytics}
                                    >
                                        <Icon
                                            style={{ marginRight: "7px" }}
                                            type="file"
                                        />
                                        Выгрузить в Excel
                                    </button>
                                </div>
                            </div>
                            <ReviewBlock
                                review={analytics ? analytics.reviewsCount : {}}
                            />
                            <div className="charts">
                                <LineChart
                                    categories={
                                        analytics
                                            ? analytics.categoriesRating
                                            : {}
                                    }
                                    region={this.state.keyRegion}
                                    filter={this.state.period}
                                    start={
                                        this.state.start
                                            ? this.state.start._d
                                            : ""
                                    }
                                    end={
                                        this.state.end ? this.state.end._d : ""
                                    }
                                />
                                <div className="bar-chart">
                                    <BarChart
                                        social={
                                            analytics ? analytics.social : {}
                                        }
                                        region={this.state.keyRegion}
                                        visible={!this.state.visible}
                                        filter={this.state.period}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    analytics: state.user.analytics,
    navs: state.navs.navs,
});

export default connect(mapStateToProps, {
    getAnalytics,
    getNavigation,
    getAnalyticsExport,
})(Analytics);
