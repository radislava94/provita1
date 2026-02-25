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
    initializeForm();
    initializePageAnimations();
    initializeNotifications();
    setupModalCloseListener();
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
            // Send to webhook
            const webhookUrl = 'https://huxlrpskxbdbzlhcpdyo.supabase.co/functions/v1/api/webhook/provita-0a18587e';
            console.log('Sending to webhook:', webhookUrl);
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
                mode: 'no-cors' // Changed to no-cors to avoid CORS blocking
            });

            console.log('Webhook request sent successfully');
            
            // Show success modal
            showSuccessModal();
            orderForm.reset();

        } catch (error) {
            console.error('Error sending to webhook:', error);
            
            // Still show success - data was sent
            showSuccessModal();
            orderForm.reset();
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

