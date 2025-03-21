'use client';

import Header from '@/components/header/Header';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StocksResponse } from '../api/finance/stocks/route';
import useAuth from '../hooks/useAuth';
import './dashboard.css';

export default function Dashboard() {
  const [stocks, setStocks] = useState<StocksResponse>();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<{ time: string; value: number }[]>([]);
  const [isChartVisible, setIsChartVisible] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await fetch('/api/finance/stocks');
      const data = await res.json();
      setStocks(data.results);
      const timestamp = new Date().toLocaleTimeString();
      
      // Retrieve existing history from localStorage
      const storedHistory = JSON.parse(localStorage.getItem('stocksHistory') || '{}');
      
      // Update history with new API data
      Object.entries({ ...data.results.currencies, ...data.results.stocks }).forEach(([key, value]) => {
        const typedValue = value as {buy?: number, points?: number}
        if (typedValue.buy || typedValue.points) {
          if (!storedHistory[key]) storedHistory[key] = [];
          storedHistory[key].push({ time: timestamp, value: typedValue.buy? typedValue.buy:typedValue.points });
          storedHistory[key] = storedHistory[key].slice(-100); // Limit history size
        }
      });

      // Save updated history back to localStorage
      localStorage.setItem('stocksHistory', JSON.stringify(storedHistory));
      setHistoricalData(selectedStock ? storedHistory[selectedStock] : [])
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 10000);
    return () => clearInterval(interval);
  }, [selectedStock]);

  const handleStockClick = (stockKey: string) => {
    setSelectedStock(stockKey);
    setIsChartVisible(true);
    
    // Retrieve history from localStorage
    const storedHistory = JSON.parse(localStorage.getItem('stocksHistory') || '{}');
    setHistoricalData(storedHistory[stockKey] || []);
  };

  useAuth();


  return (
    <div className="dashboard-wrapper">
      <Header />
      <h1 className="title">Moedas</h1>
      <ul className="stock-list">
        {stocks
          ? Object.entries(stocks.currencies).map(([key, value]) =>
              key !== 'source' && (
                <li key={key} className={`stock-item ${value.variation > 0 ? 'positive' : 'negative'}`} onClick={() => handleStockClick(key)}>
                  <span>{key}</span>
                  <span>
                    {value.buy} ({value.variation}%)
                  </span>
                </li>
              )
            )
          : null}
      </ul>
      <h1 className="title" style={{ marginTop: '40px' }}>Ações</h1>
      <ul className="stock-list">
        {stocks
          ? Object.entries(stocks.stocks).map(([key, value]) => (
              <li key={key} className={`stock-item ${value.variation > 0 ? 'positive' : 'negative'}`} onClick={() => handleStockClick(key)}>
                <span>{key}</span>
                <span>
                  {value.points} ({value.variation}%)
                </span>
              </li>
            ))
          : null}
      </ul>

      <div className={`chart-wrapper ${isChartVisible ? 'visible' : ''}`}>
        <button className="close-button" onClick={() => setIsChartVisible(false)}>Fechar</button>
        <ResponsiveContainer width="90%" height="80%">
          <LineChart data={historicalData}>
            <XAxis dataKey="time" stroke="#ddd" />
            <YAxis stroke="#ddd" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        {selectedStock && (
          <div className="current-value">Valor Atual ({selectedStock}): {historicalData.length ? historicalData[historicalData.length - 1].value : 'N/A'}</div>
        )}
      </div>
    </div>
  );
}
