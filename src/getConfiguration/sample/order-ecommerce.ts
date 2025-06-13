import type { TEditorConfiguration } from "../../documents/editor/core"

const SFA365_MARKETING_V2: TEditorConfiguration = {
  root: {
    type: "EmailLayout",
    data: {
      backdropColor: "#E8F0FE",
      canvasColor: "#FFFFFF",
      textColor: "#1F2937",
      fontFamily: "MODERN_SANS",
      childrenIds: [
        "block-hero-spacer",
        "block-title",
        "block-image",
        "block-greeting",
        "block-intro",
        "block-features-header",
        "block-feature-1",
        "block-feature-2",
        "block-feature-3",
        "block-feature-4",
        "block-feature-5",
        "block-highlight",
        "block-cta-link-1",
        "block-cta-link-2",
        "block-signature",
        "block-subtitle",
        "block-contact",
        "block-cta-button",
        "block-footer-spacer"
      ],
    },
  },

  "block-hero-spacer": {
    type: "Spacer",
    data: { props: { height: 70 } },
  },

  "block-title": {
    type: "Text",
    data: {
      style: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        padding: { top: 20, bottom: 10, right: 24, left: 24 },
      },
      props: {
        text: "📊 Transform the Way Your Sales Team Works with SFA365",
      },
    },
  },

  "block-image": {
    type: "Image",
    data: {
      style: {
        padding: { top: 10, bottom: 24, right: 24, left: 24 },
      },
      props: {
        url: "https://res.cloudinary.com/dgxmh6wai/image/upload/v1749007653/work_seamlessly_ovfzfl.png",
        alt: "SFA365 Sales Platform Interface",
        linkHref: "https://sfa-website.vercel.app",
        contentAlignment: "middle",
      },
    },
  },

  "block-greeting": {
    type: "Text",
    data: {
      style: {
        fontSize: 16,
        padding: { top: 0, bottom: 16, right: 24, left: 24 },
      },
      props: { text: "Hello [Client/Partner Name]," },
    },
  },

  "block-intro": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 16, right: 24, left: 24 },
      },
      props: {
        text: "Empower your sales team with **SFA365**, the intelligent sales platform designed to streamline daily operations, boost performance, and deliver results.",
      },
    },
  },

  "block-features-header": {
    type: "Text",
    data: {
      style: {
        fontSize: 16,
        fontWeight: "bold",
        padding: { top: 0, bottom: 12, right: 24, left: 24 },
      },
      props: {
        text: "🔧 Key benefits of SFA365:",
      },
    },
  },

  "block-feature-1": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 8, right: 24, left: 24 },
      },
      props: {
        text: "📱 Unified mobile + web experience",
      },
    },
  },

  "block-feature-2": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 8, right: 24, left: 24 },
      },
      props: {
        text: "📍 Smart route planning for field agents",
      },
    },
  },

  "block-feature-3": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 8, right: 24, left: 24 },
      },
      props: {
        text: "📊 Real-time analytics dashboard",
      },
    },
  },

  "block-feature-4": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 8, right: 24, left: 24 },
      },
      props: {
        text: "🧠 AI-driven insights for better decision-making",
      },
    },
  },

  "block-feature-5": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 16, right: 24, left: 24 },
      },
      props: {
        text: "👥 Easy CRM integration for lead & customer management",
      },
    },
  },

  "block-highlight": {
    type: "Text",
    data: {
      style: {
        backgroundColor: "#FEF3C7",
        padding: { top: 16, bottom: 16, right: 24, left: 24 },
      },
      props: {
        text: "💡 Built for modern sales teams that want to work smarter, not harder.",
      },
    },
  },

  "block-cta-link-1": {
    type: "Text",
    data: {
      style: {
        padding: { top: 16, bottom: 8, right: 24, left: 24 },
      },
      props: {
        text: "📅 Book a personalized demo: https://sfa-website.vercel.app/contact",
      },
    },
  },

  "block-cta-link-2": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 32, right: 24, left: 24 },
      },
      props: {
        text: "🔍 Discover more features: https://sfa-website.vercel.app",
      },
    },
  },

  "block-signature": {
    type: "Text",
    data: {
      style: {
        fontSize: 18,
        fontWeight: "bold",
        padding: { top: 20, bottom: 8, right: 24, left: 24 },
      },
      props: {
        text: "SFA365 by ISIANPADU",
      },
    },
  },

  "block-subtitle": {
    type: "Text",
    data: {
      style: {
        color: "#6B7280",
        fontSize: 15,
        padding: { top: 0, bottom: 8, right: 24, left: 24 },
      },
      props: {
        text: "Revolutionize your sales operations.",
      },
    },
  },

  "block-contact": {
    type: "Text",
    data: {
      style: {
        color: "#6B7280",
        fontSize: 14,
        padding: { top: 0, bottom: 16, right: 24, left: 24 },
      },
      props: {
        text: "📞 03 5519 1070 | ✉️ sales@isianpadu.com | 🌐 isianpadu.com",
      },
    },
  },

  "block-cta-button": {
    type: "Button",
    data: {
      style: {
        fontSize: 14,
        padding: { top: 12, bottom: 24, right: 24, left: 24 },
      },
      props: {
        buttonBackgroundColor: "#3B82F6",
        buttonStyle: "rectangle",
        text: "Get Started with SFA365",
        url: "https://sfa-website.vercel.app",
      },
    },
  },

  "block-footer-spacer": {
    type: "Spacer",
    data: { props: { height: 24 } },
  },
}

export default SFA365_MARKETING_V2
