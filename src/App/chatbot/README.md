# Email Template Generator Chatbot

A simple terminal-based chatbot that generates JSON templates for email layouts using OpenAI.

## Features

- Terminal-based interactive chat interface
- Generates JSON templates for email layouts based on natural language descriptions
- **Creates diverse templates with multiple block types** (Text, Image, Button, Spacer, Divider)
- Uses OpenAI's GPT-4 model for intelligent template generation
- **Strict validation** to ensure templates follow the required structure
- Auto-fixing of common template issues
- Test mode for trying the chatbot without an API key

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key (for standard mode)

## Installation

1. Clone this repository or download the files
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Set up your OpenAI API key in the `.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

Start the chatbot:

```bash
node chatbot.js
```

If you don't have an OpenAI API key, you can run in test mode:

```bash
node chatbot.js --test
```

Once the chatbot is running:
1. Enter a description of the email template you want to generate
2. The chatbot will generate a JSON template based on your description
3. Use the following commands:
   - `validate` - Check if the last generated template is valid
   - `save <filename>` - Save the last generated template to a file (default: template.json)
   - `exit` - Quit the chatbot

## Example Prompts

- "Create a welcome email with a header image, greeting text, and a signup button"
- "Generate a newsletter template with three article sections and a footer"
- "Make a simple notification email with an alert icon and confirmation button"

## JSON Template Structure

The generated templates follow this structure with multiple block types:

```json
{
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F5F5F5",
      "canvasColor": "#FFFFFF",
      "textColor": "#262626",
      "fontFamily": "MODERN_SANS",
      "childrenIds": [
        "block-1713199011200",
        "block-1713199011299",
        "block-1713199011300",
        "block-1713199022488",
        "block-1713199033677"
      ]
    }
  },
  "block-1713199011200": {
    "type": "Spacer",
    "data": {
      "props": {
        "height": 40
      }
    }
  },
  "block-1713199011299": {
    "type": "Text",
    "data": {
      "style": {
        "fontSize": 24,
        "fontWeight": "bold",
        "textAlign": "center",
        "padding": {
          "top": 24,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Welcome to Our Service!"
      }
    }
  },
  "block-1713199011300": {
    "type": "Image",
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
        "url": "https://example.com/welcome-image.jpg",
        "alt": "Welcome Image",
        "contentAlignment": "middle"
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
        "text": "Thank you for joining us! We're excited to have you as a customer."
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
        "buttonBackgroundColor": "#4A90E2",
        "buttonStyle": "rectangle",
        "text": "Get Started",
        "url": "https://example.com/start"
      }
    }
  }
}
```

## License

MIT


## JSON Template Structure Requirements

The generated templates must strictly follow this structure:

```json
{
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F5F5F5",  // Must be a valid hex color
      "canvasColor": "#FFFFFF",     // Must be a valid hex color
      "textColor": "#262626",       // Must be a valid hex color
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
```

### Supported Block Types

1. **Text**:
   - Required props: `text` (string)
   - Optional style: `fontWeight`, `padding`, `fontSize`, `textAlign`, `color`, `backgroundColor`

2. **Image**:
   - Required props: `url` (string), `alt` (string)
   - Optional props: `linkHref`, `contentAlignment`
   - Optional style: `padding`

3. **Button**:
   - Required props: `text` (string), `url` (string)
   - Optional props: `buttonBackgroundColor` (hex color), `buttonStyle`
   - Optional style: `fontSize`, `padding`

4. **Spacer**:
   - Required props: `height` (number)

5. **Divider**:
   - No specific required properties

### Style Properties

- `padding`: Object with `top`, `bottom`, `right`, `left` values (all numbers)
- `fontWeight`: String ("normal", "bold")
- `fontSize`: Number
- `textAlign`: String ("center", "left", "right")
- `color`: String (hex color code)
- `backgroundColor`: String (hex color code)

The chatbot includes validation to ensure all generated templates follow this structure.

