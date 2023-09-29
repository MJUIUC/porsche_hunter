import PostCreator from "../components/PostCreator";

export default function CreatePostView() {

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}>
            <h1>Create New Post</h1>
            <PostCreator />
        </div>
    );
};