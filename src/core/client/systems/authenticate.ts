import * as alt from 'alt-client';
import { Events } from '../../shared/events';

alt.log('systems/authenticate.ts');

const DISCORD_APP_ID = '1090747667317010532';

async function handleAuthentication() {
    let bearerToken: string;

    try {
        bearerToken = await alt.Discord.requestOAuth2Token(DISCORD_APP_ID);
    } catch (e) {}

    alt.emitServerRaw(Events.toServer.finishAuthenticate, bearerToken);
}

alt.onServer(Events.toClient.authenticate, handleAuthentication);
