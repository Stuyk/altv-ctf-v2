import * as I from '../interfaces/index';

const zeroVector = { x: 0, y: 0, z: 0 };

export const arenas: I.ArenaInfo[] = [
    {
        weapon: 'WEAPON_GUSENBERG',
        spawns: {
            red: { x: 165.3600311279297, y: 2753.3837890625, z: 43.357845306396484 },
            blue: { x: 357.1416931152344, y: 2867.729736328125, z: 42.82969284057617 },
        },
        flags: {
            red: { x: 190.33889770507812, y: 2797.526611328125, z: 45.655120849609375 },
            blue: { x: 305.5166320800781, y: 2879.37158203125, z: 43.49885940551758 },
        },
        boundaries: [zeroVector, zeroVector, zeroVector, zeroVector, 10],
    },
    {
        weapon: 'WEAPON_REVOLVER',
        spawns: {
            red: { x: 738.4081420898438, y: -877.299072265625, z: 25.044363021850586 },
            blue: { x: 723.0001220703125, y: -796.6744995117188, z: 24.756031036376953 },
        },
        flags: {
            red: { x: 716.7882080078125, y: -922.4368896484375, z: 23.97035026550293 },
            blue: { x: 735.9468383789062, y: -843.2891235351562, z: 24.948596954345703 },
        },
        boundaries: [zeroVector, zeroVector, zeroVector, zeroVector, 10],
    },

    {
        weapon: 'WEAPON_MICROSMG',
        spawns: {
            red: { x: -1296.48681640625, y: -1191.845703125, z: 4.945659160614014 },
            blue: { x: -1338.60546875, y: -1082.563720703125, z: 6.933906555175781 },
        },
        flags: {
            red: { x: -1358.253173828125, y: -1203.968505859375, z: 4.449897289276123 },
            blue: { x: -1361.276123046875, y: -1117.384521484375, z: 4.279109477996826 },
        },
        boundaries: [zeroVector, zeroVector, zeroVector, zeroVector, 10],
    },
];
