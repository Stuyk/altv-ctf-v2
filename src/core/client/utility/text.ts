import * as alt from 'alt-client';
import * as native from 'natives';

alt.log('utility/text.ts');

interface DrawText {
    text: string;
    pos: alt.Vector3 | alt.Vector2;
    scale: number;
    color: alt.RGBA;
}

export function drawText2D(drawText: DrawText) {
    if (drawText.scale > 2) {
        drawText.scale = 2;
    }

    native.clearDrawOrigin();
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(drawText.text);
    native.setTextFont(4);
    native.setTextScale(1, drawText.scale);
    native.setTextColour(drawText.color.r, drawText.color.g, drawText.color.b, drawText.color.a);
    native.setTextOutline();
    native.setTextDropShadow();
    native.endTextCommandDisplayText(drawText.pos.x, drawText.pos.y, 0);
}

export function drawText3D(drawText: DrawText) {
    if (drawText.scale > 2) {
        drawText.scale = 2;
    }

    if (!(drawText.pos instanceof alt.Vector3)) {
        return;
    }

    native.setDrawOrigin(drawText.pos.x, drawText.pos.y, drawText.pos.z, false); // Used to stabalize text, sprites, etc. in a 3D Space.
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(drawText.text);
    native.setTextFont(4);
    native.setTextScale(1, drawText.scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextColour(drawText.color.r, drawText.color.g, drawText.color.b, drawText.color.a);
    native.setTextOutline();
    native.setTextDropShadow();
    native.setTextJustification(0);
    native.endTextCommandDisplayText(0, 0, 0);
    native.clearDrawOrigin();
}
