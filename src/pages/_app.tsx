import { Provider as NextAuthProvider } from 'next-auth/client'

import { Header } from '../components/Header'
import '../styles/global.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}
