# CallsPro - AI-Powered Voice Sales Platform

CallsPro is a Next.js application that enables businesses to create and manage AI-powered voice assistants for sales and customer service.

## Features

- 🔐 Authentication with NextAuth.js (Email/Password & Google)
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🌓 Dark/Light mode support
- 📱 Responsive design
- 🔄 Multi-step form for agent configuration
- 🎯 AI model customization
- 🗣️ Voice configuration
- 📚 Knowledge base management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form & Zod

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/callspro.git
cd callspro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your environment variables:
```env
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            
│   ├── agent-config/      # Agent configuration components
│   ├── auth/              # Authentication components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
└── types/                 # TypeScript type definitions
```

## Configuration Steps

1. **Model Configuration**
   - Set initial message and system prompt
   - Choose AI provider and model
   - Configure temperature and token limits
   - Enable/disable emotion detection

2. **Voice Configuration**
   - Select voice type
   - Adjust voice parameters
   - Test voice output

3. **Knowledge Base**
   - Upload training materials
   - Define custom responses
   - Set business rules

4. **Review**
   - Preview configuration
   - Test agent responses
   - Deploy agent

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
