import { Input, Button } from 'reactstrap';
import { useState, useEffect } from 'react';

const StockListItemForm = (props) => {
    
    const [ticker, setTicker] = useState("");
    const [shares, setShares] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [isValid, setIsValid] = useState(false);
    
    const AWS_API_GATEWAY = "https://n1haz2qiqi.execute-api.us-east-1.amazonaws.com/prod";
    const AWS_API_GATEWAY_ADD_STOCK = AWS_API_GATEWAY + '/add-stock';
    
    useEffect(() => {
        let isValid = (ticker.length > 0);              // ticker isn't blank
        isValid = isValid && (shares.length > 0);       // shares isn't blank
        isValid = isValid && (purchasePrice.length > 0);// purchasePrice isn't blank
        isValid = isValid && !/[^A-Z]/.test(ticker);    // ticker has letters only
        setIsValid(isValid);
    }, [ticker, shares, purchasePrice]);
    
    const addStock = () => {
        return new Promise((resolve, reject) => {
            const fetchOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ticker: ticker,
                    shares: shares,
                    purchasePrice: purchasePrice
                })
            }
            
            fetch(AWS_API_GATEWAY_ADD_STOCK, fetchOptions)
            .then(response => {
                if(!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => resolve(data))
            .then(() => {
                props.getPortfolio();
                setTicker("");
                setShares(0);
                setPurchasePrice(0);
            })
            .catch(error => reject(error));
        });
    }
    
    return (
        <tr>
            <td> <Button onClick={addStock} >
                Add
            </Button> </td>
            
            <td><Input valid={isValid} invalid={!isValid} value={ticker} id="ticker" onChange={(e) => setTicker(e.target.value)}/></td>
            <td></td>
            <td><Input valid={isValid} invalid={!isValid} value={shares} id="shares" onChange={(e) => setShares(e.target.value)}/></td>
            <td><Input valid={isValid} invalid={!isValid} value={purchasePrice} id="purchasePrice" onChange={(e) => setPurchasePrice(e.target.value)}/></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    )
}

export default StockListItemForm