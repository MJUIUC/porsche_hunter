import { useState } from 'react';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import { autoPlay } from 'react-swipeable-views-utils';
import { Card, CardContent, CardMedia } from '@mui/material';
import { CarData } from './PorscheModelTypeahaedList';
import { Hunter } from '../contexts/AppState';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export interface AutomobileCapture {
    id?: number;
    uuid: string;
    huntResultPostId: string;
    authorId: string;
    caption: string;
    imageUrl: string;
    model: string;
    type: string;
}

export interface PostViewProps {
    post: {
        id?: number;
        uuid: string;
        authorId: string;
        title: string;
        location: string;
        blogContent: string;
        isPrivate: boolean;
        createdAt: string;
        updatedAt: string;
        captures: AutomobileCapture[];
        vehicleModel: CarData;
        author: Hunter;
    };
}

export function formatCoordinates(coordinateString) {
    const [latitude, longitude] = coordinateString.split(',').map(Number);

    const formattedLatitude = Math.abs(latitude) + (latitude >= 0 ? '°N' : '°S');
    const formattedLongitude = Math.abs(longitude) + (longitude >= 0 ? '°E' : '°W');

    return `${formattedLatitude}, ${formattedLongitude}`;
};

export default function PostView({ post }: PostViewProps) {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = post.captures.length;
    const theme = useTheme();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <Card style={{
            maxWidth: '800px',
            marginTop: '20px',
            marginBottom: '20px',
        }}>
            <CardMedia>
                <Paper
                    square
                    elevation={0}
                    sx={{
                        display: 'flex',
                        pl: 2,
                        bgcolor: 'background.default',
                    }}
                >
                    <Typography component='div'>
                        <h1>{post.title}</h1>
                        <h5>{`@${post.author.hunterName}`}</h5>
                        <h5>{formatCoordinates(post.location)}</h5>
                    </Typography>
                </Paper>
                <AutoPlaySwipeableViews
                    interval={8000}
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                >
                    {post.captures.map((capture: AutomobileCapture, index: number) => {
                        const timestamp = Date.now();
                        return <div key={`${timestamp}-${index}`} style={{
                            textAlign: 'center',
                        }}>
                            {Math.abs(activeStep - index) <= 2 ? (
                                <Box
                                    component="img"
                                    sx={{
                                        display: 'block',
                                        overflow: 'hidden',
                                        width: '100%',
                                    }}
                                    src={capture.imageUrl}
                                    alt={capture.caption}
                                />
                            ) : null}
                            <p>{capture.caption}</p>
                        </div>
                    })}
                </AutoPlaySwipeableViews>
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button
                            size="small"
                            onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}
                        >
                            Next
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowLeft />
                            ) : (
                                <KeyboardArrowRight />
                            )}
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowRight />
                            ) : (
                                <KeyboardArrowLeft />
                            )}
                            Back
                        </Button>
                    }
                />
            </CardMedia>
            <CardContent>
                <Typography variant="body1" component="div">
                    {post.blogContent}
                </Typography>
                <Typography variant="h6" component="div" style={{
                    display: 'flex',
                    alignItems: 'center',

                }}>
                    {`Featured Model: ${post.vehicleModel.alt}`}
                    <img src={post.vehicleModel.url} style={{ width: '100px', height: '50px', marginLeft: '20px' }} />
                </Typography>
            </CardContent>
        </Card>
    );
};
