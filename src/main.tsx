import {createRoot} from 'react-dom/client'
import './index.css'
import {Provider} from 'react-redux'
import {AppHttpRequests} from './app/AppHttpRequests.tsx'
import {store} from './app/store.ts'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <AppHttpRequests/>
    </Provider>
)
