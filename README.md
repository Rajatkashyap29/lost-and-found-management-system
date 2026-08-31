# 🔎 Lost and Found Management System

A full-stack **Lost and Found Management System** designed to help users report, manage, and find lost or found items in a simple and organized way.

## 🚀 Features

### 👤 User Authentication

* User Registration
* User Login
* JWT Authentication
* User Profile
* Logout

### 🔴 Lost Items

* Report a lost item
* View my lost items
* View specific lost item
* Update lost item
* Delete lost item

### 🟢 Found Items

* Report a found item
* View my found items
* View specific found item
* Update found item
* Delete found item

### 📂 Categories

* Fetch available item categories
* Category selection while reporting items

### 🎯 Claims

* Claim lost/found items
* Manage item claims
* Claim handling workflow

### 👨‍💼 Admin

* Admin dashboard
* Manage users
* Manage items
* Manage claims

## 🛠️ Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Pydantic
* JWT Authentication

### Frontend

* React
* JavaScript
* Axios
* React Router
* CSS

## 📁 Project Structure

```text
lost-and-found-management-system/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## 🔐 Authentication

The application uses **JWT-based authentication**.

Authenticated requests send the token using the `auth` header:

```text
auth: Bearer <token>
```

## ⚙️ Backend Setup

Clone the repository:

```bash
git clone <your-repository-url>
```

Go to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and add your environment variables.

Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Backend will run on:

```text
http://127.0.0.1:8000
```

## ⚛️ Frontend Setup

Go to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## 📌 API Endpoints

### Lost Items

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | `/lost-item`               | Report lost item        |
| GET    | `/see-lost-item`           | View my lost items      |
| GET    | `/see-lost-item/{item_id}` | View specific lost item |
| PUT    | `/lost-item/{item_id}`     | Update lost item        |
| DELETE | `/lost-item/{item_id}`     | Delete lost item        |

### Found Items

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| POST   | `/found-item`               | Report found item        |
| GET    | `/see-found-item`           | View my found items      |
| GET    | `/see-found-item/{item_id}` | View specific found item |
| PUT    | `/found-item/{item_id}`     | Update found item        |
| DELETE | `/found-item/{item_id}`     | Delete found item        |

### General

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | `/items`      | View all items       |
| GET    | `/categories` | Fetch all categories |

## 🔒 Environment Variables

Sensitive information such as:

* Database URL
* JWT Secret Key
* API keys

should be stored in `.env` and **must not be committed to GitHub**.

A `.env.example` file can be used to show the required variables without exposing secrets.

## 📚 Project Status

🚧 **Currently in Development**

The project is being developed incrementally with both backend and frontend features.

## 🎯 Future Improvements

* Advanced item search
* Item filtering by category
* Image upload
* Improved claim verification
* Email notifications
* Admin moderation
* Better dashboard analytics

## 👨‍💻 Author

**Rajat Kashyap**

---

⭐ If you find this project useful, feel free to explore the repository.
