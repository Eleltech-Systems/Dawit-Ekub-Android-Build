import { Pressable, Image, ScrollView, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SelectList } from 'react-native-dropdown-select-list';
import { Calendar } from 'react-native-ethiopian-calendar';
import { initDB, startNewEkub } from '../database/ekubDB';
import { addDaysEthiopian } from '../utilities/addDaysEthiopian';
import { formatCurrency } from '../utilities/FormatCurrency';
import { ModalPopup } from '../utilities/ModalPopup';
import { COLORS } from '../constants/theme';
import styles from '../styles/ComponentStyles';

const schema = yup.object().shape({
     ekubName: yup.string().required("የእቁብዎን ስም ያስገቡ"),
     ekubType: yup.string().required("የእቁብ አይነት ይምረጡ"),
     medebAmount: yup.string().required("መደብ ብር መጠን ያስገቡ"),
     selectedDate: yup.string().required("የሚጀመርበትን ቀን ያስገቡ"),
     duration: yup.string().required("የሚፈጀውን ጊዜ ይወስኑ"),
});

export default function StartNewEkub({ navigation }) {
     const { control, handleSubmit, reset, formState: { errors, isValid }, } =
          useForm({ resolver: yupResolver(schema), defaultValues: { ekubName: '', ekubType: '', medebAmount: null, selectedDate: '', duration: null }, });

     const [show, setShow] = useState(false);
     const [mode, setMode] = React.useState('EC');
     const [locale, setLocale] = React.useState('AMH');
     const [ekubName, setEkubName] = useState('');
     const [ekubType, setEkubType] = useState('');
     const [medebAm, setMedebAm] = useState(0);
     const [startDat, setStartDat] = useState('1-1-2017');
     const [durashn, setDurashn] = useState(1);
     const [successMessage, setSuccessMessage] = useState('');
     const [errorMessage, setErrorMessage] = useState('');
     const [visible, setVisible] = React.useState(false);
     const [loading, setLoading] = useState(false);
     const [newDate, setNewDate] = useState();
     const givenDateString = startDat; // Your given date in 'DD-MM-YYYY' format


     let duration;
     if (ekubType === "የቀን") {
          duration = Number(durashn) - 1;
     } else if (ekubType === "የሳምንት") {
          duration = (Number(durashn) * 7) - 1;
     } else
          duration = (Number(durashn) * 30) - 1;


     // useEffect to Initialize the database
     useEffect(() => {
          initDB();
     }, [])

     // useEffect to add days on a given date
     useEffect(() => {
          try {
               const newDateCalculated = addDaysEthiopian(givenDateString, duration);
               setNewDate(newDateCalculated);
          } catch (error) {
               // console.error("Error calculating new date:", error);
               setNewDate("Error calculating date");
          }

     }, [givenDateString, duration]); // Dependencies for useEffect

     const data = [
          { value: "የቀን" },
          { value: "የሳምንት" },
          { value: "የወር" }
     ];

     // Function to distruct form data, trim extra spaces, convert numeric sting value to number 
     // and add data to the database and inform the user a success and failure message.
     const onPressSend = (formData) => {
          setLoading(true);
          setVisible(true);
          const { ekubName, ekubType, medebAmount, selectedDate, duration } = formData;
          const trimmedName = ekubName.trim().replace(/\s+/g, ' '); //To remove the first and last and the middle extra spaces between the input string.
          const durashn = Number(duration);
          const medebAm = Number(medebAmount);
          startNewEkub(trimmedName, ekubType, medebAm, selectedDate, durashn, newDate,
               (successMessage) => {
                    setLoading(false);
                    setSuccessMessage(successMessage);
                    reset();
               },
               (errorMessage) => {
                    setLoading(false);
                    setErrorMessage(errorMessage);
               }
          );
     };

     const handleModalClose = () => {
          setLoading(false);
          setVisible(false);
          setSuccessMessage('');
          setErrorMessage('');
     }

     return (
          <>
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerTextAm}>አዲስ እቁብ ይጀምሩ</Text>
                    <Text></Text>
               </View>
               <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} // Adjust behavior for iOS and Android
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset if needed
               >
                    <ScrollView>
                         <View style={{ alignItems: 'center', marginTop: 30 }}>
                              <Image source={require("../../assets/images/money-bag2.webp")} style={{ marginLeft: 10, height: 90, width: 90 }} />
                         </View>
                         <View style={[styles.allInputContainer, { padding: 0 }]}>
                              {/* Title and Short Description */}
                              <View style={{ borderTopLeftRadius: 14, borderTopRightRadius: 14, backgroundColor: COLORS.primary, padding: 20 }}>
                                   <Text style={[styles.xSmallTextAm, { textAlign: "justify", color: COLORS.offwhite }]}>
                                        እቁብዎን ከመጀመርዎ በፊት የመደብ ብር መጠን እና የእቁብዎን የጊዜ ቆይታ ቀድመው መወሰን ይገባዎታል። እጣ የሚጥሉበትን ጊዜ በአባልዎ ብዛት ላይ ተመስርተው ይወስናሉ።
                                   </Text>
                              </View>

                              {/* Input Forms */}
                              <View style={{ padding: 20 }}>
                                   <View style={styles.inputContainer}>
                                        <Text style={styles.mediumTextAm}>የእቁብ ስም፡</Text>
                                        <Controller
                                             control={control}
                                             rules={{ required: true, }}
                                             name="ekubName"
                                             render={({ field: { onChange, value } }) =>
                                             (
                                                  <View style={styles.inputBox}>
                                                       <TextInput
                                                            style={styles.inputText}
                                                            value={value}
                                                            placeholder="ምሳሌ፡ ሰላም እቁብ"
                                                            placeholderTextColor={COLORS.gray2}
                                                            onChangeText={(text) => {
                                                                 onChange(text); // Update react-hook-form state
                                                                 setEkubName(text); // Update local state
                                                            }}
                                                       />
                                                  </View>
                                             )}
                                        />
                                        {errors.ekubName && <Text style={styles.inputErrorTextAm}>{errors.ekubName.message}</Text>}
                                   </View>

                                   <View style={styles.inputContainer}>
                                        <Text style={styles.mediumTextAm}>የእቁብ አይነት፡</Text>
                                        <Controller
                                             control={control}
                                             rules={{ required: "እባክዎ የእቁብ አይነት ይምረጡ", }}
                                             name="ekubType"
                                             render={({ field: { onChange, value } }) =>
                                             (
                                                  <SelectList
                                                       data={data}
                                                       arrowicon={<FontAwesome name="chevron-down" size={12} color={"black"} />}
                                                       search={false}
                                                       placeholder={value === '' && "የእቁብ አይነት ይምረጡ"}
                                                       boxStyles={styles.inputSelectListBoxStyle}
                                                       inputStyles={styles.inputSelectListInputStyle}
                                                       dropdownStyles={styles.inputSelectListDropdownStyles}
                                                       dropdownTextStyles={styles.smallTextAm}
                                                       setSelected={(selectedValue) => {
                                                            onChange(selectedValue);
                                                            setEkubType(selectedValue);
                                                       }}
                                                  />
                                             )}
                                        />
                                        {errors.ekubType && <Text style={styles.inputErrorTextAm}>{errors.ekubType.message}</Text>}
                                   </View>

                                   <View style={styles.inputContainer}>
                                        <Text style={styles.mediumTextAm}>መደብ ብር፡</Text>
                                        <Controller
                                             control={control}
                                             rules={{ required: true, }} name="medebAmount"
                                             render={({ field: { onChange, value } }) =>
                                             (
                                                  <View style={styles.inputBox}>
                                                       <TextInput
                                                            keyboardType="numeric"
                                                            style={styles.inputText}
                                                            value={value}
                                                            onChangeText={(num) => {
                                                                 onChange(num);
                                                                 setMedebAm(num);
                                                            }}
                                                       />
                                                  </View>
                                             )}
                                        />
                                        {errors.medebAmount && <Text style={styles.inputErrorTextAm}>{errors.medebAmount.message}</Text>}
                                   </View>

                                   <View style={styles.inputContainer}>
                                        <Text style={styles.mediumTextAm}>የሚጀመርበት ቀን፡</Text>
                                        <Controller
                                             control={control}
                                             rules={{ required: "የሚጀምሩበትን ቀን ይምረጡ" }}
                                             name="selectedDate"
                                             render={({ field: { value, onChange } }) => (
                                                  <>
                                                       <View style={[styles.inputBox, { flexDirection: "row", justifyContent: "space-between" }]}>
                                                            <TextInput
                                                                 editable={false}
                                                                 style={[styles.inputText, { width: '85%' }]}
                                                                 value={value}
                                                                 onChangeText={onChange}
                                                            />
                                                            <Pressable onPress={() => setShow(!show)}>
                                                                 <Ionicons name="calendar" size={24} color={show == false ? COLORS.primary : "green"} />
                                                            </Pressable>
                                                       </View>
                                                       {show &&
                                                            <Calendar
                                                                 // mode={mode}
                                                                 onDatePress={(date) => {
                                                                      onChange(`${date.ethiopian.date}-${date.ethiopian.month}-${date.ethiopian.year}`),
                                                                           setStartDat(`${date.ethiopian.date}-${date.ethiopian.month}-${date.ethiopian.year}`),
                                                                           setShow(!show)
                                                                 }}
                                                                 onModeChange={(selectedMode) => setMode(selectedMode)}
                                                                 onLanguageChange={(lang) => setLocale(lang)}
                                                                 locale={locale}
                                                            />
                                                       }
                                                  </>
                                             )}
                                        />
                                        {errors.selectedDate && (<Text style={styles.inputErrorTextAm}>{errors.selectedDate.message}</Text>)}
                                   </View>

                                   <View style={styles.inputContainer}>
                                        {ekubType === '' && <Text style={styles.mediumText}></Text>}
                                        {ekubType === 'የቀን' && <Text style={styles.mediumTextAm}>{"የሚፈጀው ቀን፡"}</Text>}
                                        {ekubType === 'የሳምንት' && <Text style={styles.mediumTextAm}>{"የሚፈጀው ሳምንት፡"}</Text>}
                                        {ekubType === 'የወር' && <Text style={styles.mediumTextAm}>{"የሚፈጀው ወር፡"}</Text>}
                                        <Controller
                                             control={control}
                                             rules={{ required: true, }}
                                             name="duration"
                                             render={({ field: { onChange, value } }) =>
                                             (
                                                  <View style={styles.inputBox}>
                                                       <TextInput
                                                            editable={ekubType !== '' && true}
                                                            keyboardType="numeric"
                                                            style={styles.inputText}
                                                            value={value} onChangeText={(num) => {
                                                                 onChange(num); // Update react-hook-form state
                                                                 setDurashn(num); // Update local state
                                                            }}
                                                       />
                                                  </View>

                                             )}
                                        />
                                        {errors.duration && <Text style={styles.inputErrorTextAm}>{errors.duration.message}</Text>}
                                   </View>
                              </View>
                         </View>

                         {/* results before ekub starts */}
                         {isValid === true &&
                              <View style={{ margin: 20 }}>
                                   <View style={{ backgroundColor: "#bdc6df", borderTopLeftRadius: 14, borderTopRightRadius: 14, padding: 12 }}>
                                        <Text style={[styles.mediumTextAm, { textAlign: "center", marginVertical: 5, color: COLORS.primary }]}>
                                             {ekubName.trim().replace(/\s+/g, ' ')}
                                        </Text>
                                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, alignItems: 'center' }}>
                                             <FontAwesome6 name="circle-info" size={16} color={COLORS.primary} />
                                             <Text style={[styles.xSmallTextAm, { width: '96%' }]}>በዚህ መረጃ ላይ ተመስርተው እቁብዎን ከመጀመርዎ በፊት መልሰው ማስተካከል ይችላሉ።</Text>
                                        </View>
                                   </View>
                                   <View style={{ backgroundColor: COLORS.secondary2, paddingHorizontal: 20, paddingBottom: 10, paddingTop: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                                        <View style={styles.resultContainer}>
                                             <Text style={[styles.smallTextAm, { width: "34%", }]}>የእቁብ አይነት፡</Text>
                                             <Entypo name="arrow-long-right" size={20} color={COLORS.primary} />
                                             <Text style={[styles.smallTextAm, { marginLeft: 10 }]}>{ekubType}</Text>
                                        </View>
                                        <View style={styles.resultContainer}>
                                             <Text style={[styles.smallTextAm, { width: "34%", }]}>መደብ ብር፡</Text>
                                             <Entypo name="arrow-long-right" size={20} color={COLORS.primary} />
                                             <Text style={[styles.smallText, { marginLeft: 10 }]}>{formatCurrency(medebAm)}</Text>
                                        </View>
                                        <View style={styles.resultContainer}>
                                             <Text style={[styles.smallTextAm, { width: "34%", }]}>የሚጀመርበት ቀን፡ </Text>
                                             <Entypo name="arrow-long-right" size={20} color={COLORS.primary} />
                                             <Text style={[styles.smallText, { marginLeft: 10 }]}>{startDat}</Text>
                                        </View>
                                        <Text style={[styles.smallTextAm, { marginTop: 20 }]}>{"ይህ  "}
                                             <Text style={{ color: COLORS.primary }}>{ekubType}</Text>{"  እቁብ የሚጠናቀቀው በ  "}
                                             <Text style={{ color: COLORS.primary }}>{newDate}</Text>{"  ሲሆን ደራሽ  "}
                                             <Text style={{ color: COLORS.primary }}>{formatCurrency(Number(medebAm) * Number(durashn))}</Text>{"  ብር ነው።"}
                                        </Text>
                                   </View>
                              </View>
                         }

                         {/* Success and Failure Modal */}
                         <View style={styles.modalContainer}>
                              <ModalPopup visible={visible}>
                                   {loading === true ?
                                        <>
                                             <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={handleModalClose}>
                                                  <Ionicons name="close" size={24} color="black" />
                                             </TouchableOpacity>
                                             <View style={styles.modalBox}>
                                                  <ActivityIndicator size="large" color={COLORS.primary} />
                                                  <Text style={styles.smallTextAm}>አዲስ እቁብ በመጀመር ላይ ...</Text>
                                             </View>
                                        </> :
                                        <>
                                             {successMessage !== '' &&
                                                  <>
                                                       <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { handleModalClose(), navigation.goBack() }}>
                                                            <Ionicons name="close" size={24} color="black" />
                                                       </TouchableOpacity>
                                                       <View style={styles.modalBox}>
                                                            <Image
                                                                 source={require('../../assets/images/success.webp')}
                                                                 style={{ height: 100, width: 100 }}
                                                            />
                                                            <Text style={styles.mediumTextAm}>{successMessage}</Text>
                                                       </View>
                                                  </>
                                             }

                                             {errorMessage !== '' &&
                                                  <>
                                                       <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={handleModalClose}>
                                                            <Ionicons name="close" size={24} color="black" />
                                                       </TouchableOpacity>
                                                       <View style={styles.modalBox}>
                                                            <Image
                                                                 source={require('../../assets/images/error.webp')}
                                                                 style={{ height: 80, width: 80 }}
                                                            />
                                                            <Text style={styles.errorTextAm}>{errorMessage}</Text>
                                                       </View>
                                                  </>
                                             }
                                        </>
                                   }
                              </ModalPopup>
                         </View>

                         <View style={{ marginBottom: 50 }}>
                              {isValid === true ?
                                   <TouchableOpacity onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.primary }]}>
                                        <Text style={[styles.smallTextAm, { color: COLORS.offwhite }]}>ይጀምሩ</Text>
                                   </TouchableOpacity> :
                                   <Pressable onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.btnInValid }]}>
                                        <Text style={[styles.smallTextAm, { color: COLORS.darkText }]}>ይጀምሩ</Text>
                                   </Pressable>
                              }
                         </View>
                    </ScrollView>
               </KeyboardAvoidingView>
          </>
     )
}