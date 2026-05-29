import projectsModel from '../models/projects.js';

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

    res.render('project', {
        title: project.title,
        project
    });
}

export default {
    showProjectsPage,
    showProjectDetailsPage
};