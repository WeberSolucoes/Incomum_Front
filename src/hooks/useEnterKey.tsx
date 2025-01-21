import { useEffect } from 'react';

const useEnterKey = (callback: () => void, isActive: boolean = true, buttonRef: React.RefObject<HTMLButtonElement>) => {
    useEffect(() => {
        if (!isActive) return; // Não adiciona o listener se não estiver ativo

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Evita comportamentos padrão, se necessário
                if (buttonRef.current) {
                    buttonRef.current.click(); // Simula o clique no botão "Consultar"
                } else {
                    callback(); // Caso o botão não exista, chama o callback
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [callback, isActive, buttonRef]);
};

export default useEnterKey;

