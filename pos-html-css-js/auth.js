
document.addEventListener('DOMContentLoaded', () => {
    // --- Helper Validation Functions ---
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

    function setError(inputElement, errorElement, message) {
        if (!inputElement || !errorElement) return;
        inputElement.classList.add('is-invalid');
        inputElement.classList.remove('is-valid');
        inputElement.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function setSuccess(inputElement, errorElement) {
        if (!inputElement || !errorElement) return;
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        inputElement.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function clearStatus(inputElement, errorElement) {
        if (!inputElement || !errorElement) return;
        inputElement.classList.remove('is-invalid');
        inputElement.classList.remove('is-valid');
        inputElement.removeAttribute('aria-invalid');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function triggerShake(element) {
        if (!element) return;
        element.classList.remove('shake-animation');
        // Force reflow
        void element.offsetWidth;
        element.classList.add('shake-animation');
    }

    // --- 1. LOGIN FORM VALIDATION ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');

        function validateLoginEmail(showEmpty = true) {
            const val = emailInput.value.trim();
            if (val === '') {
                if (showEmpty) setError(emailInput, emailError, 'Email address is required.');
                else clearStatus(emailInput, emailError);
                return false;
            }
            if (!EMAIL_REGEX.test(val)) {
                setError(emailInput, emailError, 'Please enter a valid email address (e.g. user@company.com).');
                return false;
            }
            setSuccess(emailInput, emailError);
            return true;
        }

        function validateLoginPassword(showEmpty = true) {
            const val = passwordInput.value;
            if (val.trim() === '') {
                if (showEmpty) setError(passwordInput, passwordError, 'Password is required.');
                else clearStatus(passwordInput, passwordError);
                return false;
            }
            if (val.length < 6) {
                setError(passwordInput, passwordError, 'Password must be at least 6 characters.');
                return false;
            }
            setSuccess(passwordInput, passwordError);
            return true;
        }

        // Live input listeners
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('is-invalid') || emailInput.value.length > 5) {
                validateLoginEmail(true);
            }
        });
        emailInput.addEventListener('blur', () => validateLoginEmail(true));

        passwordInput.addEventListener('input', () => {
            if (passwordInput.classList.contains('is-invalid') || passwordInput.value.length >= 6) {
                validateLoginPassword(true);
            }
        });
        passwordInput.addEventListener('blur', () => validateLoginPassword(true));

        // Submit listener
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const isEmailValid = validateLoginEmail(true);
            const isPassValid = validateLoginPassword(true);

            if (!isEmailValid || !isPassValid) {
                triggerShake(loginForm);
                if (!isEmailValid) emailInput.focus();
                else passwordInput.focus();
                return;
            }

            // Valid submission flow
            const submitBtn = loginForm.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Logging In...';
            }

            // Save active user info for the dashboard
            const userEmail = emailInput.value.trim();
            const userName = userEmail.split('@')[0].replace('.', ' ');
            localStorage.setItem('dashpoint_current_user', JSON.stringify({
                email: userEmail,
                name: userName.charAt(0).toUpperCase() + userName.slice(1)
            }));

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 600);
        });
    }

    // --- 2. REGISTRATION FORM VALIDATION ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');
        const confirmPasswordError = document.getElementById('confirm-password-error');

        const strengthBar = document.getElementById('password-strength-bar');
        const strengthLabel = document.getElementById('password-strength-label');

        function calculatePasswordStrength(pass) {
            let score = 0;
            if (pass.length >= 8) score++;
            if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
            if (/[0-9]/.test(pass)) score++;
            if (/[^A-Za-z0-9]/.test(pass)) score++;
            return score;
        }

        function updateStrengthIndicator(pass) {
            if (!strengthBar || !strengthLabel) return;
            if (!pass) {
                strengthBar.className = 'strength-bar';
                strengthLabel.textContent = '';
                return;
            }

            const score = calculatePasswordStrength(pass);
            strengthBar.className = 'strength-bar';

            if (score <= 1) {
                strengthBar.classList.add('strength-weak');
                strengthLabel.textContent = 'Strength: Weak';
                strengthLabel.style.color = '#ef4444';
            } else if (score === 2 || score === 3) {
                strengthBar.classList.add('strength-medium');
                strengthLabel.textContent = 'Strength: Moderate';
                strengthLabel.style.color = '#f59e0b';
            } else {
                strengthBar.classList.add('strength-strong');
                strengthLabel.textContent = 'Strength: Strong';
                strengthLabel.style.color = '#10b981';
            }
        }

        function validateRegisterName(showEmpty = true) {
            const val = nameInput.value.trim();
            if (val === '') {
                if (showEmpty) setError(nameInput, nameError, 'Full Name is required.');
                else clearStatus(nameInput, nameError);
                return false;
            }
            if (val.length < 2) {
                setError(nameInput, nameError, 'Name must be at least 2 characters.');
                return false;
            }
            if (!NAME_REGEX.test(val)) {
                setError(nameInput, nameError, 'Name can only contain letters, spaces, and hyphens.');
                return false;
            }
            setSuccess(nameInput, nameError);
            return true;
        }

        function validateRegisterEmail(showEmpty = true) {
            const val = emailInput.value.trim();
            if (val === '') {
                if (showEmpty) setError(emailInput, emailError, 'Email address is required.');
                else clearStatus(emailInput, emailError);
                return false;
            }
            if (!EMAIL_REGEX.test(val)) {
                setError(emailInput, emailError, 'Please enter a valid email address (e.g. name@company.com).');
                return false;
            }
            setSuccess(emailInput, emailError);
            return true;
        }

        function validateRegisterPassword(showEmpty = true) {
            const val = passwordInput.value;
            updateStrengthIndicator(val);

            if (val.trim() === '') {
                if (showEmpty) setError(passwordInput, passwordError, 'Password is required.');
                else clearStatus(passwordInput, passwordError);
                return false;
            }
            if (val.length < 8) {
                setError(passwordInput, passwordError, 'Password must be at least 8 characters long.');
                return false;
            }
            if (!/[A-Za-z]/.test(val) || !/[0-9]/.test(val)) {
                setError(passwordInput, passwordError, 'Password must include at least one letter and one number.');
                return false;
            }

            setSuccess(passwordInput, passwordError);

            // Re-validate confirmation if populated
            if (confirmPasswordInput && confirmPasswordInput.value) {
                validateConfirmPassword(true);
            }
            return true;
        }

        function validateConfirmPassword(showEmpty = true) {
            if (!confirmPasswordInput) return true;
            const passVal = passwordInput.value;
            const confirmVal = confirmPasswordInput.value;

            if (confirmVal.trim() === '') {
                if (showEmpty) setError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password.');
                else clearStatus(confirmPasswordInput, confirmPasswordError);
                return false;
            }
            if (passVal !== confirmVal) {
                setError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match.');
                return false;
            }
            setSuccess(confirmPasswordInput, confirmPasswordError);
            return true;
        }

        // Live input listeners
        nameInput.addEventListener('input', () => {
            if (nameInput.classList.contains('is-invalid') || nameInput.value.length >= 2) {
                validateRegisterName(true);
            }
        });
        nameInput.addEventListener('blur', () => validateRegisterName(true));

        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('is-invalid') || emailInput.value.length > 5) {
                validateRegisterEmail(true);
            }
        });
        emailInput.addEventListener('blur', () => validateRegisterEmail(true));

        passwordInput.addEventListener('input', () => {
            validateRegisterPassword(false);
            if (passwordInput.classList.contains('is-invalid')) {
                validateRegisterPassword(true);
            }
        });
        passwordInput.addEventListener('blur', () => validateRegisterPassword(true));

        confirmPasswordInput.addEventListener('input', () => {
            if (confirmPasswordInput.classList.contains('is-invalid') || confirmPasswordInput.value.length >= 6) {
                validateConfirmPassword(true);
            }
        });
        confirmPasswordInput.addEventListener('blur', () => validateConfirmPassword(true));

        // Submit listener
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const isNameValid = validateRegisterName(true);
            const isEmailValid = validateRegisterEmail(true);
            const isPassValid = validateRegisterPassword(true);
            const isConfirmValid = validateConfirmPassword(true);

            if (!isNameValid || !isEmailValid || !isPassValid || !isConfirmValid) {
                triggerShake(registerForm);
                if (!isNameValid) nameInput.focus();
                else if (!isEmailValid) emailInput.focus();
                else if (!isPassValid) passwordInput.focus();
                else confirmPasswordInput.focus();
                return;
            }

            // Valid submission flow
            const submitBtn = registerForm.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Creating Account...';
            }

            localStorage.setItem('dashpoint_current_user', JSON.stringify({
                name: nameInput.value.trim(),
                email: emailInput.value.trim()
            }));

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 700);
        });
    }
});
