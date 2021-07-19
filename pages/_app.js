import '../styles/global.scss'

function MyApp({ Component, pageProps }) {
  return (
    <div className="m-8">
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
