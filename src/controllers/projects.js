import projectsModel from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be valid'),

  body('organizationId')
    .notEmpty()
    .withMessage('Organization is required')
    .isInt()
    .withMessage('Organization must be valid')
];

const editProjectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),

  body('project_date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be valid'),

  body('organization_id')
    .notEmpty()
    .withMessage('Organization is required')
    .isInt()
    .withMessage('Organization must be valid')
];

async function showProjectsPage(req, res) {
  const projects = await projectsModel.getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

  res.render('projects', {
    title: 'Upcoming Service Projects',
    projects
  });
}

async function showProjectDetailsPage(req, res) {
  const projectId = req.params.id;

  const project = await projectsModel.getProjectDetails(projectId);
  const categories = await projectsModel.getCategoriesByProjectId(projectId);

  res.render('project', {
    title: project.title,
    project,
    categories
  });
}

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();

  res.render('new-project', {
    title: 'Add New Service Project',
    organizations
  });
};

const processNewProjectForm = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.redirect('/new-project');
  }

  const { title, description, location, date, organizationId } = req.body;

  const projectId = await projectsModel.createProject(
    title,
    description,
    location,
    date,
    organizationId
  );

  req.flash('success', 'New service project created successfully!');

  res.redirect(`/project/${projectId}`);
};

async function showEditProjectForm(req, res) {
  const projectId = req.params.id;
  const project = await projectsModel.getProjectDetails(projectId);
  const organizations = await getAllOrganizations();

  res.render('update-project', {
    title: 'Edit Service Project',
    project,
    organizations
  });
}

async function processEditProjectForm(req, res) {
  const errors = validationResult(req);
  const projectId = req.params.id;

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.redirect(`/edit-project/${projectId}`);
  }

  const { title, description, location, project_date, organization_id } = req.body;

  await projectsModel.updateProject(
    projectId,
    title,
    description,
    location,
    project_date,
    organization_id
  );

  req.flash('success', 'Service project updated successfully!');

  res.redirect(`/project/${projectId}`);
}

export default {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation,
  editProjectValidation
};