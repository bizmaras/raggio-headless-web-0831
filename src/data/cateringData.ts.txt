export interface CateringItem {
  id: string;
  name: string;
  description: string;
  category: 'Salads' | 'Pasta' | 'Entrees' | 'Platters';
  halfTrayPrice: string;
  fullTrayPrice: string;
  servesHalf?: string;
  servesFull?: string;
}

export const CATERING_ITEMS: CateringItem[] = [
  {
    id: 'cat-baked-ziti',
    name: 'Baked Ziti',
    description: 'Penne pasta layered with marinara, ricotta, and melted Grande mozzarella.',
    category: 'Pasta',
    halfTrayPrice: '$55.00',
    fullTrayPrice: '$95.00',
    servesHalf: '8-10 guests',
    servesFull: '15-20 guests',
  },
  {
    id: 'cat-chicken-parm',
    name: 'Chicken Parmesan',
    description: 'Breaded chicken cutlets topped with tomato sauce and toasted mozzarella.',
    category: 'Entrees',
    halfTrayPrice: '$65.00',
    fullTrayPrice: '$115.00',
    servesHalf: '8-10 guests',
    servesFull: '15-20 guests',
  },
  {
    id: 'cat-garden-salad',
    name: 'Gourmet Garden Salad',
    description: 'Fresh mixed greens, Roma tomatoes, cucumbers, black olives, and croutons.',
    category: 'Salads',
    halfTrayPrice: '$40.00',
    fullTrayPrice: '$70.00',
    servesHalf: '10-12 guests',
    servesFull: '20-25 guests',
  },
  {
    id: 'cat-wrap-platter',
    name: 'Assorted Wrap Platter',
    description: 'Variety of fresh turkey, roast beef, and Italian subs served in tortilla wraps.',
    category: 'Platters',
    halfTrayPrice: '$65.00',
    fullTrayPrice: '$120.00',
    servesHalf: '10 Wraps',
    servesFull: '20 Wraps',
  },
];