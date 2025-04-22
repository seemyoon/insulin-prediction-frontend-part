# Insulin Dose Calculator

A web application designed to help medical professionals determine insulin doses for diabetes patients. The application provides a user-friendly interface for doctors to input patient data and receive insulin dose recommendations.

## Features

- Secure login system for medical professionals
- Patient data collection and management
- Diabetes type determination
- Insulin type selection (Basal/Bolus)
- Insulin dose prediction
- Patient history tracking

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd insulin-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
  ├── components/         # React components
  │   ├── Login.tsx
  │   ├── Dashboard.tsx
  │   ├── Diagnosis.tsx
  │   ├── InsulinType.tsx
  │   └── InsulinPrediction.tsx
  ├── styles/            # CSS styles
  │   ├── index.css
  │   ├── Login.css
  │   ├── Dashboard.css
  │   ├── Diagnosis.css
  │   ├── InsulinType.css
  │   └── InsulinPrediction.css
  ├── App.tsx           # Main application component
  └── index.tsx         # Application entry point
```

## Usage

1. Login with medical professional credentials
2. Access the dashboard
3. Start a new diagnosis or view patient history
4. Follow the step-by-step process to:
   - Input patient data
   - Determine diabetes type
   - Select insulin type
   - Get dose prediction

## Development

To start development:

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 