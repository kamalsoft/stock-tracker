// client/tests/Transaction.test.js
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { Transaction } from '../src/store/slices/transactionSlice'

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

  it('handles transaction deletion', async () => {
    const { getAllByRole, getByText } = render(<Transaction />)
    await waitFor(() => expect(getAllByRole('listitem')).toHaveLength(2))
    const deleteButton = getByText('Delete')
    fireEvent.click(deleteButton)
    await waitFor(() => expect(getAllByRole('listitem')).toHaveLength(1))
  })
})
