import utilities from './utilities';
import { useEffect } from 'react';

function StockListTotals(props) {
  
  const { stocks } = props;
  
  const totals = stocks.reduce((summary, stock) => {
    if (!isNaN(stock.profit))
      summary.profit += stock.profit;
    if (!isNaN(stock.purchaseValue))
      summary.purchaseValue += stock.purchaseValue;
    if (!isNaN(stock.currentValue))
      summary.currentValue += stock.currentValue;
    return summary;
  }, {currentValue: 0, purchaseValue: 0, profit: 0});
  const profitClass = totals.profit < 0 ? 'loss' : 'profit';
  
  // Need the empty <td> tag for Del col
  return (
    <tr>
      <td></td> 
      <th>TOTALS</th>
      <th colSpan="3">&nbsp;</th>
      <th className="money">{utilities.formatNumber(totals.purchaseValue)}</th>
      <th>&nbsp;</th>
      <th className="money">{utilities.formatNumber(totals.currentValue)}</th>
      <th className={"money "+profitClass}>{utilities.formatNumber(totals.profit)}</th>
    </tr>
  );
}

export default StockListTotals;
