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
} from './controllers/users.js';


const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/organizations');
});

router.get('/organizations', organizationsController.showOrganizationsPage);
router.get('/organization/:id', organizationsController.showOrganizationDetailsPage);

router.get('/projects', projectsController.showProjectsPage);
router.get('/project/:id', projectsController.showProjectDetailsPage);

router.get('/categories', categoriesController.showCategoriesPage);
router.get('/category/:id', categoriesController.showCategoryDetailsPage);
router.get('/edit-project/:id', projectsController.showEditProjectForm);
router.post(
  '/edit-project/:id',
  projectsController.editProjectValidation,
  projectsController.processEditProjectForm
);
router.get('/new-category', categoriesController.showNewCategoryForm);
router.post(
    '/new-category',
    categoriesController.categoryValidationRules,
    categoriesController.processNewCategoryForm
);

router.get('/edit-category/:id', categoriesController.showEditCategoryForm);
router.post(
    '/edit-category/:id',
    categoriesController.categoryValidationRules,
    categoriesController.processEditCategoryForm
);

router.get('/new-project', projectsController.showNewProjectForm);

router.post(
  '/new-project',
  projectsController.projectValidation,
  projectsController.processNewProjectForm
);

router.get('/new-organization', organizationsController.showNewOrganizationForm);
router.post(
    '/new-organization',
    organizationsController.organizationValidation,
    organizationsController.processNewOrganizationForm
);

router.get('/edit-organization/:id', organizationsController.showEditOrganizationForm);

router.post(
  '/edit-organization/:id',
  organizationsController.organizationValidation,
  organizationsController.processEditOrganizationForm
);


router.get(
  '/assign-categories/:projectId',
  categoriesController.showAssignCategoriesForm
);

router.post(
  '/assign-categories/:projectId',
  categoriesController.processAssignCategoriesForm
);

router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

export default router;