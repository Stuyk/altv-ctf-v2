import * as alt from 'alt-server';

export function setClothes(player: alt.Player, team: 'red' | 'blue') {
    player.model = 'mp_m_freemode_01';
    if (!player.isSpawned) {
        player.spawn(0, 0, 0, 0);
    }

    if (team === 'blue') {
        player.setClothes(0, 0, 0, 0); // Face
        player.setClothes(1, 21, 0, 0); // Head
        player.setClothes(2, 0, 0, 0); // Hair
        player.setClothes(3, 1, 0, 0); // Torso
        player.setClothes(4, 13, 0, 0); // Legs
        player.setClothes(6, 1, 0, 0); // Shoes
        player.setClothes(8, 15, 0, 0); // Undershirt
        player.setClothes(11, 14, 0, 0); // Top
        return;
    }

    if (team === 'red') {
        player.setClothes(0, 0, 0, 0); // Face
        player.setClothes(1, 26, 0, 0); // Head
        player.setClothes(2, 0, 0, 0); // Hair
        player.setClothes(3, 1, 0, 0); // Torso
        player.setClothes(4, 13, 0, 0); // Legs
        player.setClothes(6, 1, 0, 0); // Shoes
        player.setClothes(8, 15, 0, 0); // Undershirt
        player.setClothes(11, 79, 0, 0); // Top
        return;
    }
}
