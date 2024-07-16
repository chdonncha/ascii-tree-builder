import { v4 as uuidv4 } from 'uuid';

export const SAMPLE_TREE_DATA = [
    { id: '1', parentId: null, name: 'Root', type: 'folder' },
    { id: '2', parentId: '1', name: 'Documents', type: 'folder' },
    { id: '3', parentId: '2', name: 'Reports', type: 'folder' },
    { id: '4', parentId: '3', name: 'Monthly_Report.txt', type: 'file' },
    { id: '5', parentId: '3', name: 'Annual_Report.txt', type: 'file' },
    { id: '6', parentId: '2', name: 'Invoices', type: 'folder' },
    { id: '7', parentId: '1', name: 'Media', type: 'folder' },
    { id: '8', parentId: '7', name: 'Images', type: 'folder' },
    { id: '9', parentId: '8', name: 'Profile_Picture.jpg', type: 'file' },
    { id: '10', parentId: '8', name: 'Banner.jpg', type: 'file' },
    { id: '11', parentId: '7', name: 'Videos', type: 'folder' },
    { id: '12', parentId: '11', name: 'Intro_Video.mp4', type: 'file' },
    { id: '13', parentId: '1', name: 'Games', type: 'folder' },
    { id: '14', parentId: '13', name: 'Retro', type: 'folder' },
    { id: '15', parentId: '14', name: 'Doom', type: 'file' },
    { id: '16', parentId: '14', name: 'Quake', type: 'file' },
];

const generateUUIDsForSampleData = (sampleData) => {
    const idMapping = sampleData.reduce((acc, current) => {
        const newId = uuidv4();
        acc[current.id] = { newId, parentId: current.parentId };
        return acc;
    }, {});

    return sampleData.map(node => ({
        ...node,
        id: idMapping[node.id].newId,
        parentId: node.parentId ? idMapping[node.parentId].newId : null,
    }));
};

export const convertedSampleData = generateUUIDsForSampleData(SAMPLE_TREE_DATA);