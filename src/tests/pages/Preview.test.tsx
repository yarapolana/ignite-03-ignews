import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import Preview, { getStaticProps } from '../../pages/posts/preview/[slug]'
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
  excerpt: 'Post excerpt',
  content: '<p>Post excerpt</p>',
  updatedAt: '09/10/2021'
}

jest.mock('../../services/prismic')
jest.mock('next-auth/client')
jest.mock('next/router')

describe('Preview', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<Preview post={post} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post if user has active subscription', async () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: 'fake-active-subscription'
      },
      false
    ] as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<Preview post={post} />)

    expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

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

    const response = await getStaticProps({
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
            excerpt: 'Post excerpt',
            content: '<p>Post excerpt</p>',
            updatedAt: '9/10/2021'
          }
        }
      })
    )
  })
})
