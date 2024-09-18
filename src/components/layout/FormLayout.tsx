import React, { ReactNode, useState } from "react";
import BarraDeFerramentas from "../common/BarraDeFerramentas";
import { useCodigo } from "../../contexts/CodigoProvider";


interface FormLayoutProps {
    children: ReactNode[];
    name: string;
}
const FormLayout: React.FC<FormLayoutProps> = ({ children, name }) => {
    const {view, setView} = useCodigo();
    const [search, setSearch] = useState<string>(''); // Estado para controlar a exibição

    const handleCreateClick = () => {
        setView('create');
    };

    const handleSearchClick = () => {
        setView('list');
    };
    const handleSearch = (term: string) => {
        setSearch(term);
    }
    const renderChildren =
        React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
                // Assumimos que o primeiro filho é para a lista e o segundo é para criar
                if (view === 'list' && index === 0) {
                    return React.cloneElement(child as React.ReactElement<any>, { search });
                } else if (view === 'create' && index === 1) {
                    return child;
                }
            }
            return null;
        })


    return (
        <div className="card p-4" style={{width:'1000px',margin:'auto', boxShadow: '10px 10px 100px rgba(0, 0, 0, 0.4),-2px -2px 6px rgba(255, 255, 255, 0.6)'}}>
            <h1 style={{color:"#0152a1"}}>{view === 'list' ? `Lista de ${name}` : `Cadastrar ${name}`}</h1>
            <BarraDeFerramentas onCreateClick={handleCreateClick} onSearch={handleSearch} onSearchClick={handleSearchClick} />
            {renderChildren}
        </div>
    )
}



export default FormLayout