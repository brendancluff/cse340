import bcrypt from 'bcrypt';
import volunteersModel from '../models/volunteers.js';

import {
  createUser,
  authenticateUser,
  getAllUsers,
} from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
  res.render('register', {
    title: 'Register',
  });
};

const processUserRegistrationForm = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await createUser(name, email, passwordHash);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Error registering user:', error);

    req.flash('error', 'An error occurred during registration. Please try again.');
    res.redirect('/register');
  }
};

const showLoginForm = (req, res) => {
  res.render('login', {
    title: 'Login',
  });
};

const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);

    if (user) {
      req.session.user = user;

      req.flash('success', 'Login successful!');
      res.redirect('/dashboard');
    } else {
      req.flash('error', 'Invalid email or password.');
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error during login:', error);

    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/login');
  }
};

const processLogout = (req, res) => {
  delete req.session.user;

  req.flash('success', 'Logout successful!');
  res.redirect('/login');
};

const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash('error', 'You must be logged in to access that page.');
    return res.redirect('/login');
  }

  next();
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash('error', 'You must be logged in to access this page.');
      return res.redirect('/login');
    }

    if (req.session.user.role_name !== role) {
      req.flash('error', 'You do not have permission to access this page.');
      return res.redirect('/dashboard');
    }

    next();
  };
};

const showDashboard = async (req, res) => {
  try {
    const volunteerProjects = await volunteersModel.getVolunteerProjectsByUser(
      req.session.user.user_id
    );

    res.render('dashboard', {
      title: 'Dashboard',
      user: req.session.user,
      volunteerProjects,
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);

    req.flash('error', 'Unable to load dashboard.');
    res.redirect('/projects');
  }
};

const showUsersPage = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.render('users', {
      title: 'Registered Users',
      users,
    });
  } catch (error) {
    console.error('Error loading users:', error);

    req.flash('error', 'Unable to load users.');
    res.redirect('/dashboard');
  }
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  showDashboard,
  requireRole,
  showUsersPage,
};