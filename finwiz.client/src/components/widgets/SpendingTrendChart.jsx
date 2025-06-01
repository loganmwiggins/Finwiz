import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js

function hexToRgba(hex, alpha = 0.2) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) =>
        r + r + g + g + b + b
    );

    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function SpendingTrendChart({ accounts = null, statements = null, timePeriod = "all", colorHex = "#4CAF50" }) {
    const filterLabelsByTimePeriod = (labels) => {
        const now = new Date();

        if (timePeriod === "past6") {
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
            return labels.filter(label => new Date(label) >= sixMonthsAgo);
        }

        if (timePeriod === "past12") {
            const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
            return labels.filter(label => new Date(label) >= twelveMonthsAgo);
        }

        if (!isNaN(timePeriod)) {
            return labels.filter(label => {
                const date = new Date(label);
                return date.getFullYear().toString() === timePeriod;
            });
        }

        return labels;
    };

    const processChartData = () => {
        const monthlyTotals = {};
        const datasets = [];
        let labels = [];

        if (accounts && Array.isArray(accounts)) {
            const accountDataMap = {};

            accounts.forEach((account) => {
                const accountId = account.id;
                accountDataMap[accountId] = {};

                account.statements?.forEach(statement => {
                    const date = new Date(statement.statementEnd);
                    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

                    if (!monthlyTotals[monthYear]) monthlyTotals[monthYear] = 0;
                    monthlyTotals[monthYear] += statement.amount;

                    if (!accountDataMap[accountId][monthYear]) accountDataMap[accountId][monthYear] = 0;
                    accountDataMap[accountId][monthYear] += statement.amount;
                });
            });

            labels = filterLabelsByTimePeriod(Object.keys(monthlyTotals).sort((a, b) => new Date(a) - new Date(b)));

            datasets.push({
                label: 'All Accounts',
                data: labels.map(label => monthlyTotals[label] || 0),
                borderColor: '#1fa846',
                backgroundColor: 'rgba(31, 168, 70, 0.2)',
                fill: true,
                tension: 0.1,
                hidden: false
            });

            accounts.forEach((account) => {
                const acctColor = account.colorHex || '#2196F3';
                datasets.push({
                    label: `${account.provider} ${account.name}`,
                    data: labels.map(label => accountDataMap[account.id]?.[label] || 0),
                    borderColor: acctColor,
                    backgroundColor: hexToRgba(acctColor, 0.2),
                    fill: false,
                    tension: 0.1,
                    hidden: true
                });
            });
        } 
        
        else if (statements && Array.isArray(statements)) {
            statements.forEach(statement => {
                const date = new Date(statement.statementEnd);
                const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

                if (!monthlyTotals[monthYear]) monthlyTotals[monthYear] = 0;
                monthlyTotals[monthYear] += statement.amount;
            });

            labels = filterLabelsByTimePeriod(Object.keys(monthlyTotals).sort((a, b) => new Date(a) - new Date(b)));

            datasets.push({
                label: 'Spending',
                data: labels.map(label => monthlyTotals[label] || 0),
                borderColor: colorHex,
                backgroundColor: hexToRgba(colorHex, 0.2),
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