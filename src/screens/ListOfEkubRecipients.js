import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { deleteEkubRecipients, selectAllEkubRecipients } from '../database/ekubDB';
import { useFocusEffect } from '@react-navigation/native';
import { formatCurrency } from '../utilities/FormatCurrency';
import { Entypo, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import styles from '../styles/ComponentStyles';

export default function ListOfEkubRecipients({ route, navigation }) {
     const { ekubId } = route.params;
     const [allEkubRecipients, setAllEkubRecipients] = useState([]);
     const [visibleMenuIndex, setVisibleMenuIndex] = useState(null);
     const [isLoading, setIsLoading] = useState(false);
     const [loadingForDelete, setLoadingForDelete] = useState(false);
     const [message, setMessage] = useState('');


     const fetchEkubRecipients = () => {
          setIsLoading(true)
          setTimeout(() => {
               selectAllEkubRecipients(ekubId, setAllEkubRecipients)
               setIsLoading(false)
          });
     }

     useFocusEffect(
          React.useCallback(() => {
               fetchEkubRecipients();
          }, [])
     );

     const toggleMenu = (index) => {
          setVisibleMenuIndex(visibleMenuIndex === index ? null : index);
     };


     const handleDelete = (payId) => {
          setLoadingForDelete(true)
          deleteEkubRecipients(payId,
               (successMessage) => {
                    setMessage('');
                    setLoadingForDelete(false)
                    fetchEkubRecipients();
                    setVisibleMenuIndex(null);
               },
               (errorMessage) => {
                    setLoadingForDelete(false)
                    setMessage(errorMessage);
               }
          );
     }


     const showAllEkubRecipientsList = () => {
          return allEkubRecipients.map((item, index, array) => {
               return (
                    <View key={index} style={{ marginHorizontal: 10, marginVertical: 5, gap: 10 }}>
                         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Text style={[styles.smallTextAm, { color: COLORS.primary }]}>ቀን፡ </Text>
                              <Text style={{ color: COLORS.primary }}>{item.dateOfPayment}</Text>
                         </View>

                         <View style={{ backgroundColor: COLORS.secondary, marginBottom: 20, borderRadius: 8, padding: 5 }}>
                              <View style={[styles.resultContainer, { width: '100%', flexDirection: 'row', flexDirection: "row", justifyContent: "space-between" }]}>
                                   <View style={{ flexDirection: "row" }}>
                                        <View style={styles.orderedNumBox}>
                                             <Text style={[styles.largTextAm, { color: COLORS.offwhite }]}>{(array.length - 1) - (index - 1)}{"ኛ"}</Text>
                                        </View>
                                        <View style={{}}>
                                             <Text style={styles.mediumText}>{item.takerName}</Text>
                                             <View style={[styles.resultContainer, { gap: 12 }]}>
                                                  <Text style={styles.smallTextAm}>የብር መጠን</Text>
                                                  <Entypo name="arrow-long-right" size={20} color={COLORS.primary} />
                                                  <Text style={[styles.smallText]}>{formatCurrency(item.moneyAmount)}</Text>
                                             </View>
                                        </View>

                                   </View>
                                   <TouchableOpacity onPress={() => { toggleMenu(index), setLoadingForDelete(false), setMessage('') }}
                                        style={{ justifyContent: "center" }}>
                                        {visibleMenuIndex === index ? (<MaterialCommunityIcons name="close" size={20} color="black" />) :
                                             (<Entypo name="chevron-down" size={20} color="black" />)}
                                   </TouchableOpacity>
                              </View>

                              {visibleMenuIndex === index && (
                                   <View style={[styles.resultContainer, { justifyContent: "flex-end", gap: 30, paddingVertical: 10, marginHorizontal: 10 }]}>
                                        {message !== '' ?
                                             <Text style={styles.errorText}>{message}</Text>
                                             :
                                             <>
                                                  {loadingForDelete === true ?
                                                       <View style={[styles.basicStyle, { marginHorizontal: 50, padding: 4 }]}>
                                                            <ActivityIndicator size="small" color={COLORS.primary} />
                                                       </View>
                                                       :
                                                       <TouchableOpacity onPress={() => handleDelete(item.id)}
                                                            style={[styles.lightButtons, { paddingVertical: 2 }]}>
                                                            <Text style={styles.smallTextAm}>ይሰርዙ</Text>
                                                            <FontAwesome6 name="trash" size={16} color={COLORS.primary} />
                                                       </TouchableOpacity>
                                                  }
                                             </>
                                        }
                                   </View>
                              )}
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
                    <Text style={styles.headerTextAm}>የእቁብ ብር የደረሳቸው</Text>
                    <Text></Text>
               </View>
               {isLoading === true ?
                    (<View style={styles.activityIndicatorContainer}>
                         <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>)
                    :
                    (
                         <ScrollView>
                              <View style={{ marginTop: 20, marginBottom: 50 }}>
                                   {allEkubRecipients.length === 0 ?
                                        <View style={{ margin: 50, alignItems: "center", paddingVertical: 100 }}>
                                             <Image source={require("../../assets/images/nofile.webp")} style={{ height: 160, width: 160, alignSelf: "center" }} />
                                             <Text style={[styles.smallTextAm, { marginTop: 20 }]}>
                                                  ምንም የእቁብ ብር ክፍያ አልፈፀሙም!
                                             </Text>
                                        </View>
                                        :
                                        <>{showAllEkubRecipientsList()}</>
                                   }
                              </View>
                         </ScrollView>
                    )
               }
          </>
     )
}