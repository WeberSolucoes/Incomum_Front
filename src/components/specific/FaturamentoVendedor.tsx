import React from 'react';
import { Card, CardContent, Typography, Grid, Tabs, Tab } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { Chart } from 'primereact/chart';

// Dados para os gráficos menores
const data = [
  { name: 'Jan', uv: 4000 },
  { name: 'Feb', uv: 3000 },
  { name: 'Mar', uv: 2000 },
  { name: 'Apr', uv: 2780 },
  { name: 'May', uv: 3900 },
  { name: 'Jun', uv: 1500 },
  { name: 'Jul', uv: 4500 },
  { name: 'Aug', uv: 3500 },
  { name: 'Sep', uv: 2700 },
  { name: 'Oct', uv: 4800 },
  { name: 'Nov', uv: 3000 },
  { name: 'Dec', uv: 6000 },
];

// Dados para o gráfico do PrimeReact
const primeChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Vendas',
        data: [4000, 3000, 2000, 2780, 3900, 1500, 4500, 3500, 2700, 4800, 3000, 6000],
        borderColor: '#e87717', // Cor da linha
        backgroundColor: 'rgba(232, 119, 23, 1)', // Cor de fundo com transparência
        fill: true, // Preenche a área sob a linha
        tension: 0.4,
      },
      {
        label: 'Clientes',
        data: [5000, 2500, 2200, 3700, 2900, 1200, 4200, 3300, 2100, 4600, 3100, 5800],
        borderColor: '#0152a1', // Cor da linha
        backgroundColor: 'rgba(1, 82, 161, 1)', // Cor de fundo com transparência
        fill: true, // Preenche a área sob a linha
        tension: 0.4,
      },
    ],
  };

const Dashboard = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (_event: any, newValue: React.SetStateAction<number>) => {
    setTabValue(newValue);
  };

  const metrics = [
    { label: "Vendas", value: "14k", growth: "+25%", period: "Últimos 30 dias" },
    { label: "Lucro", value: "$12k", growth: "+15%", period: "Últimos 30 dias" },
    { label: "Clientes", value: "8k", growth: "+10%", period: "Últimos 30 dias" },
    { label: "Engajamento", value: "500", growth: "+5%", period: "Últimos 30 dias" },
  ];

  const primeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Mês',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Vendas',
        },
      },
    },
  };

  return (
    <div style={{ padding: '20px', marginTop: '-60px', marginLeft: '320px' }}>
      <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
        <Tab label="Vendas" />
        <Tab label="Lucro" />
        <Tab label="Clientes" />
        <Tab label="Engajamento" />
      </Tabs>

      <Grid container spacing={3} style={{ marginTop: '20px', width: '1120px' }}>
        {/* Gráficos Menores */}
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card variant="outlined" style={{ height: '250px', boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.4), -2px -2px 6px rgba(255, 255, 255, 0.6)' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {metric.label}
                </Typography>
                <Typography variant="h4">{metric.value}</Typography>
                <Typography variant="body2" color="textSecondary">{metric.growth}</Typography>
                <Typography variant="caption" color="textSecondary">{metric.period}</Typography>
                <AreaChart width={230} height={80} data={data}>
                  <defs>
                    <linearGradient id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <CartesianGrid stroke="none" />
                  <Area type="monotone" dataKey="uv" stroke="#0152a1" fill={`url(#color${index})`} />
                </AreaChart>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Gráficos Maiores e Card de Metas */}
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card variant="outlined" style={{ height: '300px', boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.4), -2px -2px 6px rgba(255, 255, 255, 0.6)' }}>
              <CardContent>
                <Typography style={{ marginLeft: '60px' }} variant="h6">
                  Gráfico Maior - {metrics[tabValue].label}
                </Typography>

                {/* Contêiner para o gráfico com width 100% */}
                <div style={{ width: '100%', height: '150%' }}>
                  {/* Gráfico com estilo que forçará 100% de largura */}
                  <Chart
                    type="bar"
                    data={primeChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false, // Permitir que o gráfico preencha o contêiner sem manter proporção
                      scales: {
                        x: { display: true },
                        y: { display: true }
                      }
                    }}
                    style={{ width: '100%', height: '230px' }} // Garantir que o gráfico ocupe 100% do contêiner
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Card de Metas */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined" style={{ height: '300px', boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.4), 0px -2px 6px rgba(255, 255, 255, 0.6)' }}>
              <CardContent>
                <Typography variant="h6">Metas</Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Vendas: $20k
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Lucro: $15k
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Clientes: 10k
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Engajamento: 700
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;

