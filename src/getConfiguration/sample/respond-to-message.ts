import { TEditorConfiguration } from '../../documents/editor/core';

const RESPOND_TO_MESSAGE: TEditorConfiguration = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F0ECE5',
      canvasColor: '#F0ECE5',
      textColor: '#030303',
      fontFamily: 'MODERN_SERIF',
      childrenIds: [
        'block_HjX7RN8eDEz7BLBHSQCNgU',
        'block_Jf65r5cUAnEzBfxnHKGa5S',
        'block_WmPDNHDpyHkygqjHuqF7St',
        'block_4VCKUvRMo7EbuMdN1VsdRw',
        'block_4siwziT4BkewmN55PpXvEu',
        'block_S9Rg9F3bGcviRyfMpoU5e4',
        'block_ClosingText',
      ],
    },
  },
  block_HjX7RN8eDEz7BLBHSQCNgU: {
    type: 'Image',
    data: {
      style: {
        padding: {
          top: 8,
          bottom: 24,
          left: 24,
          right: 24,
        },
      },
      props: {
        height: 32,
        url: 'https://d1iiu589g39o6c.cloudfront.net/live/platforms/platform_A9wwKSL6EV6orh6f/images/wptemplateimage_hW6RusynHUNTKoLm/boop.png',
        contentAlignment: 'middle',
      },
    },
  },
  block_Jf65r5cUAnEzBfxnHKGa5S: {
    type: 'Heading',
    data: {
      style: {
        padding: {
          top: 16,
          bottom: 0,
          left: 24,
          right: 24,
        },
      },
      props: {
        level: 'h2',
        text: `Thanks for Your Enquiry, Anna!`,
      },
    },
  },
  block_WmPDNHDpyHkygqjHuqF7St: {
    type: 'Text',
    data: {
      style: {
        fontSize: 16,
        padding: {
          top: 8,
          bottom: 16,
          left: 24,
          right: 24,
        },
      },
      props: {
        text: 'Thank you for reaching out to us regarding dog boarding from August 1 to August 29. We’re happy to hear from you again!',
      },
    },
  },
  block_95nkowWyi4p2VBiA46Eizs: {
    type: 'Text',
    data: {
      style: {
        backgroundColor: '#faf9f9',
        fontSize: 21,
        padding: {
          top: 24,
          bottom: 24,
          left: 24,
          right: 24,
        },
      },
      props: {
        text: 'Yes, we’d love to care for Emma again next month! Please let us know your preferred dates so we can confirm availability.',
      },
    },
  },
  block_4VCKUvRMo7EbuMdN1VsdRw: {
    type: 'Container',
    data: {
      style: {
        padding: {
          top: 16,
          bottom: 16,
          left: 24,
          right: 24,
        },
      },
      props: {
        childrenIds: ['block_95nkowWyi4p2VBiA46Eizs'],
      },
    },
  },
  block_4siwziT4BkewmN55PpXvEu: {
    type: 'Button',
    data: {
      style: {
        fontSize: 16,
        textAlign: 'left',
        padding: {
          top: 24,
          bottom: 24,
          left: 24,
          right: 24,
        },
      },
      props: {
        buttonBackgroundColor: '#BE4F46',
        buttonTextColor: '#FFFFFF',
        size: 'large',
        buttonStyle: 'pill',
        text: 'Confirm Booking',
        url: 'https://yourbookinglink.com/confirm', // <-- Replace with real URL
        fullWidth: false,
      },
    },
  },
  block_S9Rg9F3bGcviRyfMpoU5e4: {
    type: 'Text',
    data: {
      style: {
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'left',
        padding: {
          top: 0,
          bottom: 16,
          left: 24,
          right: 24,
        },
      },
      props: {
        text: 'Let us know if you have any special requests or Emma’s updated care instructions. We look forward to seeing her again soon!',
      },
    },
  },
  block_ClosingText: {
    type: 'Text',
    data: {
      style: {
        fontSize: 16,
        textAlign: 'left',
        padding: {
          top: 0,
          bottom: 24,
          left: 24,
          right: 24,
        },
      },
      props: {
        text: 'Warm regards,\nThe Boop Team 🐾',
      },
    },
  },
};

export default RESPOND_TO_MESSAGE;
