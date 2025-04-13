import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { Portfolio } from './Portfolio'

describe('Portfolio', () => {
  it('renders the portfolio list', async () => {
    const { getAllByRole } = render(<Portfolio />)
    await waitFor(() => expect(getAllByRole('listitem')).toHaveLength(3))
    expect(getAllByRole('listitem')[0]).toHaveTextContent('My Portfolio')
  })

  it('handles portfolio selection', () => {
    const { getAllByRole, getByText } = render(<Portfolio />)
    const portfolioList = getAllByRole('listitem')
    fireEvent.click(portfolioList[0])
    expect(getByText('My Portfolio')).toBeInTheDocument()
  })
})
