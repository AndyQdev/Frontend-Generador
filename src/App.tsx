import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { ThemeProvider } from './context/themeContext'
import { AuthProvider } from './context/authContext'
import Loading from './components/shared/loading'
import { store } from './redux/store'
import Routes from './routes'
import { ComponentProvider } from './context/ComponentContext'
import './styles/index.css'

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ComponentProvider>
          <ThemeProvider>
            <SWRConfig value={{ revalidateOnFocus: false }}>
              <Suspense fallback={
                <div className='grid place-content-center place-items-center min-h-screen text-action'>
                  <Loading />
                </div>
              }>
                <BrowserRouter>
                  <Routes />
                </BrowserRouter>
              </Suspense>
            </SWRConfig>
          </ThemeProvider>
        </ComponentProvider>
      </AuthProvider>
    </Provider>
  )
}

export default App
