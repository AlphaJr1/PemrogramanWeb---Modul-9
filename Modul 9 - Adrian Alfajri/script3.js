document.getElementById('generate-pdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const salesData = [150, 123, 180, 240, 350, 210, 190];
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const dailyRevenue = salesData.map(sales => sales * 1000);

    function drawBarChart(doc, x, y, width, height, data, labels) {
        const maxData = Math.max(...data);
        const barWidth = width / data.length;

        const yAxisStep = maxData / 5;
        for (let i = 0; i <= 5; i++) {
            const yPos = y + height - (height * (i / 5));
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            doc.text((yAxisStep * i).toFixed(0), x - 5, yPos, { align: 'right' });
            doc.setDrawColor(200, 200, 200);
            doc.line(x, yPos, x + width, yPos);
        }

        for (let i = 0; i < data.length; i++) {
            const barHeight = (data[i] / maxData) * height;
            doc.setFillColor(255, 182, 193);
            doc.rect(x + i * barWidth, y + height - barHeight, barWidth - 5, barHeight, 'F');
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            doc.text(labels[i], x + i * barWidth + (barWidth - 5) / 2, y + height + 5, { align: 'center' });
        }
    }

    doc.setFontSize(14);
    const title = "Data Penjualan Produk Selama Satu Minggu";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2;
    doc.text(title, textX, 10);
    drawBarChart(doc, 30, 20, 160, 80, salesData, days);

    const tableData = days.map((day, index) => [day, salesData[index], dailyRevenue[index]]);

    doc.autoTable({
        head: [['Hari', 'Produk Terjual', 'Pendapatan']],
        body: tableData,
        startY: 110,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 3,
            halign: 'center',
            fillColor: [255, 182, 193]
        },
        headStyles: {
            fillColor: [255, 105, 180],
            textColor: [255, 255, 255],
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        },
        tableLineColor: [200, 200, 200],
        tableLineWidth: 0.1
    });

    doc.output('dataurlnewwindow');

    displayTableHTML(tableData);
});

function displayTableHTML(tableData) {
    const tableContainer = document.getElementById('table-container');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headers = ['Hari', 'Produk Terjual', 'Pendapatan'];
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.textAlign = 'center';
        th.style.backgroundColor = '#f2f2f2';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    tableData.forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            cell.style.border = '1px solid #ddd';
            cell.style.padding = '8px';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

// Menampilkan grafik batang di halaman HTML menggunakan Chart.js
const salesData = [150, 123, 180, 240, 350, 210, 190];
const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const ctx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: days,
        datasets: [{
            label: 'Penjualan Produk',
            data: salesData,
            backgroundColor: 'rgba(255, 105, 180, 0.2)',
            borderColor: 'rgba(255, 105, 180, 1)',
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
