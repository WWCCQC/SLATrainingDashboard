// script.js
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar', // ประเภทกราฟ (bar, line, pie ฯลฯ)
    data: {
        labels: ['Project A', 'Project B', 'Project C', 'Project D'],
        datasets: [{
            label: 'Progress (%)',
            data: [80, 65, 90, 70],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Google Sheets API key
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
const SHEET_ID = '1hsaIWrQmhwGJkR5IlCvCKoR2RTyC3jWhRoyEXqWZQs8';
const SHEET_NAME = 'แดชบอร์ดอบรมช่างใหม่';

// Construct the URL to fetch data
const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Extract rows from the response
        const rows = data.values;

        // Filter and display the required columns (D, G, H, AH, AI, AJ, AK, AL)
        const filteredData = rows.map(row => ({
            D: row[3],  // Column D
            G: row[6],  // Column G
            H: row[7],  // Column H
            AH: row[33], // Column AH
            AI: row[34], // Column AI
            AJ: row[35], // Column AJ
            AK: row[36], // Column AK
            AL: row[37]  // Column AL
        }));

        console.log(filteredData);

        // Example: Render data to the page (customize as needed)
        const container = document.createElement('div');
        filteredData.forEach(item => {
            const row = document.createElement('p');
            row.textContent = JSON.stringify(item);
            container.appendChild(row);
        });
        document.body.appendChild(container);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function to fetch and display data
fetchData();