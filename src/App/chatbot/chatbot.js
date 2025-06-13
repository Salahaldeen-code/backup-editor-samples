require('dotenv').config();
const { OpenAI } = require('openai');
const readline = require('readline');
const fs = require('fs');
const { validateTemplate } = require('./validator');
const enhancedMockTemplate = require('./enhanced-mock-template');

// Check command line arguments for test mode
const TEST_MODE = process.argv.includes('--test');

// Initialize OpenAI client if not in test mode
let openai;
if (!TEST_MODE) {
  openai = new OpenAI({
    apiKey: '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'
  });
}

// Create readline interface for terminal input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Generate an email template JSON based on user input
 * @param {string} userPrompt - User's description of the desired email template
 * @returns {Promise<Object>} - Generated JSON template
 */
async function generateEmailTemplate(userPrompt) {
  if (TEST_MODE) {
    return generateMockTemplate(userPrompt);
  }
  
  try {
    console.log('\x1b[36m%s\x1b[0m', 'Generating template...');
    
    const systemPrompt = `
You are a specialized AI that generates JSON templates for email layouts.
The templates MUST strictly follow this structure and MUST include MULTIPLE DIFFERENT BLOCK TYPES.

{
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F2F5F7",  // Must be a valid hex color
      "canvasColor": "#FFFFFF",     // Must be a valid hex color
      "textColor": "#242424",       // Must be a valid hex color
      "fontFamily": "MODERN_SANS",
      "childrenIds": [
        "block-{uniqueId}"          // Array of block IDs
      ]
    }
  },
  "block-{uniqueId}": {             // Each block ID must start with "block-"
    "type": "{BlockType}",          // Must be one of the supported block types
    "data": {
      "style": {                    // Optional style object
        // Style properties specific to the block type
      },
      "props": {                    // Required props object
        // Properties specific to the block type
      }
    }
  }
}

Supported block types and their required properties:

1. Text:
   - Required props: "text" (string)
   - Optional style: "fontWeight", "padding", "fontSize", "textAlign", "color", "backgroundColor"

2. Image:
   - Required props: "url" (string), "alt" (string)
   - Optional props: "linkHref", "contentAlignment"
   - Optional style: "padding"

3. Button:
   - Required props: "text" (string), "url" (string)
   - Optional props: "buttonBackgroundColor" (hex color), "buttonStyle"
   - Optional style: "fontSize", "padding"

4. Spacer:
   - Required props: "height" (number)

5. Divider:
   - No specific required properties

Style properties:
- "padding": Object with "top", "bottom", "right", "left" values (all numbers)
- "fontWeight": String ("normal", "bold")
- "fontSize": Number
- "textAlign": String ("center", "left", "right")
- "color": String (hex color code)
- "backgroundColor": String (hex color code)

IMPORTANT RULES:
1. The JSON structure MUST match exactly as specified above
2. All block IDs referenced in childrenIds MUST exist as actual blocks
3. Each block MUST have the required properties based on its type
4. All color values MUST be valid hex codes (e.g., "#FFFFFF")
5. All numeric values MUST be actual numbers, not strings
6. DO NOT include any explanations or markdown formatting in your response
7. ONLY return the valid JSON
8. MUST include at least 5-10 different blocks with a mix of different block types
9. MUST follow a logical structure for an email (e.g., spacer, heading, image, text, button, spacer)
10. Use unique timestamps for block IDs (e.g., block-{timestamp})

Email Template Structure Best Practices:
1. Start with a spacer for top margin
2. Add a bold, centered heading
3. Include an image related to the content
4. Add a personalized greeting
5. Include paragraphs of text explaining the content
6. Add highlighted sections for important information
7. Include a call-to-action button
8. End with a spacer for bottom margin

Generate a valid JSON template based on the user's description.
Use unique IDs for each block (e.g., block-{timestamp}).
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = response.choices[0].message.content;
    
    // Extract JSON from the response
    let jsonString = content;
    
    // Remove any markdown code blocks if present
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/```\n([\s\S]*?)\n```/);
    
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    }
    
    try {
      const parsedJson = JSON.parse(jsonString);
      
      // Validate the template
      const validationResult = validateTemplate(parsedJson);
      if (!validationResult.valid) {
        console.error('\x1b[31m%s\x1b[0m', `Template validation failed: ${validationResult.error}`);
        
        // Try to fix common issues
        const fixedTemplate = attemptToFixTemplate(parsedJson);
        const fixedValidation = validateTemplate(fixedTemplate);
        
        if (fixedValidation.valid) {
          console.log('\x1b[32m%s\x1b[0m', 'Template was automatically fixed.');
          return fixedTemplate;
        } else {
          throw new Error(`Invalid template structure: ${validationResult.error}`);
        }
      }
      
      return parsedJson;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.log("Raw response:", content);
      throw new Error("Failed to parse JSON from OpenAI response");
    }
  } catch (error) {
    console.error("Error generating template:", error);
    throw new Error("Failed to generate email template");
  }
}

/**
 * Attempt to fix common template issues
 * @param {Object} template - The template to fix
 * @returns {Object} - The fixed template
 */
function attemptToFixTemplate(template) {
  const fixedTemplate = JSON.parse(JSON.stringify(template)); // Deep clone
  
  // Fix 1: Ensure root exists
  if (!fixedTemplate.root) {
    fixedTemplate.root = {
      type: "EmailLayout",
      data: {
        backdropColor: "#F2F5F7",
        canvasColor: "#FFFFFF",
        textColor: "#242424",
        fontFamily: "MODERN_SANS",
        childrenIds: []
      }
    };
  }
  
  // Fix 2: Ensure root type is correct
  if (fixedTemplate.root.type !== "EmailLayout") {
    fixedTemplate.root.type = "EmailLayout";
  }
  
  // Fix 3: Ensure root data exists
  if (!fixedTemplate.root.data) {
    fixedTemplate.root.data = {
      backdropColor: "#F2F5F7",
      canvasColor: "#FFFFFF",
      textColor: "#242424",
      fontFamily: "MODERN_SANS",
      childrenIds: []
    };
  }
  
  // Fix 4: Ensure required root data properties exist
  const requiredDataProps = ["backdropColor", "canvasColor", "textColor", "fontFamily", "childrenIds"];
  for (const prop of requiredDataProps) {
    if (!fixedTemplate.root.data.hasOwnProperty(prop)) {
      switch (prop) {
        case "backdropColor":
          fixedTemplate.root.data.backdropColor = "#F2F5F7";
          break;
        case "canvasColor":
          fixedTemplate.root.data.canvasColor = "#FFFFFF";
          break;
        case "textColor":
          fixedTemplate.root.data.textColor = "#242424";
          break;
        case "fontFamily":
          fixedTemplate.root.data.fontFamily = "MODERN_SANS";
          break;
        case "childrenIds":
          fixedTemplate.root.data.childrenIds = [];
          break;
      }
    }
  }
  
  // Fix 5: Ensure childrenIds is an array
  if (!Array.isArray(fixedTemplate.root.data.childrenIds)) {
    fixedTemplate.root.data.childrenIds = [];
  }
  
  // Fix 6: Collect all block IDs
  const blockIds = [];
  for (const key in fixedTemplate) {
    if (key !== 'root' && key.startsWith('block-')) {
      blockIds.push(key);
      
      // Fix 7: Ensure each block has type and data
      if (!fixedTemplate[key].type) {
        fixedTemplate[key].type = "Text";
      }
      
      if (!fixedTemplate[key].data) {
        fixedTemplate[key].data = {
          style: {
            padding: {
              top: 16,
              bottom: 16,
              right: 24,
              left: 24
            }
          },
          props: {}
        };
      }
      
      // Fix 8: Ensure props exists
      if (!fixedTemplate[key].data.props) {
        fixedTemplate[key].data.props = {};
      }
      
      // Fix 9: Add required props based on block type
      switch (fixedTemplate[key].type) {
        case "Text":
          if (!fixedTemplate[key].data.props.text) {
            fixedTemplate[key].data.props.text = "Text content";
          }
          break;
        case "Image":
          if (!fixedTemplate[key].data.props.url) {
            fixedTemplate[key].data.props.url = "https://example.com/image.jpg";
          }
          if (!fixedTemplate[key].data.props.alt) {
            fixedTemplate[key].data.props.alt = "Image description";
          }
          break;
        case "Button":
          if (!fixedTemplate[key].data.props.text) {
            fixedTemplate[key].data.props.text = "Click me";
          }
          if (!fixedTemplate[key].data.props.url) {
            fixedTemplate[key].data.props.url = "https://example.com";
          }
          break;
        case "Spacer":
          if (!fixedTemplate[key].data.props.hasOwnProperty('height')) {
            fixedTemplate[key].data.props.height = 20;
          }
          break;
      }
    }
  }
  
  // Fix 10: Update childrenIds to include all blocks
  fixedTemplate.root.data.childrenIds = blockIds;
  
  // Fix 11: If no blocks exist or too few blocks, create default blocks
  if (blockIds.length < 5) {
    // Add a spacer at the top
    const spacerId1 = `block-${Date.now()}`;
    fixedTemplate[spacerId1] = {
      type: "Spacer",
      data: {
        props: {
          height: 40
        }
      }
    };
    
    // Add a heading
    const headingId = `block-${Date.now() + 1}`;
    fixedTemplate[headingId] = {
      type: "Text",
      data: {
        style: {
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          padding: {
            top: 24,
            bottom: 16,
            right: 24,
            left: 24
          }
        },
        props: {
          text: "Welcome to Our Newsletter"
        }
      }
    };
    
    // Add an image
    const imageId = `block-${Date.now() + 2}`;
    fixedTemplate[imageId] = {
      type: "Image",
      data: {
        style: {
          padding: {
            top: 16,
            bottom: 24,
            right: 24,
            left: 24
          }
        },
        props: {
          url: "https://example.com/newsletter-header.jpg",
          alt: "Newsletter Header Image",
          contentAlignment: "middle"
        }
      }
    };
    
    // Add a paragraph
    const paragraphId = `block-${Date.now() + 3}`;
    fixedTemplate[paragraphId] = {
      type: "Text",
      data: {
        style: {
          fontWeight: "normal",
          padding: {
            top: 16,
            bottom: 16,
            right: 24,
            left: 24
          }
        },
        props: {
          text: "Thank you for subscribing to our newsletter. We're excited to share the latest updates with you."
        }
      }
    };
    
    // Add a button
    const buttonId = `block-${Date.now() + 4}`;
    fixedTemplate[buttonId] = {
      type: "Button",
      data: {
        style: {
          padding: {
            top: 16,
            bottom: 24,
            right: 24,
            left: 24
          }
        },
        props: {
          buttonBackgroundColor: "#2563EB",
          buttonStyle: "rectangle",
          text: "Read More",
          url: "https://example.com"
        }
      }
    };
    
    // Add a spacer at the bottom
    const spacerId2 = `block-${Date.now() + 5}`;
    fixedTemplate[spacerId2] = {
      type: "Spacer",
      data: {
        props: {
          height: 20
        }
      }
    };
    
    // Update childrenIds with all blocks
    fixedTemplate.root.data.childrenIds = [
      spacerId1,
      headingId,
      imageId,
      paragraphId,
      buttonId,
      spacerId2
    ];
  }
  
  return fixedTemplate;
}

/**
 * Generate a mock template for test mode
 * @param {string} userPrompt - User's description of the desired email template
 * @returns {Promise<Object>} - Generated mock JSON template
 */
async function generateMockTemplate(userPrompt) {
  console.log('\x1b[36m%s\x1b[0m', 'Generating template... (TEST MODE)');
  console.log('\x1b[36m%s\x1b[0m', `User prompt: "${userPrompt}"`);
  
  // Use the enhanced mock template
  const template = JSON.parse(JSON.stringify(enhancedMockTemplate)); // Deep clone
  
  // Customize the template based on the prompt
  if (userPrompt.toLowerCase().includes('welcome')) {
    template["block-1713199011299"].data.props.text = "Welcome to Our Service!";
  } else if (userPrompt.toLowerCase().includes('newsletter')) {
    template["block-1713199011299"].data.props.text = "Newsletter - June 2025";
  } else if (userPrompt.toLowerCase().includes('confirmation') || userPrompt.toLowerCase().includes('order')) {
    template["block-1713199011299"].data.props.text = "Order Confirmation";
    template["block-1713199022488"].data.props.text = "Your order has been confirmed and is being processed.";
    template["block-1713199033677"].data.props.text = "Track Order";
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate the template
  const validationResult = validateTemplate(template);
  if (!validationResult.valid) {
    console.error('\x1b[31m%s\x1b[0m', `Template validation failed: ${validationResult.error}`);
    throw new Error(`Invalid template structure: ${validationResult.error}`);
  }
  
  return template;
}

/**
 * Save template to a file
 * @param {Object} template - The template to save
 * @param {string} filename - The filename to save to
 */
function saveTemplateToFile(template, filename) {
  try {
    const filePath = `./${filename}`;
    fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
    console.log('\x1b[32m%s\x1b[0m', `Template saved to ${filePath}`);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Error saving template: ${error.message}`);
  }
}

