import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthentication } from "../hooks/UseAuthentication"
import PostCreator from "../components/PostCreator";

import { AppStateContext } from "../contexts/AppState";

export default function EditPostView() {
    const { appState } = useContext(AppStateContext);
    const [postData, setPostData] = useState<any | null>(null);
    const { postUuid } = useParams();

    const jwt = appState?.activeToken;
    const  authenticatedHunter  = appState?.authenticatedHunter;

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
                setPostData(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPost();
    }, [jwt, postUuid]);

    // console.log(postData)
    if (postData && authenticatedHunter) {
        if (postData.authorId === authenticatedHunter.uuid) {
            return (
                <div>
                    <PostCreator editPost={postData} />
                </div>
            );
        } else {
            return (
                <div>
                    <h1>You do not have permission to edit this post</h1>
                </div>
            );
        }
    } else if (postData && !authenticatedHunter) {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>You need log in to edit a post</h1>
            </div>
        );
    } else {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Loading...</h1>
            </div>
        );
    }
};