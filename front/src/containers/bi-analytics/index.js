import React, {Component} from 'react'
import {connect} from 'react-redux';

class BIAnalytics extends Component {

    state = {};

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h1 style={{marginBottom: '40px'}}>BI Аналитика</h1>
                {/* <iframe width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=e5994459-33dd-4e6a-9353-d30736aab201&autoAuth=true&ctid=284110a1-891b-4896-9e3d-9c4ab98f76a3&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWUtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" frameborder="0" allowFullScreen="true"></iframe> */}
                {/* <iframe width="1024" height="612" src="https://app.powerbi.com/view?r=eyJrIjoiNjM2NjJhZDktMDU5Mi00Mzk0LWFiMjItZjAxMDQxZmE3M2MxIiwidCI6IjQ0MjgxM2QwLWRlNmItNGYzOC04NTRhLWM2NjA3NDg4YzE1NSIsImMiOjl9&pageName=ReportSection" frameborder="0" allowFullScreen="true"></iframe> */}
            </div>
        )
    }
}

export default connect()(BIAnalytics);