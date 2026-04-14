# StayHub
StayHub is a full-stack web application inspired by Airbnb that allows users to explore, create, review, and manage property listings. The platform includes authentication, authorization, image uploads, and smart features like search and reviews.

 Features
🔐 Authentication & Authorization
User signup & login
Session-based authentication using Passport.js
Authorization for:
Editing & deleting listings (only owner)
Adding/deleting reviews (authorized users)
🏠 Listings
Create, edit, delete listings
Upload images using Cloudinary
View detailed listing pages
Responsive UI with modern design
⭐ Reviews System
Add reviews with star ratings
Delete reviews (authorized users only)
Dynamic review display
🔍 Search Functionality
Search listings by:
Title
Location
Country
Case-insensitive search using MongoDB regex
🖼️ Image Upload
Integrated with Cloudinary
Supports image upload during:
Listing creation
Listing update
🎨 UI/UX
Clean Airbnb-inspired design
Bootstrap + custom CSS styling
Responsive navbar and forms
Interactive components
🛠️ Tech Stack
💻 Frontend
HTML, CSS, JavaScript
Bootstrap
EJS (Templating)
⚙️ Backend
Node.js
Express.js
🗄️ Database
MongoDB
Mongoose
🔐 Authentication
Passport.js
express-session
☁️ Cloud Services
Cloudinary (Image Upload)
📁 Project Structure (MVC)
StayHub/
│
├── models/         # Mongoose models
├── routes/         # Route handlers
├── controllers/    # Business logic (MVC)
├── views/          # EJS templates
├── public/         # Static files (CSS, JS)
├── utils/          # Helper functions
├── middleware.js   # Custom middleware
└── app.js          # Main server file
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/stayhub.git
cd stayhub
2️⃣ Install dependencies
npm install
3️⃣ Setup environment variables

Create a .env file:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
4️⃣ Run the app
node app.js

Visit:

http://localhost:8080
