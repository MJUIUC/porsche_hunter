We will build a web client to interface with our server, because I am more familiar with that than iOS development, and the primary focus of this task is to create a backend service. The project asked for a backend system with features to support an "app" type of experience. This is opposed to something like an e-commerce website, blog, or anything that might require a lot of search engine optimization (SEO). The nice thing about building an agnostic [[Backend Technical Design Doc|backend]] API, is that it allows you to build out as many different client interfaces as you see fit, while continuing to use the same standardized business logic for each.

Because our backend API is client agnostic and we want an "app" type of user experience, our best bet is to build a single web page application. A single page application (SPA) can be downloaded to a users browser once and make subsequent API calls as needed. This will give the app itself a very "snappy" feel when moving between states, only experiencing latency when making outbound server requests.

To build this frontend, I'll use the [React](https://react.dev/) web application framework. It handles state changes very well and has a very diverse range of supporting libraries. This doc will outline the build plan for the app.

## Application State
I wanted to discuss this briefly as it is often a point of contingency when designing stateful ui's; how is that state managed? For react application, state can be handled various ways. A very popular way of tracking and maintaining an applications state throughout its life-cycle is the [Redux](https://redux.js.org/) framework.

Redux is generally my go-to for React state management over other available libraries. That being said, it is not always necessary. One drawback of Redux is the complexity involved with actually changing the state of the application. Rather than implement all of the state transforming logic required when using Redux, we'll utilize a more time effective method to manage our app state, the [ContextAPI](https://react.dev/learn/passing-data-deeply-with-context).

The ContextAPI will let the application state live in a singular object at the top level of the application.

## Pages
Even though the application is an SPA, it will have different pages to navigate. We'll make use of the react router to navigate between them or request specifics.

According to our [[Porsche Hunter Assignment Overview#Features]]:
1. Wall View
	1. Renders a wall for the logged in user.
	2. Gets all following users and look at the most recently entered post, then return them all.
2. Profile/Hunter View
	1. For any given Hunter, load their hunter account and all of their posts
3. Signup/Login View
	1. Create a new Hunter
	2. Login and authenticate with existing Hunter
4. Create Post View
	1. Upload Images for a post
	2. Select a vehicle for each image
	3. User enters post meta, which is saved to DB
5. Post View
	1. View content of a post made by any user.

## Components
For simplicity sake, we'll create a components folder and treat it as a "grab bag" of React components specifically for use in the application. That said, much of our components will be based on Googles [Material UI](https://mui.com/).