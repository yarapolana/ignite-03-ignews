import Head from 'next/head'
import { GetStaticProps } from 'next'
import { getPrismicClient } from '../../services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import styles from './styles.module.scss'
import Link from 'next/link'

interface Post {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | IG News</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.posts}>
          {(!posts || posts.length <= 0) && <h1>No posts to display</h1>}
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </section>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100
    }
  )

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find(content => content.type === 'paragraph')?.text ??
        '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'en-UK',
        {
          day: '2-digit',
          month: 'numeric',
          year: 'numeric'
        }
      )
    }
  })

  return {
    props: {
      posts
    },
    revalidate: 60 * 60 // 1 hour
  }
}
