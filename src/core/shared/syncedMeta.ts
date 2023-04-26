declare module 'alt-shared' {
    export interface ICustomPlayerStreamSyncedMeta {
        authenticated: boolean;
        name: string;
        team: 'red' | 'blue';
    }
}
