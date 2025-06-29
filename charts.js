// Data Visualization for Agriculture Page
document.addEventListener('DOMContentLoaded', function() {
    // Top Exporting Countries Chart
    const exportCtx = document.getElementById('exportChart').getContext('2d');
    const exportChart = new Chart(exportCtx, {
        type: 'bar',
        data: {
            labels: ['Spain', 'Netherlands', 'Mexico', 'USA', 'Ecuador', 'Costa Rica', 'Chile', 'South Africa', 'Philippines', 'Belgium'],
            datasets: [{
                label: 'Fruit Exports (USD billions)',
                data: [12.3, 10.8, 9.5, 8.7, 7.2, 6.8, 6.5, 5.9, 5.3, 4.8],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(76, 175, 80, 0.7)'
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(76, 175, 80, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'USD billions'
                    }
                }
            }
        }
    });

    // Top Importing Countries Chart
    const importCtx = document.getElementById('importChart').getContext('2d');
    const importChart = new Chart(importCtx, {
        type: 'bar',
        data: {
            labels: ['USA', 'Germany', 'China', 'Netherlands', 'UK', 'France', 'Russia', 'Canada', 'Japan', 'Belgium'],
            datasets: [{
                label: 'Fruit Imports (USD billions)',
                data: [18.2, 12.7, 11.5, 9.8, 8.3, 7.9, 6.4, 5.8, 5.6, 5.1],
                backgroundColor: [
                    'rgba(255, 125, 51, 0.7)',
                    'rgba(255, 125, 51, 0.7)',
                    'rgba(255, 125, 51, 0.7)',
                    'rgba(255, 125, 51, 0.7)',
                    'rgba(255, 125, 51, 0.7)',
                    'rgba(255, 125, 51, 0.7)',
                    'rgba(255, 125, 51, 0.7)',
                    'rgba(255, 125, 51, 0.7)',
                    'rgba(255, 125, 51, 0.7)',
                    'rgba(255, 125, 51, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 125, 51, 1)',
                    'rgba(255, 125, 51, 1)',
                    'rgba(255, 125, 51, 1)',
                    'rgba(255, 125, 51, 1)',
                    'rgba(255, 125, 51, 1)',
                    'rgba(255, 125, 51, 1)',
                    'rgba(255, 125, 51, 1)',
                    'rgba(255, 125, 51, 1)',
                    'rgba(255, 125, 51, 1)',
                    'rgba(255, 125, 51, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'USD billions'
                    }
                }
            }
        }
    });

    // Trade Value Over Time Chart
    const tradeValueCtx = document.getElementById('tradeValueChart').getContext('2d');
    const tradeValueChart = new Chart(tradeValueCtx, {
        type: 'line',
        data: {
            labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022'],
            datasets: [{
                label: 'Global Fruit Trade Value',
                data: [78, 85, 92, 98, 105, 112, 128],
                backgroundColor: 'rgba(63, 81, 181, 0.2)',
                borderColor: 'rgba(63, 81, 181, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'USD billions'
                    }
                }
            }
        }
    });
});