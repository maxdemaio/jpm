import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

// Initialize state types
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

// App component
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    // Intialize state
    this.state = {
      data: [],
      showGraph: false,
    };
  }

  // Load our Graph component
  // Note: as data changes in state, it will reload the parent App component
  // As a result the graph will also update with new data
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data}/>)
    }
  }

  // Function to continuously grab data from Python server
  // This function updates the App's data state w/ updated dataset
  getDataFromServer() {
    let x = 0;
    const interval = setInterval(() => {
      // Use the DataSteamer component to abstract requests to Python server
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update state with newly streamed data
        this.setState({
          data: serverResponds,
          showGraph: true,
        });
      });
      x++;
      if (x > 1000) {
        clearInterval(interval);
      }
    }, 100);
  }

  // General render which will populate our #root element in index.html
  // CSS is also tied to the classNames we assign here from App.css
  // Also we add on Bootstrap CSS classes
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank Merge & Co Task 3
        </header>
        <div className="App-content">
          {/* 'this' bound to App object/class and calls the getData method 
            continuously update the data state */}
          <button className="btn btn-primary Stream-button" onClick={() => {this.getDataFromServer()}}>Start Streaming Data</button>
          {/* After graph is turned on from the getData method, we turn on our graph
            and it is populated via state continuously */}
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
