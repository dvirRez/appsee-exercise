import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import DataTable from './Components/DataTable/DataTable';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './App.css';

const sessionsDivPopulatedStyles = {
    height: '600px',
    overflowY: 'scroll',
};

const tblMapping = {
    key: 'Id',
    cols: [
        'StartTime',
        'Id',
        'Platform',
        'AppVersion',
        'Connectivity',
        'Device',
        'OSVersion',
        'SessionIndex',
        'UserId',
        'UserIndex'
        ],
};

class App extends Component {
    state = {
        start: '',
        end: '',
        sessions: [],
        pageNumber: 1,
        fetching: false,
        error: null,
        sessionsDivStyles: null,
    };

    // When detecting end of screen, get next page and update table
    handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            console.log('bottom reached');
            this.getNextPage();
        }
    };

    //When inputs change update the state
    handleChange = (dateType) => (e) => {
        this.setState({
            [dateType]: e.target.value,
        });
    };

    // Handle changing of pageNumber by prev/next
    getNextPage = () => {
            if(this.state.sessions.length === 0) {
                return;
            }

            this.setState({
                pageNumber: this.state.pageNumber + 1,
            }, () => this.initGetSessions(this.state.pageNumber, false)());
    };

    fetchSessions = (pageNumber) => {
        const apiString = `https://api.appsee.com/sessions?apikey=8ca3c900cc1f436986d846940d8542c8&apisecret=423467cf645cff1288d3a768&fromdate=${this.state.start}&todate=${this.state.end}&page=${pageNumber}`;

        fetch(apiString)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    sessions: [...this.state.sessions, ...data.Sessions],
                    sessionsDivStyles: sessionsDivPopulatedStyles,
                    fetching: false,
                });
            })
            .catch(error => {
                this.setState({
                    error: `Error fetching sessions: ${error.message}`,
                    fetching: false,
                });
            });
    };

    // Check if inputs are valid and init getting sessions
    initGetSessions = (pageNumber = 1, isFirstFetch) => () => {
        if(this.areInputsValid()) {
            this.setState({
                fetching: isFirstFetch,
                pageNumber: pageNumber === 1 ? 1 : this.state.pageNumber,
                error: null,
            }, () => this.fetchSessions(pageNumber));
        }
    };

    // Validate required date inputs
    areInputsValid = () => {
        if(this.state.start === '' || this.state.end === '') {
            this.setState({
                error: 'Please fill in dates',
            });

            return false;
        }
        return true;
    };

    // Required dates error rendering
    renderRequiredError = () => {
        return (
            <div className="error">
                <label>{this.state.error}</label>
            </div>
        );
    };

    renderSessionsTable() {
        return (
            <DataTable data={this.state.sessions} tblMapping={tblMapping} />
        );
    }

    render() {
        return (
            <div>
                <div className="dates-div">
                    <div>
                        <span>{'Start: '}</span>
                        <input
                            id="date"
                            type="date"
                            className="date-input"
                            value={this.state.start}
                            onChange={this.handleChange('start')}
                        />
                    </div>
                    <div>
                        <span>{'End: '}</span>
                        <input
                            id="date"
                            type="date"
                            className="date-input"
                            value={this.state.end}
                            onChange={this.handleChange('end')}
                        />
                    </div>
                </div>

                {this.state.error ? this.renderRequiredError() : null}

                <div className="btn-div">
                    <Button bsStyle="primary" onClick={this.initGetSessions(1, true)}>Get Sessions</Button>
                </div>

                <div className="sessions=tbl" style={this.state.sessionsDivStyles} onScroll={this.handleScroll}>
                    {this.state.fetching ? 'Loading' : (this.state.sessions.length > 0 ? this.renderSessionsTable() : 'No data')}
                </div>
            </div>
        );
  }
}

export default App;
