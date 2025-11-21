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
export const Input = forwardRef((Props: Props, ref: LegacyRef<TextInput> | null) => {

    const { IconLeft, IconRigth, IconLeftName, IconRigthName, title, onIconLeftPress, onIconRigthPress, ...rest } = Props;

    const calculateSizePaddingLeft = () => {
        if(IconLeft) return 10;
        return 20;
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
                    ref={ref as any}
                    style={[
                        style.input
                    ]}
                    autoCapitalize="none"
                    autoCorrect={false}
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