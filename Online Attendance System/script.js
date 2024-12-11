// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function () {

    const attendanceForm = document.getElementById('attendanceForm');
    const statusSelect = document.getElementById('status');
    const leaveReasonTextarea = document.getElementById('leaveReason');
    const attendanceLogTable = document.getElementById('attendanceLogTable');

    // Function to enable or disable the Leave Reason textarea based on status
    statusSelect.addEventListener('change', function () {
        if (statusSelect.value === 'Leave') {
            leaveReasonTextarea.disabled = false; // Enable the textarea if Leave is selected
        } else {
            leaveReasonTextarea.disabled = true; // Disable the textarea if Present is selected
            leaveReasonTextarea.value = ''; // Clear the value when disabled
        }
    });

    // Function to load the attendance log from localStorage and display it
    function loadAttendanceLog() {
        const attendanceLog = JSON.parse(localStorage.getItem('attendanceLog')) || [];
        
        const tbody = attendanceLogTable.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows

        // Add each entry from the localStorage to the table
        attendanceLog.forEach(entry => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${entry.employeeId}</td>
                <td>${entry.status}</td>
                <td>${entry.status === 'Leave' ? entry.leaveReason : 'N/A'}</td>
            `;
            tbody.appendChild(newRow);
        });
    }

    // Handle the form submission
    attendanceForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Get the form values
        const employeeId = document.getElementById('employeeId').value.trim();
        const status = statusSelect.value;
        const leaveReason = leaveReasonTextarea.value.trim();

        // Validation checks
        if (!employeeId || !status) {
            alert('Please fill in all required fields!');
            return;
        }

        // If status is "Leave", make sure a reason is provided
        if (status === 'Leave' && !leaveReason) {
            alert('Please provide a reason for the leave!');
            return;
        }

        // Create an attendance entry object
        const attendanceEntry = {
            employeeId,
            status,
            leaveReason: status === 'Leave' ? leaveReason : 'N/A'
        };

        // Get existing log from localStorage, or initialize an empty array if no log exists
        const attendanceLog = JSON.parse(localStorage.getItem('attendanceLog')) || [];

        // Add the new entry to the log
        attendanceLog.push(attendanceEntry);

        // Save the updated log back to localStorage
        localStorage.setItem('attendanceLog', JSON.stringify(attendanceLog));

        // Load and display the updated attendance log
        loadAttendanceLog();

        // Clear the form after submission
        attendanceForm.reset();
        leaveReasonTextarea.disabled = true; // Disable the textarea again after submission
    });

    // Optional: Function to delete a row (e.g., for admins to remove an entry)
    attendanceLogTable.addEventListener('click', function (event) {
        if (event.target.tagName === 'TD') {
            const row = event.target.parentElement;
            const employeeId = row.cells[0].textContent; // Get Employee ID of the row to delete

            // Get existing log from localStorage
            let attendanceLog = JSON.parse(localStorage.getItem('attendanceLog')) || [];

            // Find and remove the entry with the same Employee ID
            attendanceLog = attendanceLog.filter(entry => entry.employeeId !== employeeId);

            // Save the updated log back to localStorage
            localStorage.setItem('attendanceLog', JSON.stringify(attendanceLog));

            // Reload the updated log
            loadAttendanceLog();
        }
    });

    // Load the attendance log when the page is loaded
    loadAttendanceLog();

});
