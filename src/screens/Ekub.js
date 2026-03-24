import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Pressable, } from 'react-native';
import React, { useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { getSummOfAllMemberPayment, getSumOfAllEkubRecipients, selectAllEkubMember, selectAllUniqueEkubMemberLotNumbers, selectEkub, selectEkubMemberLotNumbers } from '../database/ekubDB';
import { formatCurrency } from '../utilities/FormatCurrency';
import { COLORS } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/ComponentStyles';


export default function Ekub({ route, navigation }) {
     const { ekubId } = route.params;
     const [ekub, setEkub] = useState([]);
     const [ekubMember, setEkubMember] = useState([]);
     const [loteryNumber, setLoteryNumber] = useState([]);
     const [sumOfAllEkubMemberPayment, setSumOfAllEkubMemberPayment] = useState(0);
     const [sumOfAllEkubRecipients, setSumOfAllEkubRecipients] = useState(0);
     const [memberLotNumber, setMemberLotNumber] = useState([]);
     const [visibleMenuIndex, setVisibleMenuIndex] = useState(null);
     const [showMessage, setShowMessage] = useState(false);

     const fetchAllData = () => {
          selectEkub(ekubId, setEkub);
          selectAllEkubMember(ekubId, setEkubMember);
          selectAllUniqueEkubMemberLotNumbers(ekubId, setLoteryNumber);
          getSummOfAllMemberPayment(ekubId, setSumOfAllEkubMemberPayment);
          getSumOfAllEkubRecipients(ekubId, setSumOfAllEkubRecipients);
     }


     // Using useFocusEffect to fetch data when the screen is focused
     useFocusEffect(
          React.useCallback(() => {
               fetchAllData();
          }, [])
     );

     const reloadData = async () => {
          setShowMessage(true);

          // Simulate 3-second timer
          const timerPromise = new Promise(resolve => setTimeout(resolve, 3000));

          // Simulate a data loading function
          const loadData = new Promise(resolve => {
               setTimeout(() => {
                    fetchAllData();
                    console.log("Data loaded!");
                    resolve();
               }, 2000); // Simulate 2-second data fetch
          });

          // Wait for both timer and data load to finish
          await Promise.all([timerPromise, loadData]);

          setShowMessage(false);
     };



     const toggleMenu = (index) => {
          setVisibleMenuIndex(visibleMenuIndex === index ? null : index);
     };

     const handleSeeMore = (ekubMemberId) => {
          selectEkubMemberLotNumbers(ekubMemberId, setMemberLotNumber)
     }

     const showMemberLotNumber = () => {
          return memberLotNumber.map((item, index) => {
               return (
                    <View key={index}>
                         {item.medebType === "ሙሉ_መደብ" &&
                              <Text style={[styles.lotNum, { backgroundColor: COLORS.lotFull }]}>{item.lotNumber}</Text>
                         }
                         {item.medebType === "ግማሽ_መደብ" &&
                              <Text style={[styles.lotNum, { backgroundColor: COLORS.lotHalf }]}>{item.lotNumber}</Text>

                         }
                         {item.medebType === "እሩብ_መደብ" &&
                              <Text style={[styles.lotNum, { backgroundColor: COLORS.lotQuarter }]}>{item.lotNumber}</Text>
                         }
                    </View>
               )
          })
     }


     const showEkubMemberList = () => {
          return ekubMember.map((item, index) => {
               return (
                    <View key={index} style={{ marginHorizontal: 10 }}>
                         <TouchableOpacity onPress={() => navigation.navigate("EkubMember", { ekubTypeId: ekubId, ekubMemberId: item.id, startDate: ekub.startDate })}
                              style={{ backgroundColor: COLORS.secondary2, marginTop: 20, borderRadius: 8, }}>
                              <View style={[styles.basicStyle, { marginHorizontal: 8, marginVertical: 5 }]}>
                                   <View style={styles.orderedNumBox}>
                                        <Text style={[styles.largText, { color: COLORS.offwhite }]}>{index + 1}</Text>
                                   </View>
                                   <View style={{ width: "84%", flexDirection: "row", justifyContent: "space-between" }}>
                                        <View style={{ width: "90%" }}>
                                             <Text style={styles.mediumText}>{item.fullName}</Text>
                                             <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                                                  <Text style={styles.smallText}>{ekub.ekubType === "የቀን" && "እለታዊ ክፍያ"}{ekub.ekubType === "የሳምንት" && "ሳምንታዊ ክፍያ"}{ekub.ekubType === "የወር" && "ወርሃዊ ክፍያ"}</Text>
                                                  <Entypo name="arrow-long-right" size={20} color={COLORS.primary} />
                                                  <Text style={styles.smallText}>{formatCurrency(item.paymentAmount)}</Text>
                                             </View>
                                        </View>
                                        <Pressable onPress={() => { toggleMenu(index), handleSeeMore(item.id) }} style={{ justifyContent: "center" }}>
                                             {visibleMenuIndex === index ? (<MaterialCommunityIcons name="close" size={20} color="black" />) :
                                                  (<Entypo name="chevron-down" size={20} color="black" />)}
                                        </Pressable>
                                   </View>
                              </View>
                              {visibleMenuIndex === index && (
                                   <View style={{ paddingHorizontal: 0, marginVertical: 10, marginHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
                                        <Text style={styles.smallText}>{"እጣ ቁጥር፡ "}</Text>
                                        <View style={{ maxWidth: "76%", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", gap: 10 }}>
                                             {memberLotNumber.length === 0 ?
                                                  (<Text style={[styles.smallText, { color: COLORS.primary }]}>{"አልተሰየመም"}</Text>) : (showMemberLotNumber())
                                             }
                                        </View>
                                   </View>
                              )}
                         </TouchableOpacity>
                    </View>
               )
          })
     }



     return (
          <>
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>{ekub.ekubName}</Text>
                    <TouchableOpacity onPress={() => reloadData()}>
                         <MaterialIcons name="refresh" size={22} color={COLORS.offwhite} />
                    </TouchableOpacity>
               </View>
               {ekub.length === 0 ?
                    <View style={styles.activityIndicatorContainer}>
                         <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                    :
                    <ScrollView>
                         {showMessage && (
                              <Text style={[styles.smallText, { textAlign: "center", marginTop: 10, color: COLORS.primary }]}>{"Refreshing . . ."}</Text>
                         )}
                         <View style={[styles.contentContainer, { backgroundColor: COLORS.gray, padding: 5, marginTop: 20 }]}>
                              <View style={{ flexDirection: "row", gap: 20, marginLeft: 10, marginVertical: 20 }}>
                                   <Image source={require("../../assets/images/money-bag2.webp")} style={{ marginLeft: 10, height: 70, width: 70 }} />
                                   <Text style={[styles.smallText, { width: "64%", textAlign: "justify" }]}>{"ይህ ባለ "}
                                        <Text style={{ color: COLORS.primary }}>{formatCurrency(ekub.medebAmount)}</Text>{" መደብ የ "}
                                        <Text style={{ color: COLORS.primary }}>{ekub.duration}{ekub.ekubType === "የቀን" && " ቀን "}{ekub.ekubType === "የሳምንት" && " ሳምንት "}{ekub.ekubType === "የወር" && " ወር "}</Text>{"እቁብ ከ "}
                                        <Text style={{ color: COLORS.primary }}>{ekub.startDate}</Text>{" እስከ "}
                                        <Text style={{ color: COLORS.primary }}>{ekub.endDate}</Text>{" የሚቆይ ሲሆን ደራሽ "}
                                        <Text style={{ color: COLORS.primary }}>{formatCurrency(ekub.medebAmount * ekub.duration)}</Text>{" ብር ነው፡፡"}
                                   </Text>
                              </View>

                              <View style={{ width: "100%", borderWidth: 0.3, borderColor: "green", backgroundColor: "white", marginTop: 10, marginBottom: 30, borderRadius: 20, alignSelf: "center", paddingHorizontal: 10, paddingVertical: 10, }}>
                                   <View style={{ backgroundColor: COLORS.secondary, padding: 10, borderRadius: 10 }}>
                                        <View style={styles.resultContainer}>
                                             <Text style={[styles.smallText, { width: "34%", }]}>{"ጠቅላላ አባላት"}</Text>
                                             <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                             <Text style={[styles.smallText, { marginLeft: 10 }]}>{ekubMember.length}</Text>
                                        </View>
                                        <View style={styles.resultContainer}>
                                             <Text style={[styles.smallText, { width: "34%", }]}>{"የእጣው ብዛት"}</Text>
                                             <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                             <Text style={[styles.smallText, { marginLeft: 10 }]}>{loteryNumber.length}</Text>
                                        </View>
                                        <View style={styles.resultContainer}>
                                             <Text style={[styles.smallText, { width: "34%", }]}>{"ጠቅላላ የተሰበሰበ"}</Text>
                                             <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                             <Text style={[styles.smallText, { marginLeft: 10 }]}>{sumOfAllEkubMemberPayment === null ? (0) : formatCurrency(sumOfAllEkubMemberPayment)}</Text>
                                        </View>
                                        <View style={styles.resultContainer}>
                                             <Text style={[styles.smallText, { width: "34%", }]}>{"የተፈጸመ ክፍያ"}</Text>
                                             <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                             <Text style={[styles.smallText, { marginLeft: 10 }]}>{sumOfAllEkubRecipients === null ? (0) : formatCurrency(sumOfAllEkubRecipients)}</Text>
                                        </View>
                                        <View style={styles.resultContainer}>
                                             <Text style={[styles.smallText, { width: "34%", }]}>{"ቀሪ ብር መጠን"}</Text>
                                             <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                             <Text style={[styles.smallText, { marginLeft: 10, }]}>{formatCurrency(sumOfAllEkubMemberPayment - sumOfAllEkubRecipients)}</Text>
                                        </View>
                                   </View>

                                   <View style={[styles.resultContainer, { marginTop: 20, justifyContent: "space-between" }]}>
                                        <TouchableOpacity onPress={() => navigation.navigate("ListOfEkubRecipients", { ekubId: ekub.id })} style={[styles.lightButtons, { width: "48%", }]}>
                                             <FontAwesome6 name="list-check" size={18} color={COLORS.primary} />
                                             <Text style={styles.smallText}>{"እቁብ የደረሳቸው"}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate("ManageLotNumber", { ekubId: ekub.id })} style={[styles.lightButtons, { width: "48%", }]}>
                                             <MaterialCommunityIcons name="slot-machine" size={20} color={COLORS.primary} />
                                             <Text style={styles.smallText}>{"እጣ ማውጫ"}</Text>
                                        </TouchableOpacity>
                                   </View>
                              </View>

                              <View style={[styles.resultContainer, { width: "100%", justifyContent: "space-between" }]}>
                                   <TouchableOpacity onPress={() => navigation.navigate("PaymentList", { ekubId: ekub.id })}
                                        style={[styles.moreBtn, { borderTopRightRadius: 10, borderBottomLeftRadius: 16 }]}>
                                        <FontAwesome6 name="list-check" size={18} color={COLORS.offwhite} />
                                        <Text style={[styles.smallText, { color: COLORS.offwhite }]}>{"የክፍያ ዝርዝር"}</Text>
                                   </TouchableOpacity>


                                   <TouchableOpacity onPress={() => navigation.navigate("AddEkubMember", { ekubId: ekub.id, ekubMedeb: ekub.medebAmount })}
                                        style={[styles.moreBtn, { borderTopLeftRadius: 10, borderBottomRightRadius: 16 }]}>
                                        <Text style={[styles.smallText, { color: COLORS.offwhite }]}>{"አባል ይጨምሩ"}</Text>
                                        <Ionicons name="person-add" size={18} color={COLORS.offwhite} />
                                   </TouchableOpacity>
                              </View>
                         </View>
                         {ekubMember.length === 0 ?
                              <View style={[styles.modalContainer, { backgroundColor: COLORS.gray, marginTop: 100, marginHorizontal: 30, marginBottom: 80, borderRadius: 10, height: 300, gap: 20 }]}>
                                   <Text style={[styles.smallText, { color: COLORS.primary }]}>{"ምንም እቁብተኛ አልመዘገቡም"}</Text>
                                   <TouchableOpacity onPress={() => navigation.navigate('AddEkubMember', { ekubId: ekub.id, ekubMedeb: ekub.medebAmount })}
                                        style={styles.lightButtons}>
                                        <Text style={styles.smallText}>{"ይመዝግቡ"}</Text>
                                        <Ionicons name="person-add" size={18} color={COLORS.primary} />
                                   </TouchableOpacity>
                              </View>
                              :
                              <View style={{ marginBottom: 50 }}>
                                   {showEkubMemberList()}
                              </View>
                         }
                    </ScrollView>
               }
          </>
     )
}