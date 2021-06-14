import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink', () => {
  it('renders correctly', () => {
    render(<ActiveLink href="/">Home</ActiveLink>)

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('adds active class if link is selected', () => {
    render(<ActiveLink href="/">Home</ActiveLink>)

    expect(screen.getByText('Home')).toHaveClass('active')
  })
})
