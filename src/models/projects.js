import db from './db.js';

async function getAllProjects() {
    const sql = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM projects p
        JOIN organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date;
    `;

    const result = await db.query(sql);
    return result.rows;
}

async function getCategoriesByProjectId(projectId) {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM categories c
        JOIN project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
}

async function getProjectsByOrganizationId(organizationId) {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM projects
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

async function getUpcomingProjects(numberOfProjects) {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;

    const queryParams = [numberOfProjects];
    const result = await db.query(query, queryParams);

    return result.rows;
}

async function getProjectDetails(id) {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows[0];
}

async function updateProject(projectId, title, description, location, projectDate, organizationId) {
    const sql = `
    UPDATE projects
    SET title = $1,
        description = $2,
        location = $3,
        project_date = $4,
        organization_id = $5
    WHERE project_id = $6
    RETURNING *;
  `;

    const result = await db.query(sql, [
        title,
        description,
        location,
        projectDate,
        organizationId,
        projectId
    ]);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0];
}

const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
    INSERT INTO projects (
      title,
      description,
      location,
      project_date,
      organization_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

    const queryParams = [
        title,
        description,
        location,
        date,
        organizationId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    return result.rows[0].project_id;
};


export default {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    updateProject,
    createProject
};