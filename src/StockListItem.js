import { MdDeleteForever } from "react-icons/md";
import StockListItemForm from "./StockListItemForm.js"

function StockListItem(props) {
  
  const { stock } = props;
  
  let purchaseValueStr;
  let currentValueStr;
  
  let purchasePriceStr;
  let currentPriceStr;
  
  let profitStr;
  let profitClass;
  
  const AWS_API_GATEWAY = "https://n1haz2qiqi.execute-api.us-east-1.amazonaws.com/prod";
  const AWS_API_GATEWAY_REMOVE_STOCK = AWS_API_GATEWAY + '/delete-stock';
  
  let deleteStock;
  if (stock !== "makeStock") {
   purchaseValueStr = stock.formattedPurchaseValue;
   currentValueStr = stock.formattedCurrentValue;
    
   purchasePriceStr = stock.formattedPurchasePrice;
   currentPriceStr = stock.formattedCurrentPrice;
    
   profitStr = stock.formattedProfit;
   profitClass = stock.profit < 0 ? 'loss' : 'profit';
   
   deleteStock = (evt) => {
    let ticker = evt.currentTarget.getAttribute('data-ticker')
    console.log("DELETE STOCK: "+ticker);
    return new Promise((resolve, reject) => {
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ticker: ticker})
      }
      
      fetch(AWS_API_GATEWAY_REMOVE_STOCK, fetchOptions)
        .then(response => {
          if(!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => resolve(data))
        .then(() => props.getPortfolio())
        .catch(error => reject(error));
    });
  }
  }
  
  
   // Need the empty <td> tag for Del col
  
  if (stock !== "makeStock") {
    return (
      <tr>
        <div className="trash" onClick={deleteStock} data-ticker={stock.ticker}><MdDeleteForever /></div>
        <td>{stock.ticker}</td>
        <td>{stock.name}</td>
        <td>{stock.shares}</td>
        <td className="money">{purchasePriceStr}</td>
        <td className="money">{purchaseValueStr}</td>
        <td className="money">{currentPriceStr}</td>
        <td className="money">{currentValueStr}</td>
        <td className={"money "+profitClass}>{profitStr}</td>
      </tr>
    );
  } else {
    return (
      <StockListItemForm getPortfolio={props.getPortfolio}/>
    )
  }
}

export default StockListItem;
