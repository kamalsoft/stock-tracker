import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { StockSearch } from './StockSearch'

describe('StockSearch', () => {
  it('renders the search input', () => {
    const { getByPlaceholderText } = render(<StockSearch />)
    expect(getByPlaceholderText('Search for stocks')).toBeInTheDocument()
  })

  it('handles search input', () => {
    const { getByPlaceholderText, getByText } = render(<StockSearch />)
    const searchInput = getByPlaceholderText('Search for stocks')
    fireEvent.change(searchInput, { target: { value: 'GOOG' } })
    expect(getByText('GOOG')).toBeInTheDocument()
  })

  it('renders the search results', async () => {
    const { getAllByRole } = render(<StockSearch />)
    await waitFor(() => expect(getAllByRole('listitem')).toHaveLength(5))
    expect(getAllByRole('listitem')[0]).toHaveTextContent('AAPL')
  })
})
