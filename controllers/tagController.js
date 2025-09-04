const { Tag, Quiz } = require('../models');

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      message: 'Tags retrieved successfully',
      data: tags,
      count: tags.length
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      error: 'Failed to get tags', 
      message: error.message
    });
  }
};

// Get specific tag by ID
const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id, {
      include: [{ 
        association: 'quizzes',
        attributes: ['id', 'title', 'description', 'createdAt']
      }]
    });
    
    if (!tag) {
      return res.status(404).json({
        error: 'Tag not found',
        message: `Tag with ID ${id} does not exist`
      });
    }
    
    res.status(200).json({
      message: 'Tag retrieved successfully',
      data: tag
    });
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({
      error: 'Failed to get tag',
      message: error.message
    });
  }
};

const TagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findByPk(id);
        if (!tag) {
            return res.status(404).json({
                error: 'Tag not found',
                message: `Tag with ID ${id} does not exist`
            });
        }
        res.status(200).json({
            message: 'Tag retrieved successfully',
            data: tag
        });
    } catch (error) {
        console.error('Error fetching tag by ID:', error);
        res.status(500).json({
            error: 'Failed to get tag',
            message: error.message
        });
    }
};

// Create a new tag
const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Tag name is required'
      });
    }
    
    const tag = await Tag.create({ name });
    
    res.status(201).json({
      message: 'Tag created successfully',
      data: tag
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Tag already exists',
        message: 'A tag with this name already exists'
      });
    }
    
    res.status(500).json({
      error: 'Failed to create tag',
      message: error.message
    });
  }
};

// Update an existing tag
const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Tag name is required'
      });
    }
    
    const tag = await Tag.findByPk(id);
    
    if (!tag) {
      return res.status(404).json({
        error: 'Tag not found',
        message: `Tag with ID ${id} does not exist`
      });
    }
    
    await tag.update({ name });
    
    res.status(200).json({
      message: 'Tag updated successfully',
      data: tag
    });
  } catch (error) {
    console.error('Error updating tag:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Tag name already exists',
        message: 'A tag with this name already exists'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update tag',
      message: error.message
    });
  }
};

// Delete a tag
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tag = await Tag.findByPk(id);
    
    if (!tag) {
      return res.status(404).json({
        error: 'Tag not found',
        message: `Tag with ID ${id} does not exist`
      });
    }
    
    await tag.destroy();
    
    res.status(200).json({
      message: 'Tag deleted successfully',
      data: { id: parseInt(id) }
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({
      error: 'Failed to delete tag',
      message: error.message
    });
  }
};

module.exports = {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  TagById
};
