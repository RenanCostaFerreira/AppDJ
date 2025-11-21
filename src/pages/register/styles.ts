import { Dimensions, StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    BoxTop: {
        height: Dimensions.get('window').height / 4,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'

    },
    BoxMid: {
        width: '100%',
        paddingHorizontal: 37,
        // allow inputs to determine height so button appears right below
        paddingTop: 8

    },
    BoxBotton: {
        width: '100%',
        alignItems: 'center',
        marginTop: 16

    },
    logo: {
        width: 150,
        height: 150
    },
    text: {
        fontWeight: 'bold',
        marginTop: 40,
        fontSize: 18
    },
    titleInput: {
        marginLeft: 5,
        color: themes.colors.gray,
        marginTop: 28
    },
    button: {
        width: 250,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themes.colors.primary,
        borderRadius: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    textButton: {
        fontSize: 16,
        color: "#ffff",
        fontWeight: 'bold'
    },
    textBottom: {
        fontSize: 16,
        color: themes.colors.gray,
    },
    One:{
        color: themes.colors.primary,
        fontWeight: 'bold',
        marginTop: 40,
        fontSize: 18
    }
})
