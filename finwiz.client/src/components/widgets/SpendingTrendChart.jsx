import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function SpendingTrendChart({ statements }) {
    const processSpendingTrend = () => {
        if (!statements || statements.length === 0) {
            return { labels: [], datasets: [] };
        }

        const monthlyTotals = {};
        statements.forEach(statement => {
            const date = new Date(statement.statementEnd);
            const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

            if (!monthlyTotals[monthYear]) monthlyTotals[monthYear] = 0;
            monthlyTotals[monthYear] += statement.amount;
        });

        const labels = Object.keys(monthlyTotals).sort(
            (a, b) => new Date(a) - new Date(b)
        );
        const dataValues = labels.map(label => monthlyTotals[label]);

        return {
            labels,
            datasets: [
                {
                    label: 'Spending',
                    data: dataValues,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    fill: true,
                    tension: 0.1,
                },
            ],
        };
    };

    return <Line data={processSpendingTrend()} />;
}

export default SpendingTrendChart;