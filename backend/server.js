const express = require('express');
const hbs = require('hbs');
const app = express();
const PORT = process.env.PORT || 3000;

// Handlebars
app.set('view engine', 'hbs');
app.set('views', '../views');

// Register partials directory
hbs.registerPartials('../partials');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Remove static file serving - nginx will handle this
app.use(express.static('../public'));


// Page Routes
app.get('/', (req, res) => {
    res.render('home');
});


// API Routes
app.get('/api/', (req, res) => {
    res.json({ 
        message: 'Hello from the API!',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        service: 'nodejs-backend'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
