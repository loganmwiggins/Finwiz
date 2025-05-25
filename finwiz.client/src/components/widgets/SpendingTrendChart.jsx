import { Line } from 'react-chartjs-2';

const colorPalette = [
    '#2196F3', // Blue
    '#FF9800', // Orange
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#00BCD4', // Cyan
    '#4CAF50', // Green
    '#F44336', // Red
    '#3F51B5', // Indigo
    '#FFC107', // Amber
    '#795548'  // Brown
];

function SpendingTrendChart({ accounts = null, statements = null }) {
    const processChartData = () => {
        const monthlyTotals = {};
        const datasets = [];
        let labels = [];

        if (accounts && Array.isArray(accounts)) {
            // Multi-account mode
            const accountDataMap = {};

            accounts.forEach((account, index) => {
                const accountId = account.id;
                accountDataMap[accountId] = {};

                account.statements?.forEach(statement => {
                    const date = new Date(statement.statementEnd);
                    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

                    // Total across all
                    if (!monthlyTotals[monthYear]) monthlyTotals[monthYear] = 0;
                    monthlyTotals[monthYear] += statement.amount;

                    // Per-account
                    if (!accountDataMap[accountId][monthYear]) accountDataMap[accountId][monthYear] = 0;
                    accountDataMap[accountId][monthYear] += statement.amount;
                });
            });

            labels = Object.keys(monthlyTotals).sort((a, b) => new Date(a) - new Date(b));

            datasets.push({
                label: 'All Accounts',
                data: labels.map(label => monthlyTotals[label] || 0),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true,
                tension: 0.1,
                hidden: false // visible by default
            });

            accounts.forEach((account, index) => {
                const color = colorPalette[index % colorPalette.length];
                datasets.push({
                    label: `${account.provider} ${account.name}`,
                    data: labels.map(label => accountDataMap[account.id]?.[label] || 0),
                    borderColor: color,
                    backgroundColor: `${color}33`, // light transparent fill
                    fill: false,
                    tension: 0.1,
                    hidden: true // hidden by default
                });
            });
        } 
        
        else if (statements && Array.isArray(statements)) {
            // Single account mode
            statements.forEach(statement => {
                const date = new Date(statement.statementEnd);
                const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

                if (!monthlyTotals[monthYear]) monthlyTotals[monthYear] = 0;
                monthlyTotals[monthYear] += statement.amount;
            });

            labels = Object.keys(monthlyTotals).sort((a, b) => new Date(a) - new Date(b));

            datasets.push({
                label: 'Spending',
                data: labels.map(label => monthlyTotals[label] || 0),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true,
                tension: 0.1
            });
        }

        return { labels, datasets };
    };

    const data = processChartData();

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
    };

    return <Line data={data} options={options} />;
}

export default SpendingTrendChart;