import { ServerRespond } from './DataStreamer';

// Mimic our schema types from our Graph component
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // Compute price similar to module 1 getRatio
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC/priceDEF;
    // Set upper/lower bounds (mock values)
    const upperBound = 1 + .05;
    const lowerBound = 1 - .05;

    // properly process the raw server data passed to it so that it can return
    // the processed data which will be rendered by the Graph component’s table.
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      lower_bound: lowerBound,
      upper_bound: upperBound,
      // Check if ratio went above/below upper/lower bound
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
      // Get most updated timestamp
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
    };
  }
}
