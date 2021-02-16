import WeightRandomizer from "weight-randomizer";
import * as googlePhotosApi from "../external/google/photosApi";
import * as dropboxApiV2 from "../external/dropbox/apiV2";
import uuid from "uuid";

export async function getPlaylist(recipe, cognitoIdentityId) {
    let mediaItemsAndWeight = [];

    const googlePhotoAlbums = recipe.albums;
    const dropboxFolders = recipe.folders;

    for (const googlePhotoAlbum of googlePhotoAlbums) {
      let googlePhotoItems = await googlePhotosApi.getPhotoItems(cognitoIdentityId, googlePhotoAlbum.id);
      let mediaItems = googlePhotoItems.map(item => {
         const { id, baseUrl } = item;
         return {
           id: id,
           url: baseUrl,
           source: 'google',
           parentId: googlePhotoAlbum.id
         }
      });

      mediaItemsAndWeight.push({ weight: parseInt(googlePhotoAlbum.weight), objects: mediaItems });
    }

    for (const folder of dropboxFolders) {
      let dropboxItems = await dropboxApiV2.listFolders(cognitoIdentityId, {
                                                                            path: folder.path_lower,
                                                                            include_media_info:  true
                                                                            }, 'file');

      let mediaItems = dropboxItems.filter(x => x.media_info.metadata[".tag"] === 'photo');

      let mediaItemsMapped = [];
      for (const item of mediaItems) {
        mediaItemsMapped.push({
          id: item.id,
          url: null,
          source: 'dropbox',
          parentId: folder.id,
          path: item.path_lower
        })
      }

      mediaItemsAndWeight.push({ weight: parseInt(folder.weight), objects: mediaItemsMapped });
    }

    let randomizer = new WeightRandomizer();
    const playlistSequence = randomizer.getSequence(mediaItemsAndWeight, process.env.playlistSequenceLengthDefault);

    let playlist = await createPlaylist(recipe, playlistSequence);
    let clientPhotoSequence = await fetchPhotoData(cognitoIdentityId, playlist.photos, process.env.playlistSequenceReturnedToClient);
    playlist.photos = clientPhotoSequence;

    savePlaylist(playlist);

    return playlist;
}

async function fetchPhotoData(cognitoIdentityId, photos, numberOfItems) {
  if(photos.length < numberOfItems) {
    numberOfItems = photos.length;
  }

  for(let i = 0; i < numberOfItems; i++) {
    if(photos[i].source === 'dropbox') {
      let temporaryLink = await dropboxApiV2.getTemporaryLink(cognitoIdentityId, { path: photos[i].path });

      photos[i].url = temporaryLink;
    } 
  }

  return photos;
}

async function createPlaylist(recipe, photos) {
    let playlistItem = {
      playlistId: uuid.v1(),
      recipeId: recipe.recipeId,
      userId: recipe.userId,
      photos: photos,
      feeds: recipe.feeds,
      transitionEffect: {
        type: recipe.transitionEffect.type,
        duration: recipe.transitionEffect.duration,
      },
      displayEffect: {
        type: recipe.displayEffect.type,
      },
      createdAt: Date.now()
    };

    return playlistItem;
  }

  async function savePlaylist(playlist) {
     /*const params = {
      TableName: process.env.tableNamePlaylists,
      Item: playlist
    };

    try {
      await dynamoDbLib.call("put", params);
      return playlist;
    } catch (e) {
      console.error(e);
      return failure({ status: false, errorCode: e.errorCode, errorMessage: e.errorMessage });
    }*/
  }