import * as alt from 'alt-server';
import './utility/ipc'; // Used to reconnect, do not remove.
import './utility/utility';
import './systems/index';
import { connectLocalClient } from './utility/reconnect';

if (alt.debug) {
    connectLocalClient();
}
