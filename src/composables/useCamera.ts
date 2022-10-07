import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';


async function takePhoto() {
    return await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 100,
        presentationStyle: 'popover',
    }).catch();
}

export function useCamera() {
    return {
        takePhoto
    };
}

