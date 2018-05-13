import React, { Component } from 'react';
import logo from './logo.svg';
import { FormControl, Button, Label } from 'react-bootstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import './App.css';

const sessionsDivPopulatedStyles = {
    height: '600px',
    overflowY: 'scroll',
};

class App extends Component {
    state = {
        start: '',
        end: '',
        sessions: [],
        pageNumber: 1,
        fetching: false,
        error: false,
        sessionsDivStyles: null,
    };

    handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            console.log('bottom reached');
            this.handleChangePage('next')();
        }
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
                // Not allowing to fetch pages < 1
                if(this.state.pageNumber === 1 ) {
                    return;
                }

                this.setState({
                    pageNumber: this.state.pageNumber - 1,
                }, () => this.getSessions(this.state.pageNumber)());
            }
            else {
                this.setState({
                    pageNumber: this.state.pageNumber + 1,
                }, () => this.getSessions(this.state.pageNumber)());
            }

    };

    fetchSessions = (pageNumber) => {
        const apiString = `https://api.appsee.com/sessions?apikey=8ca3c900cc1f436986d846940d8542c8&apisecret=423467cf645cff1288d3a768&fromdate=${this.state.start}&todate=${this.state.end}&page=${pageNumber}`;

        fetch(apiString)
            .then(res => res.json())
            .then(data => {
                console.log('current sessions: ', this.state.sessions);
                console.log('fetched sessions: ', data.Sessions);
                console.log('aggregated sessions: ', [...this.state.sessions, ...data.Sessions]);
                this.setState({
                    sessions: [...this.state.sessions, ...data.Sessions],
                    fetching: false,
                    sessionsDivStyles: sessionsDivPopulatedStyles,
                });
            });
    };

    getSessions = (pageNumber = 1) => () => {
        if(this.state.fetching) {
            return;
        }
        // if(this.areInputsValid()) {
            this.setState({
                error: false,
                fetching: true,
            }, () => this.fetchSessions(pageNumber));
        // }
    };

    areInputsValid = () => {
        if(this.state.start === '' || this.state.end === '') {
            this.setState({
                error: true,
            });

            return false;
        }
        return true;
    };

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

    renderSessionsRows() {
        return (
            this.state.sessions.map( session => (
                <Tr key={session.Id}>
                    <Td>{session.StartTime}</Td>
                    <Td>{session.Id}</Td>
                    <Td>{session.Platform}</Td>
                    <Td>{session.AppVersion}</Td>
                    <Td>{session.Connectivity}</Td>
                    <Td>{session.Device}</Td>
                    <Td>{session.OSVersion}</Td>
                    <Td>{session.SessionIndex}</Td>
                    <Td>{session.UserId}</Td>
                    <Td>{session.UserIndex}</Td>
                </Tr>
            ))
        );
    }

    renderSessionsTable() {
        return (
            <Table>
                <Thead>
                <Tr>
                    <Th>Id</Th>
                    <Th>StartTime</Th>
                    <Th>Platform</Th>
                    <Th>AppVersion</Th>
                    <Th>Connectivity</Th>
                    <Th>Device</Th>
                    <Th>OSVersion</Th>
                    <Th>SessionIndex</Th>
                    <Th>UserId</Th>
                    <Th>UserIndex</Th>
                </Tr>
                </Thead>
                <Tbody>
                {this.renderSessionsRows()}
                </Tbody>
            </Table>
        );
    }

  render() {
    return (
        <div id="app-root">
            <div className="dates-div">
                <div>
                    <span>{'Start: '}</span>
                    <FormControl
                        className="date-input"
                        type="text"
                        value={this.state.start}
                        placeholder="Enter start date"
                        onChange={this.handleChange('start')}
                    />
                </div>
                <div>
                    <span>{'End: '}</span>
                    <FormControl
                      className="date-input"
                      type="text"
                      value={this.state.end}
                      placeholder="Enter end date"
                      onChange={this.handleChange('end')}
                    />
                </div>
            </div>

            {this.state.error ? this.renderRequiredError() : null}

            {this.state.pageNumber >= 1 ?  this.renderLabelDiv(): null}

            <div className="btn-div">
                <Button bsStyle="primary" onClick={this.getSessions(1)}>Get Sessions</Button>
                <Button bsStyle="primary" onClick={this.handleChangePage('prev')}>Previous</Button>
                <Button bsStyle="primary" onClick={this.handleChangePage('next')}>Next</Button>
            </div>

            <div className="sessions-tbl" style={this.state.sessionsDivStyles} onScroll={this.handleScroll}>
                {this.state.sessions.length > 0 ? this.renderSessionsTable() : 'No data'}
                {/*{this.state.fetching ? 'Loading' : (this.state.sessions.length > 0 ? this.renderSessionsTable() : 'No data')}*/}
            </div>
        </div>
    );
  }
}

export default App;
