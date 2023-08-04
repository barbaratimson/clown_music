import { BrowserRouter, Route, Routes } from "react-router-dom"
import Main from "./components/Main"
import Auth from "./components/Auth"
import Registration from "./components/Registration"
import About from "./components/About"

const Router = () => {
    
    return <BrowserRouter>
        <Routes>
            {/* <Route element={<About/>} path = '/' /> */}
            <Route element={<Main/>} path = '/listen' />
            <Route element={<Auth/>} path = '/login' />
            <Route element={<Registration/>} path = '/register' />
            <Route path = '*' element = {<div>Страница не найдена</div>} />
        </Routes>
    </BrowserRouter>
}

export default Router