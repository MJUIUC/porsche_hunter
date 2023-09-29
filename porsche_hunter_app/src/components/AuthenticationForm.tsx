import { useState } from 'react';
import { TextField, Button, Container } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useAuthentication } from '../hooks/UseAuthentication';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const auth = useAuthentication();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        hunterName: '',
        emailAddress: '',
        password: '',
        dateOfBirth: null as Date | null,
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleChange = (event: any) => {
        const { id, value } = event.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleDateChange = (date: Date | null) => {
        setFormData({
            ...formData,
            dateOfBirth: date,
        });
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'First Name is required';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Last Name is required';
        }

        if (!formData.hunterName.trim()) {
            errors.hunterName = 'Hunter Name is required';
        }

        if (!formData.emailAddress.trim()) {
            errors.emailAddress = 'Email Address is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.emailAddress)) {
            errors.emailAddress = 'Invalid email address';
        }

        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.dateOfBirth) {
            errors.dateOfBirth = 'Date of Birth is required';
        }

        return errors;
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            // Form is valid, you can submit the data or perform other actions here
            console.log('Form data:', formData);
            if (await auth.signup(formData)){
                console.log('Signup successful');
                setFormErrors({});
                navigate('/'); // Redirect to the home page
            }
        } else {
            // Form has errors, update the error state
            setFormErrors(errors);
        }
    };

    return (
        <Container maxWidth='sm'>
            <form onSubmit={handleSubmit}>
                <TextField
                    id='firstName'
                    label='First Name'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                />
                <TextField
                    id='lastName'
                    label='Last Name'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                />
                <TextField
                    id='hunterName'
                    label='Hunter Name'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    value={formData.hunterName}
                    onChange={handleChange}
                    error={!!formErrors.hunterName}
                    helperText={formErrors.hunterName}
                />
                <TextField
                    id='emailAddress'
                    label='Email Address'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    value={formData.emailAddress}
                    onChange={handleChange}
                    error={!!formErrors.emailAddress}
                    helperText={formErrors.emailAddress}
                />
                <TextField
                    id='password'
                    label='Password'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date Of Birth"
                        value={formData.dateOfBirth}
                        onChange={handleDateChange}
                    />
                </LocalizationProvider>
                <Button
                    style={{ marginTop: '1rem' }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                >
                    Submit
                </Button>
            </form>
        </Container>
    );
};

const Login = () => {
    const { login } = useAuthentication();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ emailAddress: '', password: '' });
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setCredentials({
            ...credentials,
            [id]: value,
        });
    };

    const handleLogin = async () => {
        const success = await login(credentials);

        if (success) {
            // Redirect or perform other actions on successful login
            console.log('Login successful');
            setLoginError(null);
            navigate('/'); // Redirect to the home page
        } else {
            // Handle login failure (e.g., show an error message)
            setLoginError('Invalid credentials. Please try again.');
        }
    };

    return (
        <Container maxWidth='sm'>
            <form>
                <TextField
                    id='emailAddress'
                    label='Email Address'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    value={credentials.emailAddress}
                    onChange={handleChange}
                />
                <TextField
                    id='password'
                    label='Password'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    type='password'
                    value={credentials.password}
                    onChange={handleChange}
                />
                {loginError && (
                    <div style={{ color: 'red' }}>{loginError}</div>
                )}
                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default function AuthenticationForm() {
    const [isSignup, setIsSignup] = useState(true);

    const toggleForm = () => {
        setIsSignup(!isSignup);
    };

    const buttonStyle = {
        backgroundColor: '#f0f0f0', // Replace with your desired lighter color
        color: '#333', // Optional: Text color
    };

    return (
        <div>
            {isSignup ? <Signup /> : <Login />}
            <p>
                {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}
                <Button onClick={toggleForm} style={buttonStyle}>
                    {isSignup ? 'Log in' : 'Sign up'}
                </Button>
            </p>
        </div>
    );
};
