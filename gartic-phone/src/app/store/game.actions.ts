import { Album } from '../modules/shared/types/types';

export class SetAlbums {
    static readonly type = '[Game] SetAlbums';

    constructor(public albums: Album[]) {}
}
