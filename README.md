# Zellora

The backend can take up to 1 minute to load since its running on a free server
It winds down after a period of inactivity

## Developer: Austen Cole

## Hosted Link

https://zellora-frontend.onrender.com/

## Hosted With:

https://render.com

## Wire Frames

[WireFrames](/WireFrames/)

## Overview

Zellora is a full-stack Q&A platform that enables users to ask questions, provide answers, and share knowledge with a community. Inspired by platforms like Stack Overflow and Quora, Zellora offers a clean, user-friendly interface for knowledge sharing and problem solving.

The platform features user authentication, question posting with tags, answer submission, voting on content, and comprehensive search functionality. It's designed to be responsive, secure, and scalable.

## Functionality

### User Features

- **User Authentication**: Register, login, and profile management
- **Ask Questions**: Post questions with detailed descriptions and relevant tags
- **Answer Questions**: Provide solutions to questions from other users
- **Voting System**: Upvote or downvote questions and answers
- **Accept Answers**: Question authors can mark the best answer as accepted
- **Search**: Find relevant questions by keywords, tags, or users
- **User Profiles**: View activity history, questions, and answers

### Admin Features

- **User Management**: Admin dashboard for user administration
- **Content Moderation**: Review and moderate questions and answers
- **Analytics**: Basic statistics on platform usage and engagement

## Technologies Used

### Frontend

- **React 19**: Modern component-based UI library
- **React Router**: Client-side routing
- **CSS3**: Custom styling with responsive design
- **React Icons**: Icon library for UI elements
- **React Hot Toast**: Notification system
- **Axios**: HTTP client for API requests
- **Vite**: Build tool and development server

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication via JSON Web Tokens
- **bcrypt**: Password hashing
- **Express Rate Limit**: API rate limiting
- **Helmet**: Security header setting
- **CORS**: Cross-Origin Resource Sharing management
- **CSRF Protection**: Protection against cross-site request forgery

## Setup and Installation

### Prerequisites

- Node.js (v16+)
- MongoDB instance (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CSRF_SECRET=your_csrf_secret_key
ALLOWED_ORIGINS=http://localhost:5173
```

4. Start the development server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with:

```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

## Ideas for Future Improvement

1. **Real-time Notifications**:

   - Implement WebSocket connections for real-time notifications
   - Notify users when their questions receive answers or comments
   - Add in-app notification system with read/unread status

2. **Rich Text Editor**:

   - Add support for markdown or WYSIWYG editor
   - Enable code syntax highlighting for technical questions
   - Support for image uploads and embedding

3. **Advanced Search and Filtering**:

   - Implement full-text search with ElasticSearch
   - Add advanced filters (date range, popularity, etc.)
   - Create a recommendation system for related questions

4. **Community Features**:

   - Add commenting functionality for discussions
   - Create a reputation/points system to reward contributions
   - Develop user achievement badges for engagement milestones

5. **Mobile Application**:
   - Develop native mobile apps for iOS and Android
   - Implement push notifications
   - Optimize UX for mobile interaction patterns

## License

ISC

---

This project was built with a focus on security, user experience, and scalability. Contributions welcome!
