import { render, screen, waitFor } from '@testing-library/react'
import { Async } from '.'

describe('Async testing', () => {
  it('renders correctly', async () => {
    render(<Async />)

    expect(screen.getByText('Hello Yara')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Button')).toBeInTheDocument()
    })

    // check if element is not in page
    // await waitFor(() => {
    //   expect(screen.queryByText('Button')).not.toBeInTheDocument()
    // })
  })
})
