// @flow
import React, { Component } from 'react';
import ffmpeg  from 'fluent-ffmpeg';
import FileList from '../components/FileList';
import FileMetadata from '../components/FileMetadata';
import OutputSetting from '../components/OutputSetting';
import ConfigPane from '../components/ConfigPane';
import styles from '../containers/wrapper.scss';
import * as ffpegUtils from '../actions/ffmpegUtils.js';
import * as metadataUtils from '../actions/metadata.js';


export default class ConverterApp extends Component {

  constructor() {
    super();
    this.state = {
      filesInfo: [],
      selectedFile: null,
      capabilities: {
        formats: [],
        videoCodecs: [],
        audioCodecs: [],
        subtitleCodecs: [],
        encoders: []
      },
      outputSetting: {
        format: '',
        size: '', // resolution
        fps: '', // frame per second
        vcodec: '', // video codec
        vbtr: 0, // video bit rate
        acodec: '', // audio codec
        aquality: 0, // audi quality
        abtr: 0, // audio bit rate
        options : new Map() //abitrari outputOption depending of the codec.
      }
    };
    ffpegUtils.ffmpegCapabilities().then( capa => {
      console.log(capa);
      this.setState({
        capabilities: capa
      });
    });
  }

  outputOptions(options : Map<string, string>) {
    let arrayOpt = [];
    options.forEach((v, k) =>
      arrayOpt.push('-' + k + ' ' + v)
    );
    return arrayOpt;
  }



handleDrop(newfiles) {
    //add metadata and error to files in a tuple [file, metadata, err]
    const filteredFile = newfiles.map(ffpegUtils.metadataFile);

    Promise.all(filteredFile).then((list) => {
      //remove errors and put files and metadata in an object
      const rightFiles = list.filter( mf => mf[2] == null ).map( x => {
        return {
          file: x[0],
          metadata: x[1]
        };
      });

      this.setState({
        filesInfo : this.state.filesInfo.concat(rightFiles)
      })
    })
  }

  handleClick(file) {
    this.setState({
        selectedFile : file
    })
  }

  handleChange(outputSetting) {
    console.log(this.outputOptions(outputSetting.options));
    ffmpeg(this.state.selectedFile.file.path)
    .outputFormat(outputSetting.format)
    .audioCodec(outputSetting.acodec)
    .audioBitrate(outputSetting.abtr)
    .audioQuality(outputSetting.aquality)
    .videoCodec(outputSetting.vcodec)
    .videoBitrate(outputSetting.vbtr, outputSetting.isConstant)
    .fps(outputSetting.fps)
    .size(outputSetting.size)
    .outputOptions(this.outputOptions(outputSetting.options))
    .on('error', function(err, stdout, stderr) {
      console.log(err);
      console.log(stdout);
      console.log(stderr);
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function() {
      console.log('Processing finished !');
    })
    .on('filenames', function(filenames) {
      console.log('Will generate ' + filenames.join(', '));
    })
    .save('C:\\Users\\etienne\\Documents\\output.mp4');

    this.setState({
        outputSetting
    })
  }

  render() {
    console.log(this.state.selectedFile)
    return (
      <div className={styles.wrapper} >
        <div className={styles.configPane} >
          <ConfigPane
            configs={[]}
          />
        </div>
        <div className={styles.fileList} >
          <FileList
              filesInfo={this.state.filesInfo}
              onDrop={i => this.handleDrop(i)}
              onClick={i => this.handleClick(i)}
              selectedFile={this.state.selectedFile}
          />
        </div>
        <div className={styles.fileMetadata} >
          <FileMetadata
            tables={metadataUtils.extractMetadata(this.state.selectedFile)}
          />
        </div>
        <div className={styles.outputSetting} >
          <OutputSetting
            formats={this.state.capabilities.formats}
            audioCodecs={this.state.capabilities.audioCodecs}
            videoCodecs={this.state.capabilities.videoCodecs}
            onClick={i => this.handleChange(i)}
          />
        </div>
      </div>
    );
  }
}