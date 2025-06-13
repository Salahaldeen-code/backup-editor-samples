// ...existing imports...
import readline from 'readline';
import OpenAI from 'openai';
import fs from 'fs';

const port = 3000;
const TEST_MODE = process.argv.includes('--test');

// Initialize OpenAI client if not in test mode
let openai;
if (!TEST_MODE) {
  // Directly set your API key here
  openai = new OpenAI({
    apiKey: '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'
  });
}

// Mock template for test mode
const mockTemplate = {
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F5F5F5",
      "canvasColor": "#FFFFFF",
      "textColor": "#262626",
      "fontFamily": "MODERN_SANS",
      "childrenIds": [
        "block-1713199011299",
        "block-1713199022488",
        "block-1713199033677"
      ]
    }
  },
  "block-1713199011299": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 24,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Welcome to Our Newsletter!"
      }
    }
  },
  "block-1713199022488": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Thank you for subscribing to our newsletter. We're excited to share the latest updates with you."
      }
    }
  },
  "block-1713199033677": {
    "type": "Button",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 24,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Read More",
        "url": "https://example.com",
        "backgroundColor": "#4A90E2",
        "textColor": "#FFFFFF"
      }
    }
  }
};

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
The templates follow this structure:

{
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F5F5F5",
      "canvasColor": "#FFFFFF",
      "textColor": "#262626",
      "fontFamily": "MODERN_SANS",
      "childrenIds": [
        "block-{uniqueId}"
      ]
    }
  },
  "block-{uniqueId}": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Hello world"
      }
    }
  }
}

Block types can include:
- Text: For text content
- Image: For images
- Button: For clickable buttons
- Divider: For horizontal dividers
- Spacer: For vertical spacing

Generate a valid JSON template based on the user's description.
Use unique IDs for each block (e.g., block-{timestamp}).
Ensure the JSON is valid and follows the exact structure shown above.
DO NOT include any explanations or markdown formatting in your response, ONLY return the valid JSON.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;

    // Extract JSON from the response
    let jsonString = content;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
      content.match(/```\n([\s\S]*?)\n```/);

    if (jsonMatch) {
      jsonString = jsonMatch[1];
    }

    try {
      const parsedJson = JSON.parse(jsonString);
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
 * Generate a mock template for test mode
 * @param {string} userPrompt - User's description of the desired email template
 * @returns {Promise<Object>} - Generated mock JSON template
 */
async function generateMockTemplate(userPrompt) {
  console.log('\x1b[36m%s\x1b[0m', 'Generating template... (TEST MODE)');
  console.log('\x1b[36m%s\x1b[0m', `User prompt: "${userPrompt}"`);

  // In test mode, we'll modify the mock template based on simple keywords
  const template = JSON.parse(JSON.stringify(mockTemplate)); // Deep clone

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

// Create readline interface for terminal input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
  console.log('\x1b[32m%s\x1b[0m', '================================================');

  let lastTemplate = null;
  askQuestion();

  function askQuestion() {
    rl.question('\x1b[33m> \x1b[0m', async (input) => {
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

      // Generate template
      try {
        const template = await generateEmailTemplate(input);
        lastTemplate = template;
        console.log('\x1b[32m%s\x1b[0m', 'Generated Template:');
        console.log(JSON.stringify(template, null, 2));
      } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', `Error: ${error.message}`);
      }

      askQuestion();
    });
  }
}

// Start the chat
startChat();