import LearningCanvas from './components/LearningCanvas'
import React from "react";
import brain from "brain.js";
import DrawingCanvas from "./components/DrawingCanvas";
import css from "./App.css";


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.net = new brain.NeuralNetwork();
    this.posRef = [];
    this.negRef = [];
    this.state = {
      learn: false
    };
  }

  learn() {
    
    const positiveData = [0,1,2].map((pos) => {
      return {
        input: this.posRef[pos].sampleData(), output: {happy: 1, sad: 0}
      }
    })
    const negativeData = [0,1,2].map((neg) => {
      return {
        input: this.negRef[neg].sampleData(), output: {happy: 0, sad: 1}
      }
    })
    this.net.train([...positiveData, ...negativeData]);
    this.setState({
      learn: true
    });
  }
  
  guessSentiment(data) {
    const result = this.net.run(data)
    this.setState({ result });
  }

  drawResults() {
    return this.state.result
      ? ['happy', 'sad'].map((sentiment) => `${sentiment}: ${Number(this.state.result[sentiment]* 100).toFixed(2)}%`).join(',')
      : ''
  }
  
  render() {
    return (
      <div>
        <div className={css.learningContainer}>
          <LearningCanvas ref={(r) => {
            this.posRef[0] = r
          }}/>
          <LearningCanvas ref={(r) => {
            this.posRef[1] = r
          }}/>
          <LearningCanvas ref={(r) => {
            this.posRef[2] = r
          }}/>
        </div>
        <div className={css.learningContainer}>
          <LearningCanvas ref={(r) => {
            this.negRef[0] = r
          }}/>
          <LearningCanvas ref={(r) => {
            this.negRef[1] = r
          }}/>
          <LearningCanvas ref={(r) => {
            this.negRef[2] = r
          }}/>
        </div>
        <div>
          <button onClick={() => this.learn()}>Learn</button>
          <DrawingCanvas onChange={data => this.guessSentiment(data)} />
          {this.state.learn && <div>Detected: {this.drawResults()}</div>}
        </div>
        
      </div>
    );
  }
}
