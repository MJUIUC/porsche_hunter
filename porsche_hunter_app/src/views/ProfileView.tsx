import React, { useState, useEffect } from 'react';
import { Container, Typography, Avatar, CircularProgress, Card, CardContent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProfileView() {
    const navigate = useNavigate();
    const { hunterName } = useParams();
    const [hunterData, setHunterData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/v1/wall/render-profile/${hunterName}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // console.log('profile:', data);
                setHunterData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching hunter data:', error);
            }
        };

        fetchData();
    }, [hunterName]);

    const handlePostClick = (postUuid: string) => {
        navigate(`/post/${postUuid}`);
        console.log('clicked post:', postUuid);
    }

    return (
        <Container maxWidth="sm">
            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography variant="h6" align="center">
                        Loading...
                    </Typography>
                </div>
            ) : (
                <div>
                    {/* <Avatar src={hunterData.hunter.avatarUrl} alt={`${hunterData.hunter.firstName} ${hunterData.hunter.lastName}`} /> */}
                    <Typography variant="h4" align="center" gutterBottom>
                        {hunterData.hunter.firstName} {hunterData.hunter.lastName}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                        @{hunterData.hunter.hunterName}
                    </Typography>
                    {/* Display other hunter data as needed */}
                </div>
            )}

            <Typography variant="h5" component="div" marginTop={4}>
                Posts
            </Typography>

            {hunterData && hunterData.posts.length > 0 ? (
                <div>
                    {hunterData.posts.map((post) => (
                        <Card variant="outlined" key={post.uuid} style={{ marginTop: '16px', cursor: 'pointer' }}
                            onClick={() => handlePostClick(post.uuid)}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {post.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Location: {post.location}
                                </Typography>
                                {/* Add more post information as needed */}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Typography variant="body1" align="center">
                    No posts available.
                </Typography>
            )}
        </Container>
    );
}
