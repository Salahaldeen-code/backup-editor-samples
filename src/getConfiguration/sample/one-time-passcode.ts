import type { TEditorConfiguration } from "../../documents/editor/core";

const NEW_FEATURE_ANNOUNCEMENT: TEditorConfiguration = {
  root: {
    type: "EmailLayout",
    data: {
      backdropColor: "#F9FAFB",
      canvasColor: "#FFFFFF",
      textColor: "#1F2937",
      fontFamily: "MODERN_SANS",
      childrenIds: [
        "block-announce-spacer-top",
        "block-announce-header",
        "block-announce-image",
        "block-announce-intro",
        "block-announce-feature-title",
        "block-announce-feature-details",
        "block-announce-benefits-title",
        "block-announce-benefit-1",
        "block-announce-benefit-2",
        "block-announce-benefit-3",
        "block-announce-cta",
        "block-announce-footer",
        "block-announce-spacer-bottom",
      ],
    },
  },

  "block-announce-spacer-top": {
    type: "Spacer",
    data: {
      props: { height: 60 },
    },
  },

  "block-announce-header": {
    type: "Text",
    data: {
      style: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        padding: { top: 0, bottom: 20, right: 24, left: 24 },
      },
      props: {
        text: "🚀 Introducing Our Latest Feature: Smart Insights",
      },
    },
  },

  "block-announce-image": {
    type: "Image",
    data: {
      style: {
        padding: { top: 0, bottom: 24, right: 24, left: 24 },
      },
      props: {
        url: "https://res.cloudinary.com/dgxmh6wai/image/upload/v1749007653/work_seamlessly_ovfzfl.png",
        alt: "Smart Insights Feature",
        linkHref: "https://sfa-website.vercel.app/features/smart-insights",
        contentAlignment: "middle",
      },
    },
  },

  "block-announce-intro": {
    type: "Text",
    data: {
      style: {
        fontSize: 16,
        padding: { top: 0, bottom: 16, right: 24, left: 24 },
      },
      props: {
        text: "Dear [Client/Partner],\n\nWe’re thrilled to announce the launch of our newest feature, Smart Insights — designed to give your sales team instant, actionable analytics to close deals faster.",
      },
    },
  },

  "block-announce-feature-title": {
    type: "Text",
    data: {
      style: {
        fontWeight: "bold",
        fontSize: 18,
        padding: { top: 16, bottom: 8, right: 24, left: 24 },
      },
      props: {
        text: "What Smart Insights Can Do For You:",
      },
    },
  },

  "block-announce-feature-details": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 16, right: 24, left: 24 },
      },
      props: {
        text: "Gain real-time visibility into sales trends, customer behaviors, and performance metrics all in one intuitive dashboard.",
      },
    },
  },

  "block-announce-benefits-title": {
    type: "Text",
    data: {
      style: {
        fontWeight: "bold",
        fontSize: 16,
        padding: { top: 0, bottom: 12, right: 24, left: 24 },
      },
      props: {
        text: "Key Benefits:",
      },
    },
  },

  "block-announce-benefit-1": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 8, right: 24, left: 24 },
      },
      props: {
        text: "✅ Identify high-potential leads faster",
      },
    },
  },

  "block-announce-benefit-2": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 8, right: 24, left: 24 },
      },
      props: {
        text: "✅ Customize reports to your sales goals",
      },
    },
  },

  "block-announce-benefit-3": {
    type: "Text",
    data: {
      style: {
        padding: { top: 0, bottom: 24, right: 24, left: 24 },
      },
      props: {
        text: "✅ Empower your team with data-driven decisions",
      },
    },
  },

  "block-announce-cta": {
    type: "Button",
    data: {
      style: {
        fontSize: 14,
        padding: { top: 16, bottom: 24, right: 24, left: 24 },
      },
      props: {
        buttonBackgroundColor: "#2563EB",
        buttonStyle: "rectangle",
        text: "Explore Smart Insights Now",
        url: "https://sfa-website.vercel.app/features/smart-insights",
      },
    },
  },

  "block-announce-footer": {
    type: "Text",
    data: {
      style: {
        color: "#6B7280",
        fontSize: 14,
        padding: { top: 0, bottom: 24, right: 24, left: 24 },
        textAlign: "center",
      },
      props: {
        text: "📞 03 5519 1070 | ✉️ sales@isianpadu.com | 🌐 isianpadu.com",
      },
    },
  },

  "block-announce-spacer-bottom": {
    type: "Spacer",
    data: {
      props: { height: 40 },
    },
  },
};

export default NEW_FEATURE_ANNOUNCEMENT;
