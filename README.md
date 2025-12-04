# Language Learning App

## About
A full-stack language-learning support app that helps users study vocabulary, take quizzes, write notes, and track their progress. Built with Angular, Node.js, and MongoDB.

While built for language learners, the structure allows adaptation for other study purposes as well.

---

## Why I Built This

After using many learning apps, I could not find one that matched the workflow I wanted.
To solve this, I designed and built my own learning tool from scratch.  
It is currently an MVP — functional but still under active improvement.

---

## Skills
<strong>Frontend:</strong> Angular, Angular Material, TypeScript, HTML, CSS  
<strong>Backend:</strong> Node.js, Express, MongoDB (Mongoose)

---

## Features
- Add, edit, and delete words
- Spaced repetition quizzes (based on the forgetting curve)
- Note creation and block editing (paragraphs, lists, tables, images)
- User authentication (register, login, logout)
- Dashboard to track learning progress

---

## Screenshots
### Dashboard page
![Dashboard](frontend/public/images/dashboard-page.png)
### Word List page
![WordList](frontend/public/images/word-list-page.png)
N### ote Detail page
![NoteDetail](frontend/public/images/note-detail-page.png)

---

## Project Structure
The project is divided into a backend (Express + MongoDB) and a frontend (Angular). The structure follows common best practices such as separating routes, services, and models.

```bush
language-learning-app/
├── backend/
│   ├── db/                # Database connection
│   │   └── connect.ts
│   ├── middleware/        # Authentication, etc.
│   │   └── auth.ts
│   ├── models/            # Mongoose models
│   │   ├── user.model.ts
│   │   ├── word.model.ts
│   │   └── note.model.ts
│   ├── routes/            # API routes
│   │   ├── user.routes.ts
│   │   ├── word.routes.ts
│   │   ├── note.routes.ts
│   │   └── dashboard.routes.ts
│   ├── .env               # Environment variables
│   └── server.ts          # Entry point
├── frontend/
│   ├── public/
│   ├── src/
│       ├── app/
│           ├── components/       # Footer, Header, Notes, etc.
│           ├── core/             # Interceptors
│           │   └── auth.interceptor.ts
│           ├── material/         # Material module
│           │   └── material-module.ts
│           ├── pages/            # auth/, home/, notes/, quiz/, words/
│           └── services/         # auth, home, note, quiz, user, word
```

---

## How to run
1. Clone this repository
```bush 
git clone https://github.com/your-username/language-learning-app.git
cd language-learning-app
```

2. Install dependencies
```bush 
# Frontend
cd frontend && npm install
# Backend
cd ../backend && npm install
cd ..
```

3. Set environment variables
```bush 
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_secret_key
```

4. Start the development server
```bush 
npm run dev
```

---

## Future Improvements
- Allow users to create custom word lists for focused study
- Expand quiz formats (multiple choice, input, flip, time-limited)
- Add pronunciation verification
- Display news articles or other sources to expose users to new words

## What I learned
- The challenge of evolving frontend ideas while maintaining backend consistency
- How to iteratively adjust API design and UI/UX during development
- Improved full-stack development workflow through trial and error