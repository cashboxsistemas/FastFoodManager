import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function SalesChart() {
  const data = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Vendas (R$)',
        data: [850, 920, 1100, 980, 1200, 1400, 1247],
        borderColor: 'hsl(207, 90%, 54%)',
        backgroundColor: 'hsla(207, 90%, 54%, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'R$ ' + value;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '200px' }}>
      <Line data={data} options={options} />
    </div>
  );
}

export function TopProductsChart({ data }: { data?: Array<{ product: any; total_sold: number; revenue: number }> }) {
  const chartData = {
    labels: data?.map(item => item.product.name) || ['X-Burger', 'Refrigerante', 'Batata Frita', 'Água', 'X-Salada'],
    datasets: [
      {
        label: 'Vendidos',
        data: data?.map(item => item.total_sold) || [25, 18, 15, 12, 8],
        backgroundColor: 'hsl(159, 70%, 40%)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: '200px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function PaymentMethodsChart({ data }: { data?: Record<string, number> }) {
  const paymentData = data || { card: 45, cash: 30, pix: 25 };
  
  const chartData = {
    labels: ['Cartão', 'Dinheiro', 'PIX'],
    datasets: [
      {
        data: [paymentData.card || 0, paymentData.cash || 0, paymentData.pix || 0],
        backgroundColor: [
          'hsl(207, 90%, 54%)',
          'hsl(159, 70%, 40%)',
          'hsl(35, 85%, 52%)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div style={{ height: '200px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export function CategoryPerformanceChart() {
  const data = {
    labels: ['Lanches', 'Bebidas', 'Acompanhamentos'],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: [
          'hsl(207, 90%, 54%)',
          'hsl(159, 70%, 40%)',
          'hsl(35, 85%, 52%)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div style={{ height: '200px' }}>
      <Pie data={data} options={options} />
    </div>
  );
}

export function CashFlowChart() {
  const data = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Entradas',
        data: [850, 920, 1100, 980, 1200, 1400, 1247],
        borderColor: 'hsl(159, 70%, 40%)',
        backgroundColor: 'hsla(159, 70%, 40%, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Saídas',
        data: [320, 280, 350, 300, 280, 320, 320],
        borderColor: 'hsl(0, 84%, 60%)',
        backgroundColor: 'hsla(0, 84%, 60%, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'R$ ' + value;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '200px' }}>
      <Line data={data} options={options} />
    </div>
  );
}
