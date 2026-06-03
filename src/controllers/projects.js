import projectsModel from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';

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
  const projectId = req.params.id;
  const { title, description, location, project_date, organization_id } = req.body;

  await projectsModel.updateProject(
    projectId,
    title,
    description,
    location,
    project_date,
    organization_id
  );

  res.redirect(`/project/${projectId}`);
}

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

export default {
    showProjectsPage,
    showProjectDetailsPage,
    showEditProjectForm,
    processEditProjectForm
};