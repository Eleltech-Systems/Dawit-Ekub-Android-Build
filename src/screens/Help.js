import { Image, Linking, ScrollView, Text, View } from 'react-native';
import styles from '../styles/ComponentStyles';
import { COLORS } from '../constants/theme';
import { Entypo, Ionicons } from '@expo/vector-icons';

export default function Help() {

     const handleUrlPress = (url) => {
          Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
     };

     return (
          <ScrollView>
               <View style={{ marginTop: 20 }}>
                    <Image source={require('../../assets/images/help4.webp')} style={{ height: 100, width: 100, alignSelf: 'center' }} />
               </View>
               <View style={{ gap: 30, marginHorizontal: 20, marginBottom: 50 }}>
                    <Text style={[styles.smallText, { textAlign: "center", marginTop: 10, paddingHorizontal: 30 }]}>{"እቁብዎን ለማስተዳደር እንዲያግዝዎ በተለያየ ርእስ የተገለጹትን መግለጫዎች ይመልከቱ።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"1 - አዲስ እቁብ ለመጀመር"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በመጀመሪያው የመተግበርያው ገፅ ላይ አዲስ እቁብ የሚያስጀምርዎትን ቁልፍ ያገኛሉ። ምንም አይነት እቁብ ካልጀመሩ በመነሻው ገፅ ፊት ለፊት እቁብዎን ማስጀምሪያ ቁልፍ ያገኛሉ። እቁብዎን ጀምረዉ ሌላ ተጨማሪ እቁብ መጀመር ከፈለጉ ደግሞ በዚሁ ገፅ አናት የሚገኘውን የመደመር ምልክት በመጫን መጀመር ይችላሉ። "}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"የእቁብዎ ማስጀመሪያ ገፅ ሲከፈት የእቁብ ስም ፣ አይነት ፣ መደብ ብር መጠን ፣ የሚጀምሩበትን ቀን እና እቁብዎ የምን ያህል ጊዜ ቆይታ እንዳለው በማስገባት ባስገቡት መረጃ መሰረት እቁቡን መቼ እንደሚያጠናቅቁ እና በመደብዎ መጠን ላይ ተመስርቶ ደራሽ የገንዘብ መጠን ምን ያህል እንደሆነ እቁቡን ከመጀመርዎ በፊት የሚያሳውቅዎ ይሆናል።"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በዚህም መረጃ ላይ ተመስርቶ የደራሽ ገንዘብ መጠን እና የጊዜ ቆይታውን ለማስተካከል ወይም ለመቀየር ይረዳል። ከዚያም እቁብዎን ወድያው መጀመር ይችላሉ። የጀመሩትን እቁቦች ሁሉ በዋናው ገፅ ላይ ማግኘት ይሚችሉ ሲሆን የጀመሩትን እቁብ በመጫን በእቁብዎ ዋና ማስተዳደሪያ ገፅ ላይ እቁቡን ማስተዳደር ይጀምራሉ።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"2 - የእቁብ አባላትን ለመመዝገብ"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በጀመሩት እቁብ ማስተዳደሪያ ገፅ ላይ አባሎችን ለመመዝገብ ወደሚያስችል ገጽ ለመግባት ( አባል ይጨምሩ ) የሚለውን ቁልፍ ይጫኑ። በዚህም ገፅ ላይ የአባልዎን ስም ፣ ስልክ ቁጥር ፣ የክፍያ መጠን እንዲሁም ተጨማሪ መረጃ በማስገባት ይመዝግቡ። የአባሎችን ስም እና ስልክ ቁጥር በቀላሉ ከስልክዎ መውሰድ ይችላሉ። "}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በዚህ ገጽ ላይ በእቁብዎ ሙሉ መደብ ብር ላይ ተመስርቶ የተለያዩ መደብ ብር መጠኖችን በዝርዝር በማስቀመጥ የአባልዎን የክፍያ መጠን መርጠው እንዲያስገቡ ያስችላል። የተመዘገቡ አባሎች ዝርዝር በዋናው የእቁብ ማስተዳደሪያ ገፅ ላይ ያስቀምጣል። ዝርዝሩን በመጫንም ወደ አባሎች መለያ ገፅ የሚያስገባ ሲሆን በዚህም የእያንዳንዱን አባሎች ሙሉ የእቁብ እንቅስቃሴ የሚቆጣጠሩበት ገፅ ነዉ።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"3 - የእቁብ አባል መለያ ገፅ"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በአባልዎ መለያ ገፅ ላይ ሙሉ የአባሉን መረጃ ያገኛሉ። በዚህም ገፅ የአባሉን ሙሉ መረጃ ለማስተካከል ፣ አባሉን ለመሰረዝ ፣ የአባሉን ክፍያ ለመመዝገብ እና ለመሰረዝ እንዲሁም የክፍያውን ማስረጃ አጭር መልእክት ለመላክ ፣ ዕጣ ቁጥር ለመሰየም ፣ ለአባሉ ክፍያ ሲፈፅሙ ለመመዝገብ እና የተለያዩ መረጃዎችን ማለትም የምን ያህል ጊዜ ክፍያ እንደተከፈለ እና እስከየትኛው ጊዜ ( ቀን ፣ ሳምንት ፣ ወር ) እንደተከፈለ ፣ ጠቅላላ የተከፈለ የብር መጠን ፣ ለአባሉ የፈጸሙትን እንዲሁም ያልፈፀሙትን ክፍያ ብር መጠን እንዲሁም ቀሪ እዳ ብር ምን ያህል እንደሆነ በቀላሉ ለማወቅ ያስችላል።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"4 - ክፍያ ለመቀበል"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በእያንዳንዱ የአባላት መለያ ገፅ ላይ ክፍያ ይቀበሉ የሚል ቁልፍ ያገኛሉ። ይህንን ቁልፍ ሲጫኑ ወደ ክፍያ መቀበያ የሚያስገባዎ ሲሆን አባሉ በጀመረው እቁብ መደብ መጠን መሰረት የክፍያውን መጠን ዝርዝር ያስቀምጣል። ከዝርዝሩ ላይ አባልዎ የሚከፍሉትን የብር መጠን መርጠው መመዝገብ ይችላሉ። ይህም ክፍያ ሲቀበሉ ስህተት እንዳይኖር ያግዛል። በተጨማሪም ክፍያ ሲቀበሉ መተግበርያው ክፍያ የተቀበሉበትን ቀን በራሱ የሚመዘግብ ይሆናል። የክፍያውንም ዝርዝር የተከፈለበትን ቀን ጨምሮ በአባሉ መለያ ገጽ ላይ በዝርዝር ያስቀምጣል።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"5 - የክፍያ ማስረጃ መልእክት ለመላክ"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በክፍያ ዝርዝር ላይ በስተቀኝ የሚገኘውን የታች ጠቋሚ ምልክት ሲጫኑ ለአጭር መልእክት መላኪያ የሚሆን ምልክት ያገኛሉ። ይህን ምልክት ሲጫኑ የክፍያውን ቀን ፣ የክፍያ መጠን ፣ እስክ የትኛው ጊዜ ( ቀን ፣ ሳምንት ፣ ወር ) እንደተከፈለ እና አጠቃላይ ክፍያ መጠን በማደራጀትና የአባሉን ስልክ ቁጥር በመጠቀም በስልክዎ መልእክት መላኪያው ላይ ለመላክ በሚመች መልኩ ያዘጋጃል እርስዎም በቀላሉ ወዲያው መላክ ይችላሉ። የክፍያ ማስረጃ አጭር መልእክት ለመላክ የሚያስችለውን ቁልፍ የሚያገኙት ከተዘረዘሩት ክፍያዎች በመጀመሪያው ላይ ላለው ብቻ ነው።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"6 - ክፍያውን ለመሰረዝ"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በክፍያ ዝርዝር ላይ በስተቀኝ የሚገኘውን የታች ጠቋሚ ምልክት ሲጫኑ ክፍያውን ለመሰረዝ የሚያስችል ቁልፍ ያገኛሉ። ይህንን ቁልፍ በመጫንም ክፍያውን መሰረዝ ይችላሉ። በሁሉም የክፍያ ዝርዝር ላይ ለመሰረዝ የሚያስችለውን ቁልፍ ያገኛሉ።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"7 - አጠቃላይ የክፍያ ዝርዝር "}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በእቁብ አባሎችዎ መለያ ውስጥ የተቀበሉትን ክፍያ ሁሉ በክፍያ ዝርዝር ውስጥ ማግኘት ይችላሉ። በዚህ የክፍያ ዝርዝር ውስጥ አጠቃላይ የሰበሰቡትን ወይም የመዘገቡትን ክፍያ መጠን ጨምሮ በየ ጊዜው የተቀበሉትን ክፍያ በተቀበሉበት ቀን በመለየት በዛው ቀን የተሰበሰበውን አጠቃላይ ድምር እና የአባላቱን ስም እና የክፍያ ብር መጠን በመዘርዘር የሚያሳይ ይሆናል። ይህም የእቁብ ብርዎን በየእለቱ ወይም በየ ሰበሰቡበት ቀን ምን ያህል እንደሰበሰቡ በቀላሉ ለማወቅ ይረዳል።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"8 - አባል ለመሰረዝ"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በአባልዎ መለያ ገፅ ላይ ይሰርዙ የሚለውን ቁልፍ ሲጫኑ አባልዎ ሙሉ በሙሉ ከእቁቡ ይሰረዛል። አባልዎን ከእቁብዎ ሲሰርዙ ለአባሉ የሰየሙት ዕጣ ቁጥር ፣ ጠቅላላ የክፍያ መረጃ ፣ የፈፀሙት ክፍያን ጨምሮ ሙሉ በሙሉ የአባሉ መረጃ ይሰረዛል።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"9 - የአባልን መረጃ ለማስተካከል"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በአባልዎ መለያ ገፅ ላይ ለማስተካከል የሚለውን ቁልፍ ሲጫኑ የአባልዎን መረጃ የሚያስተካክሉበት ገፅ ከመረጃው ጋር ይከፈታል። በዚህም መረጃውን መልሰው ማስተካከል ይቻላሉ። ነገር ግን አባልዎ ክፍያ መክፈል ከጀመሩ የክፍያ መጠኑን ማስተካከል አይችሉም። የክፍያ መጠኑን ለማስተካከል አባሉ የከፈለውን ክፍያ ሙሉ በሙሉ መሰረዝ ይገባዎታል። አባሉ የከፈሉትን ክፍያ መረጃ በማስታወሻ በመያዝ ክፍያውን ከሰረዙ ቦሃላ የክፍያ መጠኑን አስተካክለው ክፍያውን በአንዴ መመዝገብ ይችላሉ።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"10 - የክፍያ ደረሰኝ ለማስቀመጥ"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"የአባል መረጃ በሚያስተካክሉበት ገጽ ላይ ( ተጨማሪ መረጃ ) በሚል የተሰየመ ቦታ ያገኛሉ። እዚህ ቦታ ላይ በሞባይል ባንኪንግ ለአባሉ ክፍያ ሲፈፅሙ የሚላክልዎትን የክፍያ ደረሰኝ መረጃ (URL) ኮፒ አድርገው በማስገባት ማስቀመጥ ይችላሉ። እንዲሁም በተጨማሪ የአባሉ የባንክ መለያ ቁጥር እና ሌሎች መረጃዎችን እዚህ ላይ ማስቀመጥ ይችላሉ።"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በዚህ ገጽ ላይ ያስቀመጡትን የክፍያ ደረሰኝ ወይንም ሌሎች መረጃዎች በአባሉ መለያ ገፅ ላይ የሚትገኘውን የዝርዝር ጠቋሚ ምልክት በመጫን ሁሉንም የአባሉን ተጨማሪ መረጃዎች መመልከት ይችላሉ።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"11 - ክፍያ ለመፈፀም"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በአባልዎ መለያ ገፅ ላይ ( ክፍያ ይፈፅሙ ) የሚለውን ቁልፍ ሲጫኑ ለዚህ መመዝገቢያ የሚሆነው ገፅ ይከፈታል በዚህም ላይ ለአባሉ የፈፀሙትን ክፍያ ብር መጠን ጽፈው መመዝገብ ይችላሉ። ለአባሉ ክፍያ ሲፈፅሙ አባሉ በገባው እቁብ መደብ ብር መጠን መሰረት ሊወስድ ይሚችለውን የደራሽ ገንዘብ መጠን ገደብ ያሳውቃል። ይህም ክፍያ በሚፈፅሙ ጊዜ ስህተት እንዳይኖር ይረዳል።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"12 - እቁብ የደረሳቸው አባሎች ዝርዝር"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በዋናው የእቁብዎ ገፅ ላይ ( እቁብ የደረሳቸው ) በሚል የተሰየመውን ቁልፍ በመጫን ወደ ዝርዝሩ ገፅ የሚወስድ ሲሆን በዚህም ገፅ ላይ ጠቅላላ የእቁብ ብር የደረሳቸውን አባላት ዝርዝር የወሰዱበትን ቀን ፣ ስም እንዲሁም የብሩን መጠን በማስቀመጥ ይዘረዝራል። ከዝርዝሩ ላይም የፈለጉትን ለመሰረዝ እንዲችሉ በያንዳንዱ ዝርዝር ላይ በስተቀኝ የምትገኘውን የታች ጠቋሚ ምልክት ሲጫኑ ለመሰረዝ ይሚያስችለውን ቁልፍ ያገኛሉ። አንዴ በመጫን መሰረዝ ይችላሉ።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"13 - ዕጣ ቁጥር ለመሰየም"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በአባልዎ መለያ ገፅ ላይ ለዕጣ ቁጥር የሚለውን ቁልፍ ሲጫኑ ዕጣ ቁጥር የሚሰይሙበትን ገፅ ይከፍታል በዚህም ዕጣ ቁጥር ለመሰየም ያስችላል። በዚህ ገፅ ላይ ጠቅላላ የሰየሙትን ዕጣ ዝርዝር የሚያሳይ ሲሆን ይህም ዕጣ ሲሰይሙ ያልተሰየመ ዕጣ ቁጥር ለመለየት ያግዛል። ለሙሉ መደብ ዕጣ በአረንጉአዴ ፣ ለግማሽ መደብ በብርቱካናማ እና ለእሩብ መደብ በሰማያዊ ቀለም የሚሰየም ይሆናል።"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"ዕጣውንም ለመሰየም በአባሉ የክፍያ መጠን ላይ ተመስርተው ዕጣውን ይሰይሙ። ዕጣ ቁጥር ይሰይሙ የሚለውን ቁልፍ ሲጫኑ ዕጣ መሰየሚያው ይከፈታል። በዚህም የመደቡን አይነት በመምረጥ መሰየም አስችላል። ለሙሉ መደብ ተመሳሳይ ዕጣ ቁጥር መሰየም አይችሉም። ለግማሽ መደብ ከሁለት በላይ ተመሳሳይ ዕጣ ቁጥር መሰየም አይችሉም። ለእሩብ መደብ ከአራት በላይ ተመሳሳይ  ዕጣ ቁጥር መሰየም አይችሉም።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"14 - ዕጣ ለማውጣት"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"በዋናው የእቁብ ማስተዳደሪያ ገፅ ላይ ( ዕጣ ማውጫ ) የሚለውን ቁልፍ ሲጫኑ ወደ ዕጣ ማስተዳደሪያ ገፅ ያስገባዎታል። በዚህም የተሟሉ እጣዎችን በዝርዝር ያስቀምጣል። ማለትም ለየአባሉ የተሰየሙ ዕጣ ቁጥሮችን የተሟሉ ከሆኑ እዚህ ያገኛሉ። ሙሉ መደብ ዕጣ ቁጥሮች ፣ ግማሽ መደብ ሁለት ተመሳሳይ ዕጣ ቁጥሮች ፣ እሩብ መደብ አራት አራት ተመሳሳይ ዕጣ ቁጥሮች በዚህ ዕጣ ማውጫ ገፅ ይገኛሉ። ያልተሟሉ ዕጣ ቁጥሮች ማለትም ግማሽ መደብ ሁለት ተመሳሳይ ቁጥር ከሌለው እና እሩብ መደብ አራት ተመሳሳይ ቁጥር ከሌለው በዚህ ዕጣ ማውጫ ገፅ ላይ አይገኙም። "}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"የነዚህን የተሟሉ ዕጣ ቁጥሮች ብዛት በቀላሉ ማወቅ ያስችላል። ይህም በእቁብዎ ዕጣ ብዛት ላይ ተመስርተው በምን ያህል ግዜ ዕጣ ማውጣት እንዳለብዎት ለመወሰን ይረዳል። ከእነዚህ ዕጣ ቁጥሮች ውስጥ እድለኛውን ለመለየት የእጣ ማውጫ ቁልፉን እንደተጫኑ ዕጣ መለያ ገፅ ይከፈታል። በዚህ ገፅ ዕጣ ማውጫውን ያስጀምሩ ከዛም ከ 10 ሰከንድ ቦሀላ አሸናፊ ዕጣ ቁጥሩን የሚያሳይ ይሆናል። አሸናፊ ዕጣው ከተለየ ቦሀላ እንዲመዘገብ እና ከእጣ ዝርዝር እንዲወጣ የሚጠይቅ ሲሆን አዎንታዊ ምላሽ በመስጠት እንዲመዘግብ ማድረግ ወይንም ዕጣውን ድጋሜ እንዲያወጣ ማድረግ ይችላሉ።"}</Text>

                    <Text style={[styles.largText, { color: COLORS.primary }]}>{"15 - መረጃዎን ለማስቀመጥ እና መልሶ ለመጠቀም"}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"ሙሉ የእቁብ መረጃዎ ደህንነቱ የተጠበቀ ለማድረግ በመነሻ ገፅ ላይ የሚገኘውን የምናሌ ( Menu ) ምልክት በመጫን ከተዘረዘሩት አማራጮች በስተመጨረሻ ላይ መረጃዎን በፈለጉበት ቦታ ለማስቀመጥ እና ለመመለስ የሚያስችለውን ሁለት ቁልፍ ያገኛሉ። እነዚህን ቁልፎች በመጠቀም መረጃዎ ደህንነቱ የተጠበቀ ማድረግ ይገባዎታል። ( ምትክ መረጃ ያስቀምጡ ) ይሚለውን ቁልፍ ሲጫኑ ሙሉ የእቁብ መረጃ በስልክዎ ዊስጣዊ ቋት በፈለጉት ፋይል አቃፊ ( Folder ) ወይም አዲስ አቃፊ በመፍጠር እንዲያስቀምጥልዎ ማድረግ ይችላሉ። "}</Text>
                    <Text style={[styles.smallText, { textAlign: "justify" }]}>{"መተግበሪያው ሙሉ የእቁብ መረጃውን ሲያስቀምጥ (Dawit_Ekub_ያስቀመጡበት ቀን) በማድረግ ይሚያስቀምጥልዎት ይሆናል። ከመተግበሪያው በመውጣት እና የስልክዎ ውስጣዊ ቋት ውስጥ በመግባት መረጃውን ካስቀመጡበት ፋይል አቃፊ ውስጥ ወደፈለጉበት ቦታ ማስቀመጥ ይችላሉ። ይህም ባልተጠበቀ አጋጣሚ ስልክዎ ቢጠፋ የ Dawit Ekub መተግበሪያን በስልክዎ ላይ በመጫን ያስቀመጡትን ሙሉ የእቁብ መረጃ ( ምትክ መረጃ ይመልሱ ) ይሚለውን ቁልፍ በመጠቀም ሙሉ መረጃውን መመለስ ይችላሉ። እቁብዎን ከሰበሰቡ ቦሀላ አዲስ ለውጥ ያለውን መረጃ ማስቀመጥ አይዘንጉ። "}</Text>

                    <View style={{ backgroundColor: COLORS.gray, borderRadius: 12, paddingHorizontal: 20, marginBottom: 50 }}>
                         <Text style={[styles.smallText, { marginTop: 10, textAlign: "center" }]}>{"በተንቀሳቃሽ ምስል ( Video ) የታገዘ ማብራሪያዎችን ለመመልከት ከስር በሚገኙት ቻናሎቻችንን ይመልከቱ።"}</Text>
                         <View style={[styles.basicStyle, { gap: 30, marginVertical: 20, }]}>
                              <Ionicons name="logo-tiktok" size={20} color="purple" onPress={() => handleUrlPress("https://www.tiktok.com/@eleltech_systems")} />
                              <Entypo name="youtube" size={24} color="red" onPress={() => handleUrlPress("https://www.youtube.com/@Eleltech-Systems")} />
                         </View>
                    </View>
               </View>
          </ScrollView>
     )
}