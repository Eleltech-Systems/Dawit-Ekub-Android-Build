import { Pressable, Image, ScrollView, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getSumOfEkubRecipients, InsertEkubRecipients, selectEkub, selectEkubMember } from '../database/ekubDB';
import { formatCurrency } from '../utilities/FormatCurrency';
import { ConvertedDate } from '../utilities/ConverteDate';
import styles from '../styles/ComponentStyles';
import { COLORS } from '../constants/theme';


const schema = yup.object().shape({
     balance: yup.string().required('የብር መጠን ያስገቡ'),
});


export default function AddEkubRecipients({ route, navigation }) {
     const { ekubId, ekubMemberId } = route.params;
     const [ekub, setEkub] = useState([]);
     const [ekubMember, setEkubMember] = useState([]);
     const [message, setMessage] = useState('');
     const [sumOfEkubRecipients, setSumOfEkubRecipients] = useState(0);
     const [balanceLimit, setBalanceLimit] = useState(0);


     const { control, handleSubmit, reset, formState: { errors, isValid }, } =
          useForm({ resolver: yupResolver(schema), defaultValues: { balance: '' } });


     useEffect(() => {
          selectEkub(ekubId, setEkub);
          selectEkubMember(ekubMemberId, setEkubMember);
          getSumOfEkubRecipients(ekubMemberId, setSumOfEkubRecipients);
     }, []);


     const maxLimit1 = (ekubMember.paymentAmount * ekub.duration) - (sumOfEkubRecipients === null ? (0) : (sumOfEkubRecipients));


     const onPressSend = (formData) => {
          if (balanceLimit <= maxLimit1) {
               if (balanceLimit > 0) {
                    setMessage('')
                    const { balance } = formData;
                    const selectedDate = ConvertedDate();
                    const payBalance = Number(balance);
                    InsertEkubRecipients(ekubId, ekubMemberId, payBalance, selectedDate,
                         (successMessage) => {
                              reset();
                              setMessage('');
                              navigation.goBack();
                         },
                         (errorMessage) => {
                              setMessage(errorMessage);
                         }
                    );
               } else {
                    setMessage("ትክክለኛ የብር መጠን ያስገቡ");
               }
          } else {
               setMessage("ከ " + formatCurrency(maxLimit1).toString() + " ብር በላይ ክፍያ መፈጸም ወይም መመዝገብ አይችሉም!")
          }
     };


     return (
          <>
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerTextAm}>ክፍያ ይፈጽሙ</Text>
                    <Text></Text>
               </View>
               <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} // Adjust behavior for iOS and Android
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset if needed
               >
                    <ScrollView>
                         <View style={{ marginTop: 20 }}>
                              <Image source={require("../../assets/images/moneyrecieve.webp")} style={{ height: 250, width: 200, alignSelf: "center" }} />
                         </View>

                         {maxLimit1 === 0 ?
                              (<Text style={[styles.smallTextAm, { textAlign: "center", color: COLORS.primary }]}>ክፍያ ፈጽመው ጨርሰዋል</Text>)
                              :
                              (<Text style={[styles.errorTextAm, { width: "50%", alignSelf: "center" }]}>{message}</Text>)
                         }

                         <View style={styles.allInputContainer}>
                              <View style={styles.inputContainer}>
                                   <Text style={styles.mediumTextAm}>የብር መጠን፡</Text>
                                   <Controller
                                        control={control}
                                        rules={{ required: true, }}
                                        name='balance'
                                        render={({ field: { onChange, value } }) =>
                                        (
                                             <View style={styles.inputBox}>
                                                  <TextInput
                                                       keyboardType='numeric'
                                                       style={styles.inputText}
                                                       value={value}
                                                       placeholder={'ገደብ፡ ' + formatCurrency(maxLimit1.toString())}
                                                       placeholderTextColor={COLORS.gray2}
                                                       onChangeText={(num) => {
                                                            onChange(num);
                                                            setBalanceLimit(num);
                                                       }} />
                                             </View>
                                        )}
                                   />
                                   {errors.balance && <Text style={styles.inputErrorText}>{errors.balance.message}</Text>}
                              </View>

                         </View>

                         {isValid === true ?
                              (<TouchableOpacity onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.primary }]}>
                                   <Text style={[styles.mediumTextAm, { color: COLORS.offwhite }]}>ይመዝግቡ</Text>
                              </TouchableOpacity>)
                              :
                              (<Pressable onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.btnInValid }]}>
                                   <Text style={[styles.mediumTextAm, { color: COLORS.darkText }]}>ይመዝግቡ</Text>
                              </Pressable>)
                         }
                    </ScrollView>
               </KeyboardAvoidingView>
          </>
     )
}