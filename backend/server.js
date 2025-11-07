const express = require('express');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser()); // Add cookie parser middleware

// Remove static file serving - nginx will handle this
app.use(express.static('../public'));

// Data Management
var users = {};
var comments = [];
var sessions = {};

// Apply authentication middleware to all routes
app.use(requireAuth);
app.use(addUserToContext);

// Page Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/comments', (req, res) => {
    res.render('comments');
});

app.get('/comments/new', (req, res) => {
    res.render('new-comment');
});

// API Routes
app.post('/api/register', (req, res) => {
    const { username, password} = req.body;

    if (users[username]) {
        return res.status(400).json({ error: 'User already exists' }).redirect('/register');
    }

    users[username] = {
        username: username,
        password: password
    };
    
    // Set session cookie with proper options
    res.cookie('session', addSession(username), {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.redirect('/');
    console.log(`Registered user: ${username}`);
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = users[username];
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Set session cookie with proper options
    res.cookie('session', addSession(username), {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.redirect('/comments');
    console.log(`User logged in: ${username}`);
});

app.post('/api/logout', (req, res) => {
    const sessionId = req.cookies.session;
    
    if (sessionId && sessions[sessionId]) {
        const username = sessions[sessionId].username;
        delete sessions[sessionId];
        console.log(`User logged out: ${username} (session: ${sessionId})`);
    } else {
        console.log(`Logout attempt with invalid/missing session: ${sessionId}`);
    }
    
    // Clear the session cookie
    res.clearCookie('session', {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax'
    });
    
    res.redirect('/');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// Helper Functions
function addSession(username) {
    let sessionId = `session-${Date.now()}-${Math.random()}`;
    sessions[sessionId] = {
        username: username,
        createdAt: new Date(),
        sessionId: sessionId,
    }
    return sessionId;
}

// Middleware to check authentication and add user to template context
function addUserToContext(req, res, next) {
    const sessionId = req.cookies.session;
    let user = null;
    
    if (sessionId && sessions[sessionId]) {
        const session = sessions[sessionId];
        user = {
            username: session.username,
            sessionId: sessionId
        };
    }
    
    // Store user in response locals so it's available in all templates
    res.locals.user = user;
    next();
}

// Middleware to check if authenticated for page route
function requireAuth(req, res, next) {
    const authedPaths = ['/comments', '/comments/new'];
    const sessionId = req.cookies.session;

    if (!authedPaths.includes(req.path)) {
        next();
        return;
    }
    
    if (sessionId && sessions[sessionId]) {
        next();
    } else {
        res.redirect('/login');
    }
}
