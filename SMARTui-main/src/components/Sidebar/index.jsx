import './index.css'
import { useNavigate } from 'react-router-dom'

const Sidebar = () =>{
    const navigate = useNavigate();

    return(
        <div className="appSideBar">
            <div className="menu">
                <button className="menuItem" onClick={()=>navigate('/swift')}>SWIFT Compliance {'>'}</button>
            </div>
        </div>
    )
}

export default Sidebar