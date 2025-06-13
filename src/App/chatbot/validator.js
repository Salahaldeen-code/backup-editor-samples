/**
 * Email Template JSON Validator
 * 
 * This module validates that a JSON template follows the required structure for email templates.
 */

/**
 * Validates if a color string is a valid hex color code
 * @param {string} color - The color string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidHexColor(color) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Validates if an object has the required properties
 * @param {Object} obj - The object to check
 * @param {Array<string>} requiredProps - Array of required property names
 * @returns {boolean} - True if all required properties exist, false otherwise
 */
function hasRequiredProps(obj, requiredProps) {
  if (!obj) return false;
  return requiredProps.every(prop => obj.hasOwnProperty(prop));
}

/**
 * Validates the root element of the template
 * @param {Object} template - The template to validate
 * @returns {Object} - Validation result {valid: boolean, error: string}
 */
function validateRoot(template) {
  // Check if root exists
  if (!template.root) {
    return { valid: false, error: "Missing root element" };
  }
  
  // Check root type
  if (template.root.type !== "EmailLayout") {
    return { valid: false, error: "Root type must be 'EmailLayout'" };
  }
  
  // Check root data
  if (!template.root.data) {
    return { valid: false, error: "Root missing data object" };
  }
  
  // Check required data properties
  const requiredDataProps = ["backdropColor", "canvasColor", "textColor", "fontFamily", "childrenIds"];
  for (const prop of requiredDataProps) {
    if (!template.root.data.hasOwnProperty(prop)) {
      return { valid: false, error: `Root data missing required property: ${prop}` };
    }
  }
  
  // Check color values
  const colorProps = ["backdropColor", "canvasColor", "textColor"];
  for (const prop of colorProps) {
    if (!isValidHexColor(template.root.data[prop])) {
      return { valid: false, error: `Invalid hex color for ${prop}: ${template.root.data[prop]}` };
    }
  }
  
  // Check childrenIds is an array
  if (!Array.isArray(template.root.data.childrenIds)) {
    return { valid: false, error: "childrenIds must be an array" };
  }
  
  // Check childrenIds format
  for (const id of template.root.data.childrenIds) {
    if (typeof id !== 'string' || !id.startsWith('block-')) {
      return { valid: false, error: `Invalid block ID format: ${id}` };
    }
  }
  
  return { valid: true };
}

/**
 * Validates a block element
 * @param {string} blockId - The ID of the block
 * @param {Object} block - The block object to validate
 * @returns {Object} - Validation result {valid: boolean, error: string}
 */
function validateBlock(blockId, block) {
  // Check block format
  if (!block.type) {
    return { valid: false, error: `Block ${blockId} missing type property` };
  }
  
  if (!block.data) {
    return { valid: false, error: `Block ${blockId} missing data object` };
  }
  
  // Validate based on block type
  switch (block.type) {
    case "Text":
      return validateTextBlock(blockId, block);
    case "Image":
      return validateImageBlock(blockId, block);
    case "Button":
      return validateButtonBlock(blockId, block);
    case "Spacer":
      return validateSpacerBlock(blockId, block);
    case "Divider":
      return validateDividerBlock(blockId, block);
    default:
      return { valid: false, error: `Unknown block type: ${block.type}` };
  }
}

/**
 * Validates a Text block
 * @param {string} blockId - The ID of the block
 * @param {Object} block - The block object to validate
 * @returns {Object} - Validation result {valid: boolean, error: string}
 */
function validateTextBlock(blockId, block) {
  // Check required props
  if (!block.data.props || !block.data.props.text) {
    return { valid: false, error: `Text block ${blockId} missing required 'text' property` };
  }
  
  // Validate style if present
  if (block.data.style) {
    const result = validateStyle(blockId, block.data.style);
    if (!result.valid) return result;
  }
  
  return { valid: true };
}

/**
 * Validates an Image block
 * @param {string} blockId - The ID of the block
 * @param {Object} block - The block object to validate
 * @returns {Object} - Validation result {valid: boolean, error: string}
 */
function validateImageBlock(blockId, block) {
  // Check required props
  if (!block.data.props) {
    return { valid: false, error: `Image block ${blockId} missing props object` };
  }
  
  if (!block.data.props.url) {
    return { valid: false, error: `Image block ${blockId} missing required 'url' property` };
  }
  
  if (!block.data.props.alt) {
    return { valid: false, error: `Image block ${blockId} missing required 'alt' property` };
  }
  
  // Validate style if present
  if (block.data.style) {
    const result = validateStyle(blockId, block.data.style);
    if (!result.valid) return result;
  }
  
  return { valid: true };
}

