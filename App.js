import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Ekub from './src/screens/Ekub';
import EkubMember from './src/screens/EkubMember';
import Home from './src/screens/Home';
import StartNewEkub from './src/screens/StartNewEkub';
import Help from './src/screens/Help';
import About from './src/screens/About';
import AddEkubMember from './src/screens/AddEkubMember';
import AddPayment from './src/screens/AddPayment';
import AddEkubRecipients from './src/screens/AddEkubRecipients';
import PaymentList from './src/screens/PaymentList';
import UpdateEkubMember from './src/screens/UpdateEkubMember';
import ManageLotNumber from './src/screens/ManageLotNumber';
import AddEkubLotWinner from './src/screens/AddEkubLotWinner';
import SelectLotWinner from './src/screens/SelectLotWinner';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './src/utilities/CustomDrawer';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import EkubMemberLotNumber from './src/screens/EkubMemberLotNumber';
import ListOfEkubRecipients from './src/screens/ListOfEkubRecipients';
import { COLORS } from './src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import styles from './src/styles/ComponentStyles';
import { useFonts } from 'expo-font';


// This app uses both navigations, the Stack Navigations and the Drawer Navigations togather.

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

//This Root() function holds the drawer navigation and calles inside the stack navigation.
//This Root() function uses the CustomDrawer as drawerContent to add some drawer contents.
function Root() {
  return (
    <Drawer.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        // sceneStyle: { backgroundColor: 'red' }, This is the background color of the screen
        headerShown: true,
        drawerStyle: { width: "76%", },
        drawerActiveTintColor: "#006A4E",
        drawerLabelStyle: [styles.smallTextAm],
        drawerItemStyle: { borderRadius: 10, marginBottom: 10 }
      }}
      drawerContent={(props) => (<CustomDrawer {...props} />)}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: () => <Ionicons name="home" size={24} color={COLORS.primary} />,
          title: "ቀዳሚ ገጽ",
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="About"
        component={About}
        options={{
          headerShown: true,
          drawerIcon: () => <FontAwesome6 name="circle-info" size={22} color={COLORS.primary} />,
          title: "ስለ ዳዊት እቁብ",
          headerTitleStyle: [styles.headerTextAm],
          headerTintColor: COLORS.offwhite,
          headerStatusBarHeight: 30
        }}
      />

      <Drawer.Screen name="Help" component={Help} options={{
        headerShown: true,
        drawerIcon: () => <FontAwesome6 name="question-circle" size={22} color={COLORS.primary} />,
        title: "ለእገዛ",
        headerTitle: "ለእገዛ",
        headerTitleStyle: [styles.headerTextAm],
        headerTintColor: COLORS.offwhite,
        headerStatusBarHeight: 30,
      }}
      />
    </Drawer.Navigator>
  );
}


export default function App() {
  const [fontsLoaded] = useFonts({
    'NotoEthiopic': require('./assets/fonts/NotoSansEthiopic-Regular.ttf'),
    'NotoEthiopic-Bold': require('./assets/fonts/NotoSansEthiopic-Bold.ttf'),
    'NotoEthiopic-Medium': require('./assets/fonts/NotoSansEthiopic-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return null; // or loading screen
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={Root} />
        <Stack.Screen name="StartNewEkub" component={StartNewEkub} />
        <Stack.Screen name="Ekub" component={Ekub} />
        <Stack.Screen name="EkubMember" component={EkubMember} />
        <Stack.Screen name="EkubMemberLotNumber" component={EkubMemberLotNumber} />
        <Stack.Screen name="AddEkubMember" component={AddEkubMember} />
        <Stack.Screen name="UpdateEkubMember" component={UpdateEkubMember} />
        <Stack.Screen name="AddEkubRecipients" component={AddEkubRecipients} />
        <Stack.Screen name="ListOfEkubRecipients" component={ListOfEkubRecipients} />
        <Stack.Screen name="AddPayment" component={AddPayment} />
        <Stack.Screen name="PaymentList" component={PaymentList} />
        <Stack.Screen name="ManageLotNumber" component={ManageLotNumber} />
        <Stack.Screen name="AddEkubLotWinner" component={AddEkubLotWinner} />
        <Stack.Screen name="SelectLotWinner" component={SelectLotWinner} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
