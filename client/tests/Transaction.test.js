import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { Transaction } from './Transaction'

describe('Transaction', () => {
  it('renders the transaction list', async () => {
    const { getAllByRole } = render(<Transaction />)
    await waitFor(() => expect(getAllByRole('listitem')).toHaveLength(2))
    expect(getAllByRole('listitem')[0]).toHaveTextContent(
      'Buy 10 shares of AAPL'
    )
  })

  it('renders the transaction details', async () => {
    const { getAllByRole } = render(<Transaction />)
    await waitFor(() => expect(getAllByRole('listitem')).toHaveLength(2))
    expect(getAllByRole('listitem')[0]).toHaveTextContent('Date: 2022-01-01')
    expect(getAllByRole('listitem')[0]).toHaveTextContent('Type: Buy')
    expect(getAllByRole('listitem')[0]).toHaveTextContent('Quantity: 10')
    expect(getAllByRole('listitem')[0]).toHaveTextContent('Price: $100.00')
  })

  it('handles transaction selection', () => {
    const { getAllByRole, getByText } = render(<Transaction />)
    const transactionList = getAllByRole('listitem')
    fireEvent.click(transactionList[0])
    expect(getByText('Transaction Details')).toBeInTheDocument()
  })

  it('renders the transaction form', async () => {
    const { getByText } = render(<Transaction />)
    await waitFor(() =>
      expect(getByText('Add Transaction')).toBeInTheDocument()
    )
    expect(getByText('Date')).toBeInTheDocument()
    expect(getByText('Type')).toBeInTheDocument()
    expect(getByText('Quantity')).toBeInTheDocument()
    expect(getByText('Price')).toBeInTheDocument()
  })

  it('handles transaction form submission', () => {
    const { getByText, getByPlaceholderText } = render(<Transaction />)
    const dateInput = getByPlaceholderText('Date')
    const typeInput = getByPlaceholderText('Type')
    const quantityInput = getByPlaceholderText('Quantity')
    const priceInput = getByPlaceholderText('Price')
    fireEvent.change(dateInput, { target: { value: '2022-01-01' } })
    fireEvent.change(typeInput, { target: { value: 'Buy' } })
    fireEvent.change(quantityInput, { target: { value: '10' } })
    fireEvent.change(priceInput, { target: { value: '100.00' } })
    const submitButton = getByText('Add Transaction')
    fireEvent.click(submitButton)
    expect(getByText('Transaction added successfully')).toBeInTheDocument()
  })
})
