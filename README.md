# Store Rating System

A full-stack web application that allows users to submit ratings for registered stores. The system features role-based authentication with different access levels for System Administrators, Store Owners, and Normal Users.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, Store Owner, Normal User)
- **Password validation** (8-16 chars, uppercase, special character)
- **Protected routes** with middleware authorization

### 👥 User Roles & Permissions

#### 🏛️ System Administrator
- ✅ Create and manage users (all roles)
- ✅ Add and manage stores
- ✅ View comprehensive dashboard with statistics
- ✅ Access to all system data and analytics
- ✅ User management with filtering and search

#### 🏪 Store Owner
- ✅ View store-specific dashboard
- ✅ Monitor store ratings and average scores
- ✅ View customer feedback and ratings
- ✅ Track store performance metrics

#### 👤 Normal User
- ✅ Browse and search all registered stores
- ✅ Submit ratings (1-5 scale) for stores
- ✅ Update previously submitted ratings
- ✅ View personal rating history
- ✅ Search stores by name and address

### 🎯 Core Functionality
- **Store Management**: Complete CRUD operations for stores
- **Rating System**: 1-5 star rating with validation
- **Search & Filter**: Advanced search with sorting options
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Dynamic UI updates without page refresh

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **PostgreSQL** database with optimized queries
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** and **Helmet** for security
- **Rate limiting** for API protection

### Frontend
- **React 18** with **Vite** for fast development
- **React Router** for client-side routing
- **Tailwind CSS** for responsive styling
- **Lucide React** for modern icons
- **Axios** for API communication
- **Context API** for state management

### Development Tools
- **ESLint** for code quality
- **PostCSS** for CSS processing
- **Nodemon** for backend auto-reload

## 📁 Project Structure

```
store-rating-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── database.sql
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── ratingController.js
│   │   │   ├── storeController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── ratingRoutes.js
│   │   │   ├── storeOwnerRoutes.js
│   │   │   └── storeRoutes.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   ├── auth/
    │   │   ├── common/
    │   │   ├── dashboard/
    │   │   ├── store/
    │   │   └── user/
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   ├── constants.js
    │   │   └── validation.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── vite.config.js
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/Vinay-910/store-rating-system.git
cd store-rating-system
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create PostgreSQL database
createdb store_rating_system

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup
```bash
# Run the database schema
psql -d store_rating_system -f src/config/database.sql
```

### 4. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL
```

### 5. Environment Variables

#### Backend (`.env`)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_system
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎮 Running the Application

### Development Mode
```bash
# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT CHECK (LENGTH(address) <= 400),
    role user_role NOT NULL DEFAULT 'normal_user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Stores Table
```sql
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT CHECK (LENGTH(address) <= 400),
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Ratings Table
```sql
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    store_id INTEGER REFERENCES stores(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/update-password` - Update password

### Stores
- `GET /api/stores` - Get all stores (with search/filter)
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create store (Admin only)
- `PUT /api/stores/:id` - Update store (Admin only)
- `DELETE /api/stores/:id` - Delete store (Admin only)

### Ratings
- `POST /api/ratings` - Submit/update rating
- `GET /api/ratings/user` - Get user's ratings
- `GET /api/ratings/store/:id` - Get store's ratings
- `DELETE /api/ratings/:id` - Delete rating

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## ✅ Form Validations

- **Name**: Upto 60 characters and not null
- **Email**: Valid email format
- **Password**: 8-16 characters, uppercase + special character
- **Address**: Maximum 400 characters
- **Rating**: Integer between 1-5

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcrypt
- **Rate Limiting** on authentication endpoints
- **CORS Protection** with specific origin allowlist
- **Input Validation** on both client and server
- **SQL Injection Prevention** with parameterized queries
- **XSS Protection** with Helmet middleware

## 🎨 UI Features

- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme Support** - Consistent color scheme
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time validation feedback
- **Search & Filtering** - Advanced search capabilities
- **Pagination** - Efficient data loading

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Test API endpoints using the provided test file
# Use REST Client extension with test-api.http
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**⭐ If this project helped you, please give it a star!**
