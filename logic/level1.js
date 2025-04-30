document.addEventListener('DOMContentLoaded', () => {
    // Game constants
    const TOTAL_BUDGET = 1000;
    const MINIMUM_VALUES = {
        rent: 300,
        groceries: 200,
        transport: 100,
        savings: 100
    };

    // Get DOM elements
    const sliders = ['rent', 'groceries', 'transport', 'savings'];
    const elements = {};
    
    sliders.forEach(id => {
        elements[id] = {
            slider: document.getElementById(id),
            value: document.getElementById(`${id}Value`),
            tooltip: document.getElementById(`${id}ValueTooltip`)
        };
    });

    const remainingElement = document.getElementById('remaining');
    const messageElement = document.getElementById('message');
    const submitButton = document.getElementById('submit-budget');

    function updateValues() {
        // Fixed calculation: properly calculate total by adding all slider values
        let total = 0;
        sliders.forEach(id => {
            // Ensure we're working with numbers by using parseInt with radix
            const value = parseInt(elements[id].slider.value, 10);
            elements[id].value.textContent = value;
            elements[id].tooltip.textContent = value;
            total += value;
        });
        
        const remaining = TOTAL_BUDGET - total;
        remainingElement.textContent = remaining;

        // Update UI feedback
        if (remaining < 0) {
            remainingElement.style.color = '#ff0000';
            messageElement.textContent = 'Over budget!';
            messageElement.style.color = '#ff0000';
        } else if (remaining > 0) {
            remainingElement.style.color = '#ffff00';
            messageElement.textContent = `$${remaining} left to budget`;
            messageElement.style.color = '#ffff00';
        } else {
            remainingElement.style.color = '#00ff00';
            messageElement.textContent = 'Ready to submit!';
            messageElement.style.color = '#00ff00';
        }

        // Check minimum requirements
        let allMinimumsMet = true;
        for (const [category, minimum] of Object.entries(MINIMUM_VALUES)) {
            const value = parseInt(elements[category].slider.value, 10);
            if (value < minimum) {
                messageElement.textContent = `${category} needs at least $${minimum}`;
                messageElement.style.color = '#ff0000';
                allMinimumsMet = false;
                break;
            }
        }

        // Enable or disable submit button based on validation
        submitButton.disabled = (remaining !== 0 || !allMinimumsMet);
    }

    // Add event listeners
    sliders.forEach(id => {
        elements[id].slider.addEventListener('input', updateValues);
    });

    // Handle budget submission
    submitButton.addEventListener('click', () => {
        const values = {};
        let total = 0;
        
        sliders.forEach(id => {
            // Fixed calculation: ensure proper number conversion
            values[id] = parseInt(elements[id].slider.value, 10);
            total += values[id];
        });

        // Fixed calculation: use the correctly calculated total
        // Check if total budget is correct
        if (total !== TOTAL_BUDGET) {
            window.location.href = 'FS/fail1.html';
            return;
        }

        // Check minimum requirements
        for (const [category, minimum] of Object.entries(MINIMUM_VALUES)) {
            if (values[category] < minimum) {
                window.location.href = 'FS/fail1.html';
                return;
            }
        }

        // Success case
        window.location.href = 'FS/success1.html';
    });

    // Initialize values on page load
    updateValues();
});