export const STAR_SYSTEMS = [
  {
    id: 'stanton', name: 'Stanton', position: [0, 0, 0], type: 'F-type Star',
    status: 'UEE Owned', color: '#FFD700', starColor: '#ffe566', size: 2.5,
    dangerLevel: 3, description: 'Privately owned system, hub of commerce and conflict.',
    jumpPoints: ['pyro', 'terra', 'magnus', 'nyx'],
    planets: [
      { id: 'hurston', name: 'Hurston', color: '#8B4513', orbitRadius: 8, size: 0.6,
        stations: ['Lorville', 'HDMS-Bezdek', 'HDMS-Lathan'] },
      { id: 'crusader', name: 'Crusader', color: '#87CEEB', orbitRadius: 14, size: 0.9,
        stations: ['Port Olisar', 'Grim HEX', 'Covalex Hub'] },
      { id: 'arccorp', name: 'ArcCorp', color: '#4169E1', orbitRadius: 20, size: 0.55,
        stations: ['Area18', 'Baijini Point'] },
      { id: 'microtech', name: 'MicroTech', color: '#B0C4DE', orbitRadius: 27, size: 0.65,
        stations: ['New Babbage', 'Port Tressler'] },
    ]
  },
  {
    id: 'pyro', name: 'Pyro', position: [18, 4, -10], type: 'Red Dwarf',
    status: 'Unclaimed', color: '#FF4500', starColor: '#ff6622', size: 1.8,
    dangerLevel: 5, description: 'Lawless system. Extreme pirate activity. Approach with caution.',
    jumpPoints: ['stanton', 'nyx'],
    planets: [
      { id: 'pyro1', name: 'Pyro I', color: '#cc2200', orbitRadius: 5, size: 0.4 },
      { id: 'bloom', name: 'Bloom', color: '#ff6600', orbitRadius: 9, size: 0.7 },
      { id: 'monox', name: 'Monox', color: '#884422', orbitRadius: 13, size: 0.5 },
      { id: 'terminus', name: 'Terminus', color: '#664433', orbitRadius: 17, size: 0.45 },
      { id: 'pyro5', name: 'Pyro V', color: '#992200', orbitRadius: 21, size: 0.35 },
    ]
  },
  {
    id: 'nyx', name: 'Nyx', position: [10, -8, 15], type: 'White Dwarf',
    status: 'Unclaimed', color: '#E0E8FF', starColor: '#cce8ff', size: 1.4,
    dangerLevel: 4, description: 'Anarchist haven. Significant outlaw presence.',
    jumpPoints: ['stanton', 'pyro', 'odin'],
    planets: [
      { id: 'delamar', name: 'Delamar', color: '#555577', orbitRadius: 7, size: 0.5,
        stations: ['Levski'] },
    ]
  },
  {
    id: 'terra', name: 'Terra', position: [-20, 2, -5], type: 'G-type Star',
    status: 'UEE Capital', color: '#64E864', starColor: '#88ff88', size: 2.2,
    dangerLevel: 1, description: 'Thriving UEE capital system. Heavy security presence.',
    jumpPoints: ['stanton', 'magnus'],
    planets: [
      { id: 'terra3', name: 'Terra', color: '#2266aa', orbitRadius: 10, size: 0.75 },
    ]
  },
  {
    id: 'magnus', name: 'Magnus', position: [-12, -3, 8], type: 'K-type Star',
    status: 'UEE Owned', color: '#FFA500', starColor: '#ffb533', size: 1.9,
    dangerLevel: 2, description: 'Industrial system, moderate pirate activity near asteroid belts.',
    jumpPoints: ['stanton', 'terra'],
    planets: [
      { id: 'borea', name: 'Borea', color: '#6688aa', orbitRadius: 8, size: 0.55 },
    ]
  },
  {
    id: 'odin', name: 'Odin', position: [5, 12, 20], type: 'G-type Star',
    status: 'UEE Owned', color: '#88BBFF', starColor: '#aaccff', size: 2.0,
    dangerLevel: 2, description: 'Outer system. Some pirate activity.',
    jumpPoints: ['nyx'],
    planets: [
      { id: 'odin1', name: 'Odin I', color: '#445566', orbitRadius: 6, size: 0.4 },
      { id: 'odin2', name: 'Odin II', color: '#336699', orbitRadius: 11, size: 0.6 },
    ]
  },
  {
    id: 'sol', name: 'Sol', position: [-35, -5, -15], type: 'G-type Star',
    status: 'UEE Core', color: '#FFFF88', starColor: '#ffff99', size: 2.8,
    dangerLevel: 1, description: 'Birthplace of humanity. Heavy UEE patrol.',
    jumpPoints: ['terra', 'magnus'],
    planets: [
      { id: 'earth', name: 'Earth', color: '#2244aa', orbitRadius: 10, size: 0.65 },
      { id: 'mars', name: 'Mars', color: '#cc4422', orbitRadius: 14, size: 0.45 },
    ]
  },
  {
    id: 'croshaw', name: 'Croshaw', position: [30, -6, 5], type: 'K-type Star',
    status: 'UEE Owned', color: '#FF8844', starColor: '#ff9955', size: 1.7,
    dangerLevel: 2, description: 'First extra-solar system settled by humanity.',
    jumpPoints: ['stanton', 'pyro'],
    planets: [
      { id: 'angeli', name: 'Angeli', color: '#448844', orbitRadius: 8, size: 0.5 },
      { id: 'castra1', name: 'Castra I', color: '#885544', orbitRadius: 13, size: 0.4 },
    ]
  },
];

export const getDangerColor = (level) => {
  const colors = {
    1: '#00ff88',
    2: '#aaff00',
    3: '#ffdd00',
    4: '#ff7700',
    5: '#ff2233',
  };
  return colors[level] || '#8fb8cc';
};

export const getSystemById = (id) => STAR_SYSTEMS.find(s => s.id === id);
