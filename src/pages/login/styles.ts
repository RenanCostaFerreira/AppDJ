import { Dimensions, StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    BoxTop: {
        height: Dimensions.get('window').height / 3,
        width: '100%',
        //backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'

    },
    BoxMid: {
        height: Dimensions.get('window').height / 4,
        width: '100%',
        //backgroundColor: 'green',
        paddingHorizontal: 37

    },
    BoxBotton: {
        height: Dimensions.get('window').height / 3,
        width: '100%',
        //backgroundColor: 'cyan',
        alignItems: 'center',
        //justifyContent:'center'
        marginTop: 40

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
    ,
    roleButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 300,
        marginTop: 6
    },
    roleButton: {
        flex: 1,
        marginHorizontal: 6,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#f1f1f1'
    },
    roleButtonText: {
        color: themes.colors.primary,
        fontWeight: '600'
    }
    ,
    roleCards: {
        width: '92%',
        alignItems: 'center'
    },
    roleCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3
    },
    roleCardLeft: {
        flex: 1
    },
    roleCardLabel: {
        color: themes.colors.gray,
        fontSize: 14
    },
    roleCardTitle: {
        color: '#222',
        fontSize: 22,
        fontWeight: '700',
        marginTop: 4
    },
    BoxBottonReduced: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingTop: 8
    },
    govBadge: {
        color: '#1e90ff',
        fontSize: 12,
        marginTop: 6
    },
    roleCardRight: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f6f8fb',
        alignItems: 'center',
        justifyContent: 'center'
    },
    roleCardArrow: {
        fontSize: 22,
        color: themes.colors.primary,
        marginTop: -2
    }
})