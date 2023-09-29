This assignment is to create core features for an application which allows users to interact with Porsche vehicle related media. Users of the application will be allowed to upload pictures of vehicles with additional details including the location of the capture, captions, and car model selection. Overall, the description and name lend themselves to an app where you might "capture" Porsche sightings and detail them, and likely share with others.
## App User Experience
The general user experience should enable the user to open the application client and either post or browse pictures from their own accounts, or accounts they "follow". That user should also be able to take a picture - capture a target if you will - and post it to their own account with the ability to add details about it.

Here are some simple user flows to consider:
1. User see's vehicle in wild and wants to capture
	1. The user captures a few photos
	2. The user authenticates themselves (if not already)
	3. The user opens the 'Porsche Hunter' client application
	4. The user creates a new post by filling out a form and uploading the images
	5. The user is brought to their new post after creation
2. User wants to edit a post
	1. The user opens the 'Porsche Hunter' client application
	2. The user authenticates themselves (if not already)
	3. The user goes to their post history view
	4. They open up an old post and edit it by entering some fields
	5. The user submits the edit and is navigated to the edited post page
3. User wants to see posts of other users they follow in once place
		1. The user opens the 'Porsche Hunter' client application
		2. The user authenticates themselves (if not already)
		3. The user is brought to a page displaying the most recent posts from the other 'Porsche Hunter' accounts they follow. If they follow no-one, they receive a message

## Features
The following features will be accounted for when designing this fullstack application;

- Frontend - react web application (will look into [nextjs](https://nextjs.org/docs))
	- I don't think this will be very robust. I'm not a designer, and this is a backend focused position. As such, my focus for the web application will be to demonstrate the capabilities of the backend service.
	- We'll build an SPA with react since the description of the application sounds a lot like something that would need quick interactions. We're not worried about SEO (search engine optimization) here, Porsche is pretty well known and already has plenty of web outlets.
- Accounts - similar to users
	- There should be users in this application so that we can differentiate the application experience per individual.
	- **Bonus** Let accounts have followers.
- Hunt Result - similar to blog post
	- Photograph(s) - A single photo or album to accompany the post.
	- Car Model(s) - The car models found [here](https://www.porsche.com/usa/models/) should be incorporated into the post. Rather, it should be easy for us to be linked to details about the models in the post.
	- Location - This is where the capture was taken. We have a couple of options on capturing this.
	- Editing - An account should be able to edit and delete a hunt post.
- Wall - **Bonus**
	- A follow and wall feature for accounts to view one another's hunt results.
	- Something we should add regardless is the ability to view any account.

In order to build this and match the requirements given, we'll create a monolithic NodeJS server and couple it with an SPA React Web App. This is opposed to other web architectures that involve server side rendering. Since we're building what seems to be a backend that supports App like client behavior, it makes more sense to load a React App to the browser in order to support that experience. It will also help our monolithic service to be more flexible, as multiple clients will be able to use the same REST endpoints provided by the server.

## [[Technical Design Documentation Overviews]]