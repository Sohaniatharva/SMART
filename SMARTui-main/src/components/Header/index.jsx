import './index.css'
import UBSLogo from '../Images/ubsLogo.svg'

const Header = () => {
    return (
        <div className="appHeader">
            <div><img className="ubsLogo" src={UBSLogo} /></div>
            <div >
                <div className="appName">SMART</div>
                <div className="appFullName">SWIFT Management & Automated Regulatory Tool</div>
            </div>
        </div>
    )
}

export default Header