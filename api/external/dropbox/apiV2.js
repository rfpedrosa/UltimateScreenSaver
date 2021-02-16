import fetch from 'isomorphic-fetch';
import { Dropbox } from 'dropbox';
import * as tokensDb from "../../shared/tokensDb";

export async function listFolders(cognitoIdentityId, params, type) {
    const token = await getToken(cognitoIdentityId);
    let dropbox = new Dropbox({ accessToken: token, fetch: fetch });

    let items = [];
    let cursor = undefined;
    try {
        await dropbox.filesListFolder(params).then(function(result) {
            if (result && result.entries) {
                const filteredItems = filterItems(result.entries, type); 
                items = items.concat(filteredItems);
                if(result.has_more) {
                    cursor = result.cursor;
                }
            }
        }).catch(function(error) {
            throw error;
        });
    } catch (err) {
        console.error((err.error && err.error.error) ||
            {name: err.name, code: err.statusCode, message: err.message});
    }

    if(cursor) {
        const restOfItems = await listFoldersContinue(cognitoIdentityId, cursor, type);
        items = items.concat(restOfItems);
    }

    return items;
}

async function listFoldersContinue(cognitoIdentityId, cursor, type) {
    const token = await getToken(cognitoIdentityId);
    let dropbox = new Dropbox({ accessToken: token, fetch: fetch });

    let items = [];
    try {
        do {
            await dropbox.filesListFolderContinue({ cursor: cursor }).then(function(result) {
                if (result && result.entries) {
                    const filteredItems = filterItems(result.entries, type);
                    items = items.concat(filteredItems);

                    cursor = result.has_more ? result.cursor : undefined;
                }
            })
            .catch(function(error) {
                throw error;
            });
        } while(cursor)
    } catch (err) {
        console.error((err.error && err.error.error) ||
            {name: err.name, code: err.statusCode, message: err.message});
    }

    return items;
}

export async function getTemporaryLink(cognitoIdentityId, params) {
    const token = await getToken(cognitoIdentityId);
    let dropbox = new Dropbox({ accessToken: token, fetch: fetch });
    let temporaryLink = null;

    try {
        await dropbox.filesGetTemporaryLink(params).then(function(result) {
            if (result) {
                temporaryLink = result.link;
            }
        })
        .catch(function(error) {
            throw error;
        });
    } catch (err) {
        console.error((err.error && err.error.error) ||
            {name: err.name, code: err.statusCode, message: err.message});
    }

    return temporaryLink;
}

async function getToken(cognitoIdentityId) {
    const resultProvider = await tokensDb.get(cognitoIdentityId, 'dropbox');
    return resultProvider.Item.providerData.access_token;
}

function filterItems(entries, type) {
    return entries.filter(x => !!x)
                    .filter(x => x[".tag"] && x[".tag"] === type);
}

