import  { useEffect, useState } from 'react';
import { drawBloodPressureChart } from '../components/BloodPressureChart';

const Dashboard = () => {
  const [, setPatients] = useState([]);

   // Fetch patient data from the API
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Function to update the patient list in the plain HTML
  const updatePatientListInHTML = (patients) => {
    const patientListElement = document.getElementById('patient-list');
    if (!patientListElement) return;

    // Clear existing content
    patientListElement.innerHTML = '';

    // If no patients, show a message
    if (!Array.isArray(patients) || patients.length === 0) {
      patientListElement.innerHTML = '<li>No patients data available</li>';
      return;
    }

    // Loop through each patient and create list items
    patients.forEach((patient) => {
      const { name, gender, age, profile_picture } = patient;

      // Create list item
      const listItem = document.createElement('li');
      listItem.className = 'patient';
      listItem.style.cursor = 'pointer';

      // Add click event to display the blood pressure chart for the selected patient
      listItem.addEventListener('click', () => {
        renderPatientProfileInSidebar(patient);// for  patient right side profile
        renderBloodPressureChartInHTML(patient);// For Blood Pressure chart
        renderDiagnosisListInTable(patient); // For diagnosis history
        renderLabResultsInSidebar(patient); // For lab results
      });

      // Create image
      const img = document.createElement('img');
      img.src = profile_picture;
      img.alt = `Profile picture of ${name}`;
      img.className = 'patient-photo';
      

      // Create info div
      const infoDiv = document.createElement('div');
      infoDiv.className = 'patient-info';

      // Create name span
      const nameSpan = document.createElement('span');
      nameSpan.className = 'patient-name';
      nameSpan.textContent = name;

      // Create details span
      const detailsSpan = document.createElement('span');
      detailsSpan.className = 'patient-details';
      detailsSpan.textContent = `${gender}, ${age}`;
      
      // Create a button for future actions
        const buttonWrapper = document.createElement('div');
      buttonWrapper.className = 'patient-action-btn';

      // Create button element
      const buttonElement = document.createElement('button');
      buttonElement.className = 'action-button';
      
      // Create button image
      const actionButtonImage = document.createElement('img');
      actionButtonImage.src = 'Assets/button_image.jpg';
      actionButtonImage.alt = 'Action Button';

      // Append image to button
      buttonElement.appendChild(actionButtonImage);
      buttonWrapper.appendChild(buttonElement);


      // For now, the button does nothing when clicked
      actionButtonImage.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents list item click
        console.log(`Button clicked for patient: ${name}`);
      });

      // Append elements
      infoDiv.appendChild(nameSpan);
      infoDiv.appendChild(detailsSpan);
      listItem.appendChild(img);
      listItem.appendChild(infoDiv);
      listItem.appendChild(actionButtonImage);
      listItem.appendChild(buttonWrapper); 

      // Append list item to the HTML patient list
      patientListElement.appendChild(listItem);
    });
  };
    const fetchPatients = async () => {
      const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev/patients';
      const username = process.env.REACT_APP_API_USERNAME;
      const password = process.env.REACT_APP_API_PASSWORD;

      const headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(`${username}:${password}`));

      try {
        const response = await fetch(apiUrl, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        const patientArray = Array.isArray(data) ? data : [];
        setPatients(patientArray);  
        updatePatientListInHTML(patientArray);
        if (patientArray.length > 0) {
          const firstPatient = patientArray[0];
          renderPatientProfileInSidebar(firstPatient);
          renderBloodPressureChartInHTML(firstPatient);
          renderDiagnosisListInTable(firstPatient);
          renderLabResultsInSidebar(firstPatient);
        }
      } catch (error) {
        console.error('Error:', error);
        setPatients([]);
        updatePatientListInHTML([]);
      }
    };

    fetchPatients();
  }, []);

  
  // Function to update the patient profile in the sidebar
  const renderPatientProfileInSidebar = (patient) => {
    const { name, date_of_birth , gender, phone_number, emergency_contact, insurance_type, profile_picture } = patient;

    // Update Profile Sidebar with the selected patient's details
    document.getElementById('profile-name').textContent = name;
    document.getElementById('dob').textContent = date_of_birth || 'N/A';
    document.getElementById('gender').textContent = gender || 'N/A';
    document.getElementById('contact-info').textContent = phone_number || 'N/A';
    document.getElementById('emergency-contact').textContent = emergency_contact || 'N/A';
    document.getElementById('insurance-provider').textContent = insurance_type || 'N/A';

    // Update profile picture (if available)
    const profilePictureElement = document.getElementById('profile-picture');
    profilePictureElement.src = profile_picture || 'Assets/default-profile.jpg';
  };
  const renderLabResultsInSidebar = (patient) => {
    console.log('Rendering lab results for patient:', patient.name);

    const labResultsListElement = document.getElementById('lab-results-ul');
    if (!labResultsListElement) return;

    // Clear existing list items
    labResultsListElement.innerHTML = '';

    // Extract lab results from the patient data
    const { lab_results = [] } = patient;

    // Check if there are lab results available
    if (lab_results.length === 0) {
        // Display a message if no lab results are available
        const noDataListItem = document.createElement('li');
        noDataListItem.textContent = 'No lab results available';
        labResultsListElement.appendChild(noDataListItem);
        return;
    }

    // Loop through each lab result and create list items with download buttons
    lab_results.forEach((testName) => {
        // Create list item
        const listItem = document.createElement('li');
        listItem.textContent = testName || 'N/A';

        // Create download button
        const downloadButton = document.createElement('button');
        downloadButton.className = 'download-btn';

        // Create image for download button using local project image
        const downloadImg = document.createElement('img');
        downloadImg.src = 'Assets/download_button.jpg'; // Use your local project image path
        downloadImg.alt = 'Download';

        // Append image to the button
        downloadButton.appendChild(downloadImg);

        

        // Append the button to the list item
        listItem.appendChild(downloadButton);

        // Append the list item to the lab results list
        labResultsListElement.appendChild(listItem);
    });
};

  const renderDiagnosisListInTable = (patient) => {
    console.log('Diagnosis Data:', patient.diagnostic_list);

    const diagnosisTableBody = document.querySelector('.diagnostic-list table tbody');
    if (!diagnosisTableBody) return;

    // Clear existing table rows
    diagnosisTableBody.innerHTML = '';

    // Check if the patient has a diagnosis history
    const { diagnostic_list = [] } = patient;

    if (diagnostic_list.length === 0) {
        // Display a message if no diagnosis history is available
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = `<td colspan="3">No diagnosis history available</td>`;
        diagnosisTableBody.appendChild(noDataRow);
        return;
    }

    // Populate the diagnosis history in the table
    diagnostic_list.forEach((diagnosis) => {
        const { name, description, status } = diagnosis;

        // Create a table row for each diagnosis entry
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${name || 'N/A'}</td>
            <td>${description || 'N/A'}</td>
            <td>${status || 'N/A'}</td>
        `;

        // Append the row to the table body
        diagnosisTableBody.appendChild(tableRow);
    });
};


  const renderBloodPressureChartInHTML = (patient) => {
    const { name, diagnosis_history } = patient;
  
    // Update chart title
    const chartTitle = document.getElementById('chart-title');
    if (chartTitle) {
      chartTitle.textContent = `Blood Pressure Chart for ${name}`;
    }
  
    // Check for diagnosis history and sort it by date
    const sortedDiagnosisHistory = diagnosis_history?.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (!sortedDiagnosisHistory || sortedDiagnosisHistory.length === 0) {
      console.error('No diagnosis data available');
      return;
    }
  
    // Arrays to store systolic, diastolic values and labels
    const systolicData = [];
    const diastolicData = [];
    const labels = [];

    // Date range filter: October 2023 to March 2024
    const startDate = new Date('2023-10-01'); // October 1, 2023
    const endDate = new Date('2024-03-31'); // March 31, 2024
     
    let latestSystolic = null;
    let latestDiastolic = null;

    // Loop through diagnosis history and extract data for each month
    sortedDiagnosisHistory.forEach((diagnosis) => {
      const { blood_pressure, heart_rate, temperature, respiratory_rate, month, year } = diagnosis;
  
      const diagnosisDate = new Date(`${month} 1, ${year}`);

    // Filter data based on the date range (October 2023 to March 2024)
    if (diagnosisDate >= startDate && diagnosisDate <= endDate) {
      const systolic = blood_pressure?.systolic?.value || 'N/A';
      const diastolic = blood_pressure?.diastolic?.value || 'N/A';

      // Update the latest systolic and diastolic values (only if they are defined)
      if (systolic !== 'N/A' && diastolic !== 'N/A') {
        latestSystolic = systolic;
        latestDiastolic = diastolic;
      }
  
      if (month && year) {
        // Format month/year into a label (e.g., "Oct 2023")
        const label = `${month} ${year}`;
        labels.push(label);
        systolicData.push(systolic);
        diastolicData.push(diastolic);
      }
  
      // If you want to update heart rate, temperature, or respiratory rate values (optional)
      if (heart_rate && temperature && respiratory_rate) {
        // Optional: you can add logic here to update heart rate, temperature, and respiratory rate if needed
        const heartRate = heart_rate?.value || 'N/A';
        const temperatureValue = temperature?.value || 'N/A';
        const respiratoryRate = respiratory_rate?.value || 'N/A';
  
        // Example update for HTML elements (if you want to display the latest values)
        const heartRateElement = document.getElementById('heart-rate-value');
        if (heartRateElement) heartRateElement.textContent = `${heartRate} bpm`;
  
        const temperatureElement = document.getElementById('temperature-value');
        if (temperatureElement) temperatureElement.textContent = `${temperatureValue} °F`;
  
        const respiratoryElement = document.getElementById('respiratory-rate-value');
        if (respiratoryElement) respiratoryElement.textContent = `${respiratoryRate} bpm`;
  
        if (heart_rate && temperature && respiratory_rate) {
          const heartRate = heart_rate?.value || 'N/A';
          const temperatureValue = temperature?.value || 'N/A';
          const respiratoryRate = respiratory_rate?.value || 'N/A';
  
          // Update heart rate, temperature, and respiratory rate status
          const heartRateElement = document.getElementById('heart-rate-value');
          if (heartRateElement) heartRateElement.textContent = `${heartRate} bpm`;
  
          const temperatureElement = document.getElementById('temperature-value');
          if (temperatureElement) temperatureElement.textContent = `${temperatureValue} °F`;
  
          const respiratoryElement = document.getElementById('respiratory-rate-value');
          if (respiratoryElement) respiratoryElement.textContent = `${respiratoryRate} bpm`;
  
          // Update Heart Rate Status with safety check
          const heartRateStatusElement = document.getElementById('heart-rate-status');
          if (heartRateStatusElement) {
            if (heart_rate?.value < 60) {
              heartRateStatusElement.textContent = 'Lower than Average';
            } else if (heart_rate?.value > 100) {
              heartRateStatusElement.textContent = 'Higher than Average';
            } else {
              heartRateStatusElement.textContent = 'Normal';
            }
          }
  
          // Update Temperature Status with safety check
          const temperatureStatusElement = document.getElementById('temperature-status');
          if (temperatureStatusElement) {
            if (temperature?.value < 95) {
              temperatureStatusElement.textContent = 'Lower';
            } else if (temperature?.value > 99) {
              temperatureStatusElement.textContent = 'Higher';
            } else {
              temperatureStatusElement.textContent = 'Normal';
            }
          }
  
          // Update Respiratory Rate Status with safety check
          const respiratoryStatusElement = document.getElementById('respiratory-rate-status');
          if (respiratoryStatusElement) {
            if (respiratory_rate?.value < 12) {
              respiratoryStatusElement.textContent = 'Lower';
            } else if (respiratory_rate?.value > 20) {
              respiratoryStatusElement.textContent = 'Higher';
            } else {
              respiratoryStatusElement.textContent = 'Normal';
            }
          }
        }
      }
    }
    });
    // If latest systolic and diastolic values are available, update the display
    if (latestSystolic !== null && latestDiastolic !== null) {
      const latestSystolicElement = document.getElementById('latest-systolic');
      const latestDiastolicElement = document.getElementById('latest-diastolic');
  
      if (latestSystolicElement) latestSystolicElement.textContent = latestSystolic;
      if (latestDiastolicElement) latestDiastolicElement.textContent = latestDiastolic;
  } else {
      console.warn('Latest blood pressure data not available');
  }
  
    // Drawing the blood pressure chart
    drawBloodPressureChart(
      systolicData,  // Systolic data
      diastolicData, // Diastolic data
      labels         // Labels with month/year
    );
  };

  return null;
};

export default Dashboard;
