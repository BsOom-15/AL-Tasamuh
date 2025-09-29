import ImageOne from '../assets/Artworks/2022-637990946190363674-36.jpeg';
import ImageTwo from '../assets/Artworks/3903-6.jpg';
import ImageThree from '../assets/Artworks/4d0325198a03e6a402a09b797f3f06d28324c471_2000x2000.webp';
import ImageFour from '../assets/Artworks/OIP.jpeg';
import ImageFive from '../assets/Artworks/OIP (1).jpeg';
import ImageSix from '../assets/Artworks/OIP (2).jpeg';
import ImageSeven from '../assets/Artworks/OIP (3).jpeg';
import ImageEight from '../assets/Artworks/OIP (4).jpeg';
import ImageNine from '../assets/Artworks/OIP (5).jpeg';
import ImageTen from '../assets/Artworks/OIP (6).jpeg';


const artists =[
    {
        "id": 1,
        "name": "Vincent van Gogh",
        "birthYear": 1853,
        "deathYear": 1890,
        "nationality": "Dutch",
        "biography": "Vincent van Gogh was a Dutch post-impressionist painter known for his bold colors and emotional depth. His most famous works include 'Starry Night' and 'The Sunflowers.'",
        "artworks": [
            {
                "id": 200,
                "title": "The Persistence of Memory",
                "year": 1931,
                "description": "Surrealist painting depicting melting clocks in a dream-like landscape.",
                "imageUrl": ImageOne,
                "medium": "Oil on canvas",
                "dimensions": "24 cm × 33 cm",
                "gallery": "Museum of Modern Art, New York",
                "available": true,
            },
            {
                "id": 201,
                "title": "The Elephants",
                "year": 1948,
                "description": "A surrealist work featuring elongated, bending elephants symbolizing fragility and decay.",
                "imageUrl": ImageTwo,
                "medium": "Oil on canvas",
                "dimensions": "35 cm × 45 cm",
                "gallery": "Dalí Theatre-Museum, Figueres",
                "available": true,
            },
            {
                "id": 202,
                "title": "Lobster Telephone",
                "year": 1936,
                "description": "An object artwork featuring a telephone with a lobster handset.",
                "imageUrl": ImageThree,
                "medium": "Mixed media",
                "dimensions": "30 cm × 50 cm",
                "gallery": "Dalí Theatre-Museum, Figueres",
                "available": true,
            },
            {
                "id": 203,
                "title": "The Sacrament of the Last Supper",
                "year": 1955,
                "description": "A reinterpretation of Leonardo da Vinci’s Last Supper, blending religious themes with surrealist elements.",
                "imageUrl": ImageFour,
                "medium": "Oil on canvas",
                "dimensions": "180 cm × 260 cm",
                "gallery": "Dalí Theatre-Museum, Figueres",
                "available": true,
            },
            {
                "id": 204,
                "title": "Dream Caused by the Flight of a Bee Around a Pomegranate a Second Before Awakening",
                "year": 1944,
                "description": "A surrealist painting depicting a dreamscape blending fantasy and reality.",
                "imageUrl": ImageFive,
                "medium": "Oil on canvas",
                "dimensions": "150 cm × 200 cm",
                "gallery": "Dalí Theatre-Museum, Figueres",
                "available": true,
            },
            {
                "id": 205,
                "title": "The Persistence of Memory (Revisited)",
                "year": 1972,
                "description": "A later version of his famous work, reflecting on memory and time.",
                "imageUrl": ImageSix,
                "medium": "Oil on canvas",
                "dimensions": "25 cm × 35 cm",
                "gallery": "Dalí Theatre-Museum, Figueres",
                "available": true,
            },
            {
                "id": 206,
                "title": "The Madonna of Port Lligat",
                "year": 1949,
                "description": "A surrealist religious painting blending Christian iconography with Dalí’s unique style.",
                "imageUrl": ImageSeven,
                "medium": "Oil on canvas",
                "dimensions": "90 cm × 120 cm",
                "gallery": "Dalí Theatre-Museum, Figueres",
                "available": true,
            },
            {
                "id": 207,
                "title": "Autumnal Cannibalism",
                "year": 1936,
                "description": "A disturbing, surrealist work depicting decay and human consumption.",
                "imageUrl":ImageEight,
                "medium": "Oil on canvas",
                "dimensions": "60 cm × 80 cm",
                "gallery": "Dalí Theatre-Museum, Figueres",
                "available": true,
            },
            {
                "id": 208,
                "title": "The Specter of Sex Appeal",
                "year": 1934,
                "description": "A surrealist painting blending eroticism with disturbing imagery.",
                "imageUrl": ImageNine,
                "medium": "Oil on canvas",
                "dimensions": "70 cm × 90 cm",
                "gallery": "Dalí Theatre-Museum, Figueres",
                "available": true,
            },
            {
                "id": 209,
                "title": "The Hallucinogenic Toreador",
                "year": 1969,
                "description": "A psychedelic, surrealist work depicting a bullfighter in a dreamlike state.",
                "imageUrl": ImageTen,
                "medium": "Oil on canvas",
                "dimensions": "120 cm × 150 cm",
                "gallery": "Dalí Theatre-Museum, Figueres",
                "available": true,
            }
        ],
    },
];

export default artists;