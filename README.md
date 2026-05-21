# AI-Powered Content Summarizer

A full-stack AI-powered content summarizer built with Node.js/Express backend, React frontend, GPT-4 for AI summarization, and Pinecone for vector storage.

## Features

- **Multiple Summary Types**: Generate short summaries, detailed summaries, bullet-point summaries, keywords, action items, and topic analysis
- **Multiple Content Input Methods**: Text input, URL scraping, and file uploads (PDF, DOCX, TXT)
- **User Authentication**: JWT-based authentication with secure password hashing
- **Summary History**: Store and search through past summaries
- **Semantic Search**: Powered by Pinecone for intelligent summary search
- **Mobile Responsive**: Fully responsive design with custom CSS
- **Clean Architecture**: Modular, scalable codebase with reusable components

## Tech Stack

### Backend
- Node.js with Express.js
- OpenAI GPT-4 API for summarization
- Pinecone for vector embeddings and storage
- JWT for authentication
- Multer for file uploads
- Axios for web scraping
- Bcrypt for password hashing

### Frontend
- React 18 with Vite
- Custom CSS (no component library)
- Axios for API calls
- React Router for navigation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key
- Pinecone API key

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=ai-summarizer
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory with the following variable:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account or login
3. Navigate to the Dashboard
4. Choose your input method (Text, URL, or File)
5. Submit your content to generate AI-powered summaries
6. View different summary types in the results
7. Access your summary history in the History page
8. Search through past summaries using semantic search

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user

### Content Processing
- `POST /api/content/text` - Process text input
- `POST /api/content/url` - Scrape and process URL
- `POST /api/content/file` - Upload and process file

### Summary
- `POST /api/summary/generate` - Generate summary
- `GET /api/summary/history` - Get user's summary history
- `GET /api/summary/:id` - Get specific summary
- `DELETE /api/summary/:id` - Delete summary
- `GET /api/summary/search` - Search summaries by similarity

## Project Structure

```
ai-powered/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
└── README.md
```

## Deployment

### Vercel Deployment

1. Deploy the frontend to Vercel:
   - Connect your GitHub repository to Vercel
   - Set the root directory to `frontend`
   - Add environment variables for production

2. Deploy the backend to Vercel (or your preferred hosting):
   - Set up a separate Vercel project for the backend
   - Configure serverless functions
   - Add environment variables

## Security Considerations

- JWT tokens for authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- File upload validation
- Environment variables for sensitive data

## Future Enhancements

- Add user settings and preferences
- Export summaries to PDF/Markdown
- Share summaries with generated links
- Dark mode toggle
- Analytics dashboard
- Support for more file formats
- Batch processing of multiple files

## License

ISC

## Support

For issues and questions, please open an issue on the GitHub repository.
