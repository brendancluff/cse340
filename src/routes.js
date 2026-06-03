import express from 'express';

import organizationsController from './controllers/organizations.js';
import projectsController from './controllers/projects.js';
import categoriesController from './controllers/categories.js';

const router = express.Router();

router.get('/organizations', organizationsController.showOrganizationsPage);
router.get('/organization/:id', organizationsController.showOrganizationDetailsPage);

router.get('/projects', projectsController.showProjectsPage);
router.get('/project/:id', projectsController.showProjectDetailsPage);

router.get('/categories', categoriesController.showCategoriesPage);
router.get('/category/:id', categoriesController.showCategoryDetailsPage);
router.get('/edit-project/:id', projectsController.showEditProjectForm);
router.post('/edit-project/:id', projectsController.processEditProjectForm);
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

export default router;