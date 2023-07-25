/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../pages/home'
import { getStaticProps } from '../../pages/home'

import { useRouter } from 'next/router'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// mocks useRouter to be able to use component' router.asPath
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

//
jest.mock('../../lib/cms', () => ({
  fetchContent: () => {
    return {}
  },
}))

describe('Home page', () => {
  const content = {
    header: 'header',
    paragraph: 'paragraph',
  }

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      pathname: '/',
      asPath: '/',
    }))
  })

  it('should render the page', () => {
    render(<Home locale="en" content={content} />)
    const heading = screen.getByRole('heading')
    expect(heading).toBeInTheDocument()
  })

  it('Test getStaticProps', async () => {
    const props = await getStaticProps({ locale: 'en' })

    expect(props).toEqual({
      props: {
        content: {},
        langToggleLink: '/fr/home',
        locale: 'en',
        meta: {
          data_en: {
            desc: 'English',
            author: 'Service Canada',
            keywords: '',
            title: 'Next Template - Home',
          },
          data_fr: {
            author: 'Service Canada',
            desc: 'Français',
            keywords: '',
            title: 'Next Template - Accueil',
          },
        },
      },
    })
  })

  it('is meets a11y', async () => {
    const { container } = render(<Home locale="en" content={content} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
