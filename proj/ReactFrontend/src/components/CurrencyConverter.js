import { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Button } from '@mui/material';
import SwapHoriz from '@mui/icons-material/SwapHoriz';

const CurrencyConverter = ({ buyUsdRate, sellUsdRate }) => {
    const [amount, setAmount] = useState(0);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('LBP');
    const [result, setResult] = useState(0);

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleFromCurrencyChange = (event) => {
        setFromCurrency(event.target.value);
    };

    const handleToCurrencyChange = (event) => {
        setToCurrency(event.target.value);
    };

    const handleConvert = (event) => {
        event.preventDefault();
        let exchangeRate;
        if (fromCurrency === 'USD' && toCurrency === 'LBP') {
            exchangeRate = sellUsdRate;
        } else if (fromCurrency === 'LBP' && toCurrency === 'USD') {
            exchangeRate = buyUsdRate;
        } else if (fromCurrency === 'USD' && toCurrency === 'USD') {
            exchangeRate = 1;
        } else if (fromCurrency === 'LBP' && toCurrency === 'LBP') {
            exchangeRate = 1;
        } else {
            exchangeRate = toCurrency === 'USD' ? buyUsdRate : sellUsdRate;
        }
        const convertedAmount = amount * exchangeRate;
        setResult(convertedAmount.toFixed(2));
    };

    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <TextField
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    variant="outlined"
                    margin="normal"
                    placeholder='Amount'
                />
            </FormControl>
            <FormControl variant="outlined" sx={{ minWidth: 200, mt: 2 }}>
                <InputLabel htmlFor="from-currency">From Currency</InputLabel>
                <Select
                    id="from-currency"
                    value={fromCurrency}
                    onChange={handleFromCurrencyChange}
                    label="From Currency"
                >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="LBP">LBP</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ minWidth: 200, mt: 2 }}>
                <InputLabel htmlFor="to-currency">To Currency</InputLabel>
                <Select
                    id="to-currency"
                    value={toCurrency}
                    onChange={handleToCurrencyChange}
                    label="To Currency"
                >
                    <MenuItem value="LBP">LBP</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleConvert}>
                Convert
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <span>{`${amount} ${fromCurrency} = ${result} ${toCurrency}`}</span>
                <SwapHoriz sx={{ ml: 2, cursor: 'pointer' }} onClick={handleSwapCurrencies} />
            </Box>
        </Box>
    );
};

export default CurrencyConverter;