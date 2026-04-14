import { Pressable, Image, ScrollView, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { AntDesign, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SelectList } from 'react-native-dropdown-select-list';
import { addEkubMember } from '../database/ekubDB';
import { ModalPopup } from '../utilities/ModalPopup';
import { ModalForContact } from '../utilities/ModalForContact';
import * as Contacts from 'expo-contacts';
import styles from '../styles/ComponentStyles';
import { COLORS } from '../constants/theme';


const schema = yup.object().shape({
     fullName: yup.string().required('ሙሉ ስም ያስገቡ'),
     phoneNumber: yup.string().required('ስልክ ቁጥር ያስገቡ'),
     paymentAmount: yup.string().required('ክፍያ ያስገቡ'),
});


export default function AddEkubMember({ route, navigation }) {
     const { ekubId, ekubMedeb } = route.params;
     const [successMessage, setSuccessMessage] = useState('');
     const [errorMessage, setErrorMessage] = useState('');
     const [visible, setVisible] = useState(false);
     const [visible2, setVisible2] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [contacts, setContacts] = useState([]);
     const [searchQuery, setSearchQuery] = useState('');
     const [payAmount, setPayAmount] = useState('');
     const [otherInfo, setOtherInfo] = useState('');


     const { control, handleSubmit, reset, formState: { errors, isValid }, } =
          useForm({ resolver: yupResolver(schema), defaultValues: { phoneNumber: '', fullName: '', paymentAmount: '' } });


     useEffect(() => {
          const getContacts = async () => {
               const { status } = await Contacts.requestPermissionsAsync();
               if (status === 'granted') {
                    const { data } = await Contacts.getContactsAsync({
                         fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
                    });

                    // Save only contacts with phone numbers
                    const filtered = data.filter(
                         (item) => item.phoneNumbers && item.phoneNumbers.length > 0
                    );
                    setContacts(filtered);
               }
          };
          getContacts();
     }, []);

     // Filter contacts by name or phone number
     const filteredContacts = contacts.filter((item) => {
          const phoneNumber = item.phoneNumbers[0]?.number || '';
          const query = searchQuery.toLowerCase();
          return (
               item.name?.toLowerCase().includes(query) ||
               phoneNumber.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
          );
     });


     const renderContactItem = ({ item }) => {
          const phoneNumber = item.phoneNumbers[0]?.number || '';
          return (
               <TouchableOpacity
                    onPress={() => handleContactPress(phoneNumber, item.name)}
                    style={{
                         backgroundColor: '#cedaed',
                         gap: 2,
                         marginBottom: 20,
                         borderRadius: 6,
                         paddingVertical: 5,
                    }}
               >
                    <Text style={[styles.mediumText, { paddingHorizontal: 15 }]}>{item.name}</Text>
                    <Text style={[styles.smallText, { paddingHorizontal: 15 }]}>{phoneNumber}</Text>
               </TouchableOpacity>
          );
     };


     const handleContactPress = (pNumber, name) => {
          reset({ phoneNumber: pNumber, fullName: name, paymentAmount: payAmount, otherInfo: otherInfo });
          setVisible2(false);
     }

     const data = [
          { value: ekubMedeb / 4 },
          { value: ekubMedeb / 2 },
          { value: (ekubMedeb / 2) + (ekubMedeb / 4) },
          { value: ekubMedeb },
          { value: ekubMedeb + (ekubMedeb / 4) },
          { value: ekubMedeb + (ekubMedeb / 2) },
          { value: ekubMedeb + (ekubMedeb / 2) + (ekubMedeb / 4) },
          { value: ekubMedeb * 2 },
          { value: (ekubMedeb * 2) + (ekubMedeb / 4) },
          { value: (ekubMedeb * 2) + (ekubMedeb / 2) },
          { value: (ekubMedeb * 2) + (ekubMedeb / 2) + (ekubMedeb / 4) },
          { value: ekubMedeb * 3 },
          { value: (ekubMedeb * 3) + (ekubMedeb / 4) },
          { value: (ekubMedeb * 3) + (ekubMedeb / 2) },
          { value: (ekubMedeb * 3) + (ekubMedeb / 2) + (ekubMedeb / 4) },
          { value: ekubMedeb * 4 },
          { value: (ekubMedeb * 4) + (ekubMedeb / 4) },
          { value: (ekubMedeb * 4) + (ekubMedeb / 2) },
          { value: (ekubMedeb * 4) + (ekubMedeb / 2) + (ekubMedeb / 4) },
          { value: ekubMedeb * 5 },
          { value: (ekubMedeb * 5) + (ekubMedeb / 4) },
          { value: (ekubMedeb * 5) + (ekubMedeb / 2) },
          { value: (ekubMedeb * 5) + (ekubMedeb / 2) + (ekubMedeb / 4) },
          { value: ekubMedeb * 6 },
          { value: (ekubMedeb * 6) + (ekubMedeb / 4) },
          { value: (ekubMedeb * 6) + (ekubMedeb / 2) },
          { value: (ekubMedeb * 6) + (ekubMedeb / 2) + (ekubMedeb / 4) },
          { value: ekubMedeb * 7 },
          { value: (ekubMedeb * 7) + (ekubMedeb / 4) },
          { value: (ekubMedeb * 7) + (ekubMedeb / 2) },
          { value: (ekubMedeb * 7) + (ekubMedeb / 2) + (ekubMedeb / 4) },
          { value: ekubMedeb * 8 },
          { value: (ekubMedeb * 8) + (ekubMedeb / 4) },
          { value: (ekubMedeb * 8) + (ekubMedeb / 2) },
          { value: (ekubMedeb * 8) + (ekubMedeb / 2) + (ekubMedeb / 4) },
          { value: ekubMedeb * 9 },
          { value: (ekubMedeb * 9) + (ekubMedeb / 4) },
          { value: (ekubMedeb * 9) + (ekubMedeb / 2) },
          { value: (ekubMedeb * 9) + (ekubMedeb / 2) + (ekubMedeb / 4) },
          { value: ekubMedeb * 10 },
     ];

     const onPressSend = (formData) => {
          setVisible(true);
          setIsLoading(true);
          const { fullName, phoneNumber, paymentAmount } = formData;
          const payAmount = Number(paymentAmount);
          addEkubMember(ekubId, fullName, phoneNumber, payAmount, otherInfo,
               (successMessage) => {
                    setIsLoading(false);
                    setSuccessMessage(successMessage);
                    setOtherInfo('');
                    reset({ fullName: '', phoneNumber: '', paymentAmount: '' });
               },
               (errorMessage) => {
                    isLoading(false);
                    setErrorMessage(errorMessage);
               }
          );
     };

     const handleContinue = () => {
          setVisible(false);
          setPayAmount('');
          setOtherInfo('');
          reset({ fullName: '', phoneNumber: '', paymentAmount: '' });
     }

     const handleModalClose = () => {
          setIsLoading(false);
          setVisible(false);
          setSuccessMessage('');
          navigation.goBack();
     }


     return (
          <>
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerTextAm}>አዲስ አባል ይጨምሩ</Text>
                    <Text></Text>
               </View>

               <ModalForContact visible={visible2}>
                    <>
                         <View style={{ alignItems: "center" }}>
                              <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => setVisible2(false)}>
                                   <Ionicons name="close" size={24} color="black" />
                              </TouchableOpacity>
                         </View>

                         {/* Search bar */}
                         <View style={[styles.resultContainer, { paddingHorizontal: 14, gap: 10, backgroundColor: COLORS.gray, marginTop: 10, borderRadius: 8 }]}>
                              <Ionicons name="search" size={24} color={COLORS.primary} />
                              <TextInput
                                   placeholder="በስም ወይም በቁጥር ይፈልጉ..."
                                   placeholderTextColor={COLORS.gray2}
                                   value={searchQuery}
                                   onChangeText={setSearchQuery}
                                   style={[styles.inputText, { width: "90%" }]}
                              />
                         </View>

                         {/* Contact list */}
                         <View style={{ gap: 30, height: "84%", marginTop: 30 }}>
                              <FlatList
                                   data={filteredContacts}
                                   keyExtractor={(item) => item.id}
                                   renderItem={renderContactItem}
                                   ListEmptyComponent={
                                        <Text style={[styles.smallTextAm, { alignSelf: "center", marginTop: 50 }]}>
                                             ምንም ዕውቂያዎች አልተገኙም።
                                        </Text>
                                   }
                              />
                         </View>
                    </>
               </ModalForContact>

               <ModalPopup visible={visible}>
                    {isLoading === true ?
                         <>
                              <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { setVisible(false), setIsLoading(false) }}>
                                   <Ionicons name="close" size={24} color="black" />
                              </TouchableOpacity>
                              <View style={styles.modalBox}>
                                   <ActivityIndicator size="large" color="green" />
                                   <Text style={styles.smallTextAm}>አባል በማስገባት ላይ ...</Text>
                              </View>
                         </> :
                         <>
                              {successMessage !== '' &&
                                   <>
                                        <View style={{ alignItems: "center" }}>
                                             <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={handleModalClose}>
                                                  <Ionicons name="close" size={24} color="black" />
                                             </TouchableOpacity>
                                             <Image
                                                  source={require("../../assets/images/success.webp")}
                                                  style={{ height: 100, width: 100, marginVertical: 10 }}
                                             />
                                             <Text style={[styles.largTextAm, { color: COLORS.primary }]}>{successMessage}</Text>
                                             <Text style={[styles.smallTextAm, { marginTop: 20 }]}>ሌላ እቁብተኛ መመዝገብ ይፈልጋሉ?</Text>

                                        </View>

                                        <View style={[styles.resultContainer, { width: "90%", alignSelf: "center", justifyContent: "space-evenly", marginVertical: 20 }]}>
                                             <TouchableOpacity onPress={handleModalClose} style={[styles.lightButtons, { width: "26%", paddingVertical: 2 }]}>
                                                  <Text style={styles.smallTextAm}>አይ</Text>
                                             </TouchableOpacity>
                                             <TouchableOpacity onPress={handleContinue} style={[styles.lightButtons, { width: "26%", paddingVertical: 2 }]}>
                                                  <Text style={styles.smallTextAm}>አዎን</Text>
                                             </TouchableOpacity>

                                        </View>
                                   </>
                              }

                              {errorMessage !== '' &&
                                   <>
                                        <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { setVisible(false), setErrorMessage('') }}>
                                             <Ionicons name="close" size={24} color="black" />
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
                         </>
                    }
               </ModalPopup>

               <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} // Adjust behavior for iOS and Android
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset if needed
               >
                    <ScrollView>
                         <Image source={require("../../assets/images/addnewuser.webp")} style={{ marginTop: 10, height: 140, width: 140, alignSelf: "center" }} />
                         <View style={[styles.allInputContainer, { marginTop: 0 }]}>
                              <View style={styles.inputContainer}>
                                   <Text style={styles.smallTextAm}>ሙሉ ስም፡</Text>
                                   <Controller
                                        control={control}
                                        rules={{ required: true, }}
                                        name='fullName'
                                        render={({ field: { onChange, value } }) =>
                                        (
                                             <View style={[styles.inputBox, { flexDirection: "row", justifyContent: "space-between" }]}>
                                                  <TextInput style={[styles.inputText, { width: "80%" }]} value={value} onChangeText={(text) => { onChange(text); }} />
                                                  <TouchableOpacity onPress={() => setVisible2(true)}>
                                                       <AntDesign name="contacts" size={24} color="green" />
                                                  </TouchableOpacity>
                                             </View>
                                        )}
                                   />
                                   {errors.fullName && <Text style={styles.inputErrorTextAm}>{errors.fullName.message}</Text>}
                              </View>

                              <View style={styles.inputContainer}>
                                   <Text style={styles.smallTextAm}>ስልክ ቁጥር፡</Text>
                                   <Controller
                                        control={control}
                                        rules={{ required: true, }}
                                        name="phoneNumber"
                                        render={({ field: { onChange, value } }) =>
                                        (
                                             <View style={styles.inputBox}>
                                                  <TextInput keyboardType="phone-pad" style={styles.inputText} value={value} onChangeText={(text) => { onChange(text); }} />
                                             </View>
                                        )}
                                   />
                                   {errors.phoneNumber && <Text style={styles.inputErrorTextAm}>{errors.phoneNumber.message}</Text>}
                              </View>

                              <View style={styles.inputContainer}>
                                   <Text style={styles.smallTextAm}>የክፍያ መጠን፡</Text>
                                   <Controller
                                        control={control}
                                        rules={{ required: "ክፍያ ያስገቡ" }}
                                        name="paymentAmount"
                                        render={({ field: { onChange, value } }) =>
                                        (
                                             <SelectList
                                                  data={data}
                                                  arrowicon={<FontAwesome name="chevron-down" size={12} color={"black"} />}
                                                  search={false}
                                                  placeholder={value === '' && "ክፍያ ያስገቡ"}
                                                  boxStyles={styles.inputSelectListBoxStyle}
                                                  inputStyles={styles.inputSelectListInputStyle}
                                                  dropdownStyles={styles.inputSelectListDropdownStyles}
                                                  setSelected={(selectedValue) => {
                                                       onChange(selectedValue);
                                                       setPayAmount(selectedValue);
                                                  }}
                                             />
                                        )}
                                   />
                                   {errors.paymentAmount && <Text style={styles.inputErrorTextAm}>{errors.paymentAmount.message}</Text>}
                              </View>

                              <View style={styles.inputContainer}>
                                   <Text style={styles.smallTextAm}>ተጨማሪ መረጃ፡</Text>
                                   <View style={{ borderWidth: 1, minHeight: 120, borderColor: COLORS.btnInValid, paddingHorizontal: 10, borderRadius: 10 }}>
                                        <TextInput
                                             multiline
                                             style={styles.inputText}
                                             value={otherInfo}
                                             placeholder="የባንክ መለያ ቁጥር  ፣  . . ."
                                             placeholderTextColor={COLORS.gray2}
                                             onChangeText={(text) => { setOtherInfo(text); }}
                                        />
                                   </View>
                              </View>
                         </View>

                         <View style={{ marginBottom: 50 }}>
                              {isValid === true ?
                                   (<TouchableOpacity onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.primary }]}>
                                        <Text style={[styles.mediumTextAm, { color: COLORS.offwhite }]}>ይመዝግቡ</Text>
                                   </TouchableOpacity>)
                                   :
                                   (<Pressable onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.btnInValid }]}>
                                        <Text style={[styles.mediumTextAm, { color: COLORS.darkText }]}>ይመዝግቡ</Text>
                                   </Pressable>)
                              }
                         </View>
                    </ScrollView>
               </KeyboardAvoidingView>
          </>
     )
}