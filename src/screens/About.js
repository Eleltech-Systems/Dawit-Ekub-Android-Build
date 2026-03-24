import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { COLORS } from '../constants/theme';
import styles from '../styles/ComponentStyles';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Application from 'expo-application';

export default function About({ navigation }) {
     const currentAppVersion = Application.nativeApplicationVersion;

     const handleUrlPress = (url) => {
          Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
     };

     return (
          <ScrollView>
               <View style={[styles.modalContainer, { margin: 20 }]}>
                    <Avatar
                         rounded
                         size={110}
                         source={require("../../assets/images/moneyLogo2.png")}
                    />
                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"Dawit Ekub"}</Text>
                    <Text style={styles.smallText}>{`Version: ${currentAppVersion}`}</Text>
               </View>
               <View style={{ margin: 20, gap: 20 }}>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>
                         {"በ Eleltech Systems ተዘጋጅቶ የቀረበላችሁ ዳዊት እቁብ መተግበሪያ ለእቁብ ብር ሰብሳቢዎች ወይም አስተዳዳሪዎች ጥሩ መፍትሄ ይዞ የመጣ ሲሆን እቁብ ሰብሳቢ ለሆናችሁ እቁባችሁን በቀላሉ ለማስተዳደር ይጠቅማችኋል።"}
                    </Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>
                         {"ሶስት የተለያዩ እቁቦችን ማለትም የቀን ፣ የሳምንት ፣ እንዲሁም የወር እቁቦችን በተቀላጠፈ ሁኔታ በፈለጉት መጠን እና አይነት ለማስተዳደር ያግዛል። "}
                    </Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>
                         {"እቁብዎን ሲጀምሩ የእቁብ አይነት ፣ የሚጀመርበትን ቀን ፣ ሙሉ መደብ ብር መጠን እና የምን ያህል የጊዜ ቆይታ ሊኖረው እንደሚችል ቀድመው መወሰን የሚጠበቅቦት ሲሆን መተግበርያው በዚህ መረጃ ላይ ተመስርቶ እቁብዎ በሙሉ መደብ ደራሽ ምን ያህል ገንዘብ እንደሆነ እና መቼ እንደሚጠናቅቅ ከመጀምርዎ በፊት ያሳውቆታል። በዚህ መረጃ ላይ ተመስርተው የጊዜ ቆይታውን እና የደራሽ ብር መጠን ለማስተካከል ያግዝዎታል።"}
                    </Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>
                         {"እቁብዎን ከጀመሩ ቦሀላ በጀመሩት እቁብ አይነት ስር የእቁብ አባሎችዎን መረጃ እና የክፍያ ብር መጠን የሚመዘግብላችሁ ሲሆን የእያንዳንዱን አባልዎችዎን የክፍያ እና አጠቃላይ የእቁብ እንቅስቃሴ ለመቆጣጠር የሚያችለውን የአባል መለያ ገጽ የሚያዘጋጅልዎ ይሆናል። በአባልዎ መለያ ገጽ ውስጥም የአባልዎን መረጃ ለማስተካከል ወይንም ለመሰረዝ ፣ ዕጣ ቁጥር ለመሰየም ፣ ክፍያ ለመቀበል ፣ እንዲሁም ደራሽ ክፍያ ለመፈፀም ፣ የክፍያውን ማስረጃ መልእክት ለመላክ ፣ የየግዜውን እና የጠቅላላ ክፍያ መረጃ እንዲሁም እስከ የትኛው ቀን ክፍያው እንደተከናወነ ለማወቅ እና ሌሎች አገልግሎቶችን ያገኛሉ። "}
                    </Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>
                         {"በዋናው የእቁብዎ ገፅ ላይ አባልዎችዎ በሚጥሉት እቁብ ብር መጠን ላይ ተመስርቶ ዝርዝራቸውን የሚያስቀምጥላችሁ ሲሆን የአባልዎ ብዛት ፣ የእጣ ብዛት ፣ አጠቃላይ የሰበሰቡት የብር መጠን ፣ አጠቃላይ የፈፀሙት የደራሽ ብር ክፍያ መጠን ፣ እንዲሁም ቀሪ የገንዘብ መጠንዎን በቀላሉ ለማወቅ የሚያስችልዎት ሲሆን በዚህም ላይ ዕጣ ከማውጣት ጨምሮ ሌሎች አገልግሎቶችን ያገኛሉ።"}
                    </Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>
                         {"ሌላውና ዋነኛው ነገር ይህ መተግበሪያ ጠቅላላ የሚያስተዳድርላችሁን ሙሉ የእቁብዎን መረጃ ደህንነቱ የተጠበቀ እንዲሆን ለማስቻል ሙሉ የእቁብዎን ምትክ መረጃ በመረጡት ቦታ ላይ ለማስቀመጥ እና ባልተጠበቀ አጋጣሚ ስልክዎ ቢጠፋ ሙሉ ምትክ መረጃውን መልሰው ለማግኘት የሚያችሎት ነዉ።"}
                    </Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>
                         {"እቁብዎን በሚጀምሩበት እና በሚያስተዳድሩበት ወቅት የሚያስቸግርዎ አንዳንድ ጉዳዮች ካሉ ወደ እገዛ ገፅ ገብተው በተለያየ ርዕስ ስር የተዘረዘሩ ማብራሪያዎችን ይመልከቱ። "}
                         <Text onPress={() => navigation.navigate("Help")} style={{ color: "blue", textDecorationLine: 'underline' }}>
                              {" እገዛ-ከፈለጉ "}
                         </Text>
                    </Text>
                    <View style={{ backgroundColor: COLORS.gray, borderRadius: 12, paddingHorizontal: 40 }}>
                         <Text style={[styles.smallText, { marginTop: 10, textAlign: "center" }]}>
                              {"ለማንኛውም ጥያቄዎና አስተያየትዎ በተከታዮቹ አድራሻዎች ያግኙን።"}
                         </Text>
                         <View style={[styles.basicStyle, { gap: 30, marginVertical: 20, }]}>
                              <FontAwesome6 name="facebook" size={20} color={COLORS.gray2} onPress={() => handleUrlPress("https://www.facebook.com/profile.php?id=61552306718431")} />
                              <FontAwesome6 name="instagram" size={20} color={COLORS.gray2} onPress={() => handleUrlPress("https://www.instagram.com/eleltech_systems/")} />
                              <FontAwesome6 name="tiktok" size={20} color={COLORS.gray2} onPress={() => handleUrlPress("https://www.tiktok.com/@eleltechsystems")} />
                              <FontAwesome6 name="youtube" size={24} color={COLORS.gray2} onPress={() => handleUrlPress("https://www.youtube.com/@EleltechSystems")} />
                         </View>
                         <Pressable onPress={() => handleUrlPress("https://www.eleltech.com/")}>
                              <Text style={[styles.smallText, { color: "blue", textDecorationLine: "underline", alignSelf: 'center', marginBottom: 10 }]}>
                                   {"www.eleltech.com"}
                              </Text>
                         </Pressable>
                    </View>
                    <Text style={[styles.about, { textAlign: "center", paddingHorizontal: 20, color: COLORS.primary }]} onPress={() => handleUrlPress("https://www.eleltech.com/dawit-ekub-terms-conditions.html")}>
                         {"የአጠቃቀም ደንቦች እና ሁኔታዎች (Terms and Conditions of Use)"}
                    </Text>
                    <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 50 }}>
                         <Text style={styles.smallText}>{"Developed by Kalkidan Asnake"}</Text>
                         <Text style={styles.smallText}>
                              &copy; {new Date().getFullYear() + " Eleltech Systems. All rights reserved."}
                         </Text>
                    </View>
               </View>
          </ScrollView>
     )
}