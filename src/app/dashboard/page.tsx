'use client';

import Header from '@/components/header/Header';
import { useEffect, useState } from 'react';
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

const StockItem = styled.li<{variation: number}>`
  padding: 10px;
  margin: 8px 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 1rem;

  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.2);
  }

  span:first-child {
    font-weight: bold;
  }

  span:last-child {
    color: ${(props: { variation: number }) => (props.variation > 0 ? '#3fb83f' : '#880a0a')};
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export default function Dashboard() {
  const [stocks, setStocks] = useState<StocksResponse>();

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await fetch('/api/finance/stocks');
      const data = await res.json();
      setStocks(data.results);
    };
    fetchStocks();
  }, []);

  console.log(stocks, stocks ? Object.entries(stocks?.currencies) : '');

  useAuth()

  return (
    <DashboardWrapper>
      <Header />
      <Title>Moedas</Title>
      <StockList>
        {stocks
          ? Object.entries(stocks?.currencies)
              .map((item) => ({ key: item[0], value: item[1] }))
              .map((item) => item.key !== 'source' ?(
                <StockItem key={item.key} variation={item.value.variation}>
                  <span>{item.key}</span>
                  <span>
                    {item.value.buy} ({item.value.variation}%)
                  </span>
                </StockItem>
              ):<></>)
          : null}
      </StockList>
      <Title style={{marginTop: '40px'}}>Ações</Title>
      <StockList >
        {stocks
          ? Object.entries(stocks?.stocks)
              .map((item) => ({ key: item[0], value: item[1] }))
              .map((item) =>  (
                <StockItem key={item.key} variation={item.value.variation}>
                  <span>{item.key}</span>
                  <span>
                    {item.value.buy} ({item.value.variation}%)
                  </span>
                </StockItem>
              ))
          : null}
      </StockList>
    </DashboardWrapper>
  );
}