/**
 * Start the interactive chat session
 */
function startChat() {
  const modeText = TEST_MODE ? '(TEST MODE)' : '';
  console.log('\x1b[32m%s\x1b[0m', `=== Email Template Generator Chatbot ${modeText} ===`);
  console.log('\x1b[32m%s\x1b[0m', 'Describe the email template you want to generate.');
  console.log('\x1b[32m%s\x1b[0m', 'Commands:');
  console.log('\x1b[32m%s\x1b[0m', '  exit - Quit the chatbot');
  console.log('\x1b[32m%s\x1b[0m', '  save <filename> - Save the last generated template to a file');
  console.log('\x1b[32m%s\x1b[0m', '  validate - Validate the last generated template');
  console.log('\x1b[32m%s\x1b[0m', '================================================');
  
  let lastTemplate = null;
  askQuestion();
  
  /**
   * Ask for user input
   */
  function askQuestion() {
    rl.question('\x1b[33m> \x1b[0m', async (input) => {
      // Check for commands
      if (input.toLowerCase() === 'exit') {
        console.log('\x1b[32m%s\x1b[0m', 'Goodbye!');
        rl.close();
        return;
      }
      
      if (input.toLowerCase().startsWith('save ')) {
        const filename = input.substring(5).trim() || 'template.json';
        if (lastTemplate) {
          saveTemplateToFile(lastTemplate, filename);
        } else {
          console.log('\x1b[31m%s\x1b[0m', 'No template to save. Generate a template first.');
        }
        askQuestion();
        return;
      }
      
      if (input.toLowerCase() === 'validate') {
        if (lastTemplate) {
          const validationResult = validateTemplate(lastTemplate);
          if (validationResult.valid) {
            console.log('\x1b[32m%s\x1b[0m', 'Template is valid!');
          } else {
            console.log('\x1b[31m%s\x1b[0m', `Template validation failed: ${validationResult.error}`);
          }
        } else {
          console.log('\x1b[31m%s\x1b[0m', 'No template to validate. Generate a template first.');
        }
        askQuestion();
        return;
      }
      
      // Generate template
      try {
        const template = await generateEmailTemplate(input);
        lastTemplate = template;
        console.log('\x1b[32m%s\x1b[0m', 'Generated Template:');
        console.log(JSON.stringify(template, null, 2));
      } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', `Error: ${error.message}`);
      }
      
      // Continue the conversation
      askQuestion();
    });
  }
}

// Start the chat
startChat();