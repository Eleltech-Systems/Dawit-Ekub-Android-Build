import * as Network from 'expo-network';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

const VERSION_URL = "https://eleltech.com/dawitekub-app-version.json";

const LATEST_VERSION_KEY = "latest_version";
const PLAYSTORE_URL_KEY = "playstore_url";

// VERSION COMPARISON
function compareVersions(current, latest) {
     const c = current.split('.').map(Number);
     const l = latest.split('.').map(Number);

     for (let i = 0; i < l.length; i++) {
          if ((c[i] || 0) < (l[i] || 0)) return -1;
          if ((c[i] || 0) > (l[i] || 0)) return 1;
     }
     return 0;
}

export async function checkAppVersion() {
     try {
          const currentVersion = Application.nativeApplicationVersion;
          const network = await Network.getNetworkStateAsync();

          let latestVersion = null;
          let playStoreUrl = null;

          // STEP 1 — Fetch & SAVE if internet available
          if (network.isConnected) {
               try {
                    const response = await fetch(VERSION_URL);
                    const data = await response.json();

                    latestVersion = data.latestVersion;
                    playStoreUrl = data.playStoreUrl;

                    await AsyncStorage.setItem(LATEST_VERSION_KEY, latestVersion);
                    await AsyncStorage.setItem(PLAYSTORE_URL_KEY, playStoreUrl);
               } catch (error) {
                    console.log("Fetch failed, will use cached data");
               }
          }

          // STEP 2 — Use saved version if offline or fetch failed
          if (!latestVersion) {
               latestVersion = await AsyncStorage.getItem(LATEST_VERSION_KEY);
               playStoreUrl = await AsyncStorage.getItem(PLAYSTORE_URL_KEY);

               if (!latestVersion) {
                    console.log("No stored version found");
                    return; // nothing to compare yet
               }
          }

          // STEP 3 — Compare versions (ALWAYS)
          const result = compareVersions(currentVersion, latestVersion);

          // STEP 4 — Force update if outdated
          if (result < 0) {
               forceUpdate(playStoreUrl);
          }

     } catch (e) {
          console.log("Version check failed:", e);
     }
}

// FORCE UPDATE ALERT (NO CANCEL)
function forceUpdate(url) {
     Alert.alert(
          "አዲስ ስሪት ተለቋል",
          "እባክዎን ወደ አዲሱ ስሪት ያዘምኑ።",
          [
               {
                    text: "ያዘምኑ",
                    onPress: () => {
                         if (url) {
                              Linking.openURL(url);
                         }
                    }
               }
          ],
          { cancelable: false } // important: prevents closing
     );
}