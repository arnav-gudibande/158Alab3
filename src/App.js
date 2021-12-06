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

        this.myParams = {
            'uuid': uuid.v4(),
            'fundamental': 2000,
            'harmonicity': 0.5,
            'decay': 5000,
            'exp_base': 0.5,
            'scalar': 0.5
        }
    }


    handlePostQuery = (query) => {

        this.myParams[query.target.name] = query.target.value

        if (query !== "") {
            request.post('/query', this.myParams)
                .then(function(response){
                    console.log(response);
           //Perform action based on response
            })
            .catch(function(error){
                console.log(error);
           //Perform action based on error
            });
        } else {
            alert("The search query cannot be empty")
        }
    }

    handleKey = (event) => {
        console.log(event.keyCode)
    }

    componentWillMount() {
        document.addEventListener("keydown", this.handleKey, false);
    }

    render() {
        return (
            <div className="App">
                <p>My App</p>
                <Typography id="thing1" gutterBottom>
                  Fundamental:
                </Typography>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Box width={300}>
                        <Slider min={1500} max={3000} step={50} defaultValue={2000} aria-label="Default"
                        valueLabelDisplay="auto" name="fundamental" onChange={this.handlePostQuery}/>
                    </Box>
                </div>
                <Typography id="thing1" gutterBottom>
                  Harmonicity:
                </Typography>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Box width={300}>
                        <Slider min={0} max={1} step={0.05} defaultValue={0.5} aria-label="Default"
                        valueLabelDisplay="auto" name="harmonicity" onChange={this.handlePostQuery}/>
                    </Box>
                </div>
                <Typography id="thing1" gutterBottom>
                  Decay:
                </Typography>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Box width={300}>
                        <Slider min={1000} max={10000} step={50} defaultValue={5000} aria-label="Default"
                        valueLabelDisplay="auto" name="decay" onChange={this.handlePostQuery}/>
                    </Box>
                </div>
                <Typography id="thing1" gutterBottom>
                  Exp base:
                </Typography>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Box width={300}>
                        <Slider min={0} max={1} step={0.05} defaultValue={0.5} aria-label="Default"
                        valueLabelDisplay="auto" name="exp_base" onChange={this.handlePostQuery}/>
                    </Box>
                </div>
                <Typography id="thing1" gutterBottom>
                  Scalar:
                </Typography>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Box width={300}>
                        <Slider min={0} max={1} step={0.05} defaultValue={0.5} aria-label="Default"
                        valueLabelDisplay="auto" name="scalar" onChange={this.handlePostQuery}/>
                    </Box>
                </div>

                <Mic></Mic>
            </div>
        );
    }
}

export default App;
