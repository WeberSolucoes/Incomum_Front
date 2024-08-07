import Relatorio from '../components/specific/Relatorio';
import '../assets/styles/pages/Relatorio.css';
import SidebarMenu from '../components/layout/SidebarMenu';
import '../assets/styles/base/App.css';


const RelatorioPage: React.FC = () => {
    return (
        <div>
            <div className="p-col-fixed" style={{ width: '250px' }}>
                <SidebarMenu onMenuItemClick={function (): void {
                    throw new Error('Function not implemented.');
                }} />
            </div>
            <div className="main-content">
                <Relatorio />
            </div>
        </div >
    )
}

export default RelatorioPage