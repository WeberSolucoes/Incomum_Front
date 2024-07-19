import React from 'react';

const CadastroForm = () =>{
  return (
    <form id="cadastro" className="form-card" method="post" action="/agencia">
      <div className="row justify-content-between text-left">
        <div className="form-group col-sm-2 d-flex flex-column" style={{ marginTop: '14px' }}>
          <label className="form-control-label px-3" style={{ textAlign: 'left' }}>
            <span
              className="text-danger"
              style={{ color: '#0152a1 !important', marginLeft: '-14px', fontWeight: 'bold' }}
              id="codigo"
            >
              Codigo
            </span>
          </label>
          <input
            style={{ color: 'black', width: '110px', height: '36px', marginTop: '0px', backgroundColor: '#f5f5f5' }}
            type="text"
            id="idcodigo"
            name="codigo"
            readOnly
          />
        </div>
        <div className="form-group col-sm-2 d-flex flex-column" style={{ marginTop: '14px', marginLeft: '-30px' }}>
          <label className="form-control-label px-3" style={{ textAlign: 'left', width: '200px', marginLeft: '-96px' }}>
            <span
              className="text-danger"
              style={{ color: '#0152a1 !important', fontWeight: 'bold' }}
              id="codigo"
            >
              Importação
            </span>
          </label>
          <input
            style={{ color: 'black', width: '110px', height: '36px', marginTop: '0px', marginLeft: '-84px' }}
            type="text"
            id="idimportacao"
            name="importacao"
          />
        </div>
        <div className="form-group col-sm-2 d-flex flex-column" style={{ marginTop: '14px', marginLeft: '-30px' }}>
          <label className="form-control-label px-3" style={{ textAlign: 'left', width: '200px', marginLeft: '-186px' }}>
            <span
              className="text-danger"
              style={{ color: '#0152a1 !important', fontWeight: 'bold' }}
              id="codigo"
            >
              Contabil
            </span>
          </label>
          <input
            style={{ lineHeight: 'normal !important', color: 'black', width: '110px', height: '36px', marginTop: '0px', marginLeft: '-170px' }}
            type="text"
            id="contabil"
            name="contabil"
          />
        </div>
        <div className="form-group col-sm-2 d-flex flex-column" style={{ marginTop: '14px', marginLeft: '-30px' }}>
          <span
            className="text-danger"
            style={{ color: '#0152a1 !important', fontSize: '16px', fontWeight: 'bold', marginLeft: '-541px' }}
            id="spansitu"
          >
            Situação
          </span>
          <select
            id="ativo"
            name="situacao"
            style={{ height: '36px', marginTop: '0px', color: 'black', width: '138px', marginLeft: '-256px' }}
            className="form-select"
            aria-label="Default select example"
          >
            <option value="A">ATIVO</option>
            <option value="I">INATIVO</option>
          </select>
        </div>
        <div className="form-group col-sm-6 d-flex flex-column">
          <label className="form-control-label px-3">
            <span className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-174px', fontSize: '16px', fontWeight: 'bold' }}></span>
          </label>
          <button
            className="btn btn-light btn-sm"
            type="button"
            style={{ width: '88px', backgroundColor: '#0152a1 !important', borderColor: '#0152a1', color: 'white !important', marginLeft: '536px', height: '26px', fontSize: '11px !important', fontWeight: 'bold', marginTop: '-55px' }}
            id="tst"
            hx-select="#minha_caixa"
            hx-trigger="click"
            data-toggle="modal"
            data-target="#ModalLongoExemplo"
          >
            Pesquisar
          </button>
        </div>
      </div>
      <div className="row justify-content-between text-left">
        <div className="form-group col-9 d-flex flex-column">
          <label id="labeagen" className="form-control-label px-3" style={{ marginTop: '14px', textAlign: 'left' }}>
            <span className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-14px', fontSize: '16px', fontWeight: 'bold' }} id="agencia">
              Agência Viagem
            </span>
          </label>
          <input
            id="descr"
            name="descr"
            type="text"
            style={{ WebkitAppearance: 'none', MozAppearance: 'textfield', appearance: 'textfield', width: '500px', height: '36px' }}
          />
        </div>
        <div className="form-group col-sm-3 d-flex flex-column">
          <label className="form-control-label px-3" style={{ marginTop: '14px' }}>
            <span className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-158px', fontSize: '16px', fontWeight: 'bold' }} id="spancnpj">
              Cnpj
            </span>
          </label>
          <input
            style={{ color: 'black', height: '36px', width: '180px', marginLeft: '-23px' }}
            type="text"
            id="cnpjinp"
            name="cnpj"
          />
        </div>
      </div>
      <div className="row justify-content-between text-left">
        <div className="form-group col-9 d-flex flex-column">
          <label id="agensite" className="form-control-label px-3" style={{ marginTop: '14px', textAlign: 'left' }}>
            <span id="spanagesite" className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-14px', fontSize: '16px', fontWeight: 'bold' }}>
              Agência Site
            </span>
          </label>
          <input
            style={{ color: 'black', height: '36px', width: '500px' }}
            type="text"
            id="agencia_site"
            name="age_site"
            autoComplete="off"
          />
        </div>
        <div className="form-group col-sm-3 d-flex flex-column">
          <label className="form-control-label px-3" style={{ marginTop: '14px' }}>
            <span className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-48px', fontSize: '16px', fontWeight: 'bold' }} id="insspan">
              Inscrição Municipal
            </span>
          </label>
          <input
            id="inscricao"
            style={{ color: 'black', height: '36px', width: '180px', marginLeft: '-23px' }}
            type="text"
            name="inscricao"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="row justify-content-between text-left">
        <div className="form-group col-9 d-flex flex-column">
          <label id="agensocial" className="form-control-label px-3" style={{ marginTop: '14px', textAlign: 'left' }}>
            <span id="spansocial" className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-14px', fontSize: '16px', fontWeight: 'bold' }}>
              Razão Social
            </span>
          </label>
          <input
            style={{ color: 'black', height: '36px', width: '500px' }}
            type="text"
            id="razaosocial"
            name="razao_social"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="row justify-content-between text-left">
        <div className="form-group col-9 d-flex flex-column">
          <label id="nomefan" className="form-control-label px-3" style={{ marginTop: '14px', textAlign: 'left' }}>
            <span className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-14px', fontSize: '16px', fontWeight: 'bold' }} id="spanfan">
              Nome Fantasia
            </span>
          </label>
          <input
            style={{ color: 'black', height: '36px', width: '500px' }}
            type="text"
            id="nome_fantasia"
            name="nome_fantasia"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="row justify-content-between text-left">
        <div className="form-group col-9 d-flex flex-column">
          <label id="labend" className="form-control-label px-3" style={{ marginTop: '14px', textAlign: 'left' }}>
            <span id="spanend" className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-14px', fontSize: '16px', fontWeight: 'bold' }}>
              Endereço
            </span>
          </label>
          <input
            id="idend"
            style={{ color: 'black', height: '36px', width: '500px' }}
            type="text"
            name="endereco"
            autoComplete="off"
          />
        </div>
        <div className="form-group col-sm-3 d-flex flex-column">
          <label className="form-control-label px-3" style={{ marginTop: '14px' }}>
            <span className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-110px', fontSize: '16px', fontWeight: 'bold' }} id="spancep">
              Cep
            </span>
          </label>
          <input
            id="idcep"
            style={{ color: 'black', height: '36px', width: '180px', marginLeft: '-23px' }}
            type="text"
            name="cep"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="row justify-content-between text-left">
        <div className="form-group col-9 d-flex flex-column">
          <label id="labeltel" className="form-control-label px-3" style={{ marginTop: '14px', textAlign: 'left' }}>
            <span className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-14px', fontSize: '16px', fontWeight: 'bold' }} id="spantel">
              Telefone
            </span>
          </label>
          <input
            id="idtel"
            style={{ color: 'black', height: '36px', width: '500px' }}
            type="text"
            name="telefone"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="row justify-content-between text-left">
        <div className="form-group col-9 d-flex flex-column">
          <label id="labeemail" className="form-control-label px-3" style={{ marginTop: '14px', textAlign: 'left' }}>
            <span id="spanemail" className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-14px', fontSize: '16px', fontWeight: 'bold' }}>
              E-mail
            </span>
          </label>
          <input
            id="email"
            style={{ color: 'black', height: '36px', width: '500px' }}
            type="email"
            name="email"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="row justify-content-between text-left">
        <div className="form-group col-9 d-flex flex-column">
          <label id="labobs" className="form-control-label px-3" style={{ marginTop: '14px', textAlign: 'left' }}>
            <span id="spanobs" className="text-danger" style={{ color: '#0152a1 !important', marginLeft: '-14px', fontSize: '16px', fontWeight: 'bold' }}>
              Observações
            </span>
          </label>
          <input
            id="obs"
            style={{ color: 'black', height: '36px', width: '500px' }}
            type="text"
            name="observacoes"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="row justify-content-end">
        <div className="form-group col-sm-4">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ backgroundColor: '#0152a1 !important', borderColor: '#0152a1', color: 'white !important', width: '100px', height: '40px', fontSize: '16px !important', fontWeight: 'bold' }}
          >
            Enviar
          </button>
        </div>
      </div>
    </form>
  );
};

export default CadastroForm;
