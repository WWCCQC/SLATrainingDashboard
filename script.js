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

    // โค้ดสำหรับกราฟ
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
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
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'left',
                    onClick: function(e, legendItem, legend) {
                        const index = legendItem.datasetIndex;
                        const ci = legend.chart;
                        const meta = ci.getDatasetMeta(index);
                        
                        // ถ้ากดปุ่ม Ctrl/Cmd
                        if (e.ctrlKey || e.metaKey) {
                            meta.hidden = !meta.hidden;
                        } else {
                            // ซ่อน/แสดงเฉพาะรายการที่เลือก
                            ci.data.datasets.forEach(function(dataset, i) {
                                const meta = ci.getDatasetMeta(i);
                                meta.hidden = i !== index;
                            });
                        }
                        
                        // อัพเดทตารางตาม Legend ที่เลือก
                        const selectedStatus = ci.data.datasets[index].label;
                        const filteredRows = filteredData2025.filter(row => {
                            if (e.ctrlKey || e.metaKey) {
                                // ถ้าเลือกหลายรายการ
                                return !meta.hidden ? row.c[34]?.v === selectedStatus : true;
                            } else {
                                // ถ้าเลือกรายการเดียว
                                return i === index ? row.c[34]?.v === selectedStatus : false;
                            }
                        });
                        
                        // อัพเดทตารางข้อมูล
                        window.tableData = filteredRows.map(row => ({
                            area: row.c[26]?.v || '',
                            roundDate: row.c[27]?.v || '',
                            trainingMonth: row.c[28]?.v || '',
                            week: row.c[39]?.v || '',
                            name: row.c[3]?.v || '',
                            company: row.c[6]?.v || '',
                            agentCode: row.c[7]?.v || '',
                            province: row.c[8]?.v || '',
                            workStatus: row.c[13]?.v || '',
                            registerResult: row.c[33]?.v || '',
                            latestStatus: row.c[34]?.v || '',
                            startDate: row.c[35]?.v || '',
                            endDate: row.c[36]?.v || '',
                            sla: row.c[37]?.v || '',
                            year: row.c[41]?.v || ''
                        }));
                        
                        renderTableData(window.tableData);
                        ci.update();
                        updateTotal();
                    }
                }
            },
            onClick: function(e) {
                // คลิกพื้นที่ว่างเพื่อรีเซ็ต
                if (e.target === this.chart) {
                    this.data.datasets.forEach(function(dataset, i) {
                        const meta = this.getDatasetMeta(i);
                        meta.hidden = false;
                    }, this);
                    this.update();
                    updateTotal();
                    // อัพเดทตารางให้แสดงข้อมูลทั้งหมด
                    updateTables(filteredData2025);
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // ฟังก์ชันคำนวณและอัพเดทผลรวม
    function updateTotal() {
        const visibleData = myChart.data.datasets.reduce((sum, dataset, i) => {
            if (!myChart.getDatasetMeta(i).hidden) {
                return sum + dataset.data.reduce((a, b) => a + b, 0);
            }
            return sum;
        }, 0);
        
        document.getElementById('totalValue').textContent = `Total: ${visibleData}`;
    }

    // คำนวณผลรวมครั้งแรก
    updateTotal();

    function initializeLegendHandlers() {
        const legendItems = document.querySelectorAll('.legend-item');
        const datasets = myChart.data.datasets;
        let selectedItems = new Set(); // เก็บรายการที่ถูกเลือก
        
        // เพิ่ม event listener สำหรับคลิกพื้นที่ว่าง
        document.addEventListener('click', (event) => {
            // ตรวจสอบว่าคลิกที่ legend-item หรือไม่
            const clickedLegend = event.target.closest('.legend-item');
            const clickedChart = event.target.closest('canvas');
            
            // ถ้าไม่ได้คลิกที่ legend-item และไม่ได้คลิกที่กราฟ ให้แสดงทุกรายการ
            if (!clickedLegend && !clickedChart) {
                selectedItems.clear();
                legendItems.forEach((item, i) => {
                    item.classList.remove('selected');
                    datasets[i].hidden = false;
                });
                myChart.update();
                updateTotal();
                // อัพเดทตารางให้แสดงข้อมูลทั้งหมด
                updateTables(filteredData2025);
            }
        });

        // จัดการการคลิกที่ Legend items
        legendItems.forEach((item, index) => {
            item.addEventListener('click', (event) => {
                event.stopPropagation();
                
                if (event.ctrlKey || event.metaKey) {
                    // ถ้ากด Ctrl/Cmd + คลิก เพื่อเลือกหลายรายการ
                    if (selectedItems.has(index)) {
                        selectedItems.delete(index);
                        item.classList.remove('selected');
                    } else {
                        selectedItems.add(index);
                        item.classList.add('selected');
                    }
                } else {
                    // คลิกปกติ เลือกเฉพาะรายการเดียว
                    selectedItems.clear();
                    selectedItems.add(index);
                    legendItems.forEach((otherItem, i) => {
                        if (i === index) {
                            otherItem.classList.add('selected');
                        } else {
                            otherItem.classList.remove('selected');
                        }
                    });
                }

                // อัพเดทการแสดงผลกราฟ
                datasets.forEach((dataset, i) => {
                    if (selectedItems.size === 0) {
                        // ถ้าไม่มีรายการที่ถูกเลือก แสดงทุกรายการ
                        dataset.hidden = false;
                    } else {
                        // ซ่อนรายการที่ไม่ได้เลือก
                        dataset.hidden = !selectedItems.has(i);
                    }
                });

                myChart.update();
                updateTotal();

                // อัพเดทตารางตาม Legend ที่เลือก
                const selectedStatuses = Array.from(selectedItems).map(i => datasets[i].label);
                const filteredRows = filteredData2025.filter(row => {
                    if (selectedItems.size === 0) {
                        return true; // แสดงข้อมูลทั้งหมด
                    } else {
                        return selectedStatuses.includes(row.c[34]?.v);
                    }
                });
                
                // อัพเดทตารางข้อมูล
                window.tableData = filteredRows.map(row => ({
                    area: row.c[26]?.v || '',
                    roundDate: row.c[27]?.v || '',
                    trainingMonth: row.c[28]?.v || '',
                    week: row.c[39]?.v || '',
                    name: row.c[3]?.v || '',
                    company: row.c[6]?.v || '',
                    agentCode: row.c[7]?.v || '',
                    province: row.c[8]?.v || '',
                    workStatus: row.c[13]?.v || '',
                    registerResult: row.c[33]?.v || '',
                    latestStatus: row.c[34]?.v || '',
                    startDate: row.c[35]?.v || '',
                    endDate: row.c[36]?.v || '',
                    sla: row.c[37]?.v || '',
                    year: row.c[41]?.v || ''
                }));
                
                renderTableData(window.tableData);
            });
        });
    }
});