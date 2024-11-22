// utils/MenuEnum.ts
import * as icons from '@coreui/icons';

export enum MenuEnum {
    cadastro_agencias = 'cadastro_agencias',
    cadastro_unidades = 'cadastro_unidades',
    cadastro_vendedores = 'cadastro_vendedores',
    cadastro_aeroporto ='cadastro_aeroporto',
    cadastro_AreaComercial = 'cadastro_AreaComercial',
    cadastro_departamento = 'cadastro_departamento',
    cadastro_assinatura = 'cadastro_assinatura',
    cadastro_classe = 'cadastro_classe',
    cadastro_acomodacao = 'cadastro_acomodacao',
    cadastro_situacaoturistico = "cadastro_situacaoturistico",
    cadastro_servicoturistico = "cadastro_servicoturistico",
    cadastro_regime = 'cadastro_regime',
    cadastro_padrao = 'cadastro_padrao',
    cadastro_paises = 'cadastro_paises',
    cadastro_companhia = 'cadastro_companhia',
    cadastro_cidade = 'cadastro_cidade',
    cadastro_cep = 'cadastro_cep',
    cadastro_moeda = 'cadastro_moeda',
    lancamento_opcao = 'lancamento_opcao',
    financeiro_opcao = 'financeiro_opcao',
    gerencial_faturamento_unidades = 'gerencial_faturamento_unidades',
    gerencial_faturamento_comercial = 'gerencial_faturamento_comercial',
    gerencial_faturamento_vendedor = 'gerencial_faturamento_vendedor',
    relatorios_simplicados_vendas = 'relatorios_simplicados_vendas',
    usuario = 'usuario',
    logout = 'logout',
    perfil = "perfil",
    default = '',
}

export interface MenuItem {
    label: string;
    icon?: keyof typeof icons;
    requiredPermissions?: string[];
    command?: () => void;
    items?: MenuItem[];
    key?: MenuEnum;
}

export const menuItems: (onMenuItemClick: (itemKey: MenuEnum) => void) => MenuItem[] = (onMenuItemClick) => [

    {
        label: 'Cadastro',
        icon: 'cilPenAlt', // Ajuste o nome do ícone conforme sua escolha
        requiredPermissions: ['Can view area comercial'],
        items: [
            {
                label: "Aeroporto",
                icon: "cilFlightTakeoff",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_aeroporto);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Agências",
                icon: "cilBriefcase",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_agencias);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Área Comercial",
                icon: "cilBuilding",
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_AreaComercial)
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }   
            },
            {
                label: "Assinatura",
                icon: "cilPen",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_assinatura);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Cep",
                icon: "cilEnvelopeLetter",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_cep);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Cidades",
                icon: "cilHouse",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_cidade);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Classe",
                icon: "cilSchool",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_classe);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Companhia",
                icon: "cilIndustry",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_companhia);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Departamento",
                icon: "cilIndustry",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_departamento);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Moeda",
                icon: "cilDollar",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_moeda);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Países",
                icon: "cilGlobeAlt",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_paises);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Situação Turistico",
                icon: "cilSchool", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_situacaoturistico);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Serviço Turistico",
                icon: "cilSchool", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_servicoturistico);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Tipo Acomodação",
                icon: "cilSchool",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_acomodacao);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Tipo Padrão",
                icon: "cilSchool",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_padrao);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Tipo Regime",
                icon: "cilSchool",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_regime);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Unidades",
                icon: "cilBuilding",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_unidades);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Vendedores",
                icon: "cilUser",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_vendedores);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
        ]
    },
    {
        label: 'Lançamentos',
        icon: 'cilCalendar', // Ajuste o nome do ícone conforme sua escolha
        requiredPermissions: ['Can view area comercial'],
        items: [
            {
                label: 'Opção',
                icon: 'cilPencil', // Ajuste o nome do ícone conforme sua escolha
                command: () => { onMenuItemClick(MenuEnum.lancamento_opcao); }
            }
        ]
    },
    {
        label: 'Financeiro',
        icon: 'cilWallet', // Ajuste o nome do ícone conforme sua escolha
        requiredPermissions: ['Can view area comercial'],
        items: [
            {
                label: 'Opção',
                icon: 'cilPencil', // Ajuste o nome do ícone conforme sua escolha
                command: () => { onMenuItemClick(MenuEnum.financeiro_opcao); }
            }
        ]
    },
    {
        label: 'Gerencial',
        icon: 'cilCalendar', // Ajuste o nome do ícone conforme sua escolha
        requiredPermissions: ['Can view area comercial'],
        items: [
            {
                label: 'Faturamento Unidade',
                icon: 'cilPencil', // Ajuste o nome do ícone conforme sua escolha
                command: () => { onMenuItemClick(MenuEnum.gerencial_faturamento_unidades); }
            },
            {
                label: 'Faturamento Comercial',
                icon: 'cilPencil', // Ajuste o nome do ícone conforme sua escolha
                command: () => { onMenuItemClick(MenuEnum.gerencial_faturamento_comercial); }
            },
            {
                label: 'Faturamento Vendedor',
                icon: 'cilPencil', // Ajuste o nome do ícone conforme sua escolha
                command: () => { onMenuItemClick(MenuEnum.gerencial_faturamento_vendedor); }
            }
        ]
    },
    {
        label: 'Relatórios',
        icon: 'cilBook', // Ajuste o nome do ícone conforme sua escolha
        items: [
            {
                label: 'Simplificado de vendas',
                icon: 'cilClipboard', // Ajuste o nome do ícone conforme sua escolha
                command: () => { onMenuItemClick(MenuEnum.relatorios_simplicados_vendas); }
            }
        ]
    },
];
