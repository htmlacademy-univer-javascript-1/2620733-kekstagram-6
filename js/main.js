import { renderPictures } from './pictures.js';

const mockPicturesData = [
    {
        url: 'https://via.placeholder.com/300x200?text=Photo+1',
        description: 'Красивый закат',
        likes: 124,
        comments: 8
    },
    {
        url: 'https://via.placeholder.com/300x200?text=Photo+2',
        description: 'Горы и облака',
        likes: 89,
        comments: 15
    },
    {
        url: 'https://via.placeholder.com/300x200?text=Photo+3',
        description: 'Морской пейзаж',
        likes: 203,
        comments: 27
    },
    {
        url: 'https://via.placeholder.com/300x200?text=Photo+4',
        description: 'Лесная тропа',
        likes: 67,
        comments: 5
    }
];

renderPictures(mockPicturesData);
