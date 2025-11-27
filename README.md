# FarmerFriendlyWebApp 🌾

A full-stack web application connecting farmers and buyers in the agricultural marketplace.

## 🚀 Features

### For Farmers
- **Authentication**: Secure login/registration with role-based access
- **Crop Management**: Add, view, and manage crop listings
- **Image Upload**: Upload crop images with automatic storage
- **Dashboard**: Comprehensive farmer portal with crop statistics

### For Buyers
- **Product Catalog**: Browse all available crops and products
- **Shopping Cart**: Add items to cart with quantity management
- **Payment Integration**: Direct buy or cart-based payment options
- **Search & Filter**: Find products by category and type

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.x** - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **MySQL 8.0** - Database
- **BCrypt** - Password encryption
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **Material-UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## 📋 Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

## 🚀 Quick Start

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vineethnaik/FarmerFriendlyWebApp.git
   cd FarmerFriendlyWebApp
   ```

2. **Database Setup**
   ```sql
   CREATE DATABASE agrizen_db;
   USE agrizen_db;
   
   -- Users table for authentication
   CREATE TABLE users (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(150) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       role ENUM('FARMER', 'BUYER') NOT NULL
   );
   
   -- Farmers table
   CREATE TABLE farmers (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(150) NOT NULL UNIQUE,
       phone VARCHAR(20),
       location VARCHAR(200),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Crop listings table
   CREATE TABLE crop_listings (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       farmer_id BIGINT NOT NULL,
       crop_name VARCHAR(100) NOT NULL,
       crop_type VARCHAR(50) NOT NULL,
       quantity INT NOT NULL,
       price DECIMAL(10,2) NOT NULL,
       harvest_date DATE NOT NULL,
       location VARCHAR(200) NOT NULL,
       description TEXT,
       image_url VARCHAR(500),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
   );
   ```

3. **Configure Application**
   ```bash
   cd backend
   # Update src/main/resources/application.properties with your database credentials
   ```

4. **Run Backend**
   ```bash
   mvn spring-boot:run
   ```
   Backend will be available at `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd React-FMS-main
   npm install
   ```

2. **Environment Configuration**
   Create `.env` file:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8080/api
   ```

3. **Run Frontend**
   ```bash
   npm start
   ```
   Frontend will be available at `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Farmer Operations
- `GET /api/farmers/by-email` - Get farmer by email
- `POST /api/farmers` - Create farmer
- `POST /api/farmers/{farmerId}/crops` - Add crop listing
- `GET /api/farmers/{farmerId}/crops` - Get farmer's crops
- `DELETE /api/crops/{cropId}` - Delete crop listing

### Buyer Operations
- `GET /api/crops` - Get all crop listings

## 🎯 User Roles

### Farmer
- Register/Login with FARMER role
- Access farmer dashboard at `/farmer-dashboard`
- Add crop listings with images
- Manage existing listings

### Buyer
- Register/Login with BUYER role
- Access buyer dashboard at `/home`
- Browse all products
- Add items to cart
- Make purchases

## 🚀 Deployment

### GitHub Actions CI/CD

The project includes automated CI/CD pipelines:

1. **Backend Pipeline** (`.github/workflows/backend-deploy.yml`)
   - Runs on backend changes
   - Tests with MySQL service
   - Builds JAR artifact
   - Deploys to Render (if configured)

2. **Frontend Pipeline** (`.github/workflows/frontend-deploy.yml`)
   - Runs on frontend changes
   - Tests React components
   - Builds production bundle
   - Deploys to Netlify (if configured)

3. **Release Pipeline** (`.github/workflows/full-stack-deploy.yml`)
   - Runs on version tags
   - Creates GitHub releases
   - Uploads build artifacts

### Required Secrets

Configure these secrets in your GitHub repository:

- `RENDER_SERVICE_ID` - Render service ID for backend deployment
- `RENDER_API_KEY` - Render API key
- `NETLIFY_AUTH_TOKEN` - Netlify authentication token
- `NETLIFY_SITE_ID` - Netlify site ID
- `REACT_APP_API_BASE_URL` - Frontend API base URL

### Docker Desktop (Full Stack)

1. **Prepare environment variables**
   ```bash
   cp deploy/docker.env.example .env
   # edit .env with MySQL creds, Gmail App Password, JWT secret, etc.
   ```
2. **Build & launch**
   ```bash
   docker compose build
   docker compose up -d
   ```
3. **Service endpoints**
   - Frontend (React + Nginx): http://localhost:3000
   - Backend (Spring Boot): http://localhost:8080
   - OTP Service (Node): http://localhost:5000
   - MySQL: localhost:3306 (credentials from `.env`)

`mysql_data` and `backend_uploads` volumes keep your DB + images between restarts. Stop everything with `docker compose down` (add `-v` to clear volumes).

### Admin OTP Microservice

If you want to enforce the new OTP-only admin login flow:

1. Copy `otp-auth-backend/` to your server.
2. Create an `env` file from `env.sample` and set:
   - `ALLOWED_ADMIN_EMAIL=pandu31417@gmail.com`
   - `GMAIL_USER` plus a Gmail App Password (see instructions below).
   - `FRONTEND_ORIGIN` pointing to your React site.
3. Install dependencies & run:
   ```bash
   cd otp-auth-backend
   npm install
   npm start
   ```
4. In `Frontend/.env`, set `REACT_APP_ADMIN_OTP_API` to the OTP server URL (e.g., `http://localhost:5000/api/admin/otp`).
5. The React `AdminLogin` component already points to this service and will redirect the admin to `/admin-dashboard` on successful OTP verification.

#### Generating a Gmail App Password
1. Enable 2-Step Verification on the Gmail account that will send OTP emails.
2. Visit [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Choose **Mail** as the app and **Other** for device (name it, e.g., `Agrizen OTP`).
4. Click **Generate** and copy the 16-character password.
5. Use that value for `GMAIL_APP_PASSWORD` in your OTP service environment file.
6. Never commit the real password—store it via secret managers or CI secrets.

## 📁 Project Structure

```
FarmerFriendlyWebApp/
├── backend/                          # Spring Boot backend
│   ├── src/main/java/com/agrizen/
│   │   ├── auth/                     # Authentication module
│   │   ├── farmer/                   # Farmer operations
│   │   └── config/                   # Configuration
│   ├── src/main/resources/
│   └── pom.xml
├── React-FMS-main/                   # React frontend
│   ├── src/components/
│   │   ├── FarmerDashboard.jsx       # Farmer portal
│   │   ├── AddCropForm.jsx          # Add crop form
│   │   ├── FarmerCropsList.jsx      # Crop listings
│   │   └── ...                      # Other components
│   ├── public/
│   └── package.json
├── uploads/                          # Image uploads
├── .github/workflows/                # CI/CD pipelines
├── otp-auth-backend/                 # Node OTP microservice (admin login)
├── docker-compose.yml                # Docker Desktop orchestration
├── Backend/Dockerfile                # Spring Boot container
├── Frontend/Dockerfile               # React build + Nginx server
├── otp-auth-backend/Dockerfile       # OTP service container
└── deploy/docker.env.example         # Sample env file for compose
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vineeth Naik**
- GitHub: [@vineethnaik](https://github.com/vineethnaik)

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- Material-UI for beautiful React components
- React team for the amazing framework