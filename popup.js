let extractedData = null; // Store the extracted data globally

// Function to extract data from the active tab
document.getElementById('extract').addEventListener('click', async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Send a message to the content script
  chrome.tabs.sendMessage(tab.id, { command: 'extractData' }, (response) => {
    if (response) {
      extractedData = response; // Store the extracted data
      document.getElementById('output').textContent = JSON.stringify(response, null, 2); // Display JSON in a readable format
    //   alert('Data extracted successfully! You can now copy it to the clipboard.');
    } else {
      document.getElementById('output').textContent = 'Failed to extract data.';
    }
  });
});

// Function to copy data to the clipboard in JSON format
document.getElementById('copy').addEventListener('click', () => {
  if (extractedData) {
    const jsonString = JSON.stringify(extractedData, null, 2); // Format data as pretty JSON
    navigator.clipboard.writeText(jsonString).then(() => {
    //   alert('Data copied to clipboard in JSON format!');
    }).catch((err) => {
      console.error('Failed to copy JSON to clipboard:', err);
    });
  } else {
    alert('No data to copy. Please extract data first.');
  }
});
