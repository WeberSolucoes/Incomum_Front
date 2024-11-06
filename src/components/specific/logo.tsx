import React, { useEffect, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useCodigo } from '../../contexts/CodigoProvider';


interface ImageUploadProps {
    agenciaId: number | null; // Recebe o ID da agência como prop
}

const ImageUpload: React.FC<ImageUploadProps> = ({ agenciaId }) => {
    const { codigo } = useCodigo(); // Ajuste conforme a origem do código
    const toast = useRef<any>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (agenciaId) {
            // Buscar a imagem atual da agência
            axios.get(`http://18.118.35.25:8443/api/incomum/agencia/${codigo}/imagem`)
                .then(response => {
                    setCurrentImageUrl(response.data.age_imagem); // Ajuste conforme o nome do campo no backend
                })
                .catch(() => {
                    toast.current.show({ severity: 'warn', summary: 'Imagem não encontrada', detail: 'Nenhuma imagem atual para esta agência.' });
                });
        }
    }, [agenciaId]);

    const onTemplateUpload = (e: any) => {
        toast.current.show({ severity: 'success', summary: 'Upload realizado', detail: e.files.length + ' arquivo(s) enviado(s)' });
        // Atualizar a imagem após o upload
        if (agenciaId) {
            axios.get(`http://18.118.35.25:8443/api/incomum/agencia/${codigo}/imagem`)
                .then(response => setCurrentImageUrl(response.data.age_imagem));
        }
    };

    const onTemplateSelect = (e: any) => {
        if (e.files.length > 1) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Você pode selecionar apenas uma imagem.' });
            return;
        }
        toast.current.show({ severity: 'info', summary: 'Arquivo selecionado', detail: e.files[0].name });
    };

    const invalidFileSizeMessageSummary = "Tamanho de arquivo inválido";
    const invalidFileSizeMessageDetail = "O arquivo excede o tamanho máximo permitido de 1MB.";

    const onTemplateError = (e: any) => {
        toast.current.show({ severity: 'error', summary: 'Erro no upload', detail: e.files[0].name + ' não foi enviado.' });
    };

    const chooseOptions = { 
        label: 'Selecionar Arquivos', 
        icon: 'pi pi-fw pi-images', 
        style: { 
            backgroundColor: '#0152a1',
            height: '34px',
            paddingTop: '0.3rem',
            border: 'none'
        } 
    };

    const uploadOptions = { 
        label: 'Salvar', 
        icon: 'pi pi-upload', 
        style: { 
            backgroundColor: '#0152a1',
            height: '34px',
            paddingTop: '0.3rem',
            border: 'none'
        } 
    };

    const cancelOptions = { 
        label: 'Cancelar', 
        icon: 'pi pi-times', 
        style: { 
            backgroundColor: '#0152a1',
            height: '34px',
            paddingTop: '0.3rem',
            border: 'none'
        } 
    };

    return (
        <div>
            <Toast ref={toast}></Toast>
            {currentImageUrl && (
                <div style={{ marginBottom: '1rem' }}>
                    <h4>Imagem Atual</h4>
                    <img src={currentImageUrl} alt="Imagem da Agência" style={{ width: '100%', maxWidth: '300px', borderRadius: '10px' }} />
                </div>
            )}
            <FileUpload
                name="age_imagem"
                url={`http://18.118.35.25:8443/api/incomum/agencia/upload/${codigo}/`}
                accept="image/*"
                maxFileSize={1000000}
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
                invalidFileSizeMessageSummary={invalidFileSizeMessageSummary}
                invalidFileSizeMessageDetail={invalidFileSizeMessageDetail}
                onError={onTemplateError}
                multiple={false}
            />
        </div>
    );
};

export default ImageUpload;
