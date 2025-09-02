# Ajo Contribution Tracker

A full-stack application to manage and track contributions in an *Ajo* (local savings group).  
Built with **Flask (Python)** for the backend and **React (JavaScript)** for the frontend.  

---

## 🚀 Features
- 📝 Sign up members under a specific group
- 👥 Manage groups and contributors
- 💰 Track contributions and payouts
- 📊 Dashboard with group contribution history
- ⚡ REST API backend + React frontend

---

## 🛠 Tech Stack
**Frontend**
- React
- TailwindCSS
- Axios  

**Backend**
- Flask
- PostgreSQL (or SQLite for dev)
- SQLAlchemy  

---

## 📂 Project Structure

Ajo_Contribution_Tracker/
│
├── backend/ # Flask API
│ ├── app.py
│ ├── requirements.txt
│ └── ...
│
├── frontend/ # React frontend
│ ├── src/
│ ├── package.json
│ └── ...
│
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/mayordagold/Ajo_Contribution_Tracker.git
cd Ajo_Contribution_Tracker

cd backend
python -m venv venv
venv\Scripts\activate   # On Windows
source venv/bin/activate  # On Mac/Linux

pip install -r requirements.txt
flask run
Backend will start at http://127.0.0.1:5000

cd frontend
npm install
npm start
Frontend will start at http://localhost:3000

Create a .env file inside backend/:
FLASK_ENV=development
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/ajo_db

For frontend (frontend/.env):
REACT_APP_API_URL=http://127.0.0.1:5000

🤝 Contributing

Fork the repo

Create a new branch (git checkout -b feature-name)

Commit changes (git commit -m "Added new feature")

Push to branch (git push origin feature-name)

Create a Pull Request
