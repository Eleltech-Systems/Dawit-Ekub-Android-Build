import { Alert } from 'react-native';
import { ConvertedDate } from './ConverteDate';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as FileSystemLegacy from 'expo-file-system/legacy';


export const backupDatabase = async () => {
     const today = ConvertedDate();
     try {
          // Database file
          const dbFile = new File(Paths.document, 'SQLite/DawitEkub');

          // Ask user to select directory
          const permissions = await FileSystemLegacy.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (!permissions.granted) {
               Alert.alert('ፍቃድ ተከልክሏል', 'ወደ ማከማቻዎ ለመድረስ ፍቃድ መስጠት አለብዎ።');
               return;
          }

          // File name
          const filename = `Dawit_Ekub_${today}`;

          // Create file
          const backupUri = await FileSystemLegacy.StorageAccessFramework.createFileAsync(
               permissions.directoryUri,
               filename,
               'application/octet-stream'
          );

          const base64 = await dbFile.base64();

          // Write to selected location
          await FileSystemLegacy.writeAsStringAsync(
               backupUri,
               base64,
               { encoding: FileSystemLegacy.EncodingType.Base64 }
          );

          Alert.alert('ተሳክቷል', 'የእቁብዎን ሙሉ መረጃ በተሳካ ሁኔታ አስቀምጠዋል።');

     } catch (error) {
          console.error(error);
          Alert.alert('አልተሳካም', 'የእቁብዎን መረጃዎ ለማስቀመጥ አልተሳካም። ' + error.message);
     }
};



export const restoreDatabase = async () => {
     try {
          const result = await DocumentPicker.getDocumentAsync({
               type: '*/*',
               copyToCacheDirectory: true,
          });

          if (result.canceled || !result.assets?.length) {
               Alert.alert('አልተሳካም ተሰርዟል', 'ምንም ፋይል አልመረጡም');
               return;
          }

          const backupUri = result.assets[0].uri;
          const backupFile = new File(backupUri);
          const dbFile = new File(Paths.document, 'SQLite/DawitEkub');

          // Correct check (exists is PROPERTY)
          if (dbFile.exists) {
               dbFile.delete();
          }

          // Copy backup file
          backupFile.copy(dbFile);

          Alert.alert('ተሳክቷል', 'ሙሉ የእቁብ መረጃዎ ወደነበረበት ተመሷል።');
     } catch (error) {
          console.error(error);
          Alert.alert('አልተሳካም', 'የእቁብ መረጃዎን ወደነበረበት ለመመለስ አልተሳካም: ' + error.message);
     }
};
