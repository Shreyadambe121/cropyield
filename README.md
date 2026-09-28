# CROPWISE – AI-Based Crop Yield Prediction & Crop Selection System

CROPWISE is a full-stack agritech application for crop yield prediction and crop selection using a Random Forest machine learning workflow inspired by district-level agricultural research.

## Features
- Crop yield prediction using Random Forest Regressor
- Crop suitability recommendation using Random Forest Classifier
- User dashboard and prediction history
- PostgreSQL-ready relational schema
- Analytics charts for seasonal and district trends
- Responsive React + Tailwind frontend

## Project structure

```text
.
├── backend/
│   ├── app/
│   ├── models/
│   ├── .env.example
│   ├── requirements.txt
│   └── .venv/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── data/
│   └── crop_yield.csv
├── README.md
├── render.yaml
└── .gitignore
```

## Local setup

### 1. Install backend dependencies

```bash
cd /workspaces/cropyield/backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### 2. Configure environment variables

Backend example:

```bash
cp backend/.env.example backend/.env
```

Example values:

```env
DATABASE_URL=sqlite:///./cropwise.db
SECRET_KEY=change-me-to-a-long-random-secret
FRONTEND_URL=http://localhost:5173
```

Frontend example:

```bash
cp frontend/.env.example frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Train the machine learning models

```bash
cd /workspaces/cropyield/backend
PYTHONPATH=. python -m app.ml.train_model
```

This creates the two saved model files in `backend/models/`.

### 4. Start the backend

```bash
cd /workspaces/cropyield/backend
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Start the frontend

In a second terminal:

```bash
cd /workspaces/cropyield/frontend
npm install
npm run dev -- --host 0.0.0.0
```

Open:
- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs

## API testing

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/crops
curl -X POST http://localhost:8000/api/predict-yield \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Maharashtra",
    "district": "Nashik",
    "crop": "Rice",
    "season": "Kharif",
    "area": 2.5,
    "rainfall": 1200,
    "temperature": 28
  }'
```

## Dataset note

A sample crop dataset is included at `/data/crop_yield.csv` for development and testing. It is intentionally marked as sample data and can be replaced later with a real district-level agricultural dataset.

## Deployment on Render

### Backend
1. Create a Python web service on Render.
2. Leave the root directory unset so the backend can access the repository-level `data/` directory.
3. Use build command:

```bash
pip install -r backend/requirements.txt
```

4. Use start command:

```bash
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT
```

5. Add environment variables:
- `DATABASE_URL`
- `SECRET_KEY`
- `FRONTEND_URL`

### Frontend
1. Create a Static Site on Render.
2. Set root directory to `frontend`.
3. Use build command:

```bash
npm install && npm run build
```

4. Set publish directory to `dist`.
5. Add environment variable:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### PostgreSQL

Create a Render PostgreSQL instance and populate the database URL in `DATABASE_URL`.

## Research alignment

This project follows the same broad methodology described in the crop yield prediction research:
- district and climate-based crop data
- Random Forest regression for yield
- Random Forest classification for crop suitability
- preprocessing, training, and model evaluation
- web-based prediction workflow

## Important note

The model metrics are generated from the sample dataset included in the project and are not assumed values.
