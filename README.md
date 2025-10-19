# Yap 

Yap is a feature-rich AI chat application that supports multimodal conversations, document creation, and web search capabilities.

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ShadCN UI** - Accessible components
- **Framer Motion** - Animations

### Backend & Database

- **Convex** - Backend-as-a-Service with real-time database
- **Clerk Auth** - Authentication and user management
- **Vercel AI SDK** - AI integration
- **Vercel Blob** - File storage

### AI & Tools

- **OpenRouter** - Multi-model AI provider
- **Exa** - Web search capabilities
- **CodeMirror** - Code editing
- **ProseMirror** - Rich text editing

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/hanif-ali/yap.git
   cd yap
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   run `cp .env.example .env.local` and popular `.env.local` with your environment variables

4. **Set up Convex**

   ```bash
   npx convex dev
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

## 🔧 Configuration

### Environment Variables

| Variable                             | Required | Description                              |
| ------------------------------------ | -------- | ---------------------------------------- |
| `NEXT_PUBLIC_CONVEX_URL`             | ✅       | Your Convex deployment URL               |
| `CONVEX_URL`                         | ✅       | Your Convex deployment URL (server-side) |
| `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` | ✅       | Clerk frontend API URL                   |
| `CLERK_SECRET_KEY`                   | ✅       | Clerk secret key                         |
| `EXA_API_KEY`                        | ❌       | Exa API key for web search               |
| `REDIS_URL`                          | ❌       | Redis URL for resumable streams          |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 
Major things that I need help with are: 
- Improving the authorization (it is very hacky right now)
- Reliability of model responses (Prompts)
- Rate limiting

### Development

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
