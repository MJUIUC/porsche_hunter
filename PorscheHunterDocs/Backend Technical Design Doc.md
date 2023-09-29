We will build a backend web API which will facilitate the features found in [[Porsche Hunter Assignment Overview#Features]]. At it's core the service will handle CRUD operations around data models pertaining to Hunt Posts and Porsche Automobiles, as well as Account/User authentication and sessions.

The service should be performative and snappy, which will be easily achievable on a small scale. We can get away with creating a monolithic type of service without having to worry much about running out of memory in any service instance. Generally though, a micro-service approach would be the best option for handling scale better, but building each service and wrangling them together would take a lot more time to implement than we have for this project.

Generally, a backend web service is comprised of the following:
- Backend Framework
	- We'll use the [ExpressJS](https://expressjs.com/) framework for this, it's the most popular NodeJS framework and has plenty of community support.
- Authentication
	- We can use [PassportJS](https://www.passportjs.org/packages/passport-local/) local strategy for a simple auth method. JWT is a good strategy which works across multiple clients.
	- [Bcrypt](https://www.npmjs.com/package/bcryptjs) package can be used to safely store salted + hashed passwords
- Error Handling
	- We should capture these in middleware and normalize them. The server shouldn't halt for any one request.
- Logging
	- [Pino](https://github.com/pinojs/pino)
	- [Morgan](https://github.com/expressjs/morgan) default dev logging is good for auto logging incoming requests.
- Metrics Reporting / Alerting
	- [Prometheus](https://prometheus.io/)
- Testing
	- [JEST](https://jestjs.io/)
	- Will try and get the functionality going for a demo, then return to focus on testing.
- Data persistence
	- For the sake of demonstration, we'll use SQLite to persist data on our server.
	- In production, we might use something like PostgreSQL instead. The migration and data replication process between the staging and development databases might be supported by a scheduled map/reduce job.
- Containerization
	- I would use Docker generally, but it doesn't give us any benefit for the demo, so I'll omit it for the sake of time.
## Data Models

Our service requires the need for a database as well. Since we're building an application for demonstration purposes, we can likely use an ORM to easily switch between database types while keeping the same data models. We can use [Prisma](https://www.prisma.io/express) to interface with SQlite for development, and MySQL in production. I don't think there are any strong needs for a type of NoSQL database to be used here aside from ease of migration, but I doubt we'll need to do that often for these core models.

Our application will be built around a few different concepts and associated data models:

- Hunters (Users)
	- An avatar - Something to represent themselves
	- Information about the hunter - name, email, location, ect.
	- Contain all a hunters owned posts
- Automobile Captures (Porsche Vehicles)
	- Model information - taken from [models](https://www.porsche.com/usa/models/)
- Hunt Results (Posts)
	- Display pictures and a user written account of the hunt
	- Hunters can flag these posts as private
	- Each hunt will have its own page, sort of like an instagram post
	- Any hunter will be able to view all of their respective hunt results on their own profiles

```typescript
interface Hunter {
	id: string;
	uuid: string;
	firstName: string;
	lastName: string;
	huntername: string;
	password: string; // This would be a hash of course. Likely bcrypt.
	emailAddress: string;
	dateOfBirth: Date;
};
```

```typescript
interface AutomobileCapture {
	id: string; // There will be a finite set of these objects.
	imageUrls: string[];
	model: string;
	type: string;
};
```

```typescript
interface HuntResultsPost{
	id: string;
	uuid: string;
	authorId: string; // uuid of the post author
	title: string;
	location: string;
	blogContent: string;
	isPrivate: boolean;
};
```

## Services
Because we are limited on time and resources (one week and no additional funding), rather than having each service coupled to its own server to help with scalability and separation of concerns, we'll build each service into a single server. With this in mind, we can architect the server to separate the services it provides as much as possible for future micro-service architecture breakout.

The Porsche Hunter Server will provide the following services:
- **Hunter Authentication Service** 
	- login, signup, authenticate accounts with passwords. 
	- Will think about handling a delete, but that could require a bit of effort depending on dependencies, which we'll consider later.
	- Generally you might want to implement a type of 2-factor authentication. Since we're using an express baser server, I'll be utilizing the passport js middleware. If it has an option for 2-factor authentication, I'll certainly look into it.
- **Hunter Post service** 
	- A new post is created when a hunter wants to capture an image of a Porsche in the wild, or upload an image of the same context.
	- The service should be able to return a hunt result on demand.
- **Image Service**
	- Raw image data will not be handled by the service itself. Typically this is done over a content delivery network (CDN, usually something like an AWS S3 bucket), and the URL of the request to upload to the CDN is stored in metadata on the websites servers.
	- For our demo and development purposes, our image files will be stored locally as I (the developer) do not have access to a CDN API.
	- The client will save the file and we can store the filepath to emulate what would take place with a normal CDN, which does a similar thing (client makes post request to CDN with pictures as data)
	- We could also potentially figure out how to host a CDN endpoint on our monolith server for demonstration purposes. There appears to be a package named [multer](https://www.npmjs.com/package/multer) which allows you to do this fairly easily.
- **Wall Service**
	- This is a bonus feature which will take all hunters that a particular hunter is following, and return their latest hunt results in a timeline.
	- I'm not imagining a lot of additional functionality aside from that, but we might revisit this section if time permits.
	- The wall service will also handle hunter profile pages.

Each of the listed services above will consist of a collection of REST endpoints in our monolithic server.

Hunter Auth Service API
```json
POST /apiv1/signup       // takes in a body of data to create a new user
body {
	"huntername": "porscheman33",
	"firstName": "John",
	"lastName": "Appleton",
	"email": "example@marcusjefferson.dev",
	"DOB" : "17-11-1993" // Date format would be important to note. UTC-8
}
POST /apiv1/login        // starts a cookie session for the user if passed auth
body {
	"email": "example@marcusjefferson.dev",
	"password": "********"
}
```

Authentication will take place via a unique session id stored in a browser cookie. The service will include authentication middleware to gate sensitive endpoints.

Hunter Post Service API (authentication required)
```json
POST /apiv1/publish_post  // creates a new hunt post
body {
	"title": "Found new 911",
	"location": "23.2134, -32.32532",
	"blogContent": "A huge string of text spanning multiple paragraphs related to this post...",
	"isPrivate": "false"
}

PUT /apiv1/edit_post      // edits an existing post
body {
	"post_uuid": "123e4567-e89b-12d3-a456-426614174000",
	"title": "Found new 911",
	"location": "23.2134, -32.32532",
	"blogContent": "EDITED: different content...",
	"isPrivate": "false"
}

DELETE /apiv1/remove_post // removes an existing post
GET /apiv1/view_post      // retrieves a specific hunt result post to be viewed.
```

Image Service API
```json
POST /mini_cdn/upload     // upload an image to the contend delivery network
GET /mini_cdn             // retrieve an image from the content delivery network
```

Wall Service API (**Bonus Functionality**, authentication required)
```json
GET /apiv1/render_wall    // generate a wall for the user in the request
GET /apiv1/render_profile // generate a profile page for the user in the reuqest
PUT /apiv1/edit_profile   // edit a profile page for the logged in user
```
