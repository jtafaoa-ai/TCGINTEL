const MOCK_DB = {
    cards: [
        {
            id: 'c1',
            name: 'Charizard Base Set',
            set: 'Base Set',
            year: 1999,
            image: 'https://images.pokemontcg.io/base1/4_hires.png',
            marketPrice: 350.00,
            trend: 'up',
            trendValue: 12.5,
            condition: 'NM',
            grade: null,
            history: {
                raw: [320, 335, 330, 345, 350, 348, 355],
                psa10: [12000, 12500, 12300, 12800, 13000, 13200, 13500],
                bgs95: [8500, 8600, 8550, 8700, 8800, 8750, 8900],
                cgc10: [9000, 9200, 9100, 9300, 9400, 9350, 9500]
            }
        },
        {
            id: 'c2',
            name: 'Black Lotus',
            set: 'Alpha',
            year: 1993,
            image: 'https://c1.scryfall.com/file/scryfall-cards/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg?1614638838', // Placeholder URL
            marketPrice: 25000.00,
            trend: 'stable',
            trendValue: 0.2,
            condition: 'LP',
            grade: 'BGS 9.0',
            history: {
                raw: [18000, 18500, 19000, 18800, 19200, 20000, 21000],
                psa10: [500000, 510000, 505000, 520000, 525000, 530000, 540000], // Hypothetical
                bgs95: [250000, 255000, 260000, 258000, 265000, 270000, 275000],
                cgc10: [280000, 285000, 290000, 295000, 300000, 310000, 315000]
            }
        },
        {
            id: 'c3',
            name: 'Michael Jordan Rookie',
            set: 'Fleer',
            year: 1986,
            image: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Michael_Jordan_1986_Fleer_Rookie_Card.jpg',
            marketPrice: 4200.00,
            trend: 'down',
            trendValue: -5.1,
            condition: 'PSA 8',
            grade: 'PSA 8',
            history: {
                raw: [2500, 2600, 2550, 2700, 2750, 2800, 2900],
                psa10: [200000, 205000, 202000, 210000, 215000, 220000, 225000],
                bgs95: [60000, 62000, 61000, 63000, 64000, 63500, 65000],
                cgc10: [65000, 67000, 66000, 68000, 69000, 68500, 70000]
            }
        },
        {
            id: 'c4',
            name: 'Blue-Eyes White Dragon',
            set: 'LOB',
            year: 2002,
            image: 'https://ms.yugipedia.com//a/a8/BlueEyesWhiteDragon-LOB-NA-UR-1E.png',
            marketPrice: 850.00,
            trend: 'up',
            trendValue: 8.4,
            condition: 'NM',
            grade: 'PSA 9',
            history: {
                raw: [400, 420, 410, 430, 440, 450, 460],
                psa10: [5000, 5200, 5100, 5300, 5400, 5500, 5600],
                bgs95: [2000, 2100, 2050, 2200, 2250, 2300, 2400],
                cgc10: [2200, 2300, 2250, 2400, 2450, 2500, 2600]
            }
        }
    ],
    user: {
        name: 'Joshua',
        totalValue: 30400.00,
        portfolioAppreciation: 12.4,
        recentScans: ['c1', 'c4']
    }
};
