# Feastr Recipe App
Feastr is a recipe app in which a user can create, save, share and search recipes within the Feastr community.

#### Created By: Kelly Hodges, Branislav Todorovic, Vickie Vien


## Deployed Feastr App:
#### [Feastr App](https://feastr.herokuapp.com/)


## User Flow:
![alt text](https://i.imgur.com/24gD2BG.png "recipe userflow")


## Tech Stack:
- MongoDB
- Node.js
- CSS
- JavaScript
- HTML


### API
- Cloudinary for uploading user and recipe photos
- Passport for easy login via Google


###
- Additional Dependencies:
- Mongoose
- Express
- EJS
- Bcrypt
- Flash Message


## Wireframes:
-  Utilized Figma to wireframe all pages of Feastr app with a mobile-first approach to design. Responsive design accross devices (mobile, tablet, desktop)


- Form pages (new user, edit profile, new recipe, edit recipe, etc.)
![alt text](https://i.imgur.com/Ef2xfHT.png "form page wireframes")


- Grid pages (all recipes, saved recipes, created recipes, community)
![alt text](https://i.imgur.com/CKgtefs.png "grid page wireframes")


- User profile page
![alt text](https://i.imgur.com/JtCwEvg.png "profile page wireframe")


- Recipe page
![alt text](https://i.imgur.com/hLdem17.png "recipe page wireframe")


## Restful Routes:
![alt text](https://i.imgur.com/0vWFWmC.png "RESTful Routes")


## Approach:
We utilized a two model approach in which users are able to create, edit, and delete their own recipes while having the ability to view, save, and unsave other community members' recipes.


## MVP:
- A working full-stack application, built by you, using Node.js, Mongoose, Express and EJS
- Adhere to the MVC file structure: Models, Views, Controllers
- A User model with functioning registration, log-in, and log-out abilities.
- At least one non-User model with all 7 RESTful routes and full CRUD.
- Your non-User model is connected to the User that created it
- A git repository not inside the class repo.
- At least one GitHub commit per day.
- Be deployed online and accessible to the public via Heroku.


## Stretch Goals:
- Utilization of EJS Partials
- Implementation of Cloudinary to upload and edit user and recipe photos
- Connected Passport to utilize Google login via gmail


## Additional Notes:
Future stretch goals include implementing and seeding API data, adding search functionality for a more robust recipe application, and cloudinary's image cropping solution. Styling updates include enhancing photo ratio on community grid, displaying individual recipes from grid to flexbox.

### Ownership:
- **Branislav Todorovic:** Led responsibilities across all back-end development. Managed schemas and models of both users and recipes. Co-created and managed all RESTful routes creation and implementation. Took ownership of deployment of Feastr recipe app via Heroku. Collaborated  on implementation of the following APIs - Cloudinary and Passport.js.
- **Kelly Hodges:** Supervised all back-end development responsibilities. Took ownership of the creation of user and recipe schemas and models. Managed and co-created all RESTful routes across all controllers - User, Recipe and Home.  Oversaw implementation of Cloudinary API, Passport.js and deployment of application on Heroku. 
- **Vickie Vien:** Managed all front-end development responsibilities from wireframing Feastr pages with Figma, coding, implementing and rendering all ejs files with a mobile-first approach, creating logo and favicon, applying partials accross all views, ensuring responsiveness across all devices (mobile, tablet, desktop), and styling of all pages with interactivity where necessary for a better user experience.
