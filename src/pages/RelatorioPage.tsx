import Relatorio  from '../components/specific/Relatorio';
import '../assets/styles/pages/Relatorio.css';
import SidebarMenu from '../components/layout/SidebarMenu';
import '../assets/styles/base/App.css';


const RelatorioPage: React.FC = () => {
    return (
        <div>
            <SidebarMenu onMenuItemClick={function (itemKey: string): void {
                throw new Error('Function not implemented.');
            } }/>
            <Relatorio/>
        </div>
    )
}

export default RelatorioPage