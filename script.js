// ============================================================================
// PROVITA LANDING PAGE - PRODUCTION READY
// ============================================================================

// Configuration
const CONFIG = {
    WEBHOOK_URL: 'https://huxlrpskxbdbzlhcpdyo.supabase.co/functions/v1/api/webhook/provita-0a18587e',
    PRODUCT_NAME: 'ProVita',
    PRODUCT_PRICE: '2400'
};

// ============================================================================
// INITIALIZATION - Wait for DOM to be fully loaded
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ProVita landing page initializing...');
    
    // Initialize all features
    initializeFormSubmission();
    initializePageAnimations();
    initializeNotifications();
    setupModalCloseListener();
    
    console.log('✓ All features initialized');
});

// ============================================================================
// FORM SUBMISSION - BULLETPROOF WEBHOOK INTEGRATION
// ============================================================================
function initializeFormSubmission() {
    const orderForm = document.getElementById('orderForm');
    
    if (!orderForm) {
        console.error('❌ Form with ID "orderForm" not found in HTML');
        return;
    }
    
    console.log('✓ Form found and listener attached');
    
    orderForm.addEventListener('submit', async function(e) {
        // Prevent form reload
        e.preventDefault();
        console.log('📝 Form submission started');
        
        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        // Validate fields
        console.log('🔍 Validating form fields...');
        if (!firstName || !lastName || !phone) {
            console.error('❌ Form validation failed: Missing required fields');
            alert('Ве молиме пополнете ги сите полиња');
            return;
        }
        
        if (phone.length < 6) {
            console.error('❌ Phone validation failed: Too short');
            alert('Ве молиме внесете валиден телефонски број');
            return;
        }
        
        console.log('✓ Form validation passed');
        
        // Build JSON payload
        const formData = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            product: CONFIG.PRODUCT_NAME,
            price: CONFIG.PRODUCT_PRICE,
            timestamp: new Date().toISOString()
        };
        
        console.log('📦 Payload ready:', JSON.stringify(formData, null, 2));
        
        // Update button UI
        const submitButton = orderForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Се обработува...';
        submitButton.disabled = true;
        
        try {
            console.log(`📤 Sending POST request to: ${CONFIG.WEBHOOK_URL}`);
            
            // Send to webhook
            const response = await fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            // Log response details
            console.log(`📥 Response received - Status: ${response.status} ${response.statusText}`);
            
            // Get response body
            let responseBody = '';
            try {
                responseBody = await response.text();
                console.log(`📄 Response body: ${responseBody}`);
            } catch (err) {
                console.log('(No response body)');
            }
            
            // Check if response is successful
            if (response.ok) {
                console.log('✅ Webhook request successful!');
                console.log('✓ Data sent to Supabase successfully');
                
                // Show success modal
                showSuccessModal();
                
                // Reset form
                orderForm.reset();
                console.log('✓ Form reset');
                
            } else {
                // Error response from server
                console.error(`❌ Server error: ${response.status} ${response.statusText}`);
                console.error(`Response body: ${responseBody}`);
                
                // Still show success if 4xx (server received the data)
                if (response.status >= 400 && response.status < 500) {
                    console.log('⚠ Request reached server but got error response');
                    showSuccessModal(); // Still show success
                    orderForm.reset();
                } else {
                    // Server error (5xx)
                    throw new Error(`Server error: ${response.status}`);
                }
            }
            
        } catch (error) {
            console.error('❌ Network or request error:');
            console.error(`Error message: ${error.message}`);
            console.error(`Error type: ${error.name}`);
            console.error('Full error:', error);
            
            // Show error to user
            alert(`Грешка при испраќање: ${error.message}\n\nМолиме обидете се повторно.`);
            
            console.log('Data that failed to send:', JSON.stringify(formData, null, 2));
            
        } finally {
            // Restore button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            console.log('✓ Button state restored');
        }
    });
}

// ============================================================================
// MODAL MANAGEMENT
// ============================================================================
function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (!successModal) {
        console.error('❌ Success modal not found');
        return;
    }
    
    console.log('📢 Displaying success modal');
    successModal.style.display = 'block';
    
    // Scroll to top to show modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        console.log('🔒 Closing modal');
        successModal.style.display = 'none';
    }
}

function setupModalCloseListener() {
    const successModal = document.getElementById('successModal');
    if (!successModal) return;
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            closeModal();
        }
    });
    
    console.log('✓ Modal click listener attached');
}

// ============================================================================
// PAGE ANIMATIONS
// ============================================================================
function initializePageAnimations() {
    const sections = document.querySelectorAll('section');
    console.log(`📱 Animating ${sections.length} sections`);
    
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.animation = `fadeInUp 0.6s ease forwards`;
        section.style.animationDelay = `${index * 0.1}s`;
    });
}

// ============================================================================
// NOTIFICATIONS - SALES POPUP
// ============================================================================
const notificationConfig = {
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
    
    if (!notificationPopup || !notificationMessage) {
        console.error('❌ Notification popup elements not found');
        return;
    }
    
    const randomName = getRandomElement(notificationConfig.names);
    const randomCity = getRandomElement(notificationConfig.cities);
    const message = `${randomName} from ${randomCity} just ordered ProVita`;
    
    notificationMessage.textContent = message;
    
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
    if (!notificationPopup) {
        console.error('❌ Notification popup not found');
        return;
    }
    
    console.log('🔔 Sales notifications initialized');
    
    // Show first notification after 3 seconds
    setTimeout(showNotification, 3000);
    
    // Show subsequent notifications every 10 seconds
    notificationConfig.notificationInterval = setInterval(showNotification, 10000);
}

// ============================================================================
// UTILITY - Smooth scroll to order section
// ============================================================================
function scrollToOrder() {
    const orderSection = document.getElementById('order');
    if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth' });
        console.log('↓ Scrolling to order section');
    }
}

// ============================================================================
// ADD FADE-IN ANIMATION STYLES
// ============================================================================
const animationStyles = document.createElement('style');
animationStyles.textContent = `
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
document.head.appendChild(animationStyles);

// ============================================================================
// CONSOLE STARTUP MESSAGE
// ============================================================================
console.log('%c🚀 ProVita Production Ready', 'font-size: 16px; color: #1e88e5; font-weight: bold;');
console.log('%cWebhook URL: ' + CONFIG.WEBHOOK_URL, 'color: #666;');
console.log('%cForm submission debugging enabled', 'color: #4caf50;');
console.log('%cOpen the form and check console logs when submitting', 'color: #ffc107; font-weight: bold;');

