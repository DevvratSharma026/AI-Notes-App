# 🤖 AI-Powered Notes App

A modern, full-stack note-taking application that leverages AI to enhance productivity and learning through smart summarization and interactive chat features.

![AI Notes App Demo]([https://via.placeholder.com/800x400/1a1a1a/00c6fb?text=AI+Notes+App+Demo](https://ai-notes-app-jet.vercel.app/))

## ✨ Features

- **🧠 AI-Powered Summarization**: Get concise summaries of lengthy notes using Groq's Llama 3 70B model
- **💬 Interactive AI Chat**: Ask questions about your notes and get contextual responses
- **🔐 Secure Authentication**: JWT-based authentication with secure cookie handling
- **📝 Full CRUD Operations**: Create, read, update, and delete notes seamlessly
- **🎨 Modern UI**: Responsive design with Tailwind CSS and smooth animations
- **🔍 Search Functionality**: Quickly find notes with real-time search
- **📱 Mobile Responsive**: Works perfectly on all device sizes

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Beautiful notifications
- **Heroicons** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### AI Integration
- **Groq API** - Fast AI inference
- **Llama 3 70B** - Large language model

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting

## 🚀 Live Demo

**Frontend**: [https://ai-notes-app-jet.vercel.app](https://ai-notes-app-jet.vercel.app)
**Backend API**: [https://ai-notes-app-rgeh.onrender.com](https://ai-notes-app-rgeh.onrender.com)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Groq API key

### 1. Clone the repository
```bash
git clone https://github.com/devvratsharma026/ai-notes-app.git
cd ai-notes-app
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ..
npm install
```

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:4000
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## 📁 Project Structure

```
ai-notes-app/
├── src/
│   ├── components/
│   │   ├── Home.jsx          # Note creation/editing
│   │   ├── Paste.jsx         # Notes listing with AI features
│   │   ├── ViewPaste.jsx     # Individual note view
│   │   ├── NavBar.jsx        # Navigation component
│   │   ├── Login.jsx         # Authentication
│   │   ├── Signup.jsx        # User registration
│   │   └── PrivateRoute.jsx  # Route protection
│   ├── redux/
│   │   ├── store.js          # Redux store configuration
│   │   ├── pasteSlice.js     # Notes state management
│   │   └── authSlice.js      # Authentication state
│   ├── App.jsx               # Main app component
│   └── main.jsx              # App entry point
├── server/
│   ├── controllers/
│   │   ├── Note.js           # Note CRUD operations
│   │   └── Auth.js           # Authentication logic
│   ├── routes/
│   │   ├── noteRoutes.js     # Note API routes
│   │   ├── userRoutes.js     # Auth API routes
│   │   └── aiRoutes.js       # AI integration routes
│   ├── models/
│   │   ├── Note.js           # Note schema
│   │   └── User.js           # User schema
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   └── server.js             # Express server setup
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Notes
- `GET /api/v1/notes/fetchAllNotes` - Get all user notes
- `POST /api/v1/notes/createNote` - Create new note
- `PUT /api/v1/notes/updateNote/:id` - Update note
- `DELETE /api/v1/notes/deleteNote/:id` - Delete note
- `GET /api/v1/notes/fetchNoteById/:id` - Get specific note

### AI Features
- `POST /api/ai/summarize` - Generate note summary
- `POST /api/ai/chat` - Chat about note content

## 🎯 Key Learning Outcomes

- **Full-stack Development**: Built complete application from database to UI
- **AI Integration**: Implemented practical AI features using modern APIs
- **Authentication**: Secure JWT-based auth with cross-origin handling
- **State Management**: Complex state handling with Redux Toolkit
- **Production Deployment**: Deployed to cloud platforms with proper configuration
- **Modern React**: Used latest React features and best practices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for providing fast AI inference
- [Vercel](https://vercel.com/) for seamless frontend deployment
- [Render](https://render.com/) for reliable backend hosting
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling

## 📧 Contact

Devvrat Sharma - [devsharma.pcm.2003@gmail.com](mailto:devsharma.pcm.2003@gmail.com)

Project Link: [https://github.com/DevvratSharma026/AI-Notes-App]((https://github.com/DevvratSharma026/AI-Notes-App))

---

⭐ If you found this project helpful, please give it a star!
