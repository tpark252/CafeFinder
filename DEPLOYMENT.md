# Deployment Guide for CafeFinder

This guide outlines how to deploy your CafeFinder application using free-tier services.

## Architecture
- **Frontend:** React + Vite (deployed on Vercel)
- **Backend:** Spring Boot (deployed on Railway)
- **Database:** MongoDB (hosted on MongoDB Atlas)

## 1. MongoDB Atlas (Database)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create free M0 cluster
3. Network Access: Add IP or allow `0.0.0.0/0` for Railway
4. Database Access: Create database user
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/cafe_finder?retryWrites=true&w=majority`

## 2. Railway (Backend)
1. Create account at [Railway](https://railway.app/)
2. New Project → Deploy from GitHub Repo
3. Select `CafeFinder` repository, set root directory to `backend/`
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `CORS_ALLOWED_ORIGINS`: Your Vercel frontend URL (add after deployment)
5. Get backend URL (e.g., `https://cafefinder-backend.up.railway.app`)

## 3. Vercel (Frontend)
1. Create account at [Vercel](https://vercel.com/)
2. Import Project → Select `CafeFinder` repository
3. Set Root Directory to `frontend/`
4. Add environment variables:
   - `VITE_API_URL`: Your Railway backend URL
   - `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
5. Deploy and get frontend URL

## 4. Update CORS
In Railway, update `CORS_ALLOWED_ORIGINS` with your Vercel URL.

## Cost: $0/month for all services on free tier!
