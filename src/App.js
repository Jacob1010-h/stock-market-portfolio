import { useState, useEffect } from 'react';
import './App.css';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import StockList from './StockList.js';

function App() {
  
  // Uncomment setMyName if required, for example, if the name
  // is stored in the DynamoDB
  const [myName/*, setMyName*/] = useState('Roger');
  
  const [stocks, setStocks] = useState([]);
  const [stockList, setStockList] = useState([]);
  
  const [stockPrices, setStockPrices] = useState({});
  const [tickerList, setTickerList] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  
  const AWS_API_GATEWAY = "https://n1haz2qiqi.execute-api.us-east-1.amazonaws.com/prod";
  const AWS_API_GATEWAY_GET_PORTFOLIO = AWS_API_GATEWAY + '/get-portfolio';
  const AWS_API_GATEWAY_GET_STOCK_PRICE = AWS_API_GATEWAY + '/get-stock-price';
  
  
  useEffect(() => {
    const tickers = createTickerList(stocks);
    setTickerList(tickers);
  }, [stocks])
  
  // Retrieve the current stock information when the page first loads
  useEffect(() => {
    const options = {
      method: 'POST',
      cache: 'default'
    };
    
    fetch(AWS_API_GATEWAY_GET_PORTFOLIO, options)
      .then(function(response) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => getPortfolio(response) )
      .catch(function(error) {
        console.log(error);
      })

    // setStocks(sampleData);
  }, []);
  
  // With the stock data add purchase value, current price
  // and current value to the stock record
  useEffect(() => {
    const enhancedStocks = stocks.map(stock => {
      stock.purchaseValue = stock.shares * stock.purchasePrice;
      stock.currentPrice = Math.random()*200 + 50;
      stock.currentValue = stock.shares * stock.currentPrice;
      stock.profit = stock.currentValue - stock.purchaseValue;
      return stock;
    })
    setStockList(enhancedStocks);
  }, [stocks])
  
  
  const createTickerList = (portfolio) => {
    return portfolio.reduce((tickers, item) => {
      tickers.push(item.ticker);
      return tickers;
    }, []);
  }
  
  const getPortfolio = (response) => {
    const stocks = response.Items;
    let betterStocks = [];
    
    // {
    //   "ticker":"",
    //   "shares":0,
    //   "purchasePrice":0.0,
    //   "name":"" // not needed
    // }
    for(let i = 0; i < stocks.length; i++) {
      const ticker = Object.values(stocks[i].ticker);
      const shares = Object.values(stocks[i].shares);
      const purchasePrice = Object.values(stocks[i].purchasePrice);
      
      betterStocks[i] = {
        "ticker" : ticker[0],
        "shares" : shares[0],
        "purchasePrice" : purchasePrice[0]
      }
    }
    // console.log(betterStocks);
    console.log(createTickerList(betterStocks));
    setStocks(betterStocks)
  }
  
  
  const getStockPrice = (ticker) => {
    return new Promise((resolve, reject) => {
      const fetchOptions = {
        methos: 'POST', 
        cache: 'default',
        body: JSON.stringify({ticker:ticker})
      }
      
      fetch(AWS_API_GATEWAY_GET_STOCK_PRICE, fetchOptions)
      .then(response => {
        if(!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
    });
  }
  
  const addStock = evt => {
    console.log('add stock clicked');
  }

  return (
    <div className="App">
      <Card>
        <CardHeader className="card-header-color">
          <h4>{myName}'s Stock Portfolio</h4>
        </CardHeader>
        <CardBody>
          <StockList data={stockList} />
        </CardBody>
        <CardFooter>
          <Button size="sm" onClick={addStock}>Add stock</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
