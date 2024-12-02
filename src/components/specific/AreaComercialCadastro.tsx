import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { AreaComercialCreateRequest } from "../../utils/apiObjects";
import { apiDeleteAreaComercial, apiGetAreaComercialById, apiGetAreaComercial, apiPostCreateAreaComercial, apiPutUpdateAreaComercial } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from 'primereact/button';

interface AreaComercialCadastroProps {
    onCodigoUpdate: (codigo: number) => void;
}

const AreaComercialCadastro: React.FC<AreaComercialCadastroProps> = ({onBackClick, onCodigoUpdate}) => {
  const { codigo } = useCodigo();
  const [request, setRequest] = useState<AreaComercialCreateRequest>({} as AreaComercialCreateRequest);
  const [AreaComercial, setAreaComercial] = useState<{ label: string, value: number }[]>([]);
  const [acoSituacao, setAcoSituacao] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        if (codigo === null) return;
        try {
            const response = await apiGetAreaComercialById(codigo);
            const unidade = response.data;
            if (unidade) {
                setRequest(unidade);
                setAcoSituacao(unidade.aco_situacao); // Ajuste aqui
                setChecked(unidade.aco_rateio === 1); // Ajuste para checkbox
            } else {
                console.error("Dados da Área Comercial não encontrados");
                toastError("Área Comercial não encontrada.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            toastError("Erro ao buscar dados da Área Comercial.");
        }
    };
    fetchData();
  }, [codigo]);

  useEffect(() => {
    const fetchAreaComercial = async () => {
        try {
            const response = await apiGetAreaComercial();
            const data = response.data;
            if (Array.isArray(data)) {
                setAreaComercial(data.map((area: { aco_descricao: string; aco_codigo: number }) => ({
                    label: area.aco_descricao,
                    value: area.aco_codigo
                })));
            } else {
                console.error("Dados inesperados para Área Comercial:", data);
                toastError("Erro: dados de Área Comercial em formato inesperado.");
            }
        } catch (error) {
            console.error("Erro ao buscar Área Comercial:", error);
            toastError("Erro ao buscar Área Comercial.");
        }
    };
    fetchAreaComercial();
  }, []);

  const handleAtivoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAcoSituacao(Number(event.target.value)); // Garantindo que seja um número
  };

  const handleDeleteClick = () => {
      if (request.aco_codigo) {
          confirmDialog({
              message: 'Tem certeza de que deseja excluir este cadastro?',
              header: 'Confirmar Exclusão',
              icon: 'pi pi-exclamation-triangle',
              accept: handleConfirmDelete,
              reject: () => console.log('Exclusão cancelada'),
              acceptLabel: 'Sim, desejo excluir',
              rejectLabel: 'Cancelar',
              className: 'custom-confirm-dialog',
          });
      }
  };

  const handleConfirmDelete = async () => {
      if (request.aco_codigo) {
          setLoading(true);
          try {
              await apiDeleteAreaComercial(request.aco_codigo);
              toastSucess('Cadastro excluído com sucesso.');
          } catch (error) {
              console.error('Erro ao excluir o cadastro:', error);
              toastError('Erro ao excluir o cadastro.');
          } finally {
              setLoading(false);
          }
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const updatedRequest = {
            ...request,
            aco_situacao: acoSituacao, // Usando o valor do estado 'acoSituacao'
            aco_codigo: request.aco_codigo || "",
            aco_descricao: request.aco_descricao?.trim() || "",
            aco_rateio: checked ? 1 : 0 // Se estiver marcado, coloca 1, senão 0
        };

        console.log("Dados enviados para atualização:", JSON.stringify(updatedRequest, null, 2));

        let response;
        if (request.aco_codigo) {
            response = await apiPutUpdateAreaComercial(request.aco_codigo, updatedRequest);
        } else {
            response = await apiPostCreateAreaComercial(updatedRequest);
        }

        console.log("Resposta da API:", response.data);

        if (response && (response.status === 200 || response.status === 201)) {
            toastSucess("Área Comercial salva com sucesso");
            if (!updatedRequest.aco_codigo) {
                const novoCodigo = response.data.aco_codigo;
                onCodigoUpdate(novoCodigo);

                setRequest(prevState => ({
                    ...prevState,
                    aco_codigo: novoCodigo // Atualiza o código da área comercial
                }));
            }
        } else {
            toastError("Erro ao salvar a Área Comercial");
        }
    };

  const handleReset = (e: React.FormEvent) => {
      e.preventDefault();
      setRequest({} as AreaComercialCreateRequest);
      setChecked(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRequest(prevState => ({ ...prevState, [id]: value }));
  };

  return (
    <form className="erp-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="aco_codigo">Código</label>
          <input style={{width:'15%'}} disabled type="text" id="aco_codigo" name="aco_codigo" value={request.aco_codigo || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="aco_descricao">Área Comercial</label>
          <input style={{ width: '70%' }} type="text" id="aco_descricao" name="aco_descricao" value={request.aco_descricao || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
            <label style={{marginLeft:'0px'}} htmlFor="aco_situacao">Situação</label>
            <select style={{marginLeft:'0px', width:'25%'}} id="aco_situacao" name="aco_situacao" value={acoSituacao} onChange={handleAtivoChange}>
                <option value={1}>Ativo</option>
                <option value={0}>Inativo</option>
            </select>
        </div>
        <div className="form-group-inline">
            <input 
                type="checkbox"
                style={{ marginLeft: '-600px' }}
                id="aco_rateio"
                name="aco_rateio"
                checked={checked} // Controle de estado para o checkbox
                onChange={() => setChecked(!checked)} // Inverte o valor de 'checked'
            />
            <label style={{ marginLeft: '10px', width: '130px' }} htmlFor="aco_rateio">Habilitar Rateio?</label>
        </div>
      </div>


      <div className="form-row">
           <Button
                label="Voltar"
                icon="pi pi-arrow-left"
                style={{backgroundColor: '#0152a1',width:'100px',height:'34px',marginLeft:'680px',borderRadius:'4px' }}
                onClick={onBackClick} // Chama a função passada como prop
            />
          {/* Condição para renderizar o botão de exclusão */}
          {request.aco_codigo && (
          <Button
            label="Excluir"
            icon="pi pi-trash"
            style={{marginLeft:'0px',color:'white',width:'100px'}}
            type="button"
            className="reset-btn"
            onClick={handleDeleteClick}
          />
        )}
        
        <button
            style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.aco_codigo ? '0px' : '0px',display: request.aco_codigo ? 'none' :''}}
            type="button"
            className="reset-btn"
            onClick={handleReset}
        >
            <i className="fas fa-trash-alt"></i> Limpar
        </button>
        <button style={{width:'100px',height:'34px',padding:'inherit'}} disabled={loading} type="submit" className="submit-btn"><i style={{marginRight:'10px'}}className="fas fa-save"></i>{loading ? 'Salvando...' : 'Salvar'}</button>
        <ConfirmDialog/>
      </div>
    </form>
  );
};

export default AreaComercialCadastro;
