import { View, Text, ScrollView, TouchableOpacity, Image, Pressable, ActivityIndicator, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import call from 'react-native-phone-call';
import * as SMS from 'expo-sms';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { deleteEkubMember, deletePayment, getSumOfEkubRecipients, getSumOfMemberPayment, selectEkub, selectEkubMember, selectMemberPayment } from '../database/ekubDB';
import { addDaysEthiopian } from '../utilities/addDaysEthiopian';
import { ModalPopup } from '../utilities/ModalPopup';
import { formatCurrency } from '../utilities/FormatCurrency';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { ConvertedDate } from '../utilities/ConverteDate';
import ParsedText from 'react-native-parsed-text';
import styles from '../styles/ComponentStyles';
import { COLORS } from '../constants/theme';
import moment from 'moment';
import { getEthiopianDateDifference } from '../utilities/calculateDateDifference';

export default function EkubMember({ route, navigation }) {
     const { ekubTypeId, ekubMemberId, startDate } = route.params;
     const [ekub, setEkub] = useState([]);
     const [ekubMember, setEkubMember] = useState([]);
     const [memberPayment, setMemberPayment] = useState([]);
     const [sumOfPayment, setSumOfPayment] = useState();
     const [sumOfEkubRecipients, setSumOfEkubRecipients] = useState(0);
     const [visibleMenuIndex, setVisibleMenuIndex] = useState(null);
     const [showMenu, setShowMenu] = useState(false);
     const [newDate, setNewDate] = useState('');
     const [visible, setVisible] = useState(false);
     const [visible2, setVisible2] = useState(false);
     const [loading, setLoading] = useState(false);
     const [loading2, setLoading2] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const [errorMessageForPay, setErrorMessageForPay] = useState('');

     const givenDateString = startDate;

     let duration;
     if (ekub.ekubType === "የቀን") {
          duration = sumOfPayment && ekubMember.paymentAmount ? (sumOfPayment / ekubMember.paymentAmount) - 1 : 0;
     } else if (ekub.ekubType === "የሳምንት") {
          duration = sumOfPayment && ekubMember.paymentAmount ? ((sumOfPayment / ekubMember.paymentAmount) * 7) - 1 : 0;
     } else {
          duration = sumOfPayment && ekubMember.paymentAmount ? ((sumOfPayment / ekubMember.paymentAmount) * 30) - 1 : 0;
     }

     const handleCallNumber = () => {
          const phoneNumber = ekubMember.phoneNumber;
          const args = {
               number: phoneNumber,
               prompt: false,
          };
          call(args).catch(console.error);
     };

     const handleSendMessage = async (paymentDate, paymentAmount) => {
          // Check if the device can send SMS
          const isAvailable = await SMS.isAvailableAsync();
          if (!isAvailable) {
               // console.log("SMS is not available on this device");
               return;
          }

          let paymentComplete = '';
          if (ekub.ekubType === "የቀን" && ekub.duration - (duration + 1) === 0) {
               paymentComplete = "\n🙏 ክፍያዎን ጨርሰዋል 🙏"
          }

          if (ekub.ekubType === "የሳምንት" && (ekub.duration - (duration + 1) / 7) === 0) {
               paymentComplete = "\n🙏 ክፍያዎን ጨርሰዋል 🙏"
          }

          if (ekub.ekubType === "የወር" && (ekub.duration - (duration + 1) / 30) === 0) {
               paymentComplete = "\n🙏 ክፍያዎን ጨርሰዋል 🙏"
          }

          const phoneNumber = ekubMember.phoneNumber;
          const message = `- ${ekub.ekubName} -\nቀን፡ ${paymentDate}\nብር፡ ${formatCurrency(paymentAmount)}\nእስከ፡ ${newDate}\nጠቅላላ፡ ${formatCurrency(sumOfPayment)}${paymentComplete}`
          const { result } = await SMS.sendSMSAsync([phoneNumber], message);
     };

     const toggleMenu = (index) => {
          setVisibleMenuIndex(visibleMenuIndex === index ? null : index);
     };

     const fetchMemeberData = () => {
          selectMemberPayment(ekubMemberId, setMemberPayment)
          getSumOfMemberPayment(ekubMemberId, setSumOfPayment)
          getSumOfEkubRecipients(ekubMemberId, setSumOfEkubRecipients)
     }

     useFocusEffect(
          React.useCallback(() => {
               selectEkub(ekubTypeId, setEkub)
               selectEkubMember(ekubMemberId, setEkubMember);
               fetchMemeberData();
          }, [ekubTypeId])
     );

     useEffect(() => {
          try {
               const newDateCalculated = addDaysEthiopian(givenDateString, duration);
               setNewDate(newDateCalculated);
          } catch (error) {
               setNewDate("ቀን በማስላት ላይ ስህተት አለ");
          }

     }, [givenDateString, duration]);


     const diff = getEthiopianDateDifference(newDate, ConvertedDate());
     const lastPaymentDate = moment(newDate, "DD-MM-YYYY");
     const today = moment(ConvertedDate(), "DD-MM-YYYY");
     const ekubLastDate = moment(ekub.endDate, "DD-MM-YYYY");

     let endEkubDateDiff;

     if (ekub.endDate !== undefined) {
          endEkubDateDiff = getEthiopianDateDifference(newDate, ekub.endDate);
     }

     const handleUrlPress = (url) => {
          Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
     };

     const onPaymentDelete = (paymentId) => {
          setLoading2(true)
          deletePayment(paymentId,
               (successMessage) => {
                    setLoading2(false);
                    fetchMemeberData();
                    setVisibleMenuIndex(null);
               },
               (errorMessage) => {
                    setLoading2(false)
                    setVisible2(true)
                    setErrorMessageForPay(errorMessage);
               }
          );
     }

     const onEkubMemberDelete = (ekubMemberId) => {
          setLoading(true);
          deleteEkubMember(ekubMemberId,
               (successMessage) => {
                    setLoading(false);
                    setVisible(false);
                    navigation.goBack();
               },
               (errorMessage) => {
                    setLoading(false)
                    setErrorMessage(errorMessage);
               }
          );
     }

     const showMemberPaymentList = () => {
          return memberPayment.map((item, index) => {
               return (
                    <View key={index} style={{ width: "100%", marginTop: 10, backgroundColor: COLORS.secondary, borderRadius: 8 }}>
                         <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>
                              <View style={{ flexDirection: 'row' }}>
                                   <View style={{ backgroundColor: COLORS.offwhite, paddingVertical: 8, width: 90, borderRadius: 5 }}>
                                        <Text style={{ paddingHorizontal: 4, color: COLORS.primary }}>{item.paymentDate}</Text>
                                   </View>
                                   <View style={[{ flexDirection: 'row', gap: 10, padding: 8, }]}>
                                        <Text style={styles.smallTextAm}>የተከፈለ ብር፡ </Text>
                                        <Entypo name="arrow-long-right" size={20} color={COLORS.primary} />
                                        <Text style={[styles.smallText, { maxWidth: 120 }]}>{formatCurrency(item.paymentAmount)}</Text>
                                   </View>
                              </View>
                              <Pressable onPress={() => { toggleMenu(index), setLoading2(false) }}>
                                   {visibleMenuIndex === index ? (
                                        <MaterialCommunityIcons name="close" size={20} color="black" />
                                   ) : (
                                        <Entypo name="chevron-down" size={20} color="black" />
                                   )}
                              </Pressable>
                         </View>

                         {visibleMenuIndex === index &&  // Only show the menu for the first item
                              <View style={[styles.resultContainer, { paddingVertical: 10, justifyContent: 'flex-end', paddingHorizontal: 30, gap: 30 }]}>
                                   {loading2 === true ?
                                        <ActivityIndicator size="small" color={COLORS.primary} />
                                        :
                                        <TouchableOpacity onPress={() => onPaymentDelete(item.id)}
                                             style={[styles.lightButtons, { paddingVertical: 2 }]}>
                                             <Text style={styles.smallTextAm}>ይሰርዙ</Text>
                                             <FontAwesome6 name="trash" size={16} color={COLORS.primary} />
                                        </TouchableOpacity>
                                   }

                                   {index === 0 && (
                                        <TouchableOpacity onPress={() => handleSendMessage(item.paymentDate, item.paymentAmount)}>
                                             <MaterialCommunityIcons name="message-text" size={24} color={COLORS.primary} />
                                        </TouchableOpacity>
                                   )}
                              </View>
                         }
                    </View>
               );
          });
     }

     const handleModalClose = () => {
          setLoading(false);
          setVisible(false);
          setErrorMessage('');
     }

     return (
          <>
               <View style={styles.headerContainer}>
                    <Pressable onPress={() => navigation.goBack()} style={{ height: "100%" }}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </Pressable>

                    <View style={{ borderWidth: 1, borderRadius: 5, flexDirection: "row", borderColor: COLORS.offwhite }}>
                         <Text style={[styles.smallTextAm, { backgroundColor: COLORS.offwhite, color: COLORS.primary, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, paddingHorizontal: 8, paddingVertical: 2 }]}>ዛሬ</Text>
                         <Text style={{ fontSize: 14, color: COLORS.offwhite, paddingHorizontal: 14, paddingVertical: 2, width: 90, alignSelf: 'center' }}>{ConvertedDate()}</Text>
                    </View>
               </View>
               {ekub.length === 0 ?
                    <View style={styles.activityIndicatorContainer}>
                         <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                    :

                    <ScrollView>
                         <View style={[styles.contentContainer, { marginTop: 10 }]}>
                              <View style={{ backgroundColor: COLORS.secondary, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                                   <View style={{ flexDirection: "row", paddingHorizontal: 14, paddingVertical: 16, justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                             <Image source={require('../../assets/images/profile-picture.png')} style={{ height: 80, width: 80, alignSelf: "center" }} />
                                             <View style={{ borderWidth: 0, maxWidth: 250, overflow: 'hidden', gap: 5 }}>
                                                  <Text style={styles.largText}>{ekubMember.fullName}</Text>
                                                  <View style={{ flexDirection: 'row', gap: 10 }}>
                                                       <TouchableOpacity onPress={() => handleCallNumber()}
                                                            style={[styles.basicStyle, { backgroundColor: COLORS.primary, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, gap: 5 }]}>
                                                            <Text style={[styles.smallTextAm, { color: COLORS.offwhite }]}>ስልክ ቁ.</Text>
                                                            <Ionicons name="call" size={18} color={COLORS.offwhite} />
                                                       </TouchableOpacity>
                                                       <Text style={[styles.smallText, {}]}>{ekubMember.phoneNumber}</Text>
                                                  </View>
                                                  <View style={[styles.resultContainer, { gap: 10 }]}>
                                                       <Text style={styles.smallTextAm}>
                                                            {ekub.ekubType === "የቀን" && "እለታዊ ክፍያ፡ "}
                                                            {ekub.ekubType === "የሳምንት" && "ሳምንታዊ ክፍያ፡ "}
                                                            {ekub.ekubType === "የወር" && "ወርሃዊ ክፍያ፡ "}
                                                       </Text>
                                                       <Text style={[styles.smallText, {}]}>{formatCurrency(ekubMember.paymentAmount)}</Text>
                                                  </View>
                                             </View>
                                        </View>
                                        <View style={{ justifyContent: "flex-end" }}>
                                             <Pressable onPress={() => setShowMenu(!showMenu)}>
                                                  {showMenu ? (<MaterialCommunityIcons name="close" size={20} color="black" />) :
                                                       (<Entypo name="chevron-down" size={20} color="black" />)}
                                             </Pressable>
                                        </View>

                                   </View>
                                   <View style={[styles.resultContainer, { gap: 10, justifyContent: "space-evenly", margin: 10 }]}>
                                        <TouchableOpacity onPress={() => setVisible(true)} style={[styles.lightButtons, { width: "30%", paddingVertical: 3 }]}>
                                             <Text style={styles.smallTextAm}>ይሰርዙ</Text>
                                             <FontAwesome6 name="trash" size={18} color={COLORS.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate("UpdateEkubMember", { ekubId: ekub.id, ekubMedeb: ekub.medebAmount, ekubMemberId: ekubMember.id })}
                                             style={[styles.lightButtons, { width: "30%", paddingVertical: 3 }]}>
                                             <Text style={styles.smallTextAm}>ያስተካክሉ</Text>
                                             <AntDesign name="edit" size={18} color={COLORS.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate("AddEkubRecipients", { ekubId: ekub.id, ekubMemberId: ekubMember.id })}
                                             style={[styles.lightButtons, { width: "30%", paddingVertical: 3 }]}>
                                             <Text style={styles.smallTextAm}>ክፍያ ይፈጽሙ</Text>
                                        </TouchableOpacity>
                                   </View>

                                   {showMenu && (
                                        <>
                                             {ekubMember.otherInfo !== '' ?
                                                  <View style={{ marginHorizontal: 14, backgroundColor: COLORS.secondary2, padding: 10, marginVertical: 10, borderRadius: 8, }}>
                                                       <ParsedText
                                                            selectable={true}
                                                            style={[styles.smallTextAm, { color: COLORS.primary }]}
                                                            parse={[{ type: "url", style: { color: COLORS.lightBlue, textDecorationLine: "underline", }, onPress: handleUrlPress },]}
                                                            childrenProps={{ allowFontScaling: false }}
                                                       >
                                                            {ekubMember.otherInfo}
                                                       </ParsedText>
                                                  </View>
                                                  :
                                                  <View style={[styles.basicStyle, { height: 80 }]}>
                                                       <Text style={[styles.xSmallTextAm, { color: COLORS.lotFull }]}>ምንም ተጨማሪ መረጃ አላስገቡም</Text>
                                                  </View>
                                             }

                                        </>
                                   )}
                              </View>

                              <View style={styles.basicStyle}>
                                   <ModalPopup visible={visible}>
                                        {loading === true ?
                                             <>
                                                  <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={handleModalClose}>
                                                       <Ionicons name="close" size={20} color="black" />
                                                  </TouchableOpacity>
                                                  <View style={styles.modalBox}>
                                                       <ActivityIndicator size="large" color="green" />
                                                       <Text style={styles.smallTextAm}>በመሰረዝ ላይ ...</Text>
                                                  </View>
                                             </>
                                             :
                                             <>
                                                  {errorMessage === '' ?
                                                       <>
                                                            <View style={{ alignItems: "center" }}>
                                                                 <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={handleModalClose}>
                                                                      <Ionicons name="close" size={20} color="black" />
                                                                 </TouchableOpacity>
                                                                 <Image
                                                                      source={require("../../assets/images/whyuser.webp")}
                                                                      style={{ height: 150, width: 150, marginVertical: 10 }}
                                                                 />

                                                            </View>
                                                            <Text style={[styles.smallTextAm, { textAlign: "justify", marginBottom: 20 }]}>
                                                                 ይህን አባል ከእቁቡ ሲሰርዙ የአባሉ እጣ ቁጥር ፣ የክፍያ ዝርዝር እንዲሁም ለአባሉ የፈጸሙት ክፍያን ጨምሮ ሙሉ በሙሉ የዚህ አባል መረጃ ይሰረዛል፡፡
                                                            </Text>
                                                            <Text style={[styles.smallTextAm, { textAlign: "center", marginVertical: 20 }]}>
                                                                 እርግጠኛ ነዎት ይህን አባል ከእቁቡ ለመሰረዝ ወስነዋል?
                                                            </Text>
                                                            <View style={[styles.resultContainer, { gap: 10, justifyContent: "space-around", margin: 10 }]}>
                                                                 <TouchableOpacity onPress={handleModalClose} style={styles.answerBtn}>
                                                                      <Ionicons name="arrow-back" size={18} color="green" />
                                                                      <Text style={styles.smallTextAm}>ይቅር</Text>
                                                                 </TouchableOpacity>
                                                                 <TouchableOpacity onPress={() => onEkubMemberDelete(ekubMemberId)} style={styles.answerBtn}>
                                                                      <Text style={styles.smallTextAm}>አዎን</Text>
                                                                      <AntDesign name="delete" size={16} color="red" />
                                                                 </TouchableOpacity>

                                                            </View>
                                                       </> :
                                                       <>
                                                            <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={handleModalClose}>
                                                                 <Ionicons name="close" size={20} color="black" />
                                                            </TouchableOpacity>
                                                            <View style={styles.modalBox}>
                                                                 <Image
                                                                      source={require("../../assets/images/error.webp")}
                                                                      style={{ height: 60, width: 60 }}
                                                                 />
                                                                 <Text style={styles.errorTextAm}>{errorMessage}</Text>
                                                            </View>
                                                       </>}
                                             </>
                                        }
                                   </ModalPopup>
                              </View>


                              <View style={{ padding: 10, width: "100%", borderRadius: 10, marginVertical: 20 }}>
                                   {memberPayment.length !== 0 &&
                                        <View style={{ backgroundColor: COLORS.secondary2, padding: 10, gap: 3, borderRadius: 10 }}>
                                             <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "100%", flexWrap: 'wrap' }}>
                                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 }}>
                                                       <Entypo name="controller-record" size={14} color={COLORS.primary} />
                                                       <Text style={styles.smallTextAm}>የተከፈለው</Text>
                                                  </View>
                                                  <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                                  <Text style={[styles.smallText, { marginLeft: 8 }]}>
                                                       {"የ"} {(ekub.ekubType === "የቀን" && `${duration + 1} ቀን  /  `)}{(ekub.ekubType === "የሳምንት" && `${(duration + 1) / 7} ሳምንት  /  `)}{(ekub.ekubType === 'የወር' && `${(duration + 1) / 30} ወር  /  `)}
                                                       {(ekub.ekubType === "የቀን" && (ekub.duration - (duration + 1) === 0 ? <Text style={{ color: "green" }}>አጠናቀዋል</Text> : `ቀሪ ${ekub.duration - (duration + 1)} ቀን`))}
                                                       {(ekub.ekubType === "የሳምንት" && (ekub.duration - ((duration + 1) / 7) === 0 ? <Text style={{ color: "green" }}>አጠናቀዋል</Text> : `ቀሪ ${ekub.duration - ((duration + 1) / 7)} ሳምንት`))}
                                                       {(ekub.ekubType === "የወር" && (ekub.duration - ((duration + 1) / 30) === 0 ? <Text style={{ color: "green" }}>አጠናቀዋል</Text> : `ቀሪ ${ekub.duration - ((duration + 1) / 30)} ወር`))}
                                                  </Text>
                                             </View>
                                             <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "100%", flexWrap: 'wrap' }}>
                                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 }}>
                                                       <Entypo name="controller-record" size={14} color={COLORS.primary} />
                                                       <Text style={styles.smallTextAm}>ጠቅላላ የተከፈለ</Text>
                                                  </View>
                                                  <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                                  <Text style={[styles.smallText, { marginLeft: 8 }]}>{formatCurrency(sumOfPayment)}</Text>
                                             </View>
                                             <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "100%", flexWrap: 'wrap' }}>
                                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 }}>
                                                       <Entypo name="controller-record" size={14} color={COLORS.primary} />
                                                       <Text style={styles.smallTextAm}>የተከፈለው እስከ</Text>
                                                  </View>
                                                  <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                                  <Text style={[styles.smallText, { marginLeft: 8 }]}>{newDate}</Text>
                                             </View>
                                             <View>
                                                  {(ekub.ekubType === "የቀን") &&
                                                       <View>
                                                            {(ekubLastDate.isBefore(today)) ?
                                                                 <>
                                                                      {(endEkubDateDiff.years !== 0 || endEkubDateDiff.months !== 0 || endEkubDateDiff.days !== 0) &&
                                                                           <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "100%", flexWrap: 'wrap' }}>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 }}>
                                                                                     <Entypo name="controller-record" size={14} color={COLORS.primary} />
                                                                                     <Text style={styles.smallTextAm}>ያልተከፈለ</Text>
                                                                                </View>
                                                                                <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                                                                {(endEkubDateDiff.years === 0 && endEkubDateDiff.months === 0 && endEkubDateDiff.days !== 0) && (endEkubDateDiff.days < 30) &&
                                                                                     <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + endEkubDateDiff.days + ` ቀን ( ` + formatCurrency(endEkubDateDiff.days * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                                                }
                                                                                {(endEkubDateDiff.years === 0 && endEkubDateDiff.months === 0 && endEkubDateDiff.days !== 0) && (endEkubDateDiff.days === 30) &&
                                                                                     <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + (endEkubDateDiff.months + 1) + ` ወር ( ` + formatCurrency(endEkubDateDiff.days * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                                                }
                                                                                {(endEkubDateDiff.years === 0 && endEkubDateDiff.months !== 0 && endEkubDateDiff.days !== 0) &&
                                                                                     <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + endEkubDateDiff.months + ` ወር ከ ` + endEkubDateDiff.days + ` ቀን ( ` + formatCurrency(((endEkubDateDiff.months * 30) + endEkubDateDiff.days) * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                                                }
                                                                                {(endEkubDateDiff.years !== 0 && endEkubDateDiff.months !== 0 && endEkubDateDiff.days !== 0) &&
                                                                                     <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + endEkubDateDiff.years + ` አመት ከ ` + endEkubDateDiff.months + ` ወር ከ ` + endEkubDateDiff.days + ` ቀን ( ` + formatCurrency(((endEkubDateDiff.years * 365) + (endEkubDateDiff.months * 30 + endEkubDateDiff.days)) * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                                                }
                                                                                {(endEkubDateDiff.years !== 0 && endEkubDateDiff.months === 0 && endEkubDateDiff.days !== 0) &&
                                                                                     <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + endEkubDateDiff.years + ` አመት ከ ` + endEkubDateDiff.days + ` ቀን ( ` + formatCurrency((endEkubDateDiff.years * 365 + endEkubDateDiff.days) * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                                                }
                                                                           </View>
                                                                      }
                                                                 </>

                                                                 :
                                                                 <>
                                                                      {((lastPaymentDate.isBefore(today)) && (lastPaymentDate.isBefore(ekubLastDate))) &&
                                                                           <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "100%", flexWrap: 'wrap' }}>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 }}>
                                                                                     <Entypo name="controller-record" size={14} color={COLORS.primary} />
                                                                                     <Text style={styles.smallTextAm}>ያልተከፈለ</Text>
                                                                                </View>
                                                                                <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                                                                {(diff.years === 0 && diff.months === 0 && diff.days !== 0) && (diff.days < 30) &&
                                                                                     <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + diff.days + ` ቀን ( ` + formatCurrency(diff.days * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                                                }
                                                                                {(diff.years === 0 && diff.months === 0 && diff.days !== 0) && (diff.days === 30) &&
                                                                                     <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + (diff.months + 1) + ` ወር ( ` + formatCurrency(diff.days * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                                                }
                                                                                {(diff.years === 0 && diff.months !== 0 && diff.days !== 0) &&
                                                                                     <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + diff.months + ` ወር ከ ` + diff.days + ` ቀን ( ` + formatCurrency(((diff.months * 30) + diff.days) * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                                                }
                                                                                {(diff.years !== 0 && diff.months !== 0 && diff.days !== 0) &&
                                                                                     <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + diff.years + ` አመት ከ ` + diff.months + ` ወር ከ ` + diff.days + ` ቀን ( ` + formatCurrency(((diff.years * 365) + (diff.months * 30 + diff.days)) * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                                                }
                                                                                {(diff.years !== 0 && diff.months === 0 && diff.days !== 0) &&
                                                                                     <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + diff.years + ` አመት ከ ` + diff.days + ` ቀን ( ` + formatCurrency((diff.years * 365 + diff.days) * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                                                }
                                                                           </View>
                                                                      }
                                                                 </>
                                                            }
                                                       </View>
                                                  }

                                                  {((ekub.ekubType === "የሳምንት") && (lastPaymentDate.isBefore(today)) && (diff.weeks !== 0)) &&
                                                       <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "100%", flexWrap: 'wrap' }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 }}>
                                                                 <Entypo name="controller-record" size={14} color={COLORS.primary} />
                                                                 <Text style={styles.smallTextAm}>ያልተከፈለ</Text>
                                                            </View>
                                                            <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                                            <Text style={[styles.smallText, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + diff.weeks + ` ሳምንት ( ` + formatCurrency(diff.weeks * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                       </View>
                                                  }

                                                  {((ekub.ekubType === "የወር") && (lastPaymentDate.isBefore(today)) && (diff.totalMonths !== 0)) &&
                                                       <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "100%", flexWrap: 'wrap' }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 }}>
                                                                 <Entypo name="controller-record" size={14} color={COLORS.primary} />
                                                                 <Text style={styles.smallTextAm}>ያልተከፈለ</Text>
                                                            </View>
                                                            <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                                            <Text style={[styles.smallTextAm, { marginLeft: 8, color: COLORS.red }]}>{`የ ` + diff.totalMonths + ` ወር ( ` + formatCurrency(diff.totalMonths * ekubMember.paymentAmount) + ` ብር )`}</Text>
                                                       </View>
                                                  }

                                             </View>


                                             {sumOfEkubRecipients !== null &&
                                                  <>
                                                       <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "100%", flexWrap: 'wrap' }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 }}>
                                                                 <Entypo name="controller-record" size={14} color={COLORS.primary} />
                                                                 <Text style={styles.smallTextAm}>የተፈጸመ ክፍያ</Text>
                                                            </View>
                                                            <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                                            <Text style={[styles.smallText, { marginLeft: 8 }]}>{formatCurrency(sumOfEkubRecipients)}</Text>
                                                       </View>

                                                       {sumOfPayment - sumOfEkubRecipients > 0 &&
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "100%", flexWrap: 'wrap' }}>
                                                                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 }}>
                                                                      <Entypo name="controller-record" size={14} color={COLORS.primary} />
                                                                      <Text style={styles.smallTextAm}>ያልተፈጸመ ክፍያ</Text>
                                                                 </View>
                                                                 <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                                                 <Text style={[styles.smallText, { marginLeft: 8 }]}>{formatCurrency(sumOfPayment - sumOfEkubRecipients)}</Text>
                                                            </View>
                                                       }

                                                       {sumOfEkubRecipients - sumOfPayment > 0 &&
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "100%", flexWrap: 'wrap' }}>
                                                                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 }}>
                                                                      <Entypo name="controller-record" size={14} color={COLORS.primary} />
                                                                      <Text style={styles.smallTextAm}>ቀሪ እዳ</Text>
                                                                 </View>
                                                                 <Entypo name="arrow-long-right" size={18} color={COLORS.primary} />
                                                                 <Text style={[styles.smallText, { marginLeft: 8 }]}>{formatCurrency(sumOfEkubRecipients - sumOfPayment)}</Text>
                                                            </View>
                                                       }
                                                  </>
                                             }
                                        </View>

                                   }

                                   {sumOfEkubRecipients === ekubMember.paymentAmount * ekub.duration &&
                                        <>
                                             {sumOfEkubRecipients - sumOfPayment === 0 &&
                                                  <Text style={[styles.mediumTextAm, { alignSelf: "center", color: "green", marginTop: 30, marginBottom: 20 }]}>እቁቡን በሚገባ አጠናቀዋል!!</Text>
                                             }
                                        </>
                                   }
                              </View>


                              <View style={[styles.resultContainer, { justifyContent: "space-between", margin: 5 }]}>
                                   <TouchableOpacity onPress={() => navigation.navigate('EkubMemberLotNumber', { ekubId: ekub.id, ekubMemberId: ekubMemberId, })}
                                        style={[styles.moreBtn, { borderTopRightRadius: 10, borderBottomLeftRadius: 16 }]}>
                                        <MaterialCommunityIcons name="numeric-7-box-multiple" size={20} color={COLORS.offwhite} />
                                        <Text style={[styles.smallTextAm, { color: COLORS.offwhite }]}>ለእጣ ቁጥር</Text>
                                   </TouchableOpacity>

                                   <TouchableOpacity onPress={() => navigation.navigate('AddPayment', { ekubId: ekubTypeId, ekubMemberId: ekubMemberId, date: ekub.startDate })}
                                        style={[styles.moreBtn, { borderTopLeftRadius: 10, borderBottomRightRadius: 16 }]}>
                                        <Text style={[styles.smallTextAm, { color: COLORS.offwhite }]}>ክፍያ ይቀበሉ</Text>
                                        <FontAwesome5 name="hand-holding-usd" size={18} color={COLORS.offwhite} />
                                   </TouchableOpacity>
                              </View>
                         </View>


                         {memberPayment.length === 0 ?
                              <View style={{ backgroundColor: "#edf0f7", marginTop: 100, marginHorizontal: 30, borderRadius: 10, alignItems: "center", justifyContent: "center", height: 300 }}>
                                   <Text style={[styles.smallTextAm, { color: COLORS.primary }]}>ምንም ክፍያ አልተቀበሉም</Text>
                                   <TouchableOpacity onPress={() => navigation.navigate("AddPayment", { ekubId: ekubTypeId, ekubMemberId: ekubMemberId, date: ekub.startDate })}
                                        style={{ borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10, alignSelf: "center", paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", gap: 10, margin: 10 }}>
                                        <Text style={styles.smallTextAm}>ይቀበሉ</Text>
                                        <FontAwesome5 name="hand-holding-usd" size={18} color={COLORS.primary} />
                                   </TouchableOpacity>
                              </View> :
                              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginHorizontal: 10, marginBottom: 50 }}>
                                   {showMemberPaymentList()}
                                   {errorMessageForPay !== '' &&
                                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                                             <ModalPopup visible={visible2}>
                                                  <>
                                                       <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { setVisible2(false), setErrorMessageForPay('') }}>
                                                            <Ionicons name="close" size={20} color="black" />
                                                       </TouchableOpacity>
                                                       <View style={styles.modalBox}>
                                                            <Image
                                                                 source={require("../../assets/images/error.webp")}
                                                                 style={{ height: 80, width: 80 }}
                                                            />
                                                            <Text style={styles.errorTextAm}>{errorMessageForPay}</Text>
                                                       </View>
                                                  </>
                                             </ModalPopup>
                                        </View>
                                   }
                              </View>
                         }
                    </ScrollView>
               }
          </>
     )
}