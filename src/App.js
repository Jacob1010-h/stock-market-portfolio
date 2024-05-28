import { useState, useEffect } from 'react';
import './App.css';
import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import StockList from './StockList.js';
import utilities from './utilities'

function App() {
  
  // Uncomment setMyName if required, for example, if the name
  // is stored in the DynamoDB
  const [myName/*, setMyName*/] = useState('Roger');
  
  const [stocks, setStocks] = useState([]);

  const [stockPrices, setStockPrices] = useState({});
  const [tickerList, setTickerList] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  
  const AWS_API_GATEWAY = "https://n1haz2qiqi.execute-api.us-east-1.amazonaws.com/prod";
  const AWS_API_GATEWAY_GET_PORTFOLIO = AWS_API_GATEWAY + '/get-portfolio';
  const AWS_API_GATEWAY_GET_STOCK_PRICE = AWS_API_GATEWAY + '/get-stock-price';
    
  // Retrieve the current stock information when the page first loads
  useEffect(() => {
    getPortfolio()
  }, []);
  
  useEffect(() => {
    const tickers = createTickerList(stocks);
    setTickerList(tickers);
  }, [stocks])
  
  // With the stock data add purchase value, current price
  // and current value to the stock record
  useEffect(() => {
    let promises = tickerList.map(ticker => getStockPrice(ticker));
    Promise.all(promises)
      .then(stocks => {
        console.log(stocks);
        const stockPrices = stocks.reduce((obj, stock) => {
          const info = {
            name: stock.data["Global Quote"] ? stock.data["Global Quote"]["01. symbol"] : null,
            price: stock.data["Global Quote"] ? stock.data["Global Quote"]["05. price"] : null
          }
          obj[stock.ticker] = info;
          return obj;
        }, {});
        setStockPrices(stockPrices);
        console.log(stockPrices);
      })
}, [tickerList])

useEffect(() => {
  let output = [];
  
  for(let i = 0; i < stocks.length; i++) {
    const ticker = Object.keys(stockPrices)[i];
    const stockPricesObj = Object.values(stockPrices)[i];
    const price = Number(Object.values(stockPricesObj)[1]);
    
    const portfolioObj = stocks[i];
    
    console.log("porfolio")
    console.log(portfolioObj);
    
    const purchasePrice = Number(portfolioObj.purchasePrice);
    const shares = Number(portfolioObj.shares);
    const purchaseValue = purchasePrice * shares;
    const currentValue = Number(price) * shares;
    
    let info = {
      ticker: ticker,
      name: ticker,
      shares: shares,
      currentPrice: price,
      purchaseValue: purchaseValue,
      pruchasePrice: purchasePrice,
      currentValue: currentValue,
      profit: currentValue - purchaseValue,
      formattedCurrentPrice: utilities.formatNumber(price),
      formattedPurchaseValue: utilities.formatNumber(purchaseValue),
      formattedPurchasePrice: utilities.formatNumber(purchasePrice),
      formattedCurrentValue: utilities.formatNumber(currentValue),
      formattedProfit: utilities.formatNumber(currentValue - purchaseValue)
    }
    output.push(info);
  }
  
  console.log("output:");
  console.log(output);
  
  setPortfolioData(output);
}, [stockPrices])
  
  const createTickerList = (portfolio) => {
    return portfolio.reduce((tickers, item) => {
      tickers.push(item.ticker);
      return tickers;
    }, []);
  }
  
  const getPortfolio = () => {
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
      .then((response) => {
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
        setStocks(betterStocks)
      } )
      .catch(function(error) {
        console.log(error);
      })
  }
  
  const getStockPrice = (ticker) => {
    return new Promise((resolve, reject) => {
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ticker: ticker})
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

  return (
    <div className="App">
      <Card>
        <CardHeader className="card-header-color">
          <h4>{myName}'s Stock Portfolio</h4>
        </CardHeader>
        <CardBody>
          <StockList data={portfolioData} getPortfolio={getPortfolio} />
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
