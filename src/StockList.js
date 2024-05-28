import { Table } from 'reactstrap';
import StockListHeader from './StockListHeader';
import StockListItem from './StockListItem.js';
import StockListTotals from './StockListTotals.js';

function StockList(props) {
  
  const sortedStockList = props.data.sort((a,b) => a.name < b.name ? -1 : 1); 
  
  return (
    <Table>
      <thead>
        <StockListHeader />
      </thead>
      <tbody>
        {
          sortedStockList.map((stock, idx) => <StockListItem key={idx} stock={stock} getPortfolio={props.getPortfolio}/> )
        }
        <StockListItem stock={"makeStock"} getPortfolio={props.getPortfolio}/>
      </tbody>
      <tfoot>
        <StockListTotals stocks={props.data} />
      </tfoot>
    </Table>
  );
}

export default StockList;
