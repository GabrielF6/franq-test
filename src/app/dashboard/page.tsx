'use client';

import Header from '@/components/header/Header';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { StocksResponse } from '../api/finance/stocks/route';
import useAuth from '../hooks/useAuth';

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: auto;
  background: linear-gradient(to right, #2c3e50 0%, #34495e 100%);
  font-family: 'Arial', sans-serif;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StockList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  color: white;
`;

const StockItem = styled.li<{ variation: number }>`
  padding: 10px;
  margin: 8px 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  cursor: pointer;

  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.2);
  }

  span:first-child {
    font-weight: bold;
  }

  span:last-child {
    color: ${(props) => (props.variation > 0 ? '#3fb83f' : '#880a0a')};
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ChartWrapper = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: ${({ isVisible }) => (isVisible ? '0' : '-100%')};
  left: 0;
  width: 100%;
  height: 33vh;
  background: rgba(0, 0, 0, 0.9);
  transition: bottom 0.3s ease-in-out;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    height: 50vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
`;

const CurrentValue = styled.div`
  color: white;
  font-size: 1.2rem;
  margin-top: 10px;
`;

export default function Dashboard() {
  const [stocks, setStocks] = useState<StocksResponse>();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<{ time: string; value: number }[]>([]);
  const [isChartVisible, setIsChartVisible] = useState(false);

  // Function to fetch stock data
  useEffect(() => {
    const fetchStocks = async () => {
      const res = await fetch('/api/finance/stocks');
      const data = await res.json();
      setStocks(data.results);

      const timestamp = new Date().toLocaleTimeString();

      setHistoricalData((prevData) => {
        if (selectedStock) {
          const newValue = data.results?.currencies?.[selectedStock]?.buy || data.results?.stocks?.[selectedStock]?.buy;
          if (newValue) {
            return [...prevData, { time: timestamp, value: newValue }].slice(-20); // Limit to last 20 data points
          }
        }
        return prevData;
      });
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 10000);
    return () => clearInterval(interval);
  }, [selectedStock]); // Now updates whenever `selectedStock` changes

  // Function to handle stock selection
  const handleStockClick = (stockKey: string) => {
    setSelectedStock(stockKey);
    setIsChartVisible(true);
    setHistoricalData([]); // Clear data when switching stocks
  };

  useAuth();

  return (
    <DashboardWrapper>
      <Header />
      <Title>Moedas</Title>
      <StockList>
        {stocks
          ? Object.entries(stocks.currencies)
              .map(([key, value]) => key !== 'source' && (
                <StockItem key={key} variation={value.variation} onClick={() => handleStockClick(key)}>
                  <span>{key}</span>
                  <span>
                    {value.buy} ({value.variation}%)
                  </span>
                </StockItem>
              ))
          : null}
      </StockList>
      <Title style={{ marginTop: '40px' }}>Ações</Title>
      <StockList>
        {stocks
          ? Object.entries(stocks.stocks).map(([key, value]) => (
              <StockItem key={key} variation={value.variation} onClick={() => handleStockClick(key)}>
                <span>{key}</span>
                <span>
                  {value.buy} ({value.variation}%)
                </span>
              </StockItem>
            ))
          : null}
      </StockList>

      {/* Gráfico de Preços em Tempo Real */}
      <ChartWrapper isVisible={isChartVisible}>
        <CloseButton onClick={() => setIsChartVisible(false)}>Fechar</CloseButton>
        <ResponsiveContainer width="90%" height="80%">
          <LineChart data={historicalData}>
            <XAxis dataKey="time" stroke="#ddd" />
            <YAxis stroke="#ddd" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        {selectedStock && (
          <CurrentValue>Valor Atual ({selectedStock}): {historicalData.length ? historicalData[historicalData.length - 1].value : 'N/A'}</CurrentValue>
        )}
      </ChartWrapper>
    </DashboardWrapper>
  );
}
