-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);
-- ========================================
-- Projects Table
-- ========================================

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_projects_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Projects
-- ========================================

INSERT INTO projects
(organization_id, title, description, location, project_date)
VALUES

-- BrightFuture Builders
(
    1,
    'Community Playground Build',
    'Help construct a new playground for local families and children.',
    'Mesa Community Park',
    '2026-06-10'
),
(
    1,
    'Neighborhood Bench Installation',
    'Install public benches in community gathering areas.',
    'Downtown Mesa',
    '2026-06-17'
),
(
    1,
    'Senior Center Repairs',
    'Assist with painting and repairs for the senior center.',
    'Mesa Senior Center',
    '2026-06-24'
),
(
    1,
    'Community Garden Fence Build',
    'Build fencing around the community garden.',
    'East Mesa Garden',
    '2026-07-01'
),
(
    1,
    'Habitat Cleanup Day',
    'Clean and restore outdoor recreation areas.',
    'Red Mountain Area',
    '2026-07-08'
),

-- GreenHarvest Growers
(
    2,
    'Urban Garden Planting',
    'Plant vegetables and flowers in neighborhood gardens.',
    'Queen Creek Community Garden',
    '2026-07-12'
),
(
    2,
    'Composting Workshop',
    'Teach families sustainable composting practices.',
    'Queen Creek Library',
    '2026-07-19'
),
(
    2,
    'Farmers Market Support',
    'Assist local farmers during the weekly market.',
    'Downtown Market',
    '2026-07-26'
),
(
    2,
    'Tree Planting Initiative',
    'Plant shade trees in public areas.',
    'San Tan Park',
    '2026-08-02'
),
(
    2,
    'Food Donation Harvest',
    'Harvest and package produce for local shelters.',
    'Community Farm',
    '2026-08-09'
),

-- UnityServe Volunteers
(
    3,
    'School Supply Drive',
    'Sort and distribute donated school supplies.',
    'Mesa Elementary School',
    '2026-08-15'
),
(
    3,
    'Holiday Food Packing',
    'Pack food boxes for families during the holiday season.',
    'Community Outreach Center',
    '2026-08-22'
),
(
    3,
    'Volunteer Orientation Event',
    'Train and organize new volunteers for upcoming events.',
    'UnityServe Office',
    '2026-08-29'
),
(
    3,
    'Charity Fun Run Setup',
    'Set up booths and stations for a fundraising event.',
    'Mesa Riverview Park',
    '2026-09-05'
),
(
    3,
    'Community Tutoring Program',
    'Provide tutoring support for local students.',
    'Public Library',
    '2026-09-12'
);

-- ========================================
-- Categories Table
-- ========================================
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project Categories Junction Table
-- ========================================
CREATE TABLE project_categories (
  project_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,

  CONSTRAINT pk_project_categories
    PRIMARY KEY (project_id, category_id),

  CONSTRAINT fk_project_categories_project
    FOREIGN KEY (project_id)
    REFERENCES projects(project_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_project_categories_category
    FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
    ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO categories (name)
VALUES
  ('Construction'),
  ('Environment'),
  ('Education'),
  ('Food Support'),
  ('Volunteer Training');

-- ========================================
-- Associate projects with categories
-- ========================================
INSERT INTO project_categories (project_id, category_id)
VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1),
  (4, 2),
  (5, 2),
  (6, 2),
  (7, 2),
  (8, 4),
  (9, 2),
  (10, 4),
  (11, 3),
  (12, 4),
  (13, 5),
  (14, 5),
  (15, 3);

  -- ========================================
-- Roles Table
-- ========================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description)
VALUES
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- ========================================
-- Users Table
-- ========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_volunteer (
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_project_volunteer
    PRIMARY KEY (user_id, project_id),

  CONSTRAINT fk_project_volunteer_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_project_volunteer_project
    FOREIGN KEY (project_id)
    REFERENCES projects(project_id)
    ON DELETE CASCADE
);