const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

const headerEnd = index.indexOf('</header>') + 9;
const footerStart = index.indexOf('<footer>');

const headerHTML = index.substring(0, headerEnd);
const footerHTML = index.substring(footerStart);

const loginContent = `
    <style>
        .auth-wrapper {
            background-color: var(--light-bg);
            padding: 4rem 0;
            min-height: calc(100vh - 400px);
        }
        .auth-container {
            max-width: 480px;
            margin: 0 auto;
            padding: 2.5rem;
            background: var(--white);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .auth-tabs {
            display: flex;
            margin-bottom: 2rem;
            border-bottom: 1px solid var(--border-color);
        }
        .auth-tab {
            flex: 1;
            text-align: center;
            padding: 1rem;
            font-weight: 600;
            color: var(--text-muted);
            cursor: pointer;
            transition: all 0.3s;
        }
        .auth-tab.active {
            color: var(--primary);
            border-bottom: 2px solid var(--primary);
        }
        .auth-form {
            display: none;
        }
        .auth-form.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text-dark);
        }
        .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            outline: none;
            transition: border-color 0.3s;
        }
        .form-group input:focus {
            border-color: var(--primary);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .forgot-password {
            display: block;
            text-align: right;
            font-size: 0.8rem;
            color: var(--primary);
            margin-bottom: 1.5rem;
        }
    </style>

    <div class="auth-wrapper">
        <div class="container">
            <div class="auth-container">
                <div class="auth-tabs">
                    <div class="auth-tab active" id="tab-login">Login</div>
                    <div class="auth-tab" id="tab-register">Register</div>
                </div>

                <!-- Login Form -->
                <form id="form-login" class="auth-form active" onsubmit="event.preventDefault(); window.location.href='index.html';">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" required>
                    </div>
                    <a href="javascript:void(0)" class="forgot-password">Forgot password?</a>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Sign In</button>
                </form>

                <!-- Register Form -->
                <form id="form-register" class="auth-form" onsubmit="event.preventDefault(); document.getElementById('tab-login').click(); alert('Account created successfully!');">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Create a password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Create Account</button>
                </form>

            </div>
        </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('tab-login').addEventListener('click', () => {
                document.getElementById('tab-login').classList.add('active');
                document.getElementById('tab-register').classList.remove('active');
                document.getElementById('form-login').classList.add('active');
                document.getElementById('form-register').classList.remove('active');
            });
            document.getElementById('tab-register').addEventListener('click', () => {
                document.getElementById('tab-register').classList.add('active');
                document.getElementById('tab-login').classList.remove('active');
                document.getElementById('form-register').classList.add('active');
                document.getElementById('form-login').classList.remove('active');
            });
        });
    </script>
`;

const newPage = headerHTML + '\n' + loginContent + '\n' + footerHTML;
fs.writeFileSync('login.html', newPage);
console.log('Successfully wrote login.html');
