// utils/MenuEnum.ts
import * as icons from '@coreui/icons';

export enum MenuEnum {
    cadastro_agencias = 'cadastro_agencias',
    cadastro_unidades = 'cadastro_unidades',
    cadastro_vendedores = 'cadastro_vendedores',
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
                label: "Unidades",
                icon: "cilBuilding", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_unidades);
                }
            },
            {
                label: "Agências",
                icon: "cilBuilding", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_agencias);
                }
            },
            {
                label: "Vendedores",
                icon: "cilUser", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_vendedores);
                }
            }
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
