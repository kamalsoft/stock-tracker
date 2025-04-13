# Stock Tracker Application

A comprehensive web application for tracking stocks, managing investment portfolios, and analyzing market data.

## Features

- **Stock Search & Analysis**: Search for stocks and view detailed information including price history, key metrics, and financial data
- **Portfolio Management**: Create and manage multiple investment portfolios
- **Transaction Tracking**: Record buy/sell transactions and track performance over time
- **Watchlists**: Create watchlists to monitor stocks of interest
- **Performance Analytics**: View detailed performance metrics and visualizations
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices

## Tech Stack

### Frontend

- React.js with hooks and functional components
- Redux Toolkit for state management
- Material-UI for component library and styling
- Chart.js for data visualization
- React Router for navigation
- Axios for API requests

### Backend

- Python with Flask framework
- SQLAlchemy ORM for database interactions
- JWT for authentication
- RESTful API architecture
- PostgreSQL database

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- PostgreSQL

### Installation

#### Backend Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/stock-tracker.git
cd stock-tracker
```

2. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Set up environment variables

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and API keys

5. Initialize the database

```bash
flask db init
flask db migrate
flask db upgrade
```

6. Run the backend server

```bash
flask run
```

The API will be available at http://localhost:5000

#### Frontend Setup

1. Navigate to the client directory

```bash
cd client
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env
```

Edit the `.env` file with your API URL and other configuration

4. Start the development server

```bash
npm start
```

The application will be available at http://localhost:3000

## Development

### Environment Variables

#### Backend

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT encoding
- `ALPHA_VANTAGE_API_KEY`: API key for Alpha Vantage stock data
- `FINNHUB_API_KEY`: API key for Finnhub stock data
- `FLASK_ENV`: Set to `development` or `production`

#### Frontend

- `REACT_APP_API_URL`: URL of the backend API
- `REACT_APP_AUTH_DOMAIN`: Auth domain (if using external auth)
- `NODE_OPTIONS`: Set to `--openssl-legacy-provider` if using Node.js v17+

### Folder Structure

```
stock-tracker/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store and slices
│   │   ├── utils/           # Utility functions
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
├── app/                     # Backend Flask application
│   ├── api/                 # API routes
│   ├── models/              # Database models
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   └── __init__.py          # Flask app initialization
├── migrations/              # Database migrations
├── tests/                   # Test files
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── requirements.txt         # Backend dependencies
└── README.md                # Project documentation
```

### API Endpoints

#### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get JWT token
- `GET /api/auth/user`: Get current user information

#### Stocks

- `GET /api/stocks/search?query={query}`: Search for stocks
- `GET /api/stocks/{symbol}`: Get stock details
- `GET /api/stocks/{symbol}/history?period={period}`: Get price history
- `GET /api/stocks/{symbol}/financials`: Get financial data

#### Portfolios

- `GET /api/portfolios`: Get user portfolios
- `POST /api/portfolios`: Create a new portfolio
- `GET /api/portfolios/{id}`: Get portfolio details
- `PUT /api/portfolios/{id}`: Update portfolio
- `DELETE /api/portfolios/{id}`: Delete portfolio

#### Transactions

- `GET /api/portfolios/{id}/transactions`: Get portfolio transactions
- `POST /api/portfolios/{id}/transactions`: Add a transaction
- `PUT /api/transactions/{id}`: Update a transaction
- `DELETE /api/transactions/{id}`: Delete a transaction

#### Watchlists

- `GET /api/watchlists`: Get user watchlists
- `POST /api/watchlists`: Create a new watchlist
- `GET /api/watchlists/{id}`: Get watchlist details
- `PUT /api/watchlists/{id}`: Update watchlist
- `DELETE /api/watchlists/{id}`: Delete watchlist
- `POST /api/watchlists/{id}/stocks`: Add stock to watchlist
- `DELETE /api/watchlists/{id}/stocks/{symbol}`: Remove stock from watchlist

## Troubleshooting

### Common Issues

#### Node.js OpenSSL Error

If you encounter an OpenSSL error with Node.js v17 or higher:

```
opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ]
```

Set the Node.js option to use the legacy OpenSSL provider:

```bash
export NODE_OPTIONS=--openssl-legacy-provider  # Linux/macOS
set NODE_OPTIONS=--openssl-legacy-provider     # Windows Command Prompt
$env:NODE_OPTIONS="--openssl-legacy-provider"  # Windows PowerShell
```

Or add it to your package.json scripts:

```json
"scripts": {
 "start": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start"
}
```

#### Babel-Jest Version Conflict

If you encounter a Babel-Jest version conflict:

```
a different version of babel-jest was detected higher up in the tree
```

Add a resolutions field to your package.json:

```json
"resolutions": {
 "babel-jest": "24.8.0"
}
```

Then run:

```bash
npm install
```

#### Slow Client Loading

If the client page takes a long time to load:

1. Check the browser console for errors and warnings
2. Look for slow API requests or component rendering
3. Ensure you're not making too many API calls at once
4. Consider implementing code splitting and lazy loading
5. Optimize large dependencies

## Performance Monitoring

The application includes a comprehensive logging system to help identify performance issues:

- API request/response times
- Component lifecycle timing
- Redux action processing
- Route change tracking
- Long task detection
- Resource load monitoring
- Core Web Vitals metrics

To access the logger in development:

```javascript
// In browser console
window.logger.log('Custom message')
window.logger.time('Operation name')
window.logger.timeEnd('Operation name')
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) for stock market data
- [Finnhub](https://finnhub.io/) for financial data
- [Material-UI](https://mui.com/) for the component library
- [Chart.js](https://www.chartjs.org/) for data visualization
