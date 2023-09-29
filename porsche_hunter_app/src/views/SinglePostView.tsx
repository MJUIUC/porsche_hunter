import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthentication } from '../hooks/UseAuthentication';
import PostView from '../components/PostView';
import { Button } from '@mui/material';

export interface PostData {
    authorId: string,
    blogContent: string,
    createdAt: string,
    id?: number
    isPrivate: false
    location: string,
    title: string,
    updatedAt: string,
    uuid: string,
    captures: {
        authorId: string,
        caption: string,
        huntResultPostId: string,
        id?: number,
        imageUrl: string,
        model: string,
        type: string,
        uuid: string,
    }[],
};

export default function SinglePostView() {
    const navigate = useNavigate();
    const [postData, setPostData] = useState<any | null>(null);
    const { postUuid } = useParams();
    const { authenticatedHunter, getCookie } = useAuthentication();
    const jwt = getCookie('jwt');


    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/v1/post/view_post/${postUuid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                const data = await response.json();
                // console.log(data);
                setPostData(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPost();
    }, [jwt, postUuid]);

    const canEditPost = (postData && postData.authorId === authenticatedHunter.uuid);

    const handleEditPostClick = () => {
        navigate(`/posteditor/${postUuid}`);
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {canEditPost ? <Button onClick={handleEditPostClick}>Edit Post</Button> : <></>}
            {postData ? <PostView post={postData} /> : <></>}
        </div>
    );
};