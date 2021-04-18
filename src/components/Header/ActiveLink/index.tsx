import { FC } from 'react'
import { useRouter } from 'next/router'
import Link, { LinkProps } from 'next/link'
import styles from '../styles.module.scss'

export const ActiveLink: FC<LinkProps> = ({ children, ...rest }) => {
  const { asPath } = useRouter()

  const isActive = asPath === rest.href

  return (
    <Link {...rest}>
      <a className={isActive ? styles.active : undefined}>{children}</a>
    </Link>
  )
}
