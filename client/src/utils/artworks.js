    import ImageOne from '../assets/Artworks/2022-637990946190363674-36.jpeg';
    import ImageTwo from '../assets/Artworks/3903-6.jpg';
    import ImageFour from '../assets/Artworks/OIP.jpeg';
    import ImageFive from '../assets/Artworks/OIP (1).jpeg';
    import ImageSix from '../assets/Artworks/OIP (2).jpeg';
    import ImageSeven from '../assets/Artworks/OIP (3).jpeg';
    import ImageEight from '../assets/Artworks/OIP (4).jpeg';
    import ImageNine from '../assets/Artworks/OIP (5).jpeg';
    import ImageTen from '../assets/Artworks/OIP (6).jpeg';
    import ImageEleven from '../assets/Artworks/OIP (7).jpeg';
    import ImageTwelve from '../assets/Artworks/R.jpeg';
    import ImageThertieen from '../assets/Artworks/c72e1f30c1b717bbcc329c3dba2efeba.jpg';
    import ImageFourteen from '../assets/Artworks/download.jpeg';
    import ImageFifteen from '../assets/Artworks/لوحة-فن-تشكيلي-لمحمد-ربا-768x432.jpg';

        const artworks = 
        [
            {
                id: 1,
                title: "Starry Night",
                artist: "Vincent van Gogh",
                year: 1889,
                description: "A famous post-impressionist painting featuring a swirling night sky over a quiet village.",
                imageUrl: ImageOne,
                medium: "Oil on canvas",
                dimensions: "73.7 cm × 92.1 cm",
                gallery: "Museum of Modern Art, New York",
                available: true,
                collection: "Post-Impressionism Collection"
            },
            {
                id: 2,
                title: "The Persistence of Memory",
                artist: "Salvador Dalí",
                year: 1931,
                description: "Surrealist painting depicting melting clocks in a dream-like landscape.",
                imageUrl: ImageTwo,
                medium: "Oil on canvas",
                dimensions: "24 cm × 33 cm",
                gallery: "Museum of Modern Art, New York",
                available: true,
                collection: "Surrealism Collection"
            },
            {
                id: 3,
                title: "The Scream",
                artist: "Edvard Munch",
                year: 1893,
                description: "Expressionist painting that captures the intense feeling of anxiety and horror.",
                imageUrl: ImageFour,
                medium: "Oil, tempera, and pastel on cardboard",
                dimensions: "91 cm × 73 cm",
                gallery: "National Gallery, Oslo",
                available: false,
                collection: "Expressionism Collection"
            },
            {
                id: 4,
                title: "Mona Lisa",
                artist: "Leonardo da Vinci",
                year: 1503,
                description: "A portrait of a woman known for her enigmatic smile.",
                imageUrl: ImageFive,
                medium: "Oil on poplar",
                dimensions: "77 cm × 53 cm",
                gallery: "Louvre, Paris",
                available: true,
                collection: "Renaissance Collection"
            },
            {
                id: 5,
                title: "The Night Watch",
                artist: "Rembrandt",
                year: 1642,
                description: "A large group portrait capturing a dynamic scene of a militia company.",
                imageUrl: ImageSix,
                medium: "Oil on canvas",
                dimensions: "363 cm × 437 cm",
                gallery: "Rijksmuseum, Amsterdam",
                available: true,
                collection: "Baroque Collection"
            },
            {
                id: 6,
                title: "Guernica",
                artist: "Pablo Picasso",
                year: 1937,
                description: "A powerful anti-war mural depicting the bombing of Guernica.",
                imageUrl: ImageSeven,
                medium: "Oil on canvas",
                dimensions: "349 cm × 776 cm",
                gallery: "Museo Reina Sofia, Madrid",
                available: false,
                collection: "Cubism Collection"
            },
            {
                id: 7,
                title: "The Kiss",
                artist: "Gustav Klimt",
                year: 1907,
                description: "An iconic symbol of love and passion, featuring a couple embracing in gold.",
                imageUrl: ImageEight,
                medium: "Oil and gold leaf on canvas",
                dimensions: "180 cm × 180 cm",
                gallery: "Belvedere Palace, Vienna",
                available: true,
                collection: "Art Nouveau Collection"
            },
            {
                id: 8,
                title: "Water Lilies",
                artist: "Claude Monet",
                year: 1899,
                description: "A serene depiction of Monet’s famous water lily pond.",
                imageUrl: ImageNine,
                medium: "Oil on canvas",
                dimensions: "200 cm × 190 cm",
                gallery: "Musée de l'Orangerie, Paris",
                available: false,
                collection: "Impressionism Collection"
            },
            {
                id: 9,
                title: "The Birth of Venus",
                artist: "Sandro Botticelli",
                year: 1486,
                description: "A Renaissance masterpiece depicting Venus emerging from the sea.",
                imageUrl: ImageTen,
                medium: "Tempera on canvas",
                dimensions: "172.5 cm × 278.5 cm",
                gallery: "Uffizi Gallery, Florence",
                collection: "Renaissance Collection"
            },
            {
                id: 10,
                title: "The Luncheon of the Boating Party",
                artist: "Pierre-Auguste Renoir",
                year: 1881,
                description: "A vibrant Impressionist scene capturing a lively group enjoying lunch by the river.",
                imageUrl: ImageEleven,
                medium: "Oil on canvas",
                dimensions: "129 cm × 129 cm",
                gallery: "The Phillips Collection, Washington, D.C.",
                collection: "Impressionism Collection"
            },
            {
                id: 11,
                title: "American Gothic",
                artist: "Grant Wood",
                year: 1930,
                description: "A famous American painting depicting a farmer and his daughter.",
                imageUrl: ImageTwelve,
                medium: "Oil on beaverboard",
                dimensions: "78.7 cm × 65.3 cm",
                gallery: "Art Institute of Chicago",
                collection: "American Art Collection"
            },
            {
                id: 12,
                title: "Girl with a Pearl Earring",
                artist: "Johannes Vermeer",
                year: 1665,
                description: "A portrait of a young woman wearing a distinctive pearl earring.",
                imageUrl: ImageThertieen,
                medium: "Oil on canvas",
                dimensions: "44.5 cm × 39 cm",
                gallery: "Mauritshuis, The Hague",
                collection: "Dutch Golden Age Collection"
            },
            {
                id: 13,
                title: "The Tower of Babel",
                artist: "Pieter Bruegel the Elder",
                year: 1563,
                description: "A complex depiction of the Tower of Babel and human ambition.",
                imageUrl: ImageFourteen,
                medium: "Oil on canvas",
                dimensions: "114 cm × 155 cm",
                gallery: "Kunsthistorisches Museum, Vienna",
                collection: "Summer Collection",
                addedAt: Date.now()
            },
            {
                id: 14,
                title: "The Arnolfini Portrait",
                artist: "Jan van Eyck",
                year: 1434,
                description: "A detailed and mysterious depiction of a married couple.",
                imageUrl: ImageFifteen,
                medium: "Oil on oak",
                dimensions: "82 cm × 60 cm",
                gallery: "National Gallery, London",
                collection: "Summer Collection",
                addedAt: Date.now()
            },
            {
                id: 15,
                title: "The Dance",
                artist: "Henri Matisse",
                year: 1910,
                description: "An iconic Fauvist painting depicting joyful dancers in bold colors.",
                imageUrl: ImageOne,
                medium: "Oil on canvas",
                dimensions: "260 cm × 390 cm",
                gallery: "The Hermitage, St. Petersburg",
                collection: "Summer Collection",
                addedAt: Date.now()
            },
            {
                id: 16,
                title: "Fellucas I",
                artist: "Mohamed Hussein",
                year: 2024,
                description: "An acrylic on canvas capturing the serene view of fellucas in the Nile.",
                imageUrl: ImageOne,
                medium: "Acrylic on canvas",
                dimensions: "180 cm × 200 cm",
                gallery: "Private Collection",
                available: false,
                collection: "Summer Collection",
                addedAt: Date.now()
            },
            {
                id: 17,
                title: "Pigeon Huts",
                artist: "Mohamed Hussein",
                year: 2024,
                description: "An acrylic on canvas depicting traditional pigeon huts by the Nile.",
                imageUrl: ImageOne,
                medium: "Acrylic on canvas",
                dimensions: "80 cm × 120 cm",
                gallery: "Private Collection",
                available: false,
                collection: "Summer Collection",
                addedAt: Date.now()
            },
            {
                id: 18,
                title: "Bas Relief II",
                artist: "Ibrahim Khatab",
                year: 2024,
                description: "Mixed media on wood exploring abstract forms and textures.",
                imageUrl: ImageOne,
                medium: "Mixed media on wood",
                dimensions: "150 cm × 150 cm",
                gallery: "Private Collection",
                available: false,
                collection: "Summer Collection",
                addedAt: Date.now()
            },
            {
                id: 19,
                title: "Urbane",
                artist: "Ibrahim Khatab",
                year: 2024,
                description: "Mixed media on wood portraying the urban landscape in modern forms.",
                imageUrl: ImageOne,
                medium: "Mixed media on wood",
                dimensions: "150 cm × 150 cm",
                gallery: "Private Collection",
                available: false,
                collection: "Summer Collection",
                addedAt: Date.now()
            },
            {
                id: 20,
                title: "Prickly Pear Ears I",
                artist: "Yasmine Hassan",
                year: 2024,
                description: "Mixed media on canvas with vibrant, abstract interpretations.",
                imageUrl: ImageOne,
                medium: "Mixed media on canvas",
                dimensions: "80 cm × 120 cm",
                gallery: "Private Collection",
                available: false,
                collection: "Summer Collection",
                addedAt: Date.now()
            },
            {
                id: 21,
                title: "Prickly Pear Ears II",
                artist: "Yasmine Hassan",
                year: 2024,
                description: "Mixed media on canvas with unique, textured patterns.",
                imageUrl: ImageOne,
                medium: "Mixed media on canvas",
                dimensions: "100 cm × 100 cm",
                gallery: "Private Collection",
                available: false,
                collection: "Contemporary Abstract Collection"
            },
            {
                id: 22,
                title: "Flurry II",
                artist: "Ahmed Farid",
                year: 2024,
                description: "Mixed media on canvas depicting dynamic, swirling patterns.",
                imageUrl: ImageOne,
                medium: "Mixed media on canvas",
                dimensions: "120 cm × 200 cm",
                gallery: "Private Collection",
                available: false,
                collection: "Contemporary Abstract Collection"
            },
            {
                id: 23,
                title: "Inferno III",
                artist: "Ahmed Farid",
                year: 2024,
                description: "Mixed media on canvas showcasing fiery, abstract imagery.",
                imageUrl: ImageOne,
                medium: "Mixed media on canvas",
                dimensions: "100 cm × 100 cm",
                gallery: "Private Collection",
                available: false,
                collection: "Contemporary Abstract Collection"
            }
        ];
        
        
        export default artworks;
        