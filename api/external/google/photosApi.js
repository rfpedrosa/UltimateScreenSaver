import axios from "axios";
import * as tokensDb from "../../shared/tokensDb";
import * as api from "./api";

export async function getAlbums(cognitoIdentityId) {
    const resultProvider = await tokensDb.get(cognitoIdentityId, 'google');
    let albums = [];

    let headers = await getHeaders(resultProvider);
    let parameters = { pageSize: process.env.googleAlbumsPageSize, pageToken: '' };

    try {
        do {
            const result = await axios.get(`${process.env.googleApiBaseUrl}/v1/albums`, {
                headers: headers,
                params: parameters,
                responseType: 'json',
            });

            if (result && result.data && result.data.albums) {
                const items = result.data.albums.filter(x => !!x);
        
                albums = albums.concat(items);
            }
            parameters.pageToken = result.data.nextPageToken;
        } while (parameters.pageToken != null);
    } catch (err) {
        console.error((err.error && err.error.error) ||
            {name: err.name, code: err.statusCode, message: err.message});
    }

    return albums;
}

export async function getPhotoItems(cognitoIdentityId, albumId) {
    const resultProvider = await tokensDb.get(cognitoIdentityId, 'google');

    let items = [];
    let parameters = { 'pageSize': process.env.googleSearchPageSize };

    const headers = await getHeaders(resultProvider);
    parameters.albumId = albumId;

    try {
        do {
            const result = await axios.post(`${process.env.googleApiBaseUrl}/v1/mediaItems:search`, parameters, {
                headers: headers,
                responseType: 'json',
            });

            if (result && result.data && result.data.mediaItems) {
                const mediaItems = result.data.mediaItems.filter(x => !!x)
                                                         .filter(x => x.mimeType && x.mimeType.startsWith('image/'));
        
                items = items.concat(mediaItems);
            }

            parameters.pageToken = result.data.nextPageToken;
        } while(parameters.pageToken)
    } catch (err) {
        console.error((err.error && err.error.error) ||
            {name: err.name, code: err.statusCode, message: err.message});
    }

    return items;
}

async function getHeaders(resultProvider) {
    let token = await getToken(resultProvider);

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
}

async function getToken(resultProvider) {
    let token = resultProvider.Item.providerData.access_token;
    try {
        token = await api.refreshTokenIfExpired(resultProvider.Item);
    } catch (e) {
        console.log('Error refreshing access token: ', e.message);
        throw e;
    }
    
    return token;
}