import React, { ReactNode, useState } from "react";
import BarraDeFerramentas from "../common/BarraDeFerramentas";


interface FormLayoutProps {
    children: ReactNode[];
}
const FormLayout: React.FC<FormLayoutProps> = ({ children }) => {
    const [view, setView] = useState<'list' | 'create'>('list');
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
        <div className="card p-4">
            <BarraDeFerramentas onCreateClick={handleCreateClick} onSearch={handleSearch} onSearchClick={handleSearchClick} />
            {renderChildren}
        </div>
    )
}



export default FormLayout