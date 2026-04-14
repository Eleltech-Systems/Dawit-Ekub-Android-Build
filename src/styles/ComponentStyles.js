import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default StyleSheet.create({
     headerContainer: {
          backgroundColor: COLORS.primary,
          paddingTop: 50,
          paddingBottom: 20,
          paddingHorizontal: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
     },
     container: {
          backgroundColor: COLORS.primary,
          height: "100%",
          alignItems: "center"
     },
     headerText: {
          fontSize: 16,
          fontWeight: "500",
          color: COLORS.offwhite
     },
     contentContainer: {
          marginHorizontal: 10,
          marginBottom: 10,
          borderWidth: 2,
          borderColor: COLORS.primary,
          borderRadius: 20
     },
     modalContainer: {
          justifyContent: "center",
          alignItems: "center"
     },
     answerBtn: {
          width: "30%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: COLORS.primary,
          borderRadius: 8,
          padding: 3,
          gap: 10,
     },
     modalBox: {
          height: 180,
          alignItems: "center",
          justifyContent: "center",
          gap: 20
     },
     activityIndicatorContainer: {
          height: "90%",
          alignItems: "center",
          justifyContent: "center"
     },
     allInputContainer: {
          backgroundColor: "white",
          borderRadius: 16,
          margin: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: "#bdc6df"
     },
     inputContainer: {
          marginTop: 10,
          gap: 10,
          marginBottom: 10
     },
     inputBox: {
          borderWidth: 1,
          borderColor: "#bdc6df",
          borderRadius: 10,
          paddingHorizontal: 10,
          alignItems: "center",
          height: 50
     },
     inputText: {
          paddingVertical: 12,
          width: "100%",
          fontSize: 14,
          color: COLORS.primary,
          fontWeight: "500",
     },
     inputSelectListBoxStyle: {
          borderWidth: 1,
          borderColor: "#bdc6df",
          paddingHorizontal: 14,
          borderRadius: 10,
          alignItems: "center",
          height: 50
     },
     inputSelectListInputStyle: {
          fontSize: 14,
          color: COLORS.primary,
          fontWeight: "500"
     },
     inputSelectListDropdownStyles: {
          borderWidth: 1,
          borderColor: COLORS.primary,
     },
     inputErrorText: {
          alignSelf: "flex-end",
          color: COLORS.red,
          fontSize: 14,
          fontWeight: "400"
     },
     submitButtons: {
          padding: 12,
          borderRadius: 8,
          marginHorizontal: 20,
          marginTop: 10,
          alignItems: "center",
          marginBottom: 140
     },
     submitButtonsText: {
          color: COLORS.offwhite,
          fontSize: 16,
          fontWeight: "500",
          alignSelf: "center"
     },
     lightButtons: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          borderWidth: 1,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderColor: COLORS.primary,
          borderRadius: 8
     },
     moreBtn: {
          width: "44%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.primary,
          paddingHorizontal: 10,
          paddingVertical: 5,
          gap: 16,
     },
     largText: {
          fontWeight: "500",
          fontSize: 18,
          color: COLORS.darkText
     },
     mediumText: {
          fontWeight: "500",
          fontSize: 16,
          color: COLORS.darkText
     },
     smallText: {
          fontWeight: "500",
          fontSize: 14,
          color: COLORS.darkText
     },


     //For Amharic---------------------------
     //--------------------------------
     headerTextAm: {
          fontSize: 16,
          fontFamily: FONTS.medium,
          color: COLORS.offwhite
     },
     largTextAm: {
          fontFamily: FONTS.medium,
          fontSize: 18,
          color: COLORS.darkText
     },
     mediumTextAm: {
          fontFamily: FONTS.medium,
          fontSize: 16,
          color: COLORS.darkText
     },
     smallTextAm: {
          fontFamily: FONTS.medium,
          fontSize: 14,
          color: COLORS.darkText
     },
     xSmallTextAm: {
          fontFamily: FONTS.regular,
          fontSize: 12,
          color: COLORS.darkText
     },
     errorTextAm: {
          fontFamily: FONTS.regular,
          fontSize: 12,
          color: "red",
          textAlign: "center"
     },
     inputErrorTextAm: {
          alignSelf: "flex-end",
          color: COLORS.red,
          fontSize: 14,
          fontFamily: FONTS.regular
     },
     errorTextAm: {
          fontFamily: FONTS.regular,
          fontSize: 12,
          color: "red",
          textAlign: "center"
     },
     inputTextAm: {
          paddingVertical: 12,
          width: "100%",
          fontSize: 14,
          color: COLORS.primary,
          fontFamily: FONTS.medium
     },
     //--------------------------------------


     xSmallText: {
          fontWeight: "400",
          fontSize: 12,
          color: COLORS.darkText
     },
     basicStyle: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
     },
     resultContainer: {
          flexDirection: "row",
          alignItems: "center",
     },
     memberInfoContainer: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12
     },
     lotCont: {
          borderWidth: 1,
          borderColor: COLORS.primary,
          marginHorizontal: 16,
          marginTop: 10,
          borderRadius: 12,
          padding: 12,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "flex-start",
          minHeight: 200
     },
     lotBox: {
          height: 40,
          width: 50,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10
     },
     lotNum: {
          borderRadius: 5,
          paddingHorizontal: 5,
          fontSize: 16,
          minWidth: 50,
          height: 25,
          color: "white",
          fontWeight: "500",
          textAlign: "center",
     },
     orderedNumBox: {
          backgroundColor: COLORS.primary,
          height: "auto",
          width: 50,
          borderRadius: 6,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
          paddingVertical: 8
     },
     errorText: {
          fontWeight: "400",
          fontSize: 12,
          color: "red",
          textAlign: "center"
     },
     listContainer: {
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.secondary2,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          marginHorizontal: 10,
          marginVertical: 10,
          paddingHorizontal: 10,
          paddingVertical: 5
     },
     contactList: {
          backgroundColor: COLORS.secondary2,
          gap: 2,
          marginBottom: 20,
          borderRadius: 6,
          paddingVertical: 5,
     }

});
