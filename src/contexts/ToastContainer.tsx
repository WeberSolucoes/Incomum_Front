import React, { useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { setToast } from '../utils/customToast';

const ToastContainer: React.FC = () => {
    const toastRef = React.useRef<Toast>(null);
    useEffect(() => {
        if (toastRef.current) {
            setToast(toastRef.current);
        }
    }, []);

    return <Toast ref={toastRef} />;
};

export default ToastContainer;
