// script.js
// เพิ่มการจัดการการเลือกข้อความในตาราง
document.addEventListener('DOMContentLoaded', function() {
    const dataTable = document.getElementById('data-table');
    if (dataTable) {
        // เพิ่มการจัดการการเลือกข้อความ
        dataTable.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'TD') {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(e.target);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        // ป้องกันการเลือกข้อความถูกยกเลิกเมื่อลากเมาส์
        dataTable.addEventListener('selectstart', function(e) {
            if (e.target.tagName === 'TD') {
                e.preventDefault();
            }
        });

        // อนุญาตให้เลือกข้อความได้หลายเซลล์
        dataTable.addEventListener('mousemove', function(e) {
            if (e.buttons === 1 && e.target.tagName === 'TD') {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.setEndAfter(e.target);
                }
            }
        });
    }
});

// โค้ดสำหรับกราฟ
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