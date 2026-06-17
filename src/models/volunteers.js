import db from './db.js';

const addVolunteer = async (accountId, projectId) => {
  const query = `
    INSERT INTO project_volunteer (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING;
  `;

  await db.query(query, [accountId, projectId]);
};

const removeVolunteer = async (accountId, projectId) => {
  const query = `
    DELETE FROM project_volunteer
    WHERE user_id = $1 AND project_id = $2;
  `;

  await db.query(query, [accountId, projectId]);
};
user_id
const isUserVolunteering = async (accountId, projectId) => {
  const query = `
    SELECT user_id
    FROM project_volunteer
    WHERE user_id = $1 AND project_id = $2;
  `;

  const result = await db.query(query, [accountId, projectId]);
  return result.rows.length > 0;
};

const getVolunteerProjectsByUser = async (accountId) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      o.organization_id,
      o.name AS organization_name
    FROM project_volunteer pv
    JOIN projects p ON pv.project_id = p.project_id
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE pv.user_id = $1
    ORDER BY p.project_date ASC;
  `;

  const result = await db.query(query, [accountId]);
  return result.rows;
};

export default {
  addVolunteer,
  removeVolunteer,
  isUserVolunteering,
  getVolunteerProjectsByUser,
};