import { Pressable, Image, ScrollView, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Entypo, FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SelectList } from 'react-native-dropdown-select-list';
import { AddEkubMemberLotNumber, deleteMemberLotNumber, selectAllEkubMemberLotNumbers, selectEkub, selectEkubMember, selectEkubMemberLotNumbers } from '../database/ekubDB';
import { formatCurrency } from '../utilities/FormatCurrency';
import { ModalPopup } from '../utilities/ModalPopup';
import styles from '../styles/ComponentStyles';
import { COLORS } from '../constants/theme';


const schema = yup.object().shape({
     selectedMedebType: yup.string().required('የመደብ አይነት ይምረጡ'),
     lotNumber: yup.string().required('እጣ ቁጥር ያስገቡ'),
});


export default function EkubMemberLotNumber({ route, navigation }) {
     const { ekubId, ekubMemberId } = route.params;
     const [ekub, setEkub] = useState([]);
     const [ekubMember, setEkubMember] = useState([]);
     const [memberLotNumber, setMemberLotNumber] = useState([]);
     const [allMemberLotNumber, setAllMemberLotNumber] = useState([]);
     const [isMainLoading, setIsMainLoading] = useState([]);
     const [visibleMenuIndex, setVisibleMenuIndex] = useState(null);
     const [visible, setVisible] = React.useState(false);
     const [loading, setLoading] = useState(false);
     const [show, setShow] = useState(false);
     const [errorMessage, setErrorMessage] = useState('Error');


     const { control, handleSubmit, reset, formState: { errors, isValid }, } =
          useForm({ resolver: yupResolver(schema), defaultValues: { selectedMedebType: '', lotNumber: '' }, });


     const fetchAllData = () => {
          setIsMainLoading(true);
          setTimeout(() => {
               setIsMainLoading(false);
               selectEkub(ekubId, setEkub);
               selectEkubMember(ekubMemberId, setEkubMember);
               selectAllEkubMemberLotNumbers(ekubId, setAllMemberLotNumber);
               selectEkubMemberLotNumbers(ekubMemberId, setMemberLotNumber);
          })
     }


     useEffect(() => {
          fetchAllData();
     }, [])


     const toggleMenu = (index) => {
          setVisibleMenuIndex(visibleMenuIndex === index ? null : index);
     };


     const data = [
          { value: "ሙሉ_መደብ" },
          { value: "ግማሽ_መደብ" },
          { value: "እሩብ_መደብ" },
     ];


     const onPressSend = (formData) => {
          setLoading(true);
          const { selectedMedebType, lotNumber } = formData;
          const ekubTypeId = ekub.id;
          const ekubMemberId = ekubMember.id;
          const medebType = selectedMedebType;

          AddEkubMemberLotNumber(ekubTypeId, ekubMemberId, medebType, lotNumber,
               (successMessage) => {
                    setLoading(false);
                    reset();
                    setShow(false);
                    fetchAllData();
               },
               (errorMessage) => {
                    setLoading(false);
                    setVisible(true);
                    setErrorMessage(errorMessage);
               }
          );
     };

     const handleDeleteLotNumber = (id, lNumber) => {
          setLoading(true);
          const ekubTypeId = ekub.id;
          const ekubMemberId = ekubMember.id;
          const lotId = id;
          const lotNumber = lNumber;

          deleteMemberLotNumber(lotNumber, lotId, ekubTypeId, ekubMemberId,
               (successMessage) => {
                    setLoading(false);
                    fetchAllData();
                    setVisibleMenuIndex(null);
               },
               (errorMessage) => {
                    setLoading(false);
                    setVisible(true);
                    setErrorMessage(errorMessage);
               }
          );
     }


     const showAllMemberLotNumberList = () => {
          return allMemberLotNumber.map((item, index) => {
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

     const showMemberLotNumberList = () => {
          return memberLotNumber.map((item, index) => {
               return (<View key={index} style={{ width: "30%", }}>
                    <View style={{ borderWidth: 1, borderColor: COLORS.offwhite, borderRadius: 10, marginVertical: 10, alignItems: "center" }}>
                         <View style={[styles.resultContainer, { gap: 10 }]}>
                              <Text style={[styles.xSmallTextAm, { color: COLORS.primary }]}>{"የ"}{item.medebType}</Text>
                              <Pressable onPress={() => toggleMenu(index)}>
                                   {visibleMenuIndex === index ?
                                        (<Ionicons name="close" size={16} color="black" />)
                                        :
                                        (<Entypo name="chevron-down" size={16} color="black" />)
                                   }
                              </Pressable>
                         </View>
                         {item.medebType === "ሙሉ_መደብ" &&
                              <View style={[styles.lotBox, { backgroundColor: COLORS.lotFull, marginVertical: 10 }]}>
                                   <Text style={styles.lotNum}>{item.lotNumber}</Text>
                              </View>
                         }
                         {item.medebType === "ግማሽ_መደብ" &&
                              <View style={[styles.lotBox, { backgroundColor: COLORS.lotHalf, marginVertical: 10 }]}>
                                   <Text style={styles.lotNum}>{item.lotNumber}</Text>
                              </View>
                         }
                         {item.medebType === "እሩብ_መደብ" &&
                              <View style={[styles.lotBox, { backgroundColor: COLORS.lotQuarter, marginVertical: 10 }]}>
                                   <Text style={styles.lotNum}>{item.lotNumber}</Text>
                              </View>
                         }


                    </View>
                    {visibleMenuIndex === index && (
                         <TouchableOpacity onPress={() => handleDeleteLotNumber(item.id, item.lotNumber)}
                              style={[styles.lightButtons, { paddingVertical: 2, gap: 10, marginBottom: 6 }]}>
                              <Text style={styles.xSmallTextAm}>ይሰርዙ</Text>
                              <FontAwesome6 name="trash" size={14} color="green" />
                         </TouchableOpacity>
                    )}
               </View>
               )
          })
     }

     const handleCloseInput = () => {
          setShow(false);
          setLoading(false);
          reset();
     }

     const handleModalClose = () => {
          setVisible(false);
          setErrorMessage('');
          setLoading(false);
     }


     return (
          <>
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerTextAm}>እጣ ቁጥር ይሰይሙ</Text>
                    <TouchableOpacity onPress={() => fetchAllData()}>
                         <MaterialIcons name="refresh" size={22} color={COLORS.offwhite} />
                    </TouchableOpacity>
               </View>
               {isMainLoading === true ?
                    <View style={styles.activityIndicatorContainer}>
                         <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                    :
                    <KeyboardAvoidingView
                         behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} // Adjust behavior for iOS and Android
                         keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset if needed
                    >
                         <ScrollView>
                              <Text style={[styles.smallTextAm, { marginTop: 10, marginHorizontal: 16 }]}>ጠቅላላ እጣ ዝርዝር</Text>
                              {allMemberLotNumber.length === 0 ?
                                   <View style={styles.lotCont}>
                                        <Text style={styles.smallTextAm}>ምንም እጣ የለም</Text>
                                   </View>
                                   :
                                   <View style={styles.lotCont}>
                                        {showAllMemberLotNumberList()}
                                   </View>
                              }

                              <View style={{ backgroundColor: COLORS.secondary, marginTop: 30, borderRadius: 10, marginHorizontal: 16, paddingHorizontal: 10 }}>
                                   <View style={{ paddingVertical: 5 }}>
                                        <Text style={styles.mediumText}>{ekubMember.fullName}</Text>
                                        <Text style={styles.smallTextAm}>{"ክፍያ መጠን  = "}{formatCurrency(ekubMember.paymentAmount)}</Text>
                                   </View>
                                   {memberLotNumber.length === 0 ?
                                        <Text style={[styles.xSmallTextAm, { alignSelf: "center", marginVertical: 40, color: "green" }]}>ለዚህ አባል ምንም እጣ ቁጥር አልሰየሙም</Text>
                                        :
                                        <View style={{ flexDirection: "row", gap: 14, flexWrap: "wrap", marginTop: 20 }}>
                                             {showMemberLotNumberList()}
                                        </View>
                                   }
                              </View>

                              <View style={styles.basicStyle}>
                                   <ModalPopup visible={visible}>
                                        {errorMessage !== '' &&
                                             <>
                                                  <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={handleModalClose}>
                                                       <Ionicons name="close" size={20} color="black" />
                                                  </TouchableOpacity>
                                                  <View style={styles.modalBox}>
                                                       <Image
                                                            source={require("../../assets/images/error.webp")}
                                                            style={{ height: 80, width: 80 }}
                                                       />
                                                       <Text style={styles.errorTextAm}>{errorMessage}</Text>
                                                  </View>
                                             </>
                                        }
                                   </ModalPopup>
                              </View>

                              {loading === true &&
                                   <View style={[styles.basicStyle, { height: 50 }]}>
                                        <ActivityIndicator size="small" color={COLORS.primary} />
                                   </View>
                              }

                              {show !== true ?
                                   <TouchableOpacity onPress={() => setShow(true)} style={[styles.lightButtons, { alignSelf: "flex-end", marginHorizontal: 16, marginTop: 20, paddingVertical: 3 }]}>
                                        <Text style={styles.smallTextAm}>እጣ ቁጥር ይሰይሙ</Text>
                                   </TouchableOpacity>
                                   :
                                   <View style={{ marginBottom: 50 }}>
                                        <TouchableOpacity onPress={() => handleCloseInput()}
                                             style={{ alignSelf: "flex-end", marginHorizontal: 20, marginTop: 20 }}>
                                             <Ionicons name="close" size={20} color="black" />
                                        </TouchableOpacity>
                                        <View style={styles.allInputContainer}>
                                             <View style={styles.inputContainer}>
                                                  <Text style={styles.mediumTextAm}>የመደብ አይነት፡</Text>
                                                  <Controller
                                                       control={control}
                                                       rules={{ required: "የመደብ አይነት ይምረጡ" }}
                                                       name='selectedMedebType'
                                                       render={({ field: { onChange, value } }) =>
                                                       (
                                                            <SelectList
                                                                 data={data}
                                                                 arrowicon={<FontAwesome name="chevron-down" size={12} color={COLORS.black} />}
                                                                 search={false}
                                                                 placeholder={value === '' && "የመደብ አይነት ይምረጡ"}
                                                                 boxStyles={styles.inputSelectListBoxStyle}
                                                                 inputStyles={styles.inputSelectListInputStyle}
                                                                 dropdownStyles={styles.inputSelectListDropdownStyles}
                                                                 setSelected={(selectedValue) => {
                                                                      onChange(selectedValue);
                                                                 }}
                                                            />
                                                       )}
                                                  />
                                                  {errors.selectedMedebType && <Text style={styles.inputErrorTextAm}>{errors.selectedMedebType.message}</Text>}
                                             </View>

                                             <View style={styles.inputContainer}>
                                                  <Text style={styles.mediumTextAm}>እጣ ቁጥር፡</Text>
                                                  <Controller
                                                       control={control}
                                                       rules={{ required: true, }}
                                                       name="lotNumber"
                                                       render={({ field: { onChange, value } }) =>
                                                       (
                                                            <View style={styles.inputBox}>
                                                                 <TextInput keyboardType="numeric" style={styles.inputText} value={value} onChangeText={(num) => {
                                                                      onChange(num);
                                                                 }} />
                                                            </View>
                                                       )}
                                                  />
                                                  {errors.lotNumber && <Text style={styles.inputErrorTextAm}>{errors.lotNumber.message}</Text>}
                                             </View>
                                        </View>

                                        {isValid === true ?
                                             <TouchableOpacity onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.primary }]}>
                                                  <Text style={[styles.mediumTextAm, { color: COLORS.offwhite }]}>ይሰይሙ</Text>
                                             </TouchableOpacity> :
                                             <Pressable onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.btnInValid }]}>
                                                  <Text style={[styles.mediumTextAm, { color: COLORS.darkText }]}>ይሰይሙ</Text>
                                             </Pressable>
                                        }
                                   </View>
                              }
                         </ScrollView>
                    </KeyboardAvoidingView>
               }
          </>
     )
}