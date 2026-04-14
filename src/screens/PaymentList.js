import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react';
import { Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native';
import { fetchPaymentsByDate, fetchPaymentsTwo, getSummOfAllMemberPayment, getSumOfAllMemberPaymentAmount, selectEkub } from '../database/ekubDB';
import { formatCurrency } from '../utilities/FormatCurrency';
import styles from '../styles/ComponentStyles';
import { COLORS } from '../constants/theme';

export default function PaymentList({ route, navigation }) {
     const { ekubId } = route.params;
     const [ekub, setEkub] = useState([]);
     const [fetchedPayments, setFetchedPayments] = useState([])
     const [fetchedPaymentsTwo, setFetchedPaymentsTwo] = useState([])
     const [sumOfAllEkubMemberPayment, setSumOfAllEkubMemberPayment] = useState(0)
     const [sumOfAllEkubMemberPaymentAmount, setSumOfAllEkubMemberPaymentAmount] = useState(0)
     const [isLoading, setIsLoading] = useState(false);
     const [show, setShow] = useState(false);

     const fetchAllData = () => {
          setIsLoading(true)
          setTimeout(() => {
               setIsLoading(false)
               fetchPaymentsByDate(ekubId, setFetchedPayments);
               fetchPaymentsTwo(ekubId, setFetchedPaymentsTwo);
          })
     }


     useFocusEffect(
          React.useCallback(() => {
               selectEkub(ekubId, setEkub);
               getSummOfAllMemberPayment(ekubId, setSumOfAllEkubMemberPayment);
               getSumOfAllMemberPaymentAmount(ekubId, setSumOfAllEkubMemberPaymentAmount);
               fetchAllData();
          }, [ekubId])
     );

     //This helps to limit the number of items renderd and helps to avoid app stack.
     const limitedData = fetchedPayments.slice(0, 200)

     // Initialize a variable to keep track of the last displayed date
     let lastDisplayedDate = null;

     const renderListItem = ({ item }) => {
          // Check if the current payment date is different from the last displayed date
          const isDifferentDate = item.paymentDate !== lastDisplayedDate;

          // Update lastDisplayedDate to the current payment's date
          if (isDifferentDate) {
               lastDisplayedDate = item.paymentDate;

               // Find the corresponding total payment for the current date
               const totalPayment = fetchedPaymentsTwo.find(total => total.paymentDate === lastDisplayedDate);

               // Render the total amount for this date
               return (
                    <View>
                         {/* Display the total amount for this date */}
                         {totalPayment && (
                              <View style={[styles.resultContainer, { justifyContent: "space-between", marginHorizontal: 10, marginTop: 30, paddingHorizontal: 10, paddingVertical: 14, borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: COLORS.secondary, }]}>
                                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.mediumTextAm}>ቀን: </Text>
                                        <Text style={styles.mediumText}>{item.paymentDate}</Text>
                                   </View>
                                   <Text style={styles.mediumText}>{formatCurrency(totalPayment.totalAmount)}</Text>
                              </View>
                         )}

                         <View style={styles.listContainer}>
                              <Text style={styles.mediumText}>{item.payerName}</Text>
                              <View style={[styles.resultContainer, { gap: 15 }]}>
                                   <Text style={styles.smallTextAm}>የብር መጠን</Text>
                                   <Entypo name="arrow-long-right" size={20} color="green" />
                                   <Text style={styles.smallText}>{formatCurrency(item.totalAmount)}</Text>
                              </View>
                         </View>

                    </View>
               );
          }

          return (
               <View style={styles.listContainer}>
                    <Text style={styles.mediumText}>{item.payerName}</Text>
                    <View style={[styles.resultContainer, { gap: 15 }]}>
                         <Text style={styles.smallTextAm}>የብር መጠን</Text>
                         <Entypo name="arrow-long-right" size={20} color="green" />
                         <Text style={styles.smallText}>{formatCurrency(item.totalAmount)}</Text>
                    </View>
               </View>
          );
     };


     return (
          <>
               {isLoading === true ?
                    <View style={styles.activityIndicatorContainer}>
                         <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                    :
                    <>
                         <View style={styles.headerContainer}>
                              <TouchableOpacity onPress={() => navigation.goBack()}>
                                   <FontAwesome6 name="arrow-left" size={20} color="white" />
                              </TouchableOpacity>
                              {fetchedPayments.length !== 0 ?
                                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.headerTextAm}>አጠቃላይ  =  </Text>
                                        <Text style={styles.headerText}>{formatCurrency(sumOfAllEkubMemberPayment)}</Text>
                                   </View>
                                   :
                                   <Text style={styles.headerTextAm}>የክፍያ ዝርዝር</Text>
                              }
                              {fetchedPayments.length !== 0 &&
                                   <TouchableOpacity onPress={() => setShow(!show)}>
                                        {show ? (<Ionicons name="close" size={20} color={COLORS.secondary2} />) :
                                             (<Entypo name="chevron-down" size={22} color={COLORS.secondary2} />)}
                                   </TouchableOpacity>
                              }
                         </View>
                         <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                              {fetchedPayments.length !== 0 && show &&
                                   (<Text style={[styles.smallText, { color: COLORS.black, textAlign: "justify", marginHorizontal: 20, marginVertical: 10 }]}>
                                        {"አሁን ባሎዎት የእቁብ አባሎች ብዛት መሰረት "}{ekub.ekubType === "የቀን" && "በየእለቱ"}{ekub.ekubType === "የሳምንት" && "በየሳምንቱ"}{ekub.ekubType === "የወር" && "በየወሩ"}{" የሚሰበሰብ የብር መጠን"}
                                        <Text style={[styles.smallText, { color: COLORS.secondary }]}> {formatCurrency(sumOfAllEkubMemberPaymentAmount)}</Text> {" ብር ሲሆን "}
                                        <Text>{"እስከ እቁብዎ ማጠናቀቂያ ቀን ድረስ ጠቅላላ የሚሰበስቡት የብር መጠን "}
                                             <Text style={[styles.smallText, { color: COLORS.secondary }]}>{formatCurrency(ekub.duration * sumOfAllEkubMemberPaymentAmount)}</Text>{" ብር ነው፡፡"}
                                        </Text>
                                   </Text>)
                              }
                         </View>
                         <ScrollView>
                              <View style={{ paddingBottom: 50 }}>
                                   {fetchedPayments.length === 0 ?
                                        <View style={{ margin: 50, alignItems: "center", paddingVertical: 100 }}>
                                             <Image source={require('../../assets/images/nofile.webp')} style={{ height: 160, width: 160, alignSelf: "center" }} />
                                             <Text style={[styles.smallTextAm, { marginTop: 20, color: COLORS.primary }]}>ምንም የክፍያ ዝርዝር የለም!</Text>
                                        </View> :
                                        <FlatList scrollEnabled={false}
                                             data={limitedData}
                                             keyExtractor={(item, index) => index.toString()}
                                             renderItem={renderListItem}
                                        />
                                   }
                              </View>
                         </ScrollView>
                    </>
               }
          </>
     )
}