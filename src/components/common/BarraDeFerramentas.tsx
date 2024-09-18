
import React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

interface BarraDeFerramentasProps {
    onCreateClick: () => void;
    onSearch: (term: string) => void;
    onSearchClick: () => void;
}
const BarraDeFerramentas: React.FC<BarraDeFerramentasProps> = ({onCreateClick, onSearch, onSearchClick})=> {
    const endContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" iconPos='right' label='Criar' className="rounded" onClick={onCreateClick} />
        </React.Fragment>
    );

    const centerContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" style={{ position: 'absolute', left: '10px', top: '70%', transform: 'translateY(-50%)' }} />
            <InputText
            style={{ width: '350%', paddingLeft: '2.5rem' }} // Ajuste do paddingLeft para deixar espaço para o ícone
            placeholder="Buscar"
            onChange={(e) => onSearch(e.target.value)}
            onClick={onSearchClick}
            />
        </IconField>
    );  

    return (
            <Toolbar start={centerContent} end={endContent} />
    );
}

export default BarraDeFerramentas;


        