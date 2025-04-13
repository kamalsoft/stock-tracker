import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { StockTracker } from './StockTracker'

describe('StockTracker', () => {
  it('renders the search bar', () => {
    const { getByPlaceholderText } = render(<StockTracker />)
    expect(getByPlaceholderText('Search for stocks')).toBeInTheDocument()
  })

  it('renders the stock list', async () => {
    const { getAllByRole } = render(<StockTracker />)
    await waitFor(() => expect(getAllByRole('listitem')).toHaveLength(5))
    expect(getAllByRole('listitem')[0]).toHaveTextContent('AAPL')
  })

  it('handles search input', () => {
    const { getByPlaceholderText, getByText } = render(<StockTracker />)
    const searchInput = getByPlaceholderText('Search for stocks')
    fireEvent.change(searchInput, { target: { value: 'GOOG' } })
    expect(getByText('GOOG')).toBeInTheDocument()
  })

  it('renders the portfolio list', async () => {
    const { getAllByRole } = render(<StockTracker />)
    await waitFor(() => expect(getAllByRole('listitem')).toHaveLength(3))
    expect(getAllByRole('listitem')[0]).toHaveTextContent('My Portfolio')
  })

  it('handles portfolio selection', () => {
    const { getAllByRole, getByText } = render(<StockTracker />)
    const portfolioList = getAllByRole('listitem')
    fireEvent.click(portfolioList[0])
    expect(getByText('My Portfolio')).toBeInTheDocument()
  })

  it('renders the transaction list', async () => {
    const { getAllByRole } = render(<StockTracker />)
    await waitFor(() => expect(getAllByRole('listitem')).toHaveLength(2))
    expect(getAllByRole('listitem')[0]).toHaveTextContent(
      'Buy 10 shares of AAPL'
    )
  })

  it('handles transaction selection', () => {
    const { getAllByRole, getByText } = render(<StockTracker />)
    const transactionList = getAllByRole('listitem')
    fireEvent.click(transactionList[0])
    expect(getByText('Buy 10 shares of AAPL')).toBeInTheDocument()
  })
})
