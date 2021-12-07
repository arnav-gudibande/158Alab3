import React, { Component } from 'react';
import AudioVisualizer from './AudioVisualizer';
import Typography from '@mui/material/Typography';

import uuid from "uuid";
import request from './request';

class AudioAnalyzer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        audioData: new Uint8Array(0),
        maxAudioFreq: null,
    };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.source = this.audioContext.createMediaStreamSource(this.props.audio);
    this.source.connect(this.analyser);
    this.rafId = requestAnimationFrame(this.tick);
  }

  tick() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.setState({ audioData: this.dataArray });
    this.setState({ maxAudioFreq: Math.max(...this.state.audioData)});
    this.rafId = requestAnimationFrame(this.tick);

    if (this.state.audioData != null) {
        const reqDict = {'frequency': (this.state.maxAudioFreq/255 * 10) - 5}

        request.post('/io', reqDict)
            .then(function(response){
                console.log(response);
            });
    } else {
        console.log("audioData null, ignoring")
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  render() {
    return (
        <div>
            <AudioVisualizer audioData={this.state.audioData} />
            <Typography id="thing1" gutterBottom>
              Max Audio Freq: {this.state.maxAudioFreq}
            </Typography>
        </div>
    )
  }
}

export default AudioAnalyzer;
