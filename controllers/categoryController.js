const { Category } = require('../models');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      message: 'Categories retrieved successfully',
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      message: error.message
    });
  }
};

const CategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                error: 'Category not found',
                message: `Category with ID ${id} does not exist`
            });
        }
        res.status(200).json({
            message: 'Category retrieved successfully',
            data: category
        });
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({
            error: 'Failed to get category',
            message: error.message
        });
    }
};

// Get specific category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [{ 
        association: 'quizzes',
        attributes: ['id', 'title', 'description', 'createdAt']
      }]
    });
    
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: `Category with ID ${id} does not exist`
      });
    }
    
    res.status(200).json({
      message: 'Category retrieved successfully',
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      error: 'Failed to get category',
      message: error.message
    });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Category name is required'
      });
    }
    
    const category = await Category.create({
      name,
      description
    });
    
    res.status(201).json({
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Category already exists',
        message: 'A category with this name already exists'
      });
    }
    
    res.status(500).json({
      error: 'Failed to create category',
      message: error.message
    });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: `Category with ID ${id} does not exist`
      });
    }
    
    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description
    });
    
    res.status(200).json({
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Category name already exists',
        message: 'A category with this name already exists'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update category',
      message: error.message
    });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: `Category with ID ${id} does not exist`
      });
    }
    
    await category.destroy();
    
    res.status(200).json({
      message: 'Category deleted successfully',
      data: { id: parseInt(id) }
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      error: 'Failed to delete category',
      message: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryById
};
