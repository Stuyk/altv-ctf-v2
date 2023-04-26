import * as alt from 'alt-client';
import * as native from 'natives';

export function drawMarker(type: number, pos: alt.Vector3, scale: alt.Vector3, rgba: alt.RGBA) {
    native.drawMarker(
        type, // type
        pos.x, //x
        pos.y, //y
        pos.z, //z
        0, //dir.x
        0, //dir.y
        0, //dir.z
        0, //rot.x
        0, //rot.y
        0, //rot.z
        scale.x, //scale.x
        scale.y, //scale.y
        scale.z, //scale.z
        rgba.r, //r
        rgba.g, //g
        rgba.b, //b
        rgba.a, //alpha
        false, // ?
        false, // ?
        2, // ?
        false, // ?
        undefined,
        undefined,
        false
    );
}
