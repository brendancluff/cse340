import express from 'express';

import organizationsController from './controllers/organizations.js';
import projectsController from './controllers/projects.js';
import categoriesController from './controllers/categories.js';
import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  showDashboard,
  requireRole,
} from './controllers/users.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/organizations');
});

router.get('/dashboard', requireLogin, showDashboard);

router.get('/organizations', organizationsController.showOrganizationsPage);
router.get('/organization/:id', organizationsController.showOrganizationDetailsPage);

router.get('/projects', projectsController.showProjectsPage);
router.get('/project/:id', projectsController.showProjectDetailsPage);

router.get('/categories', categoriesController.showCategoriesPage);
router.get('/category/:id', categoriesController.showCategoryDetailsPage);

router.get(
  '/edit-project/:id',
  requireRole('admin'),
  projectsController.showEditProjectForm
);

router.post(
  '/edit-project/:id',
  requireRole('admin'),
  projectsController.editProjectValidation,
  projectsController.processEditProjectForm
);

router.get(
  '/new-category',
  requireRole('admin'),
  categoriesController.showNewCategoryForm
);

router.post(
  '/new-category',
  requireRole('admin'),
  categoriesController.categoryValidationRules,
  categoriesController.processNewCategoryForm
);

router.get(
  '/edit-category/:id',
  requireRole('admin'),
  categoriesController.showEditCategoryForm
);

router.post(
  '/edit-category/:id',
  requireRole('admin'),
  categoriesController.categoryValidationRules,
  categoriesController.processEditCategoryForm
);

router.get(
  '/new-project',
  requireRole('admin'),
  projectsController.showNewProjectForm
);

router.post(
  '/new-project',
  requireRole('admin'),
  projectsController.projectValidation,
  projectsController.processNewProjectForm
);

router.get(
  '/new-organization',
  requireRole('admin'),
  organizationsController.showNewOrganizationForm
);

router.post(
  '/new-organization',
  requireRole('admin'),
  organizationsController.organizationValidation,
  organizationsController.processNewOrganizationForm
);

router.get(
  '/edit-organization/:id',
  requireRole('admin'),
  organizationsController.showEditOrganizationForm
);

router.post(
  '/edit-organization/:id',
  requireRole('admin'),
  organizationsController.organizationValidation,
  organizationsController.processEditOrganizationForm
);

router.get(
  '/assign-categories/:projectId',
  requireRole('admin'),
  categoriesController.showAssignCategoriesForm
);

router.post(
  '/assign-categories/:projectId',
  requireRole('admin'),
  categoriesController.processAssignCategoriesForm
);

router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);

router.get('/logout', processLogout);

export default router;