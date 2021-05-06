import { getSession } from 'next-auth/client'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Head from 'next/head'

import { RichText } from 'prismic-dom'

import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'

type PostThumbnail = {
  dimensions: {
    width: number
    height: number
  }
  alt: string
  copyright: string | null
  url: string
}

type Post = {
  slug: string
  thumbnail: PostThumbnail
  title: string
  content: string
  updatedAt: string
}

type PostProps = {
  post: Post
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | IG News</title>
      </Head>

      <main className={styles.main}>
        <article className={styles.post}>
          <header>
            <h1>{post.title}</h1>
            <time>{post.updatedAt}</time>
          </header>

          {/* {post.thumbnail && (
            <Image
              src={post.thumbnail.url}
              width={post.thumbnail.dimensions.width}
              height={post.thumbnail.dimensions.height}
              alt={post.thumbnail.alt}
              objectFit="cover"
            />
          )} */}

          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PostProps> = async ctx => {
  const { req, params } = ctx

  const session = await getSession({ req })
  const slug = String(params.slug)

  // @ts-ignore
  if (!session.activeSubscription) {
    // alert("You don't have an active subscription")
    return {
      redirect: {
        destination: '/posts',
        permanent: false
      }
    }
  }

  const prismic = getPrismicClient(req)

  const { data, last_publication_date } = await prismic.getByUID(
    'post',
    String(slug),
    {}
  )

  const post = {
    slug,
    thumbnail: {
      ...data.thumbnail
    },
    title: RichText.asText(data.title),
    content: RichText.asHtml(data.content),
    updatedAt: new Date(last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    }
  }
}
