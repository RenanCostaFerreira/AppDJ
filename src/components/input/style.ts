import { Button, StyleSheet } from "react-native";
import { themes } from "../../global/themes";


export const style = StyleSheet.create({
    BoxInput: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderRadius: 40,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        backgroundColor: themes.colors.lightGray,
        borderColor: themes.colors.lightGray

    },
    input: {
        height: '100%',
        flex: 1,
        borderRadius: 40,
        paddingHorizontal: 12
    },
    titleInput: {
        marginLeft: 5,
        color: themes.colors.gray,
        marginTop: 28
    },
    icon:{
        width: '100%'
    },
    Button:{
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
})