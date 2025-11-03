//pseudo code
//create demo day project
//app is a patient tracker
//track patient progress
//send reminders to patient and show how to do exercises
//start by creating html css and crud api
//used class projects and AI help to make this project



const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active'); 
    });
}

const searchButton = document.getElementById('searchButton');
const patientNameInput = document.getElementById('patientNameInput');
const patientInfoOutput = document.getElementById('patientInfoOutput');

if (searchButton && patientNameInput && patientInfoOutput) {

    async function fetchPatientData() {
        const patientName = patientNameInput.value.trim().toLowerCase();
        
        if (!patientName) {
            patientInfoOutput.innerHTML = `<p style="color: orange;">Please enter a patient's full name.</p>`;
            return;
        }

        const url = `/api/patient/${patientName}`; 

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json(); 
            displayPatientInfo(data);

        } catch (error) {
            console.error("Error fetching patient data:", error);
            patientInfoOutput.innerHTML = `<p style="color: red;">Failed to fetch data or a network error occurred.</p>`;
        }
    }

    function displayPatientInfo(data) {
        patientInfoOutput.innerHTML = ''; 

        const infoCard = document.createElement('div');
        infoCard.classList.add('patient-card');

        if (data.condition === 'Record not found' || data.age === 'N/A') {
            infoCard.innerHTML = `<p><strong>Result:</strong> Patient record not found for the name provided.</p>`;
        } else {
            infoCard.innerHTML = `
                <h4>Patient Details:</h4>
                <p><strong>Age:</strong> ${data.age}</p>
                <p><strong>Condition:</strong> ${data.condition}</p>
                <p><strong>Therapist:</strong> ${data.therapist}</p>
                <p><strong>Last Visit:</strong> ${data.lastVisit}</p>
                <p><strong>Progress:</strong> ${data.progress}</p>
            `;
        }
        
        patientInfoOutput.appendChild(infoCard);
    }

    searchButton.addEventListener('click', fetchPatientData);
}
