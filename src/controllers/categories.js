import categoriesModel from '../models/categories.js';
import projectsModel from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const showCategoriesPage = async (req, res) => {
    const categories = await categoriesModel.getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await categoriesModel.getCategoryDetails(categoryId);
    const projects = await categoriesModel.getProjectsByCategoryId(categoryId);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};

const categoryValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters')
        .isLength({ max: 100 }).withMessage('Category name must be 100 characters or less')
];

async function showNewCategoryForm(req, res) {
    res.render('new-category', {
        title: 'New Category',
        errors: [],
        category: {}
    });
}

async function processNewCategoryForm(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('new-category', {
            title: 'New Category',
            errors: errors.array(),
            category: req.body
        });
    }

    await categoriesModel.createCategory(req.body.name);

    res.redirect('/categories');
}

async function showEditCategoryForm(req, res) {
    const categoryId = req.params.id;
    const category = await categoriesModel.getCategoryDetails(categoryId);

    res.render('edit-category', {
        title: 'Edit Category',
        errors: [],
        category
    });
}

async function processEditCategoryForm(req, res) {
    const categoryId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('edit-category', {
            title: 'Edit Category',
            errors: errors.array(),
            category: {
                category_id: categoryId,
                name: req.body.name
            }
        });
    }

    await categoriesModel.updateCategory(categoryId, req.body.name);

    res.redirect(`/category/${categoryId}`);
}

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await projectsModel.getProjectDetails(projectId);
    const categories = await categoriesModel.getAllCategories();
    const assignedCategories = await projectsModel.getCategoriesByProjectId(projectId);

    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await categoriesModel.updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');

    res.redirect(`/project/${projectId}`);
};

export default {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidationRules
};