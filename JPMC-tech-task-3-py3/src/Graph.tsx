import React, { Component } from 'react';
import { Table } from '@jpmorganchase/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

// Initialize state types
interface IProps {
  data: ServerRespond[],
}

// Graph component that intially loads the HTML element for
// the Perspective graph
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  // Once the Perspective element is loaded, we configure the schema for the data
  componentDidMount(): void {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    // This schema object controls how we configure our Perspective table view
    // We use the Perspective JavaScript API to 
    const schema = {
      // Add prices so we can calculate their ratios
      price_abc: 'float',
      price_def: 'float',
      ratio: 'float',
      timestamp: 'date',
      // Added new fields for upper/lower bounds and trigger alert
      upper_bound: 'float',
      lower_bound: 'float',
      trigger_alert: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      // Modify attributes
      elem.load(this.table);
      // Type of graph
      elem.setAttribute('view', 'y_line');
      // X-axis
      elem.setAttribute('row-pivots', '["timestamp"]');
      // No column-pivots to sep stocks, just their ratios and upper/lower bound
      // allows us to focus on particular part of datapoint's data along y-axis
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
      // Pivot table taking statistic avgs / unique count aggregates 
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: 'avg',
        price_def: 'avg',
        ratio: 'avg',
        timestamp: 'distinct count',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'avg',
      }));
    }
  }

  // When component is updated/reloaded, use the DataManip component
  // to alter the data in the Perspective graph
  componentDidUpdate() {
    if (this.table) {
      // Changed to an array since we have multiple columns
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ]);
    }
  }
}

export default Graph;
