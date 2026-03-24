import { View, Text, Image, TouchableOpacity, Pressable, ScrollView, ActivityIndicator, AppState, Linking } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Entypo, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { deleteEkub, initDB, selectAllEkub } from '../database/ekubDB';
import { ModalPopup } from '../utilities/ModalPopup';
import { formatCurrency } from '../utilities/FormatCurrency';
import { useDrawerStatus } from '@react-navigation/drawer';
import { COLORS } from '../constants/theme';
import styles from '../styles/ComponentStyles';
import { checkAppVersion } from '../utilities/VersionCheck';
import Checkbox from "expo-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({ navigation }) {
     const drawerStatus = useDrawerStatus();
     const [isAgreed, setIsAgreed] = useState(false);
     const [isChecked, setIsChecked] = useState(false);
     const [ekubLists, setEkubLists] = useState([]);
     const [visibleMenuIndex, setVisibleMenuIndex] = useState(null);
     const [visibleForDelete, setVisibleForDelete] = useState(false);
     const [loadingForDelete, setLoadingForDelete] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const [ekubIdToDelete, setEkubIdToDelete] = useState(null);

     // Check storage on app start
     useEffect(() => {
          checkAgreement();
     }, []);

     const handleUrlPress = (url) => {
          Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
     };


     const checkAgreement = async () => {
          try {
               const value = await AsyncStorage.getItem("termsAccepted");
               if (value === "true") {
                    setIsAgreed(true);
               }
          } catch (e) {
               console.log("Error reading value", e);
          }
     };


     const handleAccept = async () => {
          if (!isChecked) return;

          try {
               await AsyncStorage.setItem("termsAccepted", "true");
               setIsAgreed(true);
          } catch (e) {
               console.log("Error saving value", e);
          }
     };


     useEffect(() => {
          const sub = AppState.addEventListener("change", state => {
               if (state === "active") {
                    checkAppVersion(); // re-check when user returns
               }
          });

          return () => sub.remove();
     }, []);


     const toggleMenu = (index) => {
          setVisibleMenuIndex(visibleMenuIndex === index ? null : index);
     };

     const fetchListOfEkubs = () => {
          setIsLoading(true);
          // This setTimeout helps to the loading effect to show loading until all the data fetches
          // we can specify the seconds (3000ms) to the setTimeout 
          setTimeout(() => {
               // After the database succefully initialized the available ekub fetches.
               initDB((successMessage) => {
                    selectAllEkub(setEkubLists);
                    // console.log(successMessage);
               }, (errorMessage) => {
                    console.log(errorMessage);
               })
               setIsLoading(false);
          });
     }

     //This useEffect loads when the drawer opens and close. This helps the restored data opens
     //after the user successfully restored from the backup external storage.
     useEffect(() => {
          fetchListOfEkubs();
     }, [drawerStatus]);


     // This useFocusEffect uses to load the data when the screen focus or mounted.
     useFocusEffect(
          useCallback(() => {
               fetchListOfEkubs();
          }, [])
     );


     const handleDelete = (ekubId) => {
          setLoadingForDelete(true);
          deleteEkub(ekubId,
               (successMessage) => {
                    setLoadingForDelete(false);
                    setVisibleForDelete(false);
                    setVisibleMenuIndex(null)
                    fetchListOfEkubs();
               },
               (errorMessage) => {
                    setLoadingForDelete(false);
                    setErrorMessage(errorMessage);
               }
          );
     }


     const showEkubList = () => {
          return ekubLists.map((item, index) => {
               return (
                    <View key={index} style={{ backgroundColor: COLORS.secondary, margin: 20, borderRadius: 12, paddingLeft: 14, paddingRight: 10, paddingVertical: 8, }}>
                         <TouchableOpacity onPress={() => navigation.navigate("Ekub", { ekubId: item.id })}
                              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                              <View style={{ width: "92%" }}>
                                   <Text style={{ fontWeight: "500", color: COLORS.primary, fontSize: 18, }}>{item.ekubName} {"-"} <Text style={styles.mediumText}>{item.ekubType}</Text></Text>
                                   <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Text style={styles.smallText}>{"መደብ"}</Text>
                                        <MaterialCommunityIcons name="approximately-equal" size={18} color={COLORS.darkText} />
                                        <Text style={styles.smallText}>{formatCurrency(item.medebAmount)}</Text>
                                        <Entypo name="arrow-long-right" size={16} color={COLORS.primary} />
                                        <Text style={styles.smallText}>{"ደራሽ"}</Text>
                                        <MaterialCommunityIcons name="approximately-equal" size={18} color={COLORS.darkText} />
                                        <Text style={styles.smallText}>{formatCurrency(item.medebAmount * item.duration)}</Text>
                                   </View>
                                   <Text style={styles.smallText}>{"ከ "}<Text style={{ color: COLORS.primary }}>{item.startDate}</Text>{"  እስከ  "}<Text style={{ color: COLORS.primary }}>{item.endDate}</Text></Text>
                              </View>
                              <Pressable onPress={() => toggleMenu(index)}>
                                   {visibleMenuIndex === index ? (<MaterialCommunityIcons name="close" size={20} color="black" />) :
                                        (<Ionicons name="chevron-down" size={20} color="black" />)}
                              </Pressable>
                         </TouchableOpacity>
                         {visibleMenuIndex === index && (
                              <TouchableOpacity onPress={() => (setVisibleForDelete(true), setEkubIdToDelete(item.id))}
                                   style={[styles.lightButtons, { alignSelf: 'flex-end', paddingVertical: 3 }]}>
                                   <Text style={styles.smallText}>{"ይሰርዙ"}</Text>
                                   <FontAwesome6 name="trash" size={16} color={COLORS.primary} />
                              </TouchableOpacity>
                         )}

                         <View style={styles.modalContainer}>
                              <ModalPopup visible={visibleForDelete}>
                                   {loadingForDelete === true ?
                                        <>
                                             <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { setVisibleForDelete(false), setLoadingForDelete(false) }}>
                                                  <Ionicons name="close" size={20} color="black" />
                                             </TouchableOpacity>
                                             <View style={styles.modalBox}>
                                                  <ActivityIndicator size="large" color="green" />
                                                  <Text style={styles.smallText}>{"በመሰረዝ ላይ . . . "}</Text>
                                             </View>
                                        </>
                                        :
                                        <>
                                             {errorMessage === "" ?
                                                  <>
                                                       <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { setVisibleForDelete(false), setLoadingForDelete(false), setVisibleMenuIndex(null) }}>
                                                            <Ionicons name="close" size={20} color="black" />
                                                       </TouchableOpacity>
                                                       <Image
                                                            source={require('../../assets/images/whyuser.webp')}
                                                            style={{ alignSelf: "center", height: 150, width: 150, marginVertical: 10 }}
                                                       />
                                                       <Text style={[styles.smallText, { alignSelf: "center", textAlign: "center", width: "80%" }]}>
                                                            {"እርግጠኛ ነዎት ይህን እቁብ ለመሰረዝ ወስነዋል?"}
                                                       </Text>
                                                       <View style={{ flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "space-evenly", marginVertical: 20 }}>
                                                            <TouchableOpacity onPress={() => { setVisibleForDelete(false), setVisibleMenuIndex(null) }} style={styles.answerBtn}>
                                                                 <Ionicons name="arrow-back" size={18} color="green" />
                                                                 <Text style={styles.aboutEkub}>{"ይቅር"}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => { handleDelete(ekubIdToDelete), setVisibleForDelete(false) }} style={styles.answerBtn}>
                                                                 <Text style={styles.aboutEkub}>{"አዎን"}</Text>
                                                                 <FontAwesome6 name="trash" size={16} color={COLORS.primary} />
                                                            </TouchableOpacity>
                                                       </View>
                                                  </>
                                                  :
                                                  <>
                                                       <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { setVisibleForDelete(false), setErrorMessage("") }}>
                                                            <Ionicons name="close" size={20} color="black" />
                                                       </TouchableOpacity>
                                                       <View style={styles.modalBox}>
                                                            <Text style={styles.errorText}>{errorMessage}</Text>
                                                       </View>
                                                  </>
                                             }
                                        </>
                                   }
                              </ModalPopup>
                         </View>
                    </View>
               )
          })
     }

     return (
          <ScrollView>
               <View style={{ backgroundColor: COLORS.secondary, position: "relative", height: 460 }}>
                    <View style={[styles.headerContainer, { backgroundColor: "transparent" }]}>
                         <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                              <MaterialIcons name="menu" size={22} color={COLORS.darkText} />
                         </TouchableOpacity>
                         {isAgreed &&
                              <TouchableOpacity onPress={() => navigation.navigate("StartNewEkub")}>
                                   <FontAwesome6 name="plus" size={20} color={COLORS.darkText} />
                              </TouchableOpacity>
                         }
                    </View>
                    <View style={{ width: "100%", height: "70%", alignItems: "center", justifyContent: "center" }}>
                         <Image source={require("../../assets/images/money-bag2.webp")} style={{ height: 160, width: 160 }} />
                    </View>
                    <LinearGradient
                         colors={['transparent', COLORS.primary]} // Gradient colors
                         style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%" }}
                    />
               </View>

               {isLoading === true ?
                    <View style={styles.container}>
                         <ActivityIndicator size="large" color={COLORS.secondary} />
                    </View>
                    :
                    <View style={{ paddingBottom: 50 }}>
                         {ekubLists.length === 0 ?
                              (<View style={styles.container}>
                                   <View style={{ marginHorizontal: 30, marginBottom: 20, gap: 20 }}>
                                        <Text style={{ alignSelf: "center", fontWeight: "500", fontSize: 24, color: COLORS.secondary }}>{"እንኳን ደህና መጡ"}</Text>
                                        <Text style={[styles.smallText, { color: COLORS.secondary, textAlign: 'justify' }]}>
                                             {"በየእለቱ ፣ በየሳምንቱ ፣ እንዲሁም በየወሩ የሚሰበሰቡ እቁቦችን በቀላሉ እዚህ ማስተዳደር ይችላሉ፡፡"}
                                        </Text>
                                   </View>
                                   {!isAgreed ?
                                        <View style={{ marginHorizontal: 30 }}>
                                             <Text style={[styles.smallText, { color: COLORS.secondary, textAlign: 'justify' }]}>
                                                  {"ይህን መተግበሪያ ለመጠቀም እባክዎ በውሎች እና ሁኔታዎች ይስማሙ።"}
                                                  <Text style={{ color: 'blue', fontWeight: '400' }} onPress={() => handleUrlPress("https://www.eleltech.com/dawit-ekub-terms-conditions.html")}>
                                                       {"   (Terms and conditions of use) "}
                                                  </Text>
                                             </Text>

                                             <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 40, marginBottom: 10 }}>
                                                  <Checkbox value={isChecked} onValueChange={setIsChecked} />
                                                  <Text style={[styles.smallText, { color: 'black' }]}>I agree to the Terms and Conditions</Text>
                                             </View>

                                             <TouchableOpacity onPress={handleAccept} style={[styles.submitButtons, { marginHorizontal: 0, backgroundColor: COLORS.secondary }]}>
                                                  <Text style={styles.smallText}>{"ይቀጥሉ"}</Text>
                                             </TouchableOpacity>
                                        </View>
                                        :
                                        <View style={{ width: '100%', paddingHorizontal: 10 }}>
                                             <Text style={[styles.smallText, { marginTop: 20, textAlign: 'center', marginBottom: 20, color: COLORS.secondary }]}>{"አሁን እቁብዎን መጀመር ይችላሉ   👇"}</Text>
                                             <TouchableOpacity
                                                  onPress={() => navigation.navigate("StartNewEkub")}
                                                  style={[styles.submitButtons, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, backgroundColor: COLORS.secondary }]}>
                                                  <FontAwesome6 name="plus" size={18} color={COLORS.primary} />
                                                  <Text style={[styles.mediumText, { color: COLORS.primary }]}>{"አዲስ እቁብ ይጀምሩ"}</Text>
                                             </TouchableOpacity>
                                        </View>
                                   }

                              </View>)
                              :
                              (<View style={styles.container}>
                                   <Text style={[styles.mediumText, { color: COLORS.secondary }]}>{ekubLists.length === 1 ? "የተጀመረ  እቁብ" : "የተጀመሩ  እቁቦች"}</Text>
                                   {showEkubList()}
                              </View>)
                         }
                    </View>
               }
          </ScrollView>
     )
}
