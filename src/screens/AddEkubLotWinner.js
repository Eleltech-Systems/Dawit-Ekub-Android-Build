import { Pressable, Image, ScrollView, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Entypo, FontAwesome, FontAwesome6 } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SelectList } from 'react-native-dropdown-select-list';
import { AddEkubLotWinners, selectAllUniqueEkubMemberLotNumbers, selectEkub, selectEkubMembersByLotNumber } from '../database/ekubDB';
import { useFocusEffect } from '@react-navigation/native';
import { formatCurrency } from '../utilities/FormatCurrency';
import { ConvertedDate } from '../utilities/ConverteDate';
import { COLORS } from '../constants/theme';
import styles from '../styles/ComponentStyles';


const schema = yup.object().shape({
     selectedLotNumber: yup.string().required('እጣ ቁጥሩን ይምረጡ'),
});


export default function AddEkubLotWinner({ route, navigation }) {
     const { ekubId } = route.params;
     const [ekub, setEkub] = useState([]);
     const [loteryNumber, setLoteryNumber] = useState([]);
     const [selectedLotNumber, setSelectedLotNumber] = useState('');
     const [message, setMessage] = useState('');
     const [memberByLotNumber, setMemberByLotNumber] = useState([]);


     const { control, handleSubmit, reset, formState: { errors, isValid }, } =
          useForm({ resolver: yupResolver(schema), defaultValues: { selectedLotNumber: '' }, });


     useFocusEffect(
          React.useCallback(() => {
               selectEkub(ekubId, setEkub);
               selectAllUniqueEkubMemberLotNumbers(ekubId, setLoteryNumber);
          }, [ekubId])
     );

     useFocusEffect(
          React.useCallback(() => {
               selectEkubMembersByLotNumber(ekubId, selectedLotNumber, setMemberByLotNumber)
          }, [selectedLotNumber])
     );

     // Transform fetched loteryNumber into the required format for SelectList
     const data = loteryNumber.map((lot) => ({
          value: lot.lotNumber,
     }));

     let medebType;

     if (memberByLotNumber.length === 1) {
          medebType = "ሙሉ_መደብ"
     } else if (memberByLotNumber.length === 2) {
          medebType = "ግማሽ_መደብ"
     } else {
          medebType = 'እሩብ_መደብ'
     }

     const onPressSend = (formData) => {
          const { selectedLotNumber } = formData;
          const selectedDate = ConvertedDate();
          const ekubId = ekub.id;
          AddEkubLotWinners(ekubId, medebType, selectedLotNumber, selectedDate,
               (successMessage) => {
                    reset();
                    setMessage('');
                    navigation.goBack();
               },
               (errorMessage) => {
                    setMessage(errorMessage);
               }
          );
     };

     const showEkubMemberList = () => {
          return memberByLotNumber.map((item, index) => {
               return (
                    <View key={index} style={{ backgroundColor: "#cedaed", marginHorizontal: 20, marginVertical: 10, borderRadius: 10, }}>
                         <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginVertical: 5 }}>
                              {memberByLotNumber.length === 1 &&
                                   <View style={[styles.lotBox, { backgroundColor: COLORS.lotFull }]}>
                                        <Text style={styles.lotNum}>{selectedLotNumber}</Text>
                                   </View>
                              }
                              {memberByLotNumber.length === 2 &&
                                   <View style={[styles.lotBox, { backgroundColor: COLORS.lotHalf }]}>
                                        <Text style={styles.lotNum}>{selectedLotNumber}</Text>
                                   </View>
                              }
                              {memberByLotNumber.length === 4 &&
                                   <View style={[styles.lotBox, { backgroundColor: COLORS.lotQuarter }]}>
                                        <Text style={styles.lotNum}>{selectedLotNumber}</Text>
                                   </View>
                              }
                              <View style={{ width: '80%' }}>
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
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerTextAm}>ከእጣ ዝርዝር ያውጡ</Text>
                    <Text></Text>
               </View>
               <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "padding"} // Adjust behavior for iOS and Android
                    keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust offset if needed
               >
                    <ScrollView>
                         <Image
                              source={require("../../assets/images/addwinner.webp")}
                              style={{ marginVertical: 20, height: 200, width: 200, alignSelf: "center" }}
                         />
                         {showEkubMemberList()}

                         <View style={styles.allInputContainer}>
                              <View style={styles.inputContainer}>
                                   <Text style={styles.mediumTextAm}>እጣ ቁጥር፡</Text>
                                   <Controller
                                        control={control}
                                        rules={{ required: "እጣ ቁጥሩን ይምረጡ" }}
                                        name="selectedLotNumber"
                                        render={({ field: { onChange, value } }) =>
                                        (
                                             <SelectList
                                                  data={data}
                                                  arrowicon={<FontAwesome name="chevron-down" size={12} color={"black"} />}
                                                  search={false}
                                                  placeholder={value === '' && "እጣ ቁጥሩን ይምረጡ"}
                                                  boxStyles={styles.inputSelectListBoxStyle}
                                                  inputStyles={styles.inputSelectListInputStyle}
                                                  dropdownStyles={styles.inputSelectListDropdownStyles}
                                                  setSelected={(selectedValue) => {
                                                       onChange(selectedValue);
                                                       setSelectedLotNumber(selectedValue);
                                                  }}
                                             />
                                        )}
                                   />
                                   {errors.selectedLotNumber && <Text style={[styles.errorTextAm, { alignSelf: "flex-end" }]}>{errors.selectedLotNumber.message}</Text>}
                              </View>
                         </View>

                         {message !== '' && <Text style={[styles.errorTextAm, { alignSelf: "center" }]}>{message}</Text>}


                         {isValid === true ?
                              <TouchableOpacity onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.primary }]}>
                                   <Text style={[styles.smallTextAm, { color: COLORS.offwhite }]}>ያውጡ</Text>
                              </TouchableOpacity> :
                              <Pressable onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.btnInValid }]}>
                                   <Text style={[styles.mediumTextAm, { color: COLORS.darkText }]}>ያውጡ</Text>
                              </Pressable>
                         }
                    </ScrollView>
               </KeyboardAvoidingView>
          </>
     )
}