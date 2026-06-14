# 🚀 Store Rating System - Project Flow Explanation

This file explains the architecture, folder structure, database tables, and step-by-step flow of the **Store Rating System** in simple and easy English.

---

## 1. 📝 Project Overview
This project is a multi-role web application where various stores are listed, and regular users can rate them from **1 to 5 stars**. The system has three main types of users (roles):
1. **Admin (System Admin):** Manages the entire system. Can add new users, create new stores, and assign owners to stores.
2. **Store Owner:** Manages their own store. Can see their store's performance dashboard, average ratings, and review history.
3. **Regular User:** Can search, sort, and browse stores. Can view store details and submit or update their rating for any store.

---

## 2. 💻 Tech Stack (Technologies Used)
*   **Frontend (Client):** 
    *   **React.js (Vite)** - For building the user interface.
    *   **React Router Dom** - For page navigation and routing.
    *   **Tailwind CSS (v4)** - For styling and responsive design.
    *   **Axios** - For making API requests to the backend.
    *   **React Toastify** - For showing success and error popup notifications.
*   **Backend (Server):**
    *   **Node.js & Express.js** - For creating the backend server and REST APIs.
    *   **JWT (JSON Web Tokens)** - For user login sessions and security.
    *   **Bcrypt.js** - For encrypting user passwords before saving them in the database.
*   **Database:**
    *   **MySQL (with `mysql2` pool)** - For storing all system data.

---

## 3. 🗃️ Database Structure (Tables)
The database contains three main tables:

### A. `users` Table
Stores details of all registered people.
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | INT (Primary Key) | Unique ID for each user (auto-incremented). |
| `name` | VARCHAR | User's full name (20 to 60 characters). |
| `email` | VARCHAR (Unique) | User's email address used for login. |
| `password` | VARCHAR | Encrypted password (hashed). |
| `address` | VARCHAR | User's address (Maximum 400 characters). |
| `role` | ENUM | The role of the user: `'user'`, `'owner'`, or `'admin'`. |

### B. `stores` Table
Stores details of all shops or stores.
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | INT (Primary Key) | Unique ID for each store. |
| `name` | VARCHAR | Name of the store. |
| `email` | VARCHAR | Contact email of the store. |
| `address` | VARCHAR | Physical address of the store. |
| `owner_id` | INT (Foreign Key) | The ID of the owner user (`users.id`). |

### C. `ratings` Table
Stores the feedback ratings given by users to stores.
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | INT (Primary Key) | Unique ID for each rating. |
| `user_id` | INT (Foreign Key) | ID of the user who gave the rating. |
| `store_id` | INT (Foreign Key) | ID of the store being rated. |
| `rating` | INT | Number of stars given (from 1 to 5). |
| `created_at` | TIMESTAMP | Date and time when the rating was submitted. |

---

## 4. 👤 Roles & Permissions Matrix
Here is a list of what each user role is allowed to do in the system:

| Feature / Action | Admin (`admin`) | Store Owner (`owner`) | Regular User (`user`) |
| :--- | :---: | :---: | :---: |
| **Login / Register** | ✅ Yes | ✅ Yes (Only Login) | ✅ Yes |
| **Add New Store** | ✅ Yes | ❌ No | ❌ No |
| **Add / Manage Users** | ✅ Yes | ❌ No | ❌ No |
| **View Dashboards** | ✅ Yes (Stats) | ✅ Yes (Store Stats) | ❌ No |
| **Browse / Search Stores** | ✅ Yes | ❌ No | ✅ Yes |
| **Submit Store Rating** | ❌ No | ❌ No | ✅ Yes (Max 1 per store) |
| **Update Own Rating** | ❌ No | ❌ No | ✅ Yes |
| **Change Own Password** | ✅ Yes | ✅ Yes | ✅ Yes |

---

## 5. 📁 Folder Structure Explained

```
store-rating/
├── client/                     # Frontend Code (React)
│   ├── src/
│   │   ├── components/         # Reusable HTML/React UI parts
│   │   │   ├── layout/Navbar.jsx
│   │   │   └── store/StoreCard.jsx
│   │   ├── context/
│   │   │   └── authContext.jsx # Manages active login sessions & tokens
│   │   ├── pages/              # Main page views
│   │   │   ├── admin/Dashboard.jsx      # Admin UI (User & Store Lists)
│   │   │   ├── auth/                    # Login, Register, & Password Change UIs
│   │   │   ├── owner/OwnerDashboard.jsx # Owner Dashboard (ratings & feedback list)
│   │   │   └── user/                    # User Pages (Store list, Store detail page)
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx       # Blocks unauthorized users from pages
│   │   ├── services/
│   │   │   ├── api.js          # Pre-configured Axios instance (injects token)
│   │   │   └── authService.js  # Functions to call backend login APIs
│   │   └── App.jsx             # Connects URL paths to specific React pages
└── server/                     # Backend Code (Node/Express/MySQL)
    ├── server.js               # Entry point of the server
    └── src/
        ├── config/db.js        # Configures MySQL database connection
        ├── middleware/
        │   ├── authMiddleware.js # Validates if incoming API requests have a valid token
        │   └── roleMiddleware.js # Limits APIs to specific roles (e.g., admin only)
        ├── routes/             # Defines API endpoints (/api/auth, /api/user, etc.)
        └── controllers/        # Logical backend tasks (register, rate, fetch data)
```

