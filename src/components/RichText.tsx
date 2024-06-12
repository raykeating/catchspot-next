import { BlocksRenderer } from '@strapi/blocks-react-renderer';

// Content should come from your Strapi API
const content: BlocksContent = [
  {
    type: 'paragraph',
    children: [{ type: 'text', text: 'A simple paragraph' }],
  },
];

const App = () => {
  return <BlocksRenderer content={content} />;
};