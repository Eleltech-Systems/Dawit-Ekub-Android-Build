import { ActivityIndicator, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Entypo, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { deleteAllEkubLotWinner, deleteEkubLotWinner, selectAllEkubLotWinner, selectAllUniqueEkubMemberLotNumbers, selectEkub, selectEkubMembersByLotNumber } from '../database/ekubDB';
import { formatCurrency } from '../utilities/FormatCurrency';
import { COLORS } from '../constants/theme';
import styles from '../styles/ComponentStyles';

export default function ManageLotNumber({ route, navigation }) {
     const { ekubId } = route.params;
     const [ekub, setEkub] = useState([]);
     const [loteryNumber, setLoteryNumber] = useState([]);
     const [lotNumber, setLotNumber] = useState([]);
     const [ekubLotWinner, setEkubLotWinner] = useState([]);
     const [memberByLotNumber, setMemberByLotNumber] = useState([]);
     const [visibleMenuIndex, setVisibleMenuIndex] = useState(null);
     const [message, setMessage] = useState('');
     const [show, setShow] = useState(false);


     const fetchLotNumber = () => {
          selectAllUniqueEkubMemberLotNumbers(ekubId, setLoteryNumber);
     }

     const fetchAllEkubLotWinner = () => {
          selectAllEkubLotWinner(ekubId, setEkubLotWinner);
     }

     const handleLotNumberPress = (lotNumber) => {
          setLotNumber(lotNumber);
          selectEkubMembersByLotNumber(ekubId, lotNumber, setMemberByLotNumber);
     }

     useFocusEffect(
          React.useCallback(() => {
               selectEkub(ekubId, setEkub);
               fetchLotNumber();
               fetchAllEkubLotWinner();
          }, [ekubId])
     );

     const toggleMenu = (index) => {
          setVisibleMenuIndex(visibleMenuIndex === index ? null : index);
     };

     const handleDelete = (lotNumber) => {
          deleteEkubLotWinner(ekubId, lotNumber,
               (successMessage) => {
                    setMessage('');
                    fetchLotNumber();
                    fetchAllEkubLotWinner();
                    setVisibleMenuIndex(null);
                    setMemberByLotNumber([]);
               },
               (errorMessage) => {
                    setMessage(errorMessage);
               }
          );
     }

     const handleDeleteAll = () => {
          const ekubId = ekub.id;
          deleteAllEkubLotWinner(ekubId,
               (successMessage) => {
                    setShow(false)
                    setMessage('');
                    fetchLotNumber();
                    fetchAllEkubLotWinner();
                    setMemberByLotNumber([]);
               },
               (errorMessage) => {
                    setMessage(errorMessage);
               }
          );
     }

     const lotNumberList = () => {
          return loteryNumber.map((item, index) => {
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

     const allEkubLotWinnerList = () => {
          return ekubLotWinner.map((item, index) => {
               return (
                    <View key={index} style={{ marginHorizontal: 5, width: "30%", marginVertical: 10 }}>
                         <View style={{ borderWidth: 1, borderColor: COLORS.btnInValid, borderRadius: 10, marginBottom: 10 }}>
                              <View style={[styles.resultContainer, { justifyContent: "space-between", gap: 10, paddingHorizontal: 4 }]}>
                                   <Text style={[styles.xSmallText, { color: COLORS.primary }]}>{item.dateOfWinner}</Text>
                                   <Pressable onPress={() => toggleMenu(index)}>
                                        <Entypo name="chevron-down" size={18} color="black" />
                                   </Pressable>
                              </View>
                              <View style={{ backgroundColor: COLORS.secondary2, marginTop: 10, borderRadius: 10, flexDirection: "row", marginBottom: 10, paddingHorizontal: 5, alignSelf: "center" }}>
                                   <Text style={styles.smallText}>{index + 1}{"ኛ"}</Text>
                                   <View style={[styles.resultContainer, { marginVertical: 10 }]}>
                                        {item.medebType === "ሙሉ_መደብ" &&
                                             <TouchableOpacity onPress={() => handleLotNumberPress(item.lotNumber)}
                                                  style={[styles.lotBox, { backgroundColor: COLORS.lotFull }]}>
                                                  <Text style={styles.lotNum}>{item.lotNumber}</Text>
                                             </TouchableOpacity>
                                        }
                                        {item.medebType === "ግማሽ_መደብ" &&
                                             <TouchableOpacity onPress={() => handleLotNumberPress(item.lotNumber)}
                                                  style={[styles.lotBox, { backgroundColor: COLORS.lotHalf }]}>
                                                  <Text style={styles.lotNum}>{item.lotNumber}</Text>
                                             </TouchableOpacity>
                                        }
                                        {item.medebType === "እሩብ_መደብ" &&
                                             <TouchableOpacity onPress={() => handleLotNumberPress(item.lotNumber)}
                                                  style={[styles.lotBox, { backgroundColor: COLORS.lotQuarter }]}>
                                                  <Text style={styles.lotNum}>{item.lotNumber}</Text>
                                             </TouchableOpacity>
                                        }
                                   </View>
                              </View>
                         </View>
                         {visibleMenuIndex === index && (
                              <TouchableOpacity onPress={() => handleDelete(item.lotNumber)} style={[styles.lightButtons, { width: 86, alignSelf: "center" }]}>
                                   <MaterialCommunityIcons name="arrow-up-left" size={16} color={COLORS.primary} />
                                   <Text style={styles.xSmallText}>{"ይመልሱ"}</Text>
                              </TouchableOpacity>
                         )}
                    </View>
               )
          })
     }

     const showEkubMemberWithLot = () => {
          return memberByLotNumber.map((item, index) => {
               return (
                    <View key={index} style={{ backgroundColor: COLORS.btnInValid, marginTop: 20, borderRadius: 10, }}>
                         <View style={[styles.resultContainer, { marginHorizontal: 8, marginVertical: 5 }]}>
                              {memberByLotNumber.length === 1 &&
                                   <View style={[styles.lotBox, { backgroundColor: COLORS.lotFull }]}>
                                        <Text style={styles.lotNum}>{lotNumber}</Text>
                                   </View>
                              }
                              {memberByLotNumber.length === 2 &&
                                   <View style={[styles.lotBox, { backgroundColor: COLORS.lotHalf }]}>
                                        <Text style={styles.lotNum}>{lotNumber}</Text>
                                   </View>
                              }
                              {memberByLotNumber.length === 4 &&
                                   <View style={[styles.lotBox, { backgroundColor: COLORS.lotQuarter }]}>
                                        <Text style={styles.lotNum}>{lotNumber}</Text>
                                   </View>

                              }
                              <View style={{ width: "80%" }}>
                                   <Text style={styles.mediumText}>{item.fullName}</Text>
                                   <View style={styles.memberInfoContainer}>
                                        <Text style={styles.smallText}>
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
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>{"እጣ ማውጫ"}</Text>
                    <Text></Text>
               </View>
               {ekub.length === 0 ?
                    <View style={styles.activityIndicatorContainer}>
                         <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                    :
                    <ScrollView>
                         {loteryNumber.length === 0 ?
                              <View style={styles.lotCont}>
                                   <Text style={[styles.smallText, { color: COLORS.primary }]}>{"ምንም እጣ የለም"}</Text>
                              </View>
                              :
                              <>
                                   {loteryNumber.length > 0 &&
                                        <Text style={[styles.smallText, { marginHorizontal: 16, marginTop: 20 }]}>
                                             {"እጣ ዝርዝር ብዛት"} = {loteryNumber.length}
                                        </Text>
                                   }
                                   <View style={styles.lotCont}>{lotNumberList()}</View>
                              </>
                         }


                         {loteryNumber.length !== 0 &&
                              <View style={{ marginHorizontal: 16 }}>
                                   <TouchableOpacity onPress={() => navigation.navigate("AddEkubLotWinner", { ekubId: ekub.id })}
                                        style={[styles.resultContainer, { backgroundColor: COLORS.primary, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, alignSelf: "center", paddingHorizontal: 16, paddingVertical: 5, gap: 10 }]}>
                                        <Text style={[styles.smallText, { color: COLORS.offwhite }]}>{"ከእጣ  ዝርዝር  ያውጡ"}</Text>
                                        <MaterialCommunityIcons name="arrow-down-right" size={20} color={COLORS.offwhite} />
                                   </TouchableOpacity>
                                   {loteryNumber.length > 1 &&
                                        <TouchableOpacity onPress={() => navigation.navigate("SelectLotWinner", { ekubId: ekub.id })}
                                             style={{ alignSelf: "center", marginTop: 40 }}>
                                             <View style={{ backgroundColor: COLORS.primary, height: 80, width: 80, borderRadius: 100 / 2, alignItems: "center", justifyContent: "center" }}>
                                                  <View style={{ borderWidth: 2, borderColor: "white", height: 70, width: 70, borderRadius: 100 / 2, alignItems: "center", justifyContent: "center", paddingLeft: 6 }}>
                                                       <MaterialCommunityIcons name="slot-machine" size={36} color="white" />
                                                  </View>
                                             </View>
                                        </TouchableOpacity>
                                   }
                              </View>
                         }

                         {ekubLotWinner.length !== 0 &&
                              <>
                                   <Text style={[styles.mediumText, { alignSelf: "center", marginTop: 40, marginBottom: 10 }]}>{"እጣ የወጣላቸው"}</Text>
                                   {memberByLotNumber.length !== 0 &&
                                        <View style={[styles.basicStyle, { marginBottom: 20, flexWrap: "wrap", marginHorizontal: 10 }]}>
                                             {showEkubMemberWithLot()}
                                        </View>

                                   }

                                   {message !== '' && <Text style={styles.errorText}>{message}</Text>}

                                   <View style={[styles.resultContainer, { height: 40, justifyContent: "space-between", marginHorizontal: 20, marginBottom: 10 }]}>
                                        <Pressable onPress={() => setShow(!show)}>
                                             {show === true ?
                                                  <Ionicons name="close-outline" size={20} color={COLORS.primary} />
                                                  :
                                                  <MaterialCommunityIcons name="arrow-up-left" size={20} color="black" />
                                             }
                                        </Pressable>

                                        {show &&
                                             <TouchableOpacity onPress={() => handleDeleteAll()} style={styles.lightButtons}>
                                                  <Text style={styles.smallText}>{"ሁሉንም ወደ እጣ ዝርዝር ይመልሱ"}</Text>
                                             </TouchableOpacity>
                                        }
                                        <Text></Text>
                                   </View>

                                   <View style={{ marginBottom: 50, flexDirection: "row", flexWrap: "wrap", marginHorizontal: 16 }}>
                                        {allEkubLotWinnerList()}
                                   </View>
                              </>
                         }
                    </ScrollView>
               }
          </>
     )
}