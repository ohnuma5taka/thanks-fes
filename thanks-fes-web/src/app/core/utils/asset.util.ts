const isExist = async (path: string) => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

const getAssetDimension = (
  path: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const isVideo = /\.(mp4|webm|ogg)$/i.test(path);
    const element = document.createElement(isVideo ? 'video' : 'img');
    element.src = path;
    element.onerror = (error) => {
      reject(new Error(`Failed to load asset at path: ${path}`));
    };
    if (isVideo) {
      const _element = element as HTMLVideoElement;
      element.onloadedmetadata = () => {
        resolve({ width: _element.videoWidth, height: _element.videoHeight });
      };
    } else {
      const _element = element as HTMLImageElement;
      element.onload = () => {
        resolve({ width: _element.width, height: _element.height });
      };
    }
  });
};

export const assetUtil = {
  isExist,
  getAssetDimension,
};
