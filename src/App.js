import React, { Component } from 'react';
import logo from './logo.svg';
import uuid from "uuid";
import './App.css';
import Mic from './Mic';
import request from './request';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import axios from 'axios'

class App extends Component {

    constructor() {
        super();

        this.state = {
          key: null,
          keyCode: null,
        };

        this.myParams = {
            'uuid': uuid.v4(),
            'fundamental': 2000,
            'harmonicity': 0.5,
            'decay': 5000,
            'exp_base': 0.5,
            'scalar': 0.5,
            'keyNum': 95,
            'frequency': 0,
        }
    }

    handlePostQuery = (query) => {

        this.myParams[query.target.name] = query.target.value

        if (query !== "") {
            request.post('/control', this.myParams)
                .then(function(response){
                    console.log(response);
           //Perform action based on response
            })
            .catch(function(error){
                console.log(error);
           //Perform action based on error
            });
        } else {
            console.log("Slider query null, ignoring")
        }
    }

    handleKey = (event) => {
        this.setState({ key: event.key })
        this.setState({ keyCode: event.keyCode })

        if (event.keyCode != null) {
            this.myParams['keyNum'] =
                Math.max(95, Math.min(125, event.keyCode + 30))

            request.post('/control', this.myParams)
                .then(function(response){
                    console.log(response);
                });
        } else {
            console.log("KeyCode null, ignoring")
        }

    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKey, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleKey, false);
    }

    render() {
        return (
            <div className="App">
                <h1>Max Controller</h1>

                <h2>I/O Controls</h2>
                <Mic></Mic>
                <p></p>

                <Typography id="thing1" gutterBottom>
                  Keyboard Input: {this.state.key}
                </Typography>

                <h2>Manual Controls</h2>

                <Typography id="thing1" gutterBottom>
                  Fundamental:
                </Typography>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Box width={300}>
                        <Slider min={220} max={3000} step={100} defaultValue={1700} aria-label="Default"
                        valueLabelDisplay="auto" name="fundamental" onChange={this.handlePostQuery}/>
                    </Box>
                </div>
                <Typography id="thing1" gutterBottom>
                  Harmonicity:
                </Typography>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Box width={300}>
                        <Slider min={1} max={10} step={0.1} defaultValue={2} aria-label="Default"
                        valueLabelDisplay="auto" name="harmonicity" onChange={this.handlePostQuery}/>
                    </Box>
                </div>
                <Typography id="thing1" gutterBottom>
                  Amp Curve:
                </Typography>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Box width={300}>
                        <Slider min={1.5} max={10} step={0.01} defaultValue={3} aria-label="Default"
                        valueLabelDisplay="auto" name="amp_curves" onChange={this.handlePostQuery}/>
                    </Box>
                </div>
                <Typography id="thing1" gutterBottom>
                  Delay Multiple:
                </Typography>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Box width={300}>
                        <Slider min={78} max={1000} step={5} defaultValue={200} aria-label="Default"
                        valueLabelDisplay="auto" name="delay_multiples" onChange={this.handlePostQuery}/>
                    </Box>
                </div>
                <Typography id="thing1" gutterBottom>
                  Delay Feedback:
                </Typography>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Box width={300}>
                        <Slider min={0.85} max={5} step={0.05} defaultValue={1.5} aria-label="Default"
                        valueLabelDisplay="auto" name="delay_feebacks" onChange={this.handlePostQuery}/>
                    </Box>
                </div>
            </div>
        );
    }
}

export default App;
