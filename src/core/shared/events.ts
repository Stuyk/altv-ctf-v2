export const Events = {
    toServer: {
        goToPosition: 'server:event:goto:position',
        finishAuthenticate: 'server:event:finish:authenticate',
    },
    toClient: {
        authenticate: 'client:event:authenticate',
        startTickEvents: 'client:event:start:ticks',
        applyPlayerChanges: 'client:event:apply:player:changes',
    },
};
