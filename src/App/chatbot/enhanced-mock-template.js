// Enhanced mock template with multiple block types
const enhancedMockTemplate = {
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
        "block-1713199022500",
        "block-1713199033677",
        "block-1713199033700"
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
        "text": "Welcome to Our Newsletter!"
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
        "url": "https://example.com/newsletter-header.jpg",
        "alt": "Newsletter Header Image",
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
        "text": "Thank you for subscribing to our newsletter. We're excited to share the latest updates with you."
      }
    }
  },
  "block-1713199022500": {
    "type": "Text",
    "data": {
      "style": {
        "backgroundColor": "#F0F7FF",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "🔔 Don't miss our upcoming event on June 15th! Register now to secure your spot."
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
        "text": "Read More",
        "url": "https://example.com"
      }
    }
  },
  "block-1713199033700": {
    "type": "Spacer",
    "data": {
      "props": {
        "height": 20
      }
    }
  }
};

module.exports = enhancedMockTemplate;

