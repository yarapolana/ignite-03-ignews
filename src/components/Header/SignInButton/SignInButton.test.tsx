import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import { SignInButton } from '.'

jest.mock('next-auth/client')

describe('Header', () => {
  it('renders correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SignInButton />)

    expect(screen.getByText('Sign In with Github')).toBeInTheDocument()
  })

  it('renders correctly when user is authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'Yara Polana',
          email: 'yara@yara.com'
        },
        expires: 'fake-expire'
      },
      false
    ])

    render(<SignInButton />)

    expect(screen.getByText('Yara Polana')).toBeInTheDocument()
  })
})
