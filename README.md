# Odds App 🎯

A modern NestJS application for collecting, storing, and analyzing sports betting odds data. The application fetches odds from The Odds API, stores them in a PostgreSQL database, and provides integration with Google Sheets for data visualization.

**Note**: Currently, the application syncs odds for a single sport at a time, as specified in the `THE_ODDS_API_SPORT_KEY` environment variable.

## Features

- 🏈 **Sports Odds Collection**: Fetches real-time odds from The Odds API
- 🗄️ **PostgreSQL Database**: Optimized schema for efficient upserts
- 📊 **Google Sheets Integration**: Automatically sync odds data to Google Sheets
- 🔄 **Scheduled Tasks**: Automatic data updates using NestJS scheduler
- 🐳 **Docker Support**: Full containerization with Docker Compose
- 📈 **Data Analysis**: Built-in views for arbitrage opportunities and market analysis
- 🛡️ **TypeORM Integration**: Type-safe database operations

## Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **API**: The Odds API integration
- **Integration**: Google Sheets API
- **Containerization**: Docker & Docker Compose
- **Task Scheduling**: NestJS Schedule module

## Quick Start

### Prerequisites

- Node.js 18+ or Docker
- PostgreSQL (if running locally)
- The Odds API key
- Google Sheets API credentials

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/keteik/odds-app.git
   cd odds-app
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker compose up -d --build
   ```

4. **The application will be available at:**
   - API: http://localhost:3000
   - Database: localhost:5432

### Option 2: Local Development

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/keteik/odds-app.git
   cd odds-app
   npm install
   ```

2. **Set up PostgreSQL database**
   ```bash
   # Install PostgreSQL locally or use Docker
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## Environment Configuration

Create a `.env` file with the following variables:

```env
# Application
APP_PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=odds_user
DATABASE_PASSWORD=odds_password
DATABASE_NAME=odds_data

# The Odds API
THE_ODDS_API_BASE_URL=https://api.the-odds-api.com/v4/
THE_ODDS_API_KEY=your_api_key_here
THE_ODDS_API_SPORT_KEY=americanfootball_nfl  # Single sport - change to desired sport
THE_ODDS_API_REGIONS=eu   # Regions can be 'us', 'us2, 'uk', 'au', 'eu'. Comma separated for multiple regions, e.g., 'us,uk,eu'

# Google Sheets Integration
GOOGLE_SHEETS_CLIENT_ID=your_client_id
GOOGLE_SHEETS_CLIENT_SECRET=your_client_secret
GOOGLE_SHEETS_SHEET_URL=https://docs.google.com/spreadsheets/d/
GOOGLE_SHEETS_SHEET_ID=your_sheet_id   # sheet must be public or shared with the service account
GOOGLE_SHEETS_SHEET_NAME=Odds   # Name of the sheet where odds will be stored
GOOGLE_SHEETS_ACCESS_TOKEN=your_access_token
GOOGLE_SHEETS_REFRESH_TOKEN=your_refresh_token
```

## Database Schema

The application uses a normalized PostgreSQL schema optimized for odds data:

- **events** - Sports matches/events
- **bookmakers** - Betting companies  
- **market_types** - Types of betting markets (h2h, h2h_lay, etc.)
- **markets** - Specific markets offered by bookmakers for events
- **outcomes** - Individual betting outcomes with odds

## API Endpoints

- `GET /sheets/odds` - Google Sheets visualization -> [localhost:3000/sheets/odds](http://localhost:3000/sheets/odds).

## Support

For support, please open an issue on GitHub or contact [ki3t3k@gmail.com](mailto:ki3t3k@gmail.com).