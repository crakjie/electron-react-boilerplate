// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {ReactSelectize, SimpleSelect, MultiSelect} from 'react-selectize';
import Prores from './codecs/Prores.js'
//import styles from './FileLine.scss';
/* <div  className={styles.container}  data-tid="container">*/
/* </div>*/
export default class OutputSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: '3g2',
      size: '420x640', // resolution
      fps: '', // frame per second
      vcodec: '', // video codec
      vbtr: 0, // video bit rate
      isConstant : false,
      acodec: '', // audio codec
      aquality: 0, // audi quality
      abtr: 0, // audio bit rate
      options : new Map()
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(key, event) {
    this.setState({
        [key] : event.target.value
    })
  }

  handleOptionChange(key, event) {
    this.setState(state => {
      return {
        options : state.options.set(key, event.target.value)
      };
    })
  }

  handleValueChange(key, event) {
    console.log(event.value)
    this.setState({
        [key] : event.value
    })
  }

  toSelectizeValue(value) {
    return {label: value, value: value}
  }

  renderVideoCodec() {
    console.log("non non"+ this.state.vcodec);
    switch(this.state.vcodec) {
      case 'prores_ks':
       console.log("oui oui"+ this.state.vcodec);
        return (
          <Prores
            onOptionChange={(key, event) => this.handleOptionChange(key, event)}
            onChange={(key, event) => this.handleChange(key, event)}
            value={this.state}
          />
        );
      default:
        return
    }
  }

  render() {

    return (
      <div>
        <ul>
          <li>
            <label>format</label>
            <SimpleSelect
              placeholder="Select a output format"
              options={this.props.formats.map(format => this.toSelectizeValue(format.name))}
              theme="material"
              onValueChange={event => this.handleValueChange('format', event)}
              value={this.toSelectizeValue(this.state.format)}
            />
          </li>
          <li>
            video codec
            <SimpleSelect
              placeholder="Select the video codec"
              options={this.props.videoCodecs.map(codec => this.toSelectizeValue(codec.name))}
              theme="material"
              onValueChange={event => this.handleValueChange('vcodec', event)}
              value={this.toSelectizeValue(this.state.vcodec)}
            />
          </li>
          <li>audio codec
            <SimpleSelect
              placeholder="Select the audio codec"
              options={this.props.audioCodecs.map(codec => this.toSelectizeValue(codec.name))}
              theme="material"
              onValueChange={event => this.handleValueChange('acodec', event)}
              value={this.toSelectizeValue(this.state.acodec)}
            />
          </li>
          {this.renderVideoCodec()}
          <li>resolution
            <input
              onChange={event => this.handleChange('size', event)}
              value={this.state.size}
            />
          </li>
          <li>frame per second
            <input
              onChange={event => this.handleChange('fps', event)}
              value={this.state.fps}
            />
          </li>

          <li>video bit rate  <input
              onChange={event =>this.handleChange('vbtr', event)}
              value={this.state.vbtr}
            /> constant
            <select onChange={event => this.handleChange('isConstant', event)}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </li>

          <li>audio quality
            <input
              onChange={event => this.handleChange('aquality', event)}
              value={this.state.aquality}
            />
          </li>
          <li>audio bit rate
            <input
              onChange={event => this.handleChange('abtr', event)}
              value={this.state.abtr}
            />
          </li>
        </ul>
        <button onClick={() =>this.props.onClick(this.state)}>Convert</button>
      </div>
    );
  }


}
