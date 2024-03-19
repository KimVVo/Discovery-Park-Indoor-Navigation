
   function applyColorAdjustments(brightness, contrast, saturate, hue) {
    const body = document.body;
    body.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hue}deg)`;

    // Update background color based on saturation value
    const saturationValue = saturate / 100; // Convert to a value between 0 and 1
    const yellowSaturationThreshold = 150; // You can adjust this threshold based on your preference

    if (saturationValue >= yellowSaturationThreshold / 100) {
        body.style.backgroundColor = 'yellow';
    } else {
        body.style.backgroundColor = ''; // Reset to default background color
    }
}


    function updateSliders() {
        const brightness = document.getElementById('brightnessSlider').value;
        const contrast = document.getElementById('contrastSlider').value;
        const saturate = document.getElementById('saturateSlider').value;
        const hue = document.getElementById('hueSlider').value;

        applyColorAdjustments(brightness, contrast, saturate, hue);

        // Update percentage labels for sliders
        document.getElementById('brightnessLabel').innerText = `${brightness}%`;
        document.getElementById('contrastLabel').innerText = `${contrast}%`;
        document.getElementById('saturateLabel').innerText = `${saturate}%`;
        document.getElementById('hueLabel').innerText = `${hue}%`;
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Create sliders when the DOM content is loaded
        createSliders();

        // Add event listeners to sliders
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.addEventListener('input', updateSliders);
        });
    });


    function saveColorPreferences(brightness, contrast, saturate, hue) {
        // You can add logic here to save user preferences (e.g., in cookies, localStorage, or send to server)
        // For now, let's just log the values to the console
        console.log('Saved preferences:', { brightness, contrast, saturate, hue });
    }

    function createSliders() {
        const adjustmentButtons = document.getElementById('adjustmentButtons');
        adjustmentButtons.innerHTML = ''; // Clear previous buttons

        const adjustments = ['brightness', 'contrast', 'saturate', 'hue'];

        adjustments.forEach(adjustment => {
            const sliderDiv = document.createElement('div');
            sliderDiv.className = 'd-flex align-items-center';

            const label = document.createElement('label');
            label.innerText = `${adjustment.charAt(0).toUpperCase() + adjustment.slice(1)}: `;

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '200'; // Adjust the max value based on your preference
            slider.value = '100'; // Default value
            slider.id = `${adjustment}Slider`; // Unique ID for each slider

            const percentageLabel = document.createElement('span');
            percentageLabel.id = `${adjustment}Label`;
            percentageLabel.innerText = '100%';

            slider.addEventListener('input', () => {
                const percentage = slider.value;
                percentageLabel.innerText = `${percentage}%`;

                const brightness = document.getElementById('brightnessSlider').value;
                const contrast = document.getElementById('contrastSlider').value;
                const saturate = document.getElementById('saturateSlider').value;
                const hue = document.getElementById('hueSlider').value;

                applyColorAdjustments(brightness, contrast, saturate, hue);
            });

            sliderDiv.appendChild(label);
            sliderDiv.appendChild(slider);
            sliderDiv.appendChild(percentageLabel);

            adjustmentButtons.appendChild(sliderDiv);
        });
    }
    function resetPreferences() {
        // Reset sliders to default values
        document.getElementById('brightnessSlider').value = '100';
        document.getElementById('contrastSlider').value = '100';
        document.getElementById('saturateSlider').value = '100';
        document.getElementById('hueSlider').value = '0';

        // Apply default color adjustments
        applyColorAdjustments(100, 100, 100, 100);

        // Update slider labels
        updateSliders();
    }


    function savePreferences() {
        const brightness = document.getElementById('brightnessSlider').value;
        const contrast = document.getElementById('contrastSlider').value;
        const saturate = document.getElementById('saturateSlider').value;
        const hue = document.getElementById('hueSlider').value;

        applyColorAdjustments(brightness, contrast, saturate, hue);
        saveColorPreferences(brightness, contrast, saturate, hue);
    }

    document.getElementById('searchbar').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        var query = document.getElementById('searchInput').value; // Get the search query

        // Get the current map center coordinates
        var center = map.getCenter();

        // unpkg.com/mapbox-gl-indoorequal@latest/ to search for the query around the current map center
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${center.lng},${center.lat}&access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
            // Extract coordinates from the first result
            var coordinates = data.features[0].center;

            // Update the map to center on the coordinates obtained from the Geocoding API
            map.flyTo({center: coordinates, zoom: 19.7}); // You can adjust the zoom level as needed
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    function submitFeedback(event) {
        event.preventDefault();
        const feedbackText = document.getElementById('feedbackText').value;
        const currentDate = new Date().toLocaleString();
        
        // Create a JSON object with the feedback data
        const feedbackData = {
            feedback: feedbackText,
            date: currentDate
        };

        // Send feedback data to the backend server
        fetch('/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        })
        .then(response => {
            if (response.ok) {
                // Provide visual feedback to the user that their feedback has been received
                alert('Thank you for your feedback!');
                // Close the modal after submission
                const modal = document.getElementById('feedbackModal');
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
            } else {
                alert('Failed to submit feedback. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting feedback. Please try again later.');
        });
    }


