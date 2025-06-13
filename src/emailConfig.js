// emailConfig.js
export const CONFIGURATION = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F8F8F8',
      canvasColor: '#FFFFFF',
      textColor: '#000000',
      fontFamily: 'MODERN_SANS',
      childrenIds: ['image-block'],
    },
  },
  'image-block': {
    type: 'Image',
    data: {
      props: {
        src: 'https://yourdomain.com/my-image.jpg', // ← Replace with your image
        alt: 'Custom Image',
        width: '600',
      },
      style: {
        padding: { top: 20, bottom: 20, left: 10, right: 10 },
      },
    },
  },
};
