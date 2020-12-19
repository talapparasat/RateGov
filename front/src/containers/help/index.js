import React, { Component } from "react";
import { connect } from "react-redux";
import "video-react/dist/video-react.css";
import { Player } from "video-react";
import { Divider } from "antd";

class Help extends Component {
    state = {};

    componentDidMount() {}

    render() {
        return (
            <div>
                <h1 style={{ marginBottom: "40px" }}>Помощь</h1>
                <div style={{ textAlign: "left" }}>
                    <p>
                        <a href="http://localhost:3500/help/Инструкция_по_использованию_Digital_Agent_Pro%20KAZ.docx">
                            Инструкция_по_использованию_RateGov RU.docx
                        </a>
                    </p>

                    <p>
                        <a href="http://localhost:3500/help/Инструкция_по_использованию_Digital_Agent_Pro%20KAZ.docx">
                            Инструкция_по_использованию_RateGov KAZ.docx
                        </a>
                    </p>
                    <Divider />
                    <div style={{ width: "75%" }}>
                        <Player
                            playsInline
                            poster="http://localhost:3500/help/screenshot_rus.png"
                            src="http://localhost:3500/help/Digital Agent-rus.ver.mp4"
                        />

                        <Divider />

                        <Player
                            playsInline
                            poster="http://localhost:3500/help/screenshot_kaz.png"
                            src="http://localhost:3500/help/Digital Agent-kaz.ver.mp4"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Help);
