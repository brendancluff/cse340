import {
    getAllOrganizations,
    getOrganizationDetails
} from '../models/organizations.js';

import projectsModel from '../models/projects.js';

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;

    const organizationDetails =
        await getOrganizationDetails(organizationId);

    const projects =
        await projectsModel.getProjectsByOrganizationId(organizationId);

    const title = 'Organization Details';

    res.render('organization', {
        title,
        organizationDetails,
        projects
    });
};

export default {
    showOrganizationsPage,
    showOrganizationDetailsPage
};