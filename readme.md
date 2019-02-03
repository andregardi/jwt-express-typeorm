
# Creating a Rest API with JWT authentication and role based authorization using TypeScript…



Today, we are going to use TypeScript Express.js and TypeORM to create an enterprise level Rest API with JWT authentication and role based authorization. The objective is to create a repository that you can use as bases for your real life projects.

Before we start, it is recommended that you are familiar with the following topics. You don’t need to be an expert but, if you never heard about one of those, I selected an introductory reading:

**What is a Rest API and basics http response codes**
[**What is REST API: a beginner’s guide**
*As this is a beginner's guide I will not be using various technical jargon involved but a simple example and…*medium.com](https://medium.com/@parastripathi/what-is-rest-api-a-beginners-guide-700e4931e67c)

**What is a JWT and why we use it to make stateless authentications**
[**5 Easy Steps to Understanding JSON Web Tokens (JWT)**
*In this article, the fundamentals of what JSON Web Tokens (JWT) are, and why they are used will be explained. JWT are…*medium.com](https://medium.com/vandium-software/5-easy-steps-to-understanding-json-web-tokens-jwt-1164c0adfcec)

**What is an ORM (Object-Relational-Mapper)**
[**What is an ORM and Why You Should Use it**
*An introduction to Object-Relational-Mappers*blog.bitsrc.io](https://blog.bitsrc.io/what-is-an-orm-and-why-you-should-use-it-b2b6f75f5e2a)

## Why TypeORM?

![](https://cdn-images-1.medium.com/max/2000/0*10ldIs5O8Y1kXzDn.png)

TypeORM allows you to write only one TypeScript Class and, with the synchronize tool, it automatically generates all SQL structure for your entity. With the class-validator package we can use the same model class to make validations.

It is compatible with MySQL / MariaDB / Postgres / SQLite / Microsoft SQL Server / Oracle / sql.js / MongoDB. You can switch between those databases without having to rewrite your code.

We are going to start this project with SQLite. I don’t recommend keeping it for production. But, because I don’t know what DB you are going to use, it allows us to make a generic project that you can run with just “npm install”, without having to setup a database server.

## Let’s start

TypeORM has a CLI tool that allow us to generate a base application already in TypeScript. To use this tool we need first to install typeORM as a global dependency:

    npm install -g typeorm

Now we can set up our application:

    typeorm init --name jwt-express-typeorm --database sqlite --express

It will create an example express application already in TypeScript with TypeORM and body-parser. Let’s install those dependencies with:

    npm install

Now, we are going to install some additional dependencies

    npm install -s helmet cors jsonwebtoken bcryptjs class-validator ts-node-dev

After that, we are going to have the following dependencies

**helmet**
Help us to secure our application by setting various HTTP headers

**cors**
Enable cross-origin Requests

**body-parser**
Parses the client’s request from json into javascript objects

**jsonwebtoken**
Will handle the jwt operations for us

**bcryptjs**
Help us to hash user passwords

**typeorm**
The ORM we are going to use to manipulate database

**reflect-metadata**
allow some annotations features used with TypeORM

**class-validator** 
A validation package that works really well with TypeORM

**sqlite3** 
We are going to use sqlite as dev database

**ts-node-dev**
Automatically restarts the server when we change any file

### Installing type check dependencies 

Since we are working with TypeScript, it is a good idea to install @types for our dependencies.

    npm install -s @types/bcryptjs @types/body-parser @types/cors @types/helmet @types/jsonwebtoken

After that you will be able to use autocomplete and typecheck even with the JavaScript packages.

## The src folder

The TypeORM CLI created a src folder which contains all typescript files. Now we are going to modify those files to create our API.

![](https://cdn-images-1.medium.com/max/2000/1*ctZ7uPNEt8Xmknjb2OH8eA.png)

### Index

The CLI already created a index.ts file as an entry point to the application. Let’s rewrite to better fit our purposes.

<iframe src="https://medium.com/media/6df2347b44ede42cf193c0f18c247053" frameborder=0></iframe>

### The routes

The CLI also created a routes.ts file. On large projects, it might not be a good idea to put all routes on the same file. We are going to create a routes/folder, with a routes/index.ts which aggregates routes from others files.

**routes/auth.ts**

<iframe src="https://medium.com/media/708d2c2b3f101a6ca8f5ecb2c6169fb5" frameborder=0></iframe>

**routes/user.ts**

<iframe src="https://medium.com/media/472fc979f26c1eacc7a6d93032d6b0c1" frameborder=0></iframe>

**routes/index.ts**

<iframe src="https://medium.com/media/46daadff8d99cc279fb86e8a87718ce4" frameborder=0></iframe>

To access the login route, for example, you will call:

    http://localhost:3000/auth/login

### Middleware

As you can see, the routes call  some middlewares before calling the controller. A middleware is really just a function that manipulates your request and call the next middleware. The best way to understand is to create your first middleware.

**middlewares/checkJwt.ts
**This middleware will be called on every route that requires a logged user. It will check if we have a valid JWT on the request header. If the token is valid, it will call the next function that will be handled by the controller. Otherwise, it will send a response with the 401 (unauthorized) status code.

<iframe src="https://medium.com/media/b9f66cd6a82be44487104ee6cb7d5f02" frameborder=0></iframe>

**middlewares/checkRole.ts**
Even if a user is validly logged in, he may try to access a route that he may not have role authorization to access. This middleware will check if the logged user really have the role required to access this route. If not, respond with 401 (unauthorized) status code. Note that we made roles as an Array of strings. That is because you may need, in the future, multiple roles to access the same route.

<iframe src="https://medium.com/media/2e433ee3431143c679efe2dffd82c33a" frameborder=0></iframe>

### The config file

To generate and validate a jwt token we need a secret key. We will be storing it on a config file. You can change your jwtSecret to any string you want.

**config/config.ts**

<iframe src="https://medium.com/media/2e6bb7c6441ad9873a6b7aefc659f8b7" frameborder=0></iframe>

### The User entity

The CLI already created a “entity/User.ts” file. But we want to change the fields, add validations and create methods for hash the password. So we need to rewrite this class.

**entity/User.ts**

<iframe src="https://medium.com/media/985dfa7ced4bd1bce103b2062b1a83e3" frameborder=0></iframe>

### The Controllers

The CLI also created a folder named controller. You can delete this, and create another named controllers(plural). Then we will create the auth and the user controllers.

**controllers/AuthController.ts**

<iframe src="https://medium.com/media/240e3a6834b1ffe44d92e60bf47b081f" frameborder=0></iframe>

**controllers/UserController.ts**

<iframe src="https://medium.com/media/2849baabd84748a5e9c8eec80f393a1f" frameborder=0></iframe>

### A request flow through the files

We wrote a lot of code and it is ok lose track of in which order each file is called. For that reason I created a simple chart that exemplifies the flow an user’s requests that requires to check a role and uses a function from userController.

![](https://cdn-images-1.medium.com/max/2116/1*cYneDhjzkAKDJBTEJ4rDog.png)

## Development and Production Scripts

![](https://cdn-images-1.medium.com/max/2428/1*l5Eb6PGvHR0AB2XZsdCLBg.png)

The Node.js itself can’t run, natively, .tsfiles. For that reason is important to know the following tools.
"tsc" — create a /build folder and converts all your .ts to .jsfiles.
"ts-node" — allows node to run .ts projects. Not recommended for production uses.
"ts-node-dev" — same as above, but allows you restart the node server every time you change a file

To better setup development and production environments, we will modify the script session of the package.json. 

<iframe src="https://medium.com/media/5c66379601b23108065e13e7a21c0414" frameborder=0></iframe>

Finally, we add a last line called smigration:run. Some windows users get an error trying to run TypeORM migrations from npm. Running it directly from the node modules folder solves the problem.

## What about the first user?

As you can see, even to create a new user we need to already have an ADMIN. This first user will be created by a migration process. Migrations are also very important to maintain your production database. If you are going to use TypeORM in production, I really recommend reading the migration documentation:
[http://typeorm.io/#/migrations](http://typeorm.io/#/migrations)

Now, let’s create our first migration

    typeorm migration:create -n CreateAdminUser

Then, we are going to modifie the generated file:

<iframe src="https://medium.com/media/ef897cdd1c33701c34e313038290d826" frameborder=0></iframe>

Now we start the server, so the synchronize tool can generate our database tables.

    npm start

Now we can run the migration, to insert the first admin user.

    npm run migration:run

Finally, your server is ready to go. Just get the Postman, or any other tool, and make some requests.

The final repository can be found on GitHub:
[**andregardi/jwt-express-typeorm**
*Rest API with JWT authentication and role based authorization using TypeScript Express.js and TypeORM …*github.com](https://github.com/andregardi/jwt-express-typeorm)


