import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { stripe } from '../../services/stripe'
import Home, { getStaticProps } from '../../pages'

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})
jest.mock('next/router')
jest.mock('../../services/stripe')

describe('Home', () => {
  it('renders correctly', () => {
    render(<Home product={{ id: 'fake-price-id', amount: '$10.00' }} />)

    expect(screen.getByText('for $10.00 month')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const priceRetrieveMocked = mocked(stripe.prices.retrieve)

    priceRetrieveMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            id: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})
