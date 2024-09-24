import React from 'react';
import { Card, CardContent, Typography, Grid, Tabs, Tab } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';

// Dados com mais oscilações
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

  return (
    <div style={{ padding: '20px',marginTop:'-60px' }}>
      <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
        <Tab label="Vendas" />
        <Tab label="Lucro" />
        <Tab label="Clientes" />
        <Tab label="Engajamento" />
      </Tabs>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {/* Gráficos Menores */}
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card variant="outlined" style={{ height: '210px' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {metric.label}
                </Typography>
                <Typography variant="h4">{metric.value}</Typography>
                <Typography variant="body2" color="textSecondary">{metric.growth}</Typography>
                <Typography variant="caption" color="textSecondary">{metric.period}</Typography>
                <AreaChart width={240} height={60} data={data}>
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
                  <Area type="monotone" dataKey="uv" stroke="#8884d8" fill={`url(#color${index})`} />
                </AreaChart>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Gráficos Maiores e Card de Metas */}
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card variant="outlined" style={{ height: '300px' }}>
              <CardContent>
                <Typography style={{marginLeft:'60px'}} variant="h6">Gráfico Maior - {metrics[tabValue].label}</Typography>
                <LineChart width={600} height={250} data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip  />
                  {/* Mantendo a grade para o gráfico maior */}
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </CardContent>
            </Card>
          </Grid>

          {/* Card de Metas */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined" style={{ height: '300px' }}>
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
