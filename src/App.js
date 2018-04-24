import React, { Component } from 'react';
import { FormControl, Button, Label } from 'react-bootstrap';
import DataTable from './Components/DataTable/DataTable';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './App.css';

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
        error: false,
    };

    //When inputs change update the state
    handleChange = (dateType) => (e) => {
        this.setState({
            [dateType]: e.target.value,
        });
    };

    // Handle changing of pageNumber by prev/next
    handleChangePage = (action) => () => {
            if(action === 'prev') {
                // Not allowing to fetch pages < 1 when clicking Previous
                if(this.state.pageNumber === 1 ) {
                    return;
                }

                this.setState({
                    pageNumber: this.state.pageNumber - 1,
                }, () => this.initGetSessions(this.state.pageNumber)());
            }
            else {
                this.setState({
                    pageNumber: this.state.pageNumber + 1,
                }, () => this.initGetSessions(this.state.pageNumber)());
            }

    };

    fetchSessions = (pageNumber) => {
        const apiString = `https://api.appsee.com/sessions?apikey=8ca3c900cc1f436986d846940d8542c8&apisecret=423467cf645cff1288d3a768&fromdate=${this.state.start}&todate=${this.state.end}&page=${pageNumber}`;

        fetch(apiString)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    sessions: data.Sessions,
                    fetching: false,
                });
            });
    };

    // Check if inputs are valid and init getting sessions
    initGetSessions = (pageNumber = 1) => () => {
        if(this.areInputsValid()) {
            this.setState({
                fetching: true,
                error: false,
            }, () => this.fetchSessions(pageNumber));
        }
    };

    // Validate required date inputs
    areInputsValid = () => {
        if(this.state.start === '' || this.state.end === '') {
            this.setState({
                error: true,
            });

            return false;
        }
        return true;
    };

    // Required dates error rendering
    renderRequiredError = () => {
        return (
            <div className="error">
                <label>{'Please fill in dates'}</label>
            </div>
        );
    };

    // Page indication rendering
    renderLabelDiv = () => {
        return (
            <div className="label-div">
                <Label bsStyle="default">{`Page: ${this.state.pageNumber}`}</Label>
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

                {this.state.pageNumber >= 1 ?  this.renderLabelDiv(): null}

                <div className="btn-div">
                    <Button bsStyle="primary" onClick={this.initGetSessions(1)}>Get Sessions</Button>
                    <Button bsStyle="primary" onClick={this.handleChangePage('prev')}>Previous</Button>
                    <Button bsStyle="primary" onClick={this.handleChangePage('next')}>Next</Button>
                </div>

                <div className="sessions=tbl">
                    {this.state.fetching ? 'Loading' : (this.state.sessions.length > 0 ? this.renderSessionsTable() : 'No data')}
                </div>
            </div>
        );
  }
}

export default App;
