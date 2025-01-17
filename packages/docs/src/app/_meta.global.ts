export default {
  docs: {
    type: 'page',
    title: 'Docs',
    items: {
      installation : 'Installation',
      guide : {
        items: {
          'getting-started' : '',
          'loading-assets' : ''
        },
      },
      api: {
        items: {
          'application' : '',
          'entity' : '',
          'components' : {
            items: {
              'camera' : '',
              'render' : '',
              'light' : ''
            },
          },
          'utils' : '',
        },
      },
    },
  },
  playground: {
    
    title: 'Playground',
    theme: { footer: false },
    items: {
      "Basic" : {
        type: 'separator',
      },
      'hello-world' : '',
      'load-a-3D-model' : {
        'title' : 'Load a 3D model'
      },
      'primitives' : '',
      'pointer-events' : '',
      "Advanced" : {
        type: 'separator',
      },
      'model-viewer' : '',
      'physics' : '',
      'motion' : '',
      'splats': {
        display: 'hidden'
      }
    },
  },
  '---': {
    type: 'separator',
    title: 'More',
  },
  faq: '',
  github_link: {
    title: 'PlayCanvas Docs',
    href: 'https://developer.playcanvas.com'
  },
}