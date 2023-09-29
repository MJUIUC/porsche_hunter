In the [[Porsche Hunter Assignment Overview]] we talked about the features of the application that we wanted to build. In this part of the document, we'll discuss a high level general architecture to build these features as well as the technology stack involved in powering them. Overall, this will be a full stack project and require both frontend and backend architecture and implementation. 

## [[Backend Technical Design Doc|Backend]]
The requirement is to build a backend web service using [NodeJS](https://nodejs.org/en). When thinking about building a backend web service, one of the most important if not the most important aspect to think about, is the scale of regular utilization of the service. Reasoning about this generally informs the architecture of the service to best fit its needs.

Since we likely wouldn't see a lot of traffic on this service, we can simply configure an API endpoint to serve multiple Porsche Hunter client variations. Since the Frontend of the application won't be baked into the web service, the service itself can be client agnostic. A trade-off we're making by not going with a server-side rendered application is a loss of SEO, but we won't need to worry about that for this type of app.

## [[Frontend Technical Design Doc|Frontend]]
The project calls for a client to help demonstrate the capabilities of the backend service. Our client will be fairly basic, but will allow a user to carry out all of the functionality outlined in the [[Porsche Hunter Assignment Overview#Features]] section.

## Timeline (Order of operations)
This is a rather large project that a team of individuals would typically spend multiple sprints on. Due to time constraints, we'll get as far as possible and leave the unfinished parts for open discussion.

1. Create NodeJS express server and install planned packages
	1. Some packages are subject to change and will be updated accordingly.
2. Create React App for server demonstration
	1. Create React App with Typescript is fine. No need for nextjs or anything like that in this case.
3. Implement a basic authentication strategy
	1. Will be using single pass auth since that can be implemented fairly quickly.
	2. Jason Web Token set in the browser cookie will be how we maintain an authenticated state within the server. This is client agnostic.
	3. Test authentication with curl cli.
	4. Create frontend authentication page and set token to cookie for demo
4. Implement a basic CDN (content delivery network for images)
	1. Create an endpoint in the NodeJS server for uploading image files. The files themselves can be stored locally for our demo.
	2. Create an endpoint in the server for hosting image files.
	3. Should authenticate the user in order to upload an image
5. Implement the blog post api
	1. Add endpoints for CRUD operations on blogposts
	2. Create corresponding React ux for blogpost ops
	3. Gate sensitive endpoints with token authentication
6. Implement wall and social
	1. Add endpoints for generating a feed of blogpost links.
	2. Add endpoints for creating follow links between users.