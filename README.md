# Doclytics AI - Frontend

AI-powered document analysis platform that allows users to upload documents (PDF, JPG, PNG) and interact with them through natural language questions.

## Features

- **Document Upload**: Support for PDF and image files (max 10MB)
- **OCR Processing**: Automatic text extraction from documents
- **AI Chat**: Ask questions about your documents and get intelligent answers
- **Document Management**: Organize and manage multiple documents
- **User Authentication**: Secure login and registration
- **Real-time Updates**: Live status tracking for document processing

## Tech Stack

- **Next.js** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **React Query** - Data fetching and caching
- **React Hook Form + Zod** - Form validation
- **React Toastify** - Notifications

## Setup & Running Locally

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
Copy `.env.example` to `.env` and update if needed:
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

3. **Run development server**
```bash
npm run dev
```

4. **Access the application**
Open [http://localhost:3000](http://localhost:3000)

## Backend Required

This frontend requires the Doclytics AI backend server running. See [doclytics-ai-server](../doclytics-ai-server) for setup instructions.
