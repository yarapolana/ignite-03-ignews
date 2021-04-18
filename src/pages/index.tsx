import { GetStaticProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'
import styles from '../styles/home.module.scss'

interface HomeProps {
  product: {
    id: string
    amount: string
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | IG News</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.hero}>
          <span>👏🏽 Hey, welcome</span>
          <h1>
            News about <br />
            the <span>React</span> world
          </h1>

          <p>
            Get acess to all the publications
            <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton />
        </section>
        <img src="/images/avatar.svg" alt="Woman coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID, {
    expand: ['product'] // if you want more information about the product
  })

  return {
    props: {
      product: {
        id: price.id,
        amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(price.unit_amount / 100)
      }
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}
