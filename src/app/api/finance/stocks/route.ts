import { NextResponse } from 'next/server';

type CurrenciesProps = {buy: number, name: string, sell: number, variation: number}
type StockProps = {points: number, name: string, location: string, variation: number}

export type StocksResponse = {
  available_sources: [];
  currencies: Record<string, CurrenciesProps>;
  stocks: Record<string, StockProps>;
  taxes: [];
};

export async function GET() {
  try {
    const response = await fetch('https://api.hgbrasil.com/finance');

    // Check if the response is successful (status in range 200-299)
    if (!response.ok) {
      // Handle failed response
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: StocksResponse = await response.json();

    // Return the successful data
    return NextResponse.json(data);

  } catch (error: unknown) {
    // Type assertion to tell TypeScript that 'error' is an instance of Error
    const typedError = error instanceof Error ? error : new Error('Unknown error');

    // Handle errors (network errors, JSON parsing errors, etc.)
    console.error(typedError); // Optionally log the error
    return NextResponse.json(
      { message: 'An error occurred while fetching the data', error: typedError.message },
      { status: 500 }
    );
  }
}
