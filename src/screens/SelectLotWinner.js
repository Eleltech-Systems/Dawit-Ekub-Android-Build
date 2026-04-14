import { View, Text, Animated, Image, TouchableOpacity, Pressable, ScrollView, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AddEkubLotWinners, selectAllUniqueEkubMemberLotNumbers, selectEkub, selectEkubMembersByLotNumber } from '../database/ekubDB';
import { Entypo, FontAwesome6, MaterialIcons, } from '@expo/vector-icons';
import { formatCurrency } from '../utilities/FormatCurrency';
import { useAudioPlayer } from "expo-audio";
import { ConvertedDate } from '../utilities/ConverteDate';
import styles from '../styles/ComponentStyles';
import { COLORS } from '../constants/theme';


const audioSource = require("../../assets/soundforrotation.mp3");


export default function LotterySelector({ route, navigation }) {
     const { ekubId } = route.params;
     const [ekub, setEkub] = useState([]);
     const [loteryNumber, setLoteryNumber] = useState([]);
     const [memberByLotNumber, setMemberByLotNumber] = useState([]);
     const [message, setMessage] = useState('');
     const rotation = useRef(new Animated.Value(0)).current;
     const player = useAudioPlayer(audioSource);
     const [isRotating, setIsRotating] = useState(false);
     const [selectedNumber, setSelectedNumber] = useState(null);


     // Handle back button press
     const handleBackButtonPress = useCallback(() => {
          if (isRotating) {
               // Prevent default back button behavior when isRotating is true
               return true; // Returning true means we have handled the event
          }
          // Allow default back button behavior when isRotating is false
          return false; // Returning false means we haven't handled the event
     }, [isRotating]);

     useEffect(() => {
          // Add event listener
          const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButtonPress);

          // Cleanup function to remove the listener
          return () => {
               backHandler.remove();
          };
     }, [handleBackButtonPress]);


     const data = loteryNumber.map((lot) =>
          lot.lotNumber,
     );


     useFocusEffect(
          React.useCallback(() => {
               selectEkub(ekubId, setEkub);
               selectAllUniqueEkubMemberLotNumbers(ekubId, setLoteryNumber);
          }, [ekubId])
     );

     useFocusEffect(
          React.useCallback(() => {
               selectEkubMembersByLotNumber(ekubId, selectedNumber, setMemberByLotNumber)
          }, [selectedNumber])
     );



     const rotateAnimation = () => {

          if (isRotating) return;
          setIsRotating(true);

          rotation.setValue(0);

          // PLAY SOUND WHEN ROTATION STARTS
          player.seekTo(0);
          player.play();

          Animated.timing(rotation, {
               toValue: 50,
               duration: 11500,
               useNativeDriver: true,
          }).start(() => {
               setIsRotating(false);
               // STOP SOUND WHEN ROTATION ENDS
               // player.pause();
               const randomIndex = Math.floor(Math.random() * data.length);
               setSelectedNumber(data[randomIndex]);
          });
     };

     const rotateInterpolate = rotation.interpolate({
          inputRange: [0, 50],
          outputRange: ["0deg", "18000deg"],
     });


     let medebType;

     if (memberByLotNumber.length === 1) {
          medebType = "ሙሉ_መደብ"
     } else if (memberByLotNumber.length === 2) {
          medebType = "ግማሽ_መደብ"
     } else {
          medebType = "እሩብ_መደብ"
     }

     const onHandleYes = () => {
          const lotNumber = selectedNumber;
          const selectedDate = ConvertedDate();
          const ekubId = ekub.id;

          AddEkubLotWinners(ekubId, medebType, lotNumber, selectedDate,
               (successMessage) => {
                    setMessage('');
                    navigation.goBack();
               },
               (errorMessage) => {
                    setMessage(errorMessage);
               }
          );
     };


     const showEkubMemberWithLot = () => {
          return memberByLotNumber.map((item, index) => {
               return (
                    <View key={index} style={{ backgroundColor: "#cedaed", marginTop: 20, borderRadius: 10, }}>
                         <View style={[styles.resultContainer, { marginHorizontal: 8, marginVertical: 5 }]}>
                              {memberByLotNumber.length === 1 &&
                                   <View style={[styles.lotBox, { backgroundColor: COLORS.lotFull }]}>
                                        <Text style={styles.lotNum}>{selectedNumber}</Text>
                                   </View>
                              }
                              {memberByLotNumber.length === 2 &&
                                   <View style={[styles.lotBox, { backgroundColor: COLORS.lotHalf }]}>
                                        <Text style={styles.lotNum}>{selectedNumber}</Text>
                                   </View>
                              }
                              {memberByLotNumber.length === 4 &&
                                   <View style={[styles.lotBox, { backgroundColor: COLORS.lotQuarter }]}>
                                        <Text style={styles.lotNum}>{selectedNumber}</Text>
                                   </View>

                              }
                              <View style={{ width: "80%" }}>
                                   <Text style={styles.mediumText}>{item.fullName}</Text>
                                   <View style={styles.memberInfoContainer}>
                                        <Text style={styles.smallTextAm}>
                                             {memberByLotNumber.length === 1 && "ሙሉ መደብ ደራሽ፡"}
                                             {memberByLotNumber.length === 2 && "ግማሽ መደብ ደራሽ፡"}
                                             {memberByLotNumber.length === 4 && "እሩብ መደብ ደራሽ፡"}
                                        </Text>
                                        <Entypo name="arrow-long-right" size={18} color="green" />
                                        <Text style={styles.smallText}>
                                             {memberByLotNumber.length === 1 && formatCurrency(ekub.medebAmount * ekub.duration)}
                                             {memberByLotNumber.length === 2 && formatCurrency((ekub.medebAmount / 2) * ekub.duration)}
                                             {memberByLotNumber.length === 4 && formatCurrency((ekub.medebAmount / 4) * ekub.duration)}
                                        </Text>
                                   </View>
                              </View>
                         </View>
                    </View>
               )
          })
     }

     return (
          <>
               <View style={styles.headerContainer}>
                    <Pressable onPress={() => navigation.goBack()} disabled={isRotating}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </Pressable>
                    <Text style={styles.headerTextAm}>እጣ ማውጫ</Text>
                    <Pressable onPress={() => setSelectedNumber(null)} disabled={isRotating}>
                         <MaterialIcons name="refresh" size={22} color={COLORS.offwhite} />
                    </Pressable>
               </View>
               <ScrollView>
                    <View style={{ alignItems: "center", borderWidth: 0, marginTop: 50, marginHorizontal: 10 }}>
                         <Animated.View style={{ transform: [{ rotate: rotateInterpolate }], }}>
                              {selectedNumber === null &&
                                   <Image
                                        source={require("../../assets/images/rotation7.png")}
                                        style={{ height: 220, width: 220, borderWidth: 4, borderColor: COLORS.primary, borderRadius: 220 / 2, margin: 60 }}
                                   />}
                         </Animated.View>
                         {selectedNumber === null &&
                              <TouchableOpacity onPress={rotateAnimation} disabled={isRotating} style={styles.lightButtons}>
                                   <Text style={styles.mediumTextAm}>ያስጀምሩ</Text>
                                   <FontAwesome6 name="play" size={20} color={COLORS.primary} />
                              </TouchableOpacity>
                         }
                         {selectedNumber !== null &&
                              <View>
                                   {isRotating !== true &&
                                        <>
                                             <View style={[styles.contentContainer, { flexDirection: "row", justifyContent: "space-around", }]}>
                                                  <Image
                                                       source={require("../../assets/images/victory3.webp")}
                                                       style={{ height: 80, width: 70, marginVertical: 5 }}
                                                  />
                                                  <View style={[styles.resultContainer, { gap: 5 }]}>
                                                       <Text style={styles.mediumText}>የወጣው እጣ ቁጥር፡ </Text>
                                                       {memberByLotNumber.length === 1 &&
                                                            <View style={[styles.lotBox, { backgroundColor: COLORS.lotFull }]}>
                                                                 <Text style={styles.lotNum}>{selectedNumber}</Text>
                                                            </View>
                                                       }
                                                       {memberByLotNumber.length === 2 &&
                                                            <View style={[styles.lotBox, { backgroundColor: COLORS.lotHalf }]}>
                                                                 <Text style={styles.lotNum}>{selectedNumber}</Text>
                                                            </View>
                                                       }
                                                       {memberByLotNumber.length === 4 &&
                                                            <View style={[styles.lotBox, { backgroundColor: COLORS.lotQuarter }]}>
                                                                 <Text style={styles.lotNum}>{selectedNumber}</Text>
                                                            </View>

                                                       }
                                                  </View>

                                             </View>

                                             <View style={styles.contentContainer}>
                                                  <View style={{ marginHorizontal: 10 }}>{showEkubMemberWithLot()}</View>
                                                  <View style={{ marginTop: 60, marginHorizontal: 40 }}>
                                                       <Text style={[styles.smallTextAm, { textAlign: "center", color: COLORS.primary }]}>
                                                            አሸናፊውን እጣ ቁጥር መመዝገብ እና ከእጣ ዝርዝር ማውጣት ይፈልጋሉ?
                                                       </Text>
                                                       <View style={[styles.resultContainer, { gap: 10, justifyContent: "space-around", marginVertical: 30, width: "70%", alignSelf: "center" }]}>
                                                            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.lightButtons, { paddingVertical: 2, width: "30%" }]}>
                                                                 <Text style={styles.smallTextAm}>አይ</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => onHandleYes()} style={[styles.lightButtons, { paddingVertical: 2, width: "30%" }]}>
                                                                 <Text style={styles.smallTextAm}>አዎን</Text>
                                                            </TouchableOpacity>
                                                       </View>
                                                  </View>
                                             </View>

                                             {message !== '' &&
                                                  <Text style={[styles.errorTextAm, { marginVertical: 40, marginHorizontal: 20, textAlign: "center" }]}>
                                                       {message}
                                                  </Text>
                                             }
                                        </>
                                   }
                              </View>
                         }
                    </View>
               </ScrollView>
          </>
     );
};