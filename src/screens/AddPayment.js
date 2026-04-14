import { Pressable, Image, ScrollView, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SelectList } from 'react-native-dropdown-select-list';
import { addEkubPayment, getSumOfMemberPayment, selectEkub, selectEkubMember } from '../database/ekubDB';
import { ConvertedDate } from '../utilities/ConverteDate';
import styles from '../styles/ComponentStyles';
import { COLORS } from '../constants/theme';


const schema = yup.object().shape({
     selectedPayment: yup.string().required("የክፍያ መጠን ይምረጡ"),
});


export default function AddPayment({ route, navigation }) {
     const { ekubId, ekubMemberId } = route.params;
     const [ekub, setEkub] = useState([]);
     const [sumOfPayment, setSumOfPayment] = useState();
     const [ekubMember, setEkubMember] = useState([]);
     const [message, setMessage] = useState('');


     const { control, handleSubmit, reset, formState: { errors, isValid }, } =
          useForm({ resolver: yupResolver(schema), defaultValues: { selectedPayment: '' }, });


     useEffect(() => {
          selectEkub(ekubId, setEkub);
          getSumOfMemberPayment(ekubMemberId, setSumOfPayment);
          selectEkubMember(ekubMemberId, setEkubMember);
     }, [])

     const payAmount1 = ekubMember.paymentAmount;
     const maxLimit1 = (ekubMember.paymentAmount * ekub.duration) - sumOfPayment;

     // Generate data array dynamically
     const data = [];
     for (let i = 1; i <= maxLimit1 / payAmount1; i++) {
          data.push({ value: ekubMember.paymentAmount * i });
     }

     const onPressSend = (formData) => {
          setMessage('');
          const { selectedPayment } = formData;
          const selectedDate = ConvertedDate();
          const payment = Number(selectedPayment);

          addEkubPayment(ekubId, ekubMemberId, payment, selectedDate,
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



     return (
          <>
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerTextAm}>ክፍያ ይቀበሉ</Text>
                    <Text></Text>
               </View>
               <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
               >
                    <ScrollView>
                         <View style={{ marginTop: 30 }}>
                              <Image source={require("../../assets/images/addpayment.webp")} style={{ height: 160, width: 160, alignSelf: "center" }} />
                         </View>

                         <View style={styles.allInputContainer}>
                              <View style={styles.inputContainer}>
                                   <Text style={styles.mediumTextAm}>የክፍያ ብር መጠን፡</Text>
                                   <Controller
                                        control={control}
                                        rules={{ required: "የክፍያ መጠን ይምረጡ" }}
                                        name="selectedPayment"
                                        render={({ field: { onChange, value } }) =>
                                        (
                                             <SelectList
                                                  data={data}
                                                  arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'} />}
                                                  search={false}
                                                  placeholder={value === '' && "የክፍያ መጠን ይምረጡ"}
                                                  boxStyles={styles.inputSelectListBoxStyle}
                                                  inputStyles={styles.inputSelectListInputStyle}
                                                  dropdownStyles={styles.inputSelectListDropdownStyles}
                                                  setSelected={(selectedValue) => {
                                                       onChange(selectedValue);
                                                  }}
                                             />
                                        )}
                                   />
                                   {errors.selectedPayment && <Text style={styles.inputErrorTextAm}>{errors.selectedPayment.message}</Text>}
                              </View>
                         </View>

                         {message !== '' &&
                              <><Text style={styles.errorTextAm}>{message}</Text></>
                         }

                         {isValid === true ?
                              (<TouchableOpacity onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.primary, marginTop: 20 }]}>
                                   <Text style={[styles.mediumTextAm, { color: COLORS.offwhite }]}>ይመዝግቡ</Text>
                              </TouchableOpacity>)
                              :
                              (<Pressable onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.btnInValid }]}>
                                   <Text style={styles.mediumTextAm}>ይመዝግቡ</Text>
                              </Pressable>)
                         }
                    </ScrollView>
               </KeyboardAvoidingView>
          </>
     )
}