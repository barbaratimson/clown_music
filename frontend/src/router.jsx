import { BrowserRouter, Route, Routes } from "react-router-dom"
import Main from "./components/Main"
import Auth from "./components/Auth"
import Registration from "./components/Registration"
import About from "./components/About"
import store from "./store"
import { Provider } from 'react-redux';
const Router = () => {
    
    return <BrowserRouter>
        <Provider store={store}>
            <Routes>
                {/* <Route element={<About/>} path = '/' /> */}
                <Route element={<Main/>} path = '/*' />
                <Route element={<Auth/>} path = '/login' />
                <Route element={<Registration/>} path = '/register' />
                <Route path = '*' element = {<div>Страница не найдена</div>} />
            </Routes>
        </Provider>
    </BrowserRouter>
}

export default Router