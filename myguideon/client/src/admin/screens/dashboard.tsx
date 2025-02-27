import * as React from 'react';
import { Box, Grid, Card, CardContent, Typography, Paper } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

// Données fictives pour les graphiques
const barData = [
  { name: 'Q1', uv: 4000, pv: 2400 },
  { name: 'Q2', uv: 3000, pv: 1398 },
  { name: 'Q3', uv: 2000, pv: 9800 },
  { name: 'Q4', uv: 2780, pv: 3908 },
];

const pieData = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
];

const DashboardScreen: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        
        {/* Carte des ventes */}
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total des Ventes
              </Typography>
              <Typography variant="h4" color="primary">
                $24,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte des profits */}
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profits
              </Typography>
              <Typography variant="h4" color="secondary">
                $8,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte des utilisateurs */}
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Utilisateurs
              </Typography>
              <Typography variant="h4" color="textSecondary">
                500
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Graphique des ventes */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performances des Ventes par Trimestre
            </Typography>
            <BarChart
              series={[
                { data: [35, 44, 24, 34] },
                { data: [51, 6, 49, 30] },
                { data: [15, 25, 30, 50] },
                { data: [60, 50, 15, 25] },
              ]}
              height={290}
              xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </Paper>
        </Grid>

        {/* Graphique des parts de marché */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Parts de Marché
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'Series A' },
                    { id: 1, value: 15, label: 'Series B' },
                    { id: 2, value: 20, label: 'Series C' },
                  ],
                },
              ]}
              width={400}
              height={200}
            />
          </Paper>
        </Grid>

        {/* Liste des meilleurs produits */}
        <Grid item xs={12} sm={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meilleurs Produits
              </Typography>
              <ul>
                <li>Produit A - $500</li>
                <li>Produit B - $450</li>
                <li>Produit C - $300</li>
                <li>Produit D - $200</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>

        {/* Liste des meilleures régions */}
        <Grid item xs={12} sm={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meilleures Régions
              </Typography>
              <ul>
                <li>Région A - $12,000</li>
                <li>Région B - $8,500</li>
                <li>Région C - $4,500</li>
                <li>Région D - $2,500</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default DashboardScreen;