---

## 6. 🔄 Step-by-Step App Flow

### Step 1: User Login & Registration
1. **Registration:**
   - A new user fills the register form (`/register`) with their Name, Email, Password, and Address.
   - The backend validates the inputs. If valid, the password is encrypted using `bcrypt` and saved to the database. The new user's role is automatically set to `'user'`.
2. **Login:**
   - The user inputs email and password on the login screen (`/`).
   - The backend checks the email and matches the password. If correct, the server generates a secure **JWT (JSON Web Token)**.
   - The client saves this token and the user's role/details in `localStorage` and React context (`authContext`).

### Step 2: Route Security (ProtectedRoute)
- Whenever a user tries to change URLs, `ProtectedRoute.jsx` checks:
  - Is the user logged in? If not, they are redirected to the Login page (`/`).
  - Is their role allowed to see this page? If an ordinary user tries to type `/admin/dashboard`, they are instantly redirected back to `/home`.

### Step 3: Regular User Flow
1. **Store Browsing:**
   - After login, the user lands on the Home Page (`/home`). Here they see all active stores.
   - They can use the search bar to find stores by name or address.
   - They can sort stores alphabetically, by location, or by their Average Rating.
2. **Submitting & Updating Ratings:**
   - When a user clicks a store, they go to the Store Details page (`/stores/:id`).
   - They can see details, total ratings, average rating, and a list of individual reviews.
   - The user can select stars (1 to 5) to rate the store.
   - **Limit:** A user can only submit one rating per store. If they have already rated the store, they will see an "Update Rating" button instead of "Submit", allowing them to modify their existing score.

### Step 4: Store Owner Flow
- Once a Store Owner logs in, they are redirected to `/owner/dashboard`.
- The backend identifies their store using their logged-in ID.
- The dashboard displays:
  - The store details (name, email, address).
  - The calculated **Average Rating** of the store.
  - A chronological list of all ratings, showing the user's name, email, star score, and the submission date.
- Store owners cannot add or edit stores or users.

### Step 5: System Admin Flow
1. **Dashboard Overview:**
   - Logs into `/admin/dashboard` and views counts of total registered users, total stores, and total submitted ratings.
2. **User Management:**
   - Admin can view, search, and sort all users.
   - Admin can manually create new users with roles like `'user'`, `'owner'`, or `'admin'`.
3. **Store Management:**
   - Admin can create new stores by filling a form (name, email, address, and owner ID).
   - **Constraint:** A store owner can only manage one store. The admin cannot assign a store to someone who already owns one.
   - Admin can click on any store to inspect its details and review history.

---

## 7. 🔌 Backend API Map

| Endpoint Route | HTTP Method | Who Can Use It? | What Does It Do? |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | Public (Anyone) | Creates a new regular user. |
| `/api/auth/login` | `POST` | Public (Anyone) | Validates credentials and returns a JWT token. |
| `/api/user/update-password`| `PUT` | ✅ All Logged-in | Updates password for the active session user. |
| `/api/admin/stats` | `GET` | ✅ Admin Only | Gets system counts for the admin dashboard. |
| `/api/admin/users` | `GET` / `POST`| ✅ Admin Only | Lists users or creates a new user. |
| `/api/admin/stores` | `GET` / `POST`| ✅ Admin Only | Lists stores or creates a new store. |
| `/api/store` | `GET` | ✅ All Logged-in | Retrieves stores with their average ratings. |
| `/api/store/:id` | `GET` | ✅ All Logged-in | Gets details and feedback history of a store. |
| `/api/store/owner-dashboard`| `GET` | ✅ Owner Only | Gets stats and ratings list for the owner's store. |
| `/api/rating` | `POST` | ✅ User Only | Submits a new star rating (1 to 5) for a store. |
| `/api/rating/:storeId` | `PUT` | ✅ User Only | Updates an existing rating for a store. |

---
