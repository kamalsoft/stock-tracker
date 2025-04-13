import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { CreatePortfolioDialog } from '../src/components/CreatePortfolioDialog'

describe('CreatePortfolioDialog', () => {
  it('renders the dialog title and form fields', () => {
    const { getByText, getByPlaceholderText } = render(
      <CreatePortfolioDialog />
    )
    expect(getByText('Create Portfolio')).toBeInTheDocument()
    expect(getByPlaceholderText('Portfolio Name')).toBeInTheDocument()
    expect(getByPlaceholderText('Initial Balance')).toBeInTheDocument()
  })

  it('handles the submit button click', () => {
    const handleSubmit = jest.fn()
    const { getByText, getByPlaceholderText } = render(
      <CreatePortfolioDialog onSubmit={handleSubmit} />
    )
    const submitButton = getByText('Create')
    const nameInput = getByPlaceholderText('Portfolio Name')
    const balanceInput = getByPlaceholderText('Initial Balance')
    fireEvent.change(nameInput, { target: { value: 'My New Portfolio' } })
    fireEvent.change(balanceInput, { target: { value: '1000.00' } })
    fireEvent.click(submitButton)
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})
