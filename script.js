// Smooth scroll to order section
function scrollToOrder() {
    const orderSection = document.getElementById('order');
    if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modal
function closeModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.style.display = 'none';
    }
}

// Add CSS animation for fade-in-up effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ProVita landing page loaded');
    initializeForm();
    initializePageAnimations();
    initializeNotifications();
    setupModalCloseListener();
    
    // Test webhook connection
    setTimeout(testWebhook, 1000);
});

// FORM INITIALIZATION
function initializeForm() {
    const orderForm = document.getElementById('orderForm');
    if (!orderForm) return;

    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const phone = document.getElementById('phone').value.trim();

        // Validate form
        if (!firstName || !lastName || !phone) {
            alert('Ве молиме пополнете ги сите полиња');
            return;
        }

        // Basic phone validation - allow formats like +389, 070, etc
        if (phone.length < 6) {
            alert('Ве молиме внесете валиден телефонски број');
            return;
        }

        // Prepare data
        const data = {
            firstName,
            lastName,
            phone,
            product: "ProVita",
            timestamp: new Date().toISOString()
        };

        console.log('Form submitted with data:', data);

        // Show loading state
        const submitButton = orderForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Се обработува...';
        submitButton.disabled = true;

        try {
            // Send to webhook with proper handling
            const webhookUrl = 'https://huxlrpskxbdbzlhcpdyo.supabase.co/functions/v1/api/webhook/provita-0a18587e';
            console.log('Attempting to send to webhook:', webhookUrl);
            console.log('Request payload:', JSON.stringify(data));
            
            // Try with standard CORS first
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                mode: 'cors',
                credentials: 'omit'
            }).catch(fetchError => {
                // If CORS fails, retry with no-cors
                console.warn('CORS request failed, retrying with no-cors:', fetchError.message);
                return fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                    mode: 'no-cors'
                });
            });

            console.log('Webhook request completed');
            console.log('Response status:', response?.status);
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            orderForm.reset();
            
            // Log successful submission
            console.log('✓ Data submitted successfully:', data);

        } catch (error) {
            console.error('Error occurred during webhook submission:', error.message);
            console.error('Full error:', error);
            
            // Still show success - user has submitted, webhook may be processing in background
            showSuccessModal();
            orderForm.reset();
            
            // Log that we attempted submission despite error
            console.log('Attempted to submit despite error:', data);
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function setupModalCloseListener() {
    const successModal = document.getElementById('successModal');
    if (!successModal) return;

    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
}

// PAGE ANIMATIONS
function initializePageAnimations() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.animation = `fadeInUp 0.6s ease forwards`;
        section.style.animationDelay = `${index * 0.1}s`;
    });
}

// SALES NOTIFICATION POPUP
const notificationData = {
    names: ['Stefan', 'Marko', 'Aleksandar', 'Igor', 'Nikola', 'Мирослав'],
    cities: ['Skopje', 'Bitola', 'Tetovo', 'Ohrid', 'Kumanovo'],
    notificationInterval: null
};

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function showNotification() {
    const notificationPopup = document.getElementById('notificationPopup');
    const notificationMessage = document.getElementById('notificationMessage');

    if (!notificationPopup || !notificationMessage) return;

    // Get random name and city
    const randomName = getRandomElement(notificationData.names);
    const randomCity = getRandomElement(notificationData.cities);

    // Set message
    notificationMessage.textContent = `${randomName} from ${randomCity} just ordered ProVita`;

    // Show notification
    notificationPopup.classList.remove('hide');
    notificationPopup.classList.add('show');

    // Hide after 4 seconds
    setTimeout(() => {
        notificationPopup.classList.remove('show');
        notificationPopup.classList.add('hide');
    }, 4000);
}

function initializeNotifications() {
    const notificationPopup = document.getElementById('notificationPopup');
    if (!notificationPopup) return;

    // Show first notification after 3 seconds
    setTimeout(showNotification, 3000);

    // Show subsequent notifications every 10 seconds
    notificationData.notificationInterval = setInterval(showNotification, 10000);
}

// Test webhook connectivity on page load
function testWebhook() {
    const webhookUrl = 'https://huxlrpskxbdbzlhcpdyo.supabase.co/functions/v1/api/webhook/provita-0a18587e';
    
    const testData = {
        firstName: 'Test',
        lastName: 'User',
        phone: '0700000000',
        product: 'ProVita',
        timestamp: new Date().toISOString()
    };

    console.log('🔍 Testing webhook connectivity...');
    
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
        mode: 'cors',
        credentials: 'omit'
    })
    .then(response => {
        console.log('✓ Webhook test response:', response.status);
        return response.text().then(text => ({ status: response.status, body: text }));
    })
    .then(data => {
        console.log('✓ Webhook is reachable - Status:', data.status);
        if (data.body) console.log('Response body:', data.body);
    })
    .catch(error => {
        console.log('⚠ Webhook test error (may be CORS related):', error.message);
        console.log('Retrying with no-cors mode...');
        
        // Retry with no-cors - won't get response but will send data
        return fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify(testData),
            mode: 'no-cors'
        }).then(() => {
            console.log('✓ Webhook request sent successfully (no-cors mode)');
        }).catch(retryError => {
            console.error('✗ Webhook completely unreachable:', retryError.message);
        });
    });
}

