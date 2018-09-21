import React from 'react';
import TextToSVG from 'text-to-svg';

export default class App extends React.Component {
  render() {
    const {width, height, sendMoneyAbroad} = this.props;
    const viewBox = [0, 0, width, height].join(' ');
    const attributes = {fill: '#FFFFFF'};
    const textToSVG = TextToSVG.loadSync('./fonts/TW-Averta-Bold.otf');
    const line1 = textToSVG.getPath(sendMoneyAbroad, {x: width/2, y: height/2-20, fontSize: 40, anchor: 'center bottom', attributes: attributes});
    const line2 = textToSVG.getPath('WITH TRANSFERWISE', {x: width/2, y: height/2+20, fontSize: 40, anchor: 'center top', attributes: attributes});

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width={width} height={height}>
        <rect fill="#2E4369" width={width} height={height} />
        <g dangerouslySetInnerHTML={{__html: line1}} />
        <g dangerouslySetInnerHTML={{__html: line2}} />
      </svg>
    )
  }
};
