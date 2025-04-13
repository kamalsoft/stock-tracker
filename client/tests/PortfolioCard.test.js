import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { PortfolioCard } from '../components/PortfolioCard'
import '@testing-library/jest-dom/extend-expect'

describe('PortfolioCard', () => {
  it('renders the portfolio name and balance', () => {
    const portfolio = { name: 'My Portfolio', balance: 1000.0 }
    const { getByText } = render(<PortfolioCard portfolio={portfolio} />)
    expect(getByText(portfolio.name)).toBeInTheDocument()
    expect(getByText(`$${portfolio.balance}`)).toBeInTheDocument()
  })

  it('handles the edit button click', () => {
    const portfolio = { name: 'My Portfolio', balance: 1000.0 }
    const handleEdit = jest.fn()
    const { getByText } = render(
      <PortfolioCard portfolio={portfolio} onEdit={handleEdit} />
    )
    const editButton = getByText('Edit')
    fireEvent.click(editButton)
    expect(handleEdit).toHaveBeenCalledTimes(1)
  })
})
