import { Pressable, Image, ScrollView, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SelectList } from 'react-native-dropdown-select-list';
import { selectEkub, selectEkubMember, selectMemberPayment, updateEkubMember } from '../database/ekubDB';
import { ModalPopup } from '../utilities/ModalPopup';
import { useFocusEffect } from '@react-navigation/native';
import { ModalForContact } from '../utilities/ModalForContact';
import * as Contacts from 'expo-contacts';
import styles from '../styles/ComponentStyles';
import { COLORS } from '../constants/theme';


const schema = yup.object().shape({
     fullName: yup.string().required("ሙሉ ስም ያስገቡ"),
     phoneNumber: yup.string().required("ስልክ ቁጥር ያስገቡ"),
     paymentAmount: yup.string().required("ክፍያ ያስገቡ"),
});


export default function UpdateEkubMember({ route, navigation }) {
     const { ekubId, ekubMedeb, ekubMemberId } = route.params;
     const [ekub, setEkub] = useState([]);
     const [ekubMember, setEkubMember] = useState([]);
     const [memberPayment, setMemberPayment] = useState([]);
     const [successMessage, setSuccessMessage] = useState('');
     const [errorMessage, setErrorMessage] = useState('');
     const [visible, setVisible] = React.useState(false);
     const [visible2, setVisible2] = React.useState(false);
     const [contacts, setContacts] = useState([]);
     const [searchQuery, setSearchQuery] = useState('');
     const [otherInfo, setOtherInfo] = useState([]);
     const [loading, setLoading] = useState(false);


     const { control, handleSubmit, reset, formState: { errors, isValid }, } =
          useForm({ resolver: yupResolver(schema), defaultValues: { phoneNumber: '', fullName: '', paymentAmount: '' } });


     const data = [];

     if (memberPayment.length > 0) {
          data.push({ value: ekubMember.paymentAmount });
     } else {
          data.push({ value: ekubMedeb / 4 })
          data.push({ value: ekubMedeb / 4 })
          data.push({ value: ekubMedeb / 2 })
          data.push({ value: (ekubMedeb / 2) + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb })
          data.push({ value: ekubMedeb + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb + (ekubMedeb / 2) })
          data.push({ value: ekubMedeb + (ekubMedeb / 2) + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb * 2 })
          data.push({ value: (ekubMedeb * 2) + (ekubMedeb / 4) })
          data.push({ value: (ekubMedeb * 2) + (ekubMedeb / 2) })
          data.push({ value: (ekubMedeb * 2) + (ekubMedeb / 2) + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb * 3 })
          data.push({ value: (ekubMedeb * 3) + (ekubMedeb / 4) })
          data.push({ value: (ekubMedeb * 3) + (ekubMedeb / 2) })
          data.push({ value: (ekubMedeb * 3) + (ekubMedeb / 2) + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb * 4 })
          data.push({ value: (ekubMedeb * 4) + (ekubMedeb / 4) })
          data.push({ value: (ekubMedeb * 4) + (ekubMedeb / 2) })
          data.push({ value: (ekubMedeb * 4) + (ekubMedeb / 2) + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb * 5 })
          data.push({ value: (ekubMedeb * 5) + (ekubMedeb / 4) })
          data.push({ value: (ekubMedeb * 5) + (ekubMedeb / 2) })
          data.push({ value: (ekubMedeb * 5) + (ekubMedeb / 2) + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb * 6 })
          data.push({ value: (ekubMedeb * 6) + (ekubMedeb / 4) })
          data.push({ value: (ekubMedeb * 6) + (ekubMedeb / 2) })
          data.push({ value: (ekubMedeb * 6) + (ekubMedeb / 2) + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb * 7 })
          data.push({ value: (ekubMedeb * 7) + (ekubMedeb / 4) })
          data.push({ value: (ekubMedeb * 7) + (ekubMedeb / 2) })
          data.push({ value: (ekubMedeb * 7) + (ekubMedeb / 2) + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb * 8 })
          data.push({ value: (ekubMedeb * 8) + (ekubMedeb / 4) })
          data.push({ value: (ekubMedeb * 8) + (ekubMedeb / 2) })
          data.push({ value: (ekubMedeb * 8) + (ekubMedeb / 2) + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb * 9 })
          data.push({ value: (ekubMedeb * 9) + (ekubMedeb / 4) })
          data.push({ value: (ekubMedeb * 9) + (ekubMedeb / 2) })
          data.push({ value: (ekubMedeb * 9) + (ekubMedeb / 2) + (ekubMedeb / 4) })
          data.push({ value: ekubMedeb * 10 })
     }


     useFocusEffect(
          React.useCallback(() => {
               const fetchData = async () => {
                    await selectEkubMember(ekubMemberId, setEkubMember);
                    reset({ phoneNumber: ekubMember.phoneNumber, fullName: ekubMember.fullName, paymentAmount: ekubMember.paymentAmount })
                    setOtherInfo(ekubMember.otherInfo)
               };
               fetchData();
               selectEkub(ekubId, setEkub);
               selectMemberPayment(ekubMemberId, setMemberPayment)
          }, [ekubMember.id]) // Ensure to include ekubMemberId as a dependency
     );


     useEffect(() => {
          const getContacts = async () => {
               const { status } = await Contacts.requestPermissionsAsync();
               if (status === "granted") {
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
               <TouchableOpacity onPress={() => handleContactPress(phoneNumber, item.name)} style={styles.contactList}>
                    <Text style={[styles.mediumText, { paddingHorizontal: 15 }]}>{item.name}</Text>
                    <Text style={[styles.smallText, { paddingHorizontal: 15 }]}>{phoneNumber}</Text>
               </TouchableOpacity>
          );
     };

     const handleContactPress = (pNumber, name) => {
          reset({ phoneNumber: pNumber, fullName: name, paymentAmount: ekubMember.paymentAmount });
          setOtherInfo(ekubMember.otherInfo);
          setVisible2(false);
     }

     const onPressSend = (formData) => {
          setLoading(true);
          setVisible(true);
          const { fullName, phoneNumber, paymentAmount } = formData;
          const ekubTypeId = ekub.id;
          const payAmount = Number(paymentAmount);
          updateEkubMember(ekubMemberId, ekubTypeId, fullName, phoneNumber, payAmount, otherInfo,
               (successMessage) => {
                    setLoading(false);
                    setSuccessMessage(successMessage);
               },
               (errorMessage) => {
                    setLoading(false);
                    setErrorMessage(errorMessage);
               }
          );
     };

     const handleModalClose = () => {
          setVisible(false);
          setSuccessMessage('');
          setErrorMessage('');
          navigation.goBack();
     }


     return (
          <>
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesome6 name="arrow-left" size={20} color={COLORS.offwhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>{"መረጃ ያስተካክሉ"}</Text>
                    <Text></Text>
               </View>
               <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior for iOS and Android
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset if needed
               >
                    <ScrollView>
                         <Image source={require("../../assets/images/edit.webp")} style={{ height: 120, width: 120, alignSelf: "center", marginTop: 20 }} />
                         <View style={styles.basicStyle}>
                              <ModalPopup visible={visible}>
                                   {loading === true ?
                                        <>
                                             <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { setVisible(false), setLoading(false) }}>
                                                  <Ionicons name="close" size={20} color="black" />
                                             </TouchableOpacity>
                                             <View style={styles.modalBox}>
                                                  <ActivityIndicator size="large" color={COLORS.primary} />
                                                  <Text style={styles.smallText}>{"በማስተካከል ላይ ..."}</Text>
                                             </View>
                                        </> :
                                        <>
                                             {successMessage !== '' &&
                                                  <>
                                                       <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => handleModalClose()}>
                                                            <Ionicons name="close" size={20} color="black" />
                                                       </TouchableOpacity>
                                                       <View style={styles.modalBox}>
                                                            <Image
                                                                 source={require("../../assets/images/success.webp")}
                                                                 style={{ height: 100, width: 100 }}
                                                            />
                                                            <Text style={[styles.mediumText, { color: COLORS.lotFull }]}>{successMessage}</Text>
                                                       </View>
                                                  </>
                                             }

                                             {errorMessage !== '' &&
                                                  <>
                                                       <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => handleModalClose()}>
                                                            <Ionicons name="close" size={20} color="black" />
                                                       </TouchableOpacity>
                                                       <View style={styles.modalBox}>
                                                            <Image
                                                                 source={require("../../assets/images/error.webp")}
                                                                 style={{ height: 80, width: 80 }}
                                                            />
                                                            <Text style={styles.errorText}>{errorMessage}</Text>
                                                       </View>
                                                  </>
                                             }
                                        </>
                                   }
                              </ModalPopup>
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
                                                  <Text style={[styles.smallText, { alignSelf: "center", marginTop: 50 }]}>
                                                       {"ምንም ዕውቂያዎች አልተገኙም።"}
                                                  </Text>
                                             }
                                        />
                                   </View>
                              </>
                         </ModalForContact>

                         <View style={styles.allInputContainer}>
                              <View style={styles.inputContainer}>
                                   <Text style={styles.mediumText}>{"ሙሉ ስም፡"}</Text>
                                   <Controller
                                        control={control}
                                        rules={{ required: true, }}
                                        name="fullName"
                                        render={({ field: { onChange, value } }) =>
                                        (
                                             <View style={[styles.inputBox, { flexDirection: "row", justifyContent: "space-between" }]}>
                                                  <TextInput
                                                       style={[styles.inputText, { width: "85%" }]}
                                                       value={value}
                                                       onChangeText={(text) => { onChange(text) }}
                                                  />
                                                  <TouchableOpacity onPress={() => setVisible2(true)}>
                                                       <AntDesign name="contacts" size={24} color={COLORS.primary} />
                                                  </TouchableOpacity>
                                             </View>
                                        )}

                                   />
                                   {errors.fullName && <Text style={styles.inputErrorText}>{errors.fullName.message}</Text>}
                              </View>

                              <View style={styles.inputContainer}>
                                   <Text style={styles.mediumText}>{"ስልክ ቁጥር፡"}</Text>
                                   <Controller
                                        control={control}
                                        rules={{ required: true, }}
                                        name="phoneNumber"
                                        render={({ field: { onChange, value } }) =>
                                        (
                                             <View style={styles.inputBox}>
                                                  <TextInput
                                                       keyboardType="phone-pad"
                                                       style={styles.inputText}
                                                       value={value}
                                                       onChangeText={(text) => { onChange(text) }} />
                                             </View>
                                        )}
                                   />
                                   {errors.phoneNumber && <Text style={styles.inputErrorText}>{errors.phoneNumber.message}</Text>}
                              </View>

                              <View style={styles.inputContainer}>
                                   <Text style={styles.mediumText}>{"የክፍያ መጠን፡"}</Text>
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
                                                  placeholder={value}
                                                  boxStyles={styles.inputSelectListBoxStyle}
                                                  inputStyles={styles.inputSelectListInputStyle}
                                                  dropdownStyles={styles.inputSelectListDropdownStyles}
                                                  setSelected={(selectedValue) => {
                                                       onChange(selectedValue);
                                                  }}
                                             />
                                        )}
                                   />
                                   {errors.paymentAmount && (<Text style={styles.inputErrorText}>{errors.paymentAmount.message}</Text>)}
                                   {memberPayment.length > 0 && (<Text style={[styles.xSmallText, { textAlign: "justify", marginHorizontal: 10 }]}>
                                        {"ይህ የእቁብ አባል ክፍያ መክፈል የጀመሩ ስለሆነ አሁን የክፍያ መጠኑን ማስተካከል አይችሉም፡፡ የክፍያ መጠኑን ማስተካከል ከፈለጉ ሙሉ በሙሉ የከፈሉትን ክፍያ መሰረዝ ይገባዎታል።"}
                                   </Text>)}
                              </View>

                              <View style={styles.inputContainer}>
                                   <Text style={styles.mediumText}>{"ተጨማሪ መረጃ፡"}</Text>
                                   <View style={{ borderWidth: 1, minHeight: 120, borderColor: COLORS.btnInValid, paddingHorizontal: 10, borderRadius: 10, }}>
                                        <TextInput
                                             multiline
                                             style={styles.inputText}
                                             value={otherInfo}
                                             placeholder="የባንክ መለያ ቁጥር  ፣  የክፍያ ደረሰኝ  ፣  . . ."
                                             placeholderTextColor="#83829A"
                                             onChangeText={(text) => { setOtherInfo(text); }}
                                        />
                                   </View>
                              </View>
                         </View>

                         {isValid === true ?
                              (<TouchableOpacity onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.primary }]}>
                                   <Text style={styles.submitButtonsText}>{"ያስተካክሉ"}</Text>
                              </TouchableOpacity>)
                              :
                              (<Pressable onPress={handleSubmit(onPressSend)} style={[styles.submitButtons, { backgroundColor: COLORS.btnInValid }]}>
                                   <Text style={[styles.submitButtonsText, { color: COLORS.darkText }]}>{"ያስተካክሉ"}</Text>
                              </Pressable>)
                         }
                    </ScrollView>
               </KeyboardAvoidingView>
          </>
     )
}