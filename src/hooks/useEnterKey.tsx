import { useEffect } from 'react';

const useEnterKey = (callback: () => void, isActive: boolean = true, buttonRef?: React.RefObject<HTMLButtonElement>) => {
    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !event.repeat) {
                event.preventDefault();
                if (buttonRef?.current) {
                    buttonRef.current.click();
                } else {
                    callback();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [callback, isActive]); // Removemos buttonRef das dependências
};

export default useEnterKey;

