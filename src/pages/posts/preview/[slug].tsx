import { useSession } from 'next-auth/client'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'

import { RichText } from 'prismic-dom'

import { getPrismicClient } from '../../../services/prismic'
import styles from '../styles.module.scss'
import Link from 'next/link'

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
  excerpt: string
  updatedAt: string
}

type PostPreviewProps = {
  post: Post
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession()
  const router = useRouter()

  useEffect(() => {
    // @ts-ignore
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session, router, post.slug])

  return (
    <>
      <Head>
        <title>{post.title} | IG News</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <header>
            <h1>{post.title}</h1>
            <time>{post.updatedAt}</time>
          </header>
          {/* 
          <Image
            src={post.thumbnail.url}
            width={post.thumbnail.dimensions.width}
            height={post.thumbnail.dimensions.height}
            alt={post.thumbnail.alt}
            objectFit="cover"
          /> */}

          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<PostPreviewProps> = async ctx => {
  const { params } = ctx

  const slug = String(params.slug)

  const prismic = getPrismicClient()

  const { data, last_publication_date } = await prismic.getByUID(
    'post',
    String(slug),
    {}
  )

  const content = data.content.splice(0, 3)

  const post = {
    slug,
    thumbnail: {
      ...data.thumbnail
    },
    title: RichText.asText(data.title),
    excerpt: RichText.asText(content),
    content: RichText.asHtml(content),
    updatedAt: new Date(last_publication_date).toLocaleDateString('en-UK', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    }
  }
}
