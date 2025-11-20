import React, { forwardRef, Fragment, LegacyRef } from 'react';

import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';

import { style } from './style';
import { themes } from '../../global/themes';
import { FontAwesome, Octicons, MaterialIcons } from '@expo/vector-icons';

type IconComponent = React.ComponentType<React.ComponentProps<typeof MaterialIcons>> |
    React.ComponentType<React.ComponentProps<typeof FontAwesome>> |
    React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
    IconLeft?: IconComponent,
    IconRigth?: IconComponent,
    IconLeftName?: string,
    IconRigthName?: string,
    title?: string,
    onIconLeftPress?: () => void,
    onIconRigthPress?: () => void,

}
export const Input = forwardRef((Props: Props, ref: LegacyRef<Textnput> | null) => {

    const { IconLeft, IconRigth, IconLeftName, IconRigthName, title, onIconLeftPress, onIconRigthPress, ...rest } = Props;

    const calculateSizeWidth = () => {
        if(IconLeft && IconRigth){
            return '83%';
        }else if(IconLeft || IconRigth){
            return '90%';
        }else{
            return '100%';
        }
    }

    const calculateSizePaddingLeft = () => {
        if(IconLeft && IconRigth){
            return 10;
        }else if(IconLeft || IconRigth){
            return 15;
        } else {
            return 20;
        }
    }

    return (
        <Fragment>
            {title&&<Text style={style.titleInput}>{title}</Text>}
            <View style={[style.BoxInput, {paddingLeft: calculateSizePaddingLeft()}]}>
                {IconLeft && IconLeftName &&(
                    <TouchableOpacity onPress={onIconLeftPress} style={style.Button}>
                        <IconLeft name={IconLeftName as any} size={20} color={themes.colors.gray} style={style.icon} />
                    </TouchableOpacity>
                )}
                <TextInput
                    style={[
                        style.input, {width: calculateSizeWidth()}
                    ]}
                    {...rest}
                />
                {IconRigth && IconRigthName &&(
                    <TouchableOpacity onPress={onIconRigthPress} style={style.Button}>
                        <IconRigth name={IconRigthName as any} size={20} color={themes.colors.gray} style={style.icon} />
                    </TouchableOpacity>
                )}
            </View>
        </Fragment>
    )
})