/**
 * Validates a Button block
 * @param {string} blockId - The ID of the block
 * @param {Object} block - The block object to validate
 * @returns {Object} - Validation result {valid: boolean, error: string}
 */
function validateButtonBlock(blockId, block) {
  // Check required props
  if (!block.data.props) {
    return { valid: false, error: `Button block ${blockId} missing props object` };
  }
  
  if (!block.data.props.text) {
    return { valid: false, error: `Button block ${blockId} missing required 'text' property` };
  }
  
  if (!block.data.props.url) {
    return { valid: false, error: `Button block ${blockId} missing required 'url' property` };
  }
  
  // Check buttonBackgroundColor if present
  if (block.data.props.buttonBackgroundColor && !isValidHexColor(block.data.props.buttonBackgroundColor)) {
    return { valid: false, error: `Button block ${blockId} has invalid buttonBackgroundColor` };
  }
  
  // Validate style if present
  if (block.data.style) {
    const result = validateStyle(blockId, block.data.style);
    if (!result.valid) return result;
  }
  
  return { valid: true };
}

/**
 * Validates a Spacer block
 * @param {string} blockId - The ID of the block
 * @param {Object} block - The block object to validate
 * @returns {Object} - Validation result {valid: boolean, error: string}
 */
function validateSpacerBlock(blockId, block) {
  // Check required props
  if (!block.data.props) {
    return { valid: false, error: `Spacer block ${blockId} missing props object` };
  }
  
  if (!block.data.props.hasOwnProperty('height') || typeof block.data.props.height !== 'number') {
    return { valid: false, error: `Spacer block ${blockId} missing required 'height' property or height is not a number` };
  }
  
  return { valid: true };
}

/**
 * Validates a Divider block
 * @param {string} blockId - The ID of the block
 * @param {Object} block - The block object to validate
 * @returns {Object} - Validation result {valid: boolean, error: string}
 */
function validateDividerBlock(blockId, block) {
  // Divider doesn't have specific required properties in the examples
  return { valid: true };
}

/**
 * Validates style properties
 * @param {string} blockId - The ID of the block
 * @param {Object} style - The style object to validate
 * @returns {Object} - Validation result {valid: boolean, error: string}
 */
function validateStyle(blockId, style) {
  // Validate padding if present
  if (style.padding) {
    const paddingProps = ["top", "bottom", "right", "left"];
    for (const prop of paddingProps) {
      if (style.padding.hasOwnProperty(prop) && typeof style.padding[prop] !== 'number') {
        return { valid: false, error: `Block ${blockId} has invalid padding.${prop} (must be a number)` };
      }
    }
  }
  
  // Validate color if present
  if (style.color && !isValidHexColor(style.color)) {
    return { valid: false, error: `Block ${blockId} has invalid color: ${style.color}` };
  }
  
  // Validate backgroundColor if present
  if (style.backgroundColor && !isValidHexColor(style.backgroundColor)) {
    return { valid: false, error: `Block ${blockId} has invalid backgroundColor: ${style.backgroundColor}` };
  }
  
  // Validate fontSize if present
  if (style.hasOwnProperty('fontSize') && typeof style.fontSize !== 'number') {
    return { valid: false, error: `Block ${blockId} has invalid fontSize (must be a number)` };
  }
  
  return { valid: true };
}

/**
 * Validates the entire template
 * @param {Object} template - The template to validate
 * @returns {Object} - Validation result {valid: boolean, error: string}
 */
function validateTemplate(template) {
  // Validate root
  const rootResult = validateRoot(template);
  if (!rootResult.valid) {
    return rootResult;
  }
  
  // Get all block IDs referenced in childrenIds
  const referencedBlockIds = template.root.data.childrenIds;
  
  // Check that all referenced blocks exist
  for (const blockId of referencedBlockIds) {
    if (!template[blockId]) {
      return { valid: false, error: `Referenced block ${blockId} does not exist in template` };
    }
  }
  
  // Validate each block
  for (const blockId of referencedBlockIds) {
    const blockResult = validateBlock(blockId, template[blockId]);
    if (!blockResult.valid) {
      return blockResult;
    }
  }
  
  // Check for blocks that exist but aren't referenced
  for (const key in template) {
    if (key !== 'root' && !referencedBlockIds.includes(key)) {
      return { valid: false, error: `Block ${key} exists but is not referenced in childrenIds` };
    }
  }
  
  return { valid: true };
}

module.exports = {
  validateTemplate
};

