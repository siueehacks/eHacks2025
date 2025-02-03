
function goToPage(path) {
    window.location.pathname = path;
}

function showError(message) {
    const errorPopup = document.getElementById('error-popup');
    const errorText = document.getElementById('error-popup-text');
    errorPopup.style.display = "flex";
    errorText.innerHTML = message;
    setTimeout(() => {
        errorPopup.style.display = "none";
        errorText.innerHTML = "";
    }, 5000);
}
let currentSlide = 0;
const slideImages = ['../Media/ehacks2024-1.jpg', '../Media/ehacks2024-2.jpg', '../Media/ehacks2024-3.jpg', '../Media/ehacks2024-4.jpg', '../Media/ehacks2024-5.jpg', '../Media/ehacks2024-6.jpg', '../Media/ehacks2024-7.jpg',]
function changeImage(direction) {
    const oldDot = document.getElementById(`about-gallery-dot-${currentSlide}`);
    if (direction > 0) {
        currentSlide = (currentSlide === slideImages.length - 1) ? 0 : currentSlide + 1;
    } else {
        currentSlide = (currentSlide === 0) ? slideImages.length - 1 : currentSlide - 1;
    }
    const newDot = document.getElementById(`about-gallery-dot-${currentSlide}`);
    const banner = document.getElementById('about-gallery-content');
    const blur = document.getElementById('about-gallery-blur');
    banner.src = slideImages[currentSlide];
    blur.src = slideImages[currentSlide];
    oldDot.className = "about-gallery-dot";
    newDot.className = "about-gallery-dot-selected";
}


async function downloadResume(userId, fileName) {
    const { apiURL } = await (await fetch('/JS/config.json')).json();
    // window.location.href = `${apiURL}/admin/resume/${userId}`;
    const pdfLink = `${apiURL}/admin/resume/${userId}`
    function downloadPDFFromBlob(blob, filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob); // Create a Blob URL
        link.download = filename; // Set the desired filename
        link.style.display = 'none'; // Hide the link
        document.body.appendChild(link); // Append the link to the body
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the DOM by removing the link
    }

    // Fetching a PDF from a URL and downloading it as a Blob
    fetch(pdfLink, { method: "GET", credentials: 'include' })
        .then(response => response.blob()) // Get the PDF as a Blob
        .then(blob => downloadPDFFromBlob(blob, fileName))
        .catch(error => console.error('Error downloading document:', error));
}

async function downloadAttendees(fileType) {
    const { apiURL } = await (await fetch('/JS/config.json')).json();
    const attendeeReq = await fetch(`${apiURL}/admin/attendees`, {
        method: "GET",
        credentials: 'include'
    });
    const attendeeRes = await attendeeReq.json();
    if (!attendeeRes.success) {
        alert(attendeeRes.reason);
        return;
    }
    const attendees = attendeeRes.attendees;
    if (fileType === "csv") {
        const fileName = `eHacks2025_Attendees.csv`
        function escapeCSV(value) {
            if (typeof value === 'string') {
                // Escape double quotes and wrap in quotes if necessary
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value; // Leave other types as is
        }

        // Function to export table to CSV
        async function exportToCSV(outputFile) {
            try {
                if (rows.length === 0) {
                    console.log('No data found in the table.');
                    return;
                }

                // Extract column names
                const headers = Object.keys(rows[0]).join(',') + '\n';

                // Convert rows to CSV format with proper escaping
                const csvData = rows.map(row =>
                    Object.values(row).map(escapeCSV).join(',')
                ).join('\n');

                // Write to file
                fs.writeFileSync(outputFile, headers + csvData);
                console.log(`CSV file saved as ${outputFile}`);

                await connection.end();
            } catch (error) {
                console.error('Error exporting to CSV:', error.message);
            }
        }

        // Example usage
        const tableName = 'your_table';
        const outputFile = path.join(__dirname, `${tableName}.csv`);

        exportToCSV(tableName, outputFile);
    } else {
        const fileName = `eHacks2025_Attendees.pdf`

    }
    // window.location.href = `${apiURL}/admin/resume/${userId}`;
    function downloadPDFFromBlob(blob, filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob); // Create a Blob URL
        link.download = filename; // Set the desired filename
        link.style.display = 'none'; // Hide the link
        document.body.appendChild(link); // Append the link to the body
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the DOM by removing the link
    }

    // Fetching a PDF from a URL and downloading it as a Blob
    fetch(pdfLink, { method: "GET", credentials: 'include' })
        .then(response => response.blob()) // Get the PDF as a Blob
        .then(blob => downloadPDFFromBlob(blob, fileName))
        .catch(error => console.error('Error downloading document:', error));
}