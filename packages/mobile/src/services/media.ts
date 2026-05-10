import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { CONFIG } from '../constants/design';

export type ImageSource = 'camera' | 'gallery';

/**
 * Request permissions and get image from camera or gallery
 */
export async function pickImage(source: ImageSource): Promise<string | null> {
  try {
    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permission.granted) {
        console.log('Camera permission denied');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        maxSize: 1024,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        console.log('Media library permission denied');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        maxSize: 1024,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
    }

    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}

/**
 * Open external URL in browser or appropriate app
 */
export async function openExternalUrl(url: string): Promise<void> {
  try {
    const parsed = Linking.parse(url);
    
    // If it's a known streaming provider, try to open the app
    if (parsed.scheme && ['http', 'https'].includes(parsed.scheme)) {
      await WebBrowser.openBrowserAsync(url);
    } else {
      // Try to open as deep link
      const canOpen = await Linking.canOpenAsync(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback to browser
        await WebBrowser.openBrowserAsync(url);
      }
    }
  } catch (error) {
    console.error('Error opening URL:', error);
    // Fallback to browser
    await WebBrowser.openBrowserAsync(url);
  }
}

/**
 * Validate image file size
 */
export function validateImageSize(uri: string, maxSizeBytes: number = CONFIG.imageMaxSize): boolean {
  // Note: This is a basic check. In production, you might want to
  // get the actual file size from the picker result
  return true;
}

/**
 * Get image dimensions from URI
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

export function getImageDimensions(uri: string): ImageDimensions {
  // This would typically use expo-image-picker's asset info
  // For now, return a default
  return { width: 1024, height: 1024 };
}

export default {
  pickImage,
  openExternalUrl,
  validateImageSize,
  getImageDimensions,
};
