import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  thumbnail: {
    dimensions: {
      width: 100,
      height: 100
    },
    alt: 'My thumbnail',
    copyright: 'copyrighted',
    url: 'thumbnail/path'
  },
  content: '<p>Post excerpt</p>',
  updatedAt: '09/10/2021'
}

jest.mock('../../services/prismic')
jest.mock('next-auth/client')
jest.mock('next/router')

describe('Post', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
  })

  it('redirects user if there is no active subscription', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts'
        })
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)
    const getPrismicClientMocked = mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          content: [
            {
              type: 'paragraph',
              text: 'Post excerpt'
            }
          ],
          title: [
            {
              type: 'heading',
              text: 'My New Post'
            }
          ]
        },
        thumbnail: {
          dimensions: {
            width: 100,
            height: 100
          },
          alt: 'My thumbnail',
          copyright: 'copyrighted',
          url: 'thumbnail/path'
        },
        last_publication_date: '2021-09-10'
      })
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            thumbnail: {},
            content: '<p>Post excerpt</p>',
            updatedAt: '9/10/2021'
          }
        }
      })
    )
  })
})
