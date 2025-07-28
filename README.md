# Prepaid Card Tracker

A mobile-first web application for tracking prepaid card balances and transactions with local-only data storage. No server, no cloud, no account registration required.

## Features

- ✅ Add multiple prepaid cards with names and initial values
- ✅ Track spending transactions for each card
- ✅ View real-time balance calculations
- ✅ Transaction history with location details
- ✅ Delete cards and transactions
- ✅ Mobile-responsive design
- ✅ Local storage only - all data stays on your device
- ✅ Dark mode support
- ✅ Material Design inspired UI

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: Wouter
- **Data Storage**: Local Storage (browser)
- **Backend**: Express.js (for development server)
- **Schema Validation**: Zod

## Prerequisites

- Node.js 20 or higher
- npm or yarn package manager

## Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd prepaid-card-tracker
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Open your browser to `http://localhost:5000`
   - The app will automatically reload when you make changes

## Build and Deployment

### Development Build
```bash
npm run dev
```
- Starts both frontend (Vite) and backend (Express) servers
- Frontend served at `http://localhost:5000`
- Hot reload enabled for development

### Production Build
```bash
npm run build
```
- Creates optimized production build in `dist/` folder
- Frontend assets are bundled and minified
- Backend code is compiled to JavaScript

### Deployment Options

#### 1. Static Site Deployment (Recommended)
Since this app uses only local storage, you can deploy it as a static site:

```bash
npm run build
```

Deploy the `dist/client` folder to any static hosting service:
- **Netlify**: Drag and drop the `dist/client` folder
- **Vercel**: Connect your repo and set build command to `npm run build`
- **GitHub Pages**: Push the `dist/client` contents to `gh-pages` branch
- **AWS S3**: Upload `dist/client` contents to S3 bucket with static hosting

#### 2. Full-Stack Deployment (Optional)
If you want to keep the Express server:

**Heroku:**
```bash
# Add to package.json scripts:
"start": "node dist/server/index.js"

# Deploy:
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

**Railway/Render:**
- Connect your GitHub repository
- Set build command: `npm run build`
- Set start command: `npm start`

**VPS/Server:**
```bash
# On your server:
npm run build
npm start
# Or use PM2 for process management:
pm2 start dist/server/index.js --name "prepaid-tracker"
```

### Environment Variables

No environment variables are required for basic functionality since the app uses local storage.

For production deployment with a database (optional):
```env
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
PORT=5000
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and storage
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage interface
├── shared/               # Shared TypeScript schemas
│   └── schema.ts        # Zod validation schemas
└── dist/                # Production build output
```

## Usage

1. **Add a Card**: Click the "+" button to add a new prepaid card with its initial value
2. **View Details**: Tap on any card to see its transaction history and current balance
3. **Add Transaction**: In card details, click "Add" to record a spending transaction
4. **Delete Items**: Use the menu (⋯) to delete cards or transactions
5. **Track Balance**: See real-time balance updates as you add transactions

## Data Storage

- All data is stored locally in your browser's localStorage
- No data is sent to any server or cloud service
- Data persists between browser sessions
- Clear browser data will remove all cards and transactions

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Adding New Features

1. **Schema Changes**: Update `shared/schema.ts` for new data structures
2. **UI Components**: Add to `client/src/components/`
3. **Pages**: Add new routes in `client/src/pages/` and register in `App.tsx`
4. **Storage**: Extend `LocalStorageService` in `client/src/lib/storage.ts`

### Code Style

- TypeScript strict mode enabled
- ESLint and Prettier configured
- Use shadcn/ui components for consistency
- Follow React best practices with hooks

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit: `git commit -m "Add feature description"`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Ensure you're using a supported browser
3. Try clearing browser storage and refreshing
4. Open an issue on GitHub with details

---

**Note**: This application stores all data locally on your device. Make sure to backup your browser data if you want to preserve your card information.