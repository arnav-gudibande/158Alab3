import React, { Component } from 'react';
import AudioAnalyzer from './AudioAnalyzer';

class Mic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null
    };
    this.toggleMicrophone = this.toggleMicrophone.bind(this);
  }

  async getMicrophone() {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    this.setState({ audio });
  }

  stopMicrophone() {
    this.state.audio.getTracks().forEach(track => track.stop());
    this.setState({ audio: null });
  }

  toggleMicrophone() {
    if (this.state.audio) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }

  render() {
    return (
      <div className="Mic">
        {this.state.audio ? <AudioAnalyzer audio={this.state.audio} /> : ''}
        <div className="controls">
          <button onClick={this.toggleMicrophone}>
            {this.state.audio ? 'Stop Mic' : 'Activate Mic'}
          </button>
        </div>
      </div>
    );
  }
}

export default Mic;
