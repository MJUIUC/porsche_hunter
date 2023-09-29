import AuthenticationForm from "../components/AuthenticationForm";
import { Container } from '@mui/material';

// should be display logic for a really basic sign in form
export default function AuthenticateView() {
    return (
      <Container maxWidth="sm">
        <AuthenticationForm />
      </Container>
    );
};

