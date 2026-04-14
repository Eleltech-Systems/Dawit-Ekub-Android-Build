import { BackHandler, Linking, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, useDrawerStatus } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { backupDatabase, restoreDatabase } from './DatabaseBackupAndRestore';
import { COLORS } from '../constants/theme';
import styles from '../styles/ComponentStyles';
import { useCallback, useState } from 'react';
import { initDB, selectAllEkub } from '../database/ekubDB';
import { useFocusEffect } from '@react-navigation/native';


export default function CustomDrawer(props) {
     const handleWebLink = () => { Linking.openURL("https://www.eleltech.com"); }
     const drawerStatus = useDrawerStatus();
     const [ekubLists, setEkubLists] = useState();

     useFocusEffect(
          useCallback(() => {
               initDB((successMessage) => {
                    selectAllEkub(setEkubLists);
                    console.log(successMessage);
               }, (errorMessage) => {
                    console.log(errorMessage);
               })
          }, [drawerStatus])
     );

     return (
          <View style={{ flex: 1 }}>
               <DrawerContentScrollView {...props}>
                    <View style={{ backgroundColor: COLORS.secondary, borderRadius: 10, padding: 20, marginBottom: 20, alignItems: "center" }}>
                         <View style={[styles.basicStyle, { backgroundColor: COLORS.secondary }]}>
                              <Avatar
                                   rounded
                                   size={110}
                                   source={require("../../assets/images/moneyLogo2.png")}
                              />
                         </View>
                         <Text style={styles.mediumText}>Dawit Ekub</Text>
                         <Text style={[styles.smallText, { marginTop: 20 }]}>Powered by: Eleltech Systems</Text>
                         <Pressable onPress={handleWebLink}>
                              <Text style={[styles.smallText, { color: COLORS.primary }]}>www.eleltech.com</Text>
                         </Pressable>
                    </View>

                    <DrawerItemList {...props} />

                    <DrawerItem
                         label="መውጫ"
                         style={{ borderRadius: 10 }}
                         labelStyle={styles.smallTextAm}
                         icon={() => <Ionicons name="exit-outline" size={24} color={COLORS.primary} />}
                         onPress={() => BackHandler.exitApp()}
                    />
                    <View style={{ borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 10, padding: 20, gap: 20, marginTop: 30 }}>
                         {ekubLists && ekubLists.length > 0 &&
                              <>
                                   <Text style={[styles.xSmallTextAm, { textAlign: "justify" }]}>
                                        ሙሉ የእቁብዎን ምትክ መረጃ በስልክዎ የፈለጉት ቦታ ላይ ለማስቀመጥ ይህን ቁልፍ ይጠቀሙ፡፡
                                   </Text>
                                   <TouchableOpacity disabled={!ekubLists} onPress={() => backupDatabase()} style={[styles.lightButtons, { gap: 14 }]}>
                                        <MaterialCommunityIcons name="file-download" size={22} color={COLORS.primary} />
                                        <Text style={styles.smallTextAm}>ምትክ መረጃ ያስቀምጡ</Text>
                                   </TouchableOpacity>
                              </>
                         }

                         <Text style={[styles.xSmallTextAm, { textAlign: "justify" }]}>
                              ያስቀመጡትን ሙሉ የእቁብዎን ምትክ መረጃ መልሰው ለመጠቀም የሚያስችልዎትን ይህን ቁልፍ ይጠቀሙ፡፡
                         </Text>
                         <TouchableOpacity onPress={() => restoreDatabase()} style={[styles.lightButtons, { gap: 14 }]}>
                              <MaterialCommunityIcons name="backup-restore" size={22} color={COLORS.primary} />
                              <Text style={styles.smallTextAm}>ምትክ  መረጃ  ይመልሱ</Text>
                         </TouchableOpacity>
                    </View>
               </DrawerContentScrollView>
          </View>
     )
}
