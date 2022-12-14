import React, { useCallback, useEffect, useState } from 'react';
import { Block, Text, Image, Button, Switch, RadioButtons } from '../../components';
import CustomModal, { ICustomPanel } from '../../components/modals/CustomModal';
import { ILanguageProps, IUser } from '../../constants/types';
import { useData, useTheme, useTranslation } from '../../hooks';
import styles from '../../assets/style/styles';
import IconRow from '../../components/utils/IconRow';
import { TouchableOpacity, View } from 'react-native';
import { timeout } from '../../utils/timeout';

export default function ProfileScreen() {
    // hooks for screen
    const [modal, setModal] = useState<ICustomPanel>({
        isVisible: false,
        type: 'success',
        title: '',
        message: '',
    });
    const [userProfileDetail, setUserProfileDetail] = useState<IUser>();
    const [activateNotification, setActivateNotification] = useState<boolean>(false);

    // hooks from app
    const { sizes, assets, colors } = useTheme();
    const { t, setLocale, languages } = useTranslation();
    const { user, handleLoading, isSensorActive, handleSensor, handleUser } = useData();
    const [languageChecked, setLanguageChecked] = useState<number>();

    const handleLanguageChanged = (item: ILanguageProps) => {
        setLanguageChecked(item.id);
        setLocale(item.locale);
    };

    const handleActivateSensor = () => {
        handleLoading(true);
        timeout(500).finally(() => handleLoading(false));
        handleSensor(!isSensorActive);
    };

    const logout = () => {
        handleUser(undefined);
    };

    useEffect(() => {
        const locale = languages.find((l) => l.active);
        setLanguageChecked(locale?.id);
        setUserProfileDetail(user);
    }, []);

    return (
        <>
            <CustomModal {...modal} />
            {!userProfileDetail ? null : (
                <Block scroll showsVerticalScrollIndicator={false} padding={sizes.padding} flex={0}>
                    {/* title */}
                    <Block flex={0} align="center" paddingBottom={sizes.s}>
                        <Text h3 center tertiary>
                            {t('profile.label.title')}
                        </Text>
                    </Block>
                    {/* image */}
                    <Block flex={0} align="center">
                        <Block
                            flex={0}
                            paddingVertical={sizes.padding}
                            style={styles.avatar_container}
                        >
                            {userProfileDetail?.foto ? (
                                <Image
                                    source={{ uri: userProfileDetail?.foto }}
                                    style={styles.avatar_background}
                                />
                            ) : (
                                <Image
                                    source={assets.avatarPlaceholder}
                                    style={styles.avatar_background}
                                />
                            )}
                        </Block>
                    </Block>
                    {/* content */}
                    <Block flex={0} card marginBottom={sizes.margin}>
                        <Block flex={0}>
                            <IconRow name="flag-checkered" text={userProfileDetail?.nombre} />
                        </Block>
                        {/* Integrations */}
                        <Block flex={0}>
                            <Text h4 tertiary>{t('profile.label.integrations')}</Text>
                            <Block
                                flex={0}
                                row
                                marginBottom={sizes.margin}
                                justify="space-between"
                                align="center"
                            >
                                <Text h5>{t('profile.label.strava')}</Text>
                                <Button color={colors.primary}>
                                    <Text
                                        white
                                        bold
                                        transform="uppercase"
                                        paddingHorizontal={sizes.md}
                                    >
                                        {t('profile.btn.connect')}
                                    </Text>
                                </Button>
                            </Block>
                            <Block
                                flex={0}
                                row
                                marginBottom={sizes.margin}
                                justify="space-between"
                                align="center"
                            >
                                <Text h5>{t('profile.label.trainingpeaks')}</Text>
                                <Button color={colors.primary}>
                                    <Text
                                        white
                                        bold
                                        transform="uppercase"
                                        paddingHorizontal={sizes.md}
                                    >
                                        {t('profile.btn.connect')}
                                    </Text>
                                </Button>
                            </Block>
                        </Block>
                        {/* Sensors */}
                        <Block
                            flex={0}
                            row
                            marginBottom={sizes.margin}
                            justify="space-between"
                            align="center"
                        >
                            <Text h4 tertiary>{t('profile.label.sensors')}</Text>
                            <Button color={colors.primary} onPress={handleActivateSensor}>
                                <Text white bold transform="uppercase" paddingHorizontal={sizes.md}>
                                    {!isSensorActive
                                        ? t('profile.btn.add')
                                        : t('profile.btn.remove')}
                                </Text>
                            </Button>
                        </Block>
                        {/* Notifications */}
                        <Block
                            flex={0}
                            row
                            marginBottom={sizes.margin}
                            justify="space-between"
                            align="center"
                        >
                            <Text h4 tertiary>{t('profile.label.notifications')}</Text>
                            <Switch
                                checked={activateNotification}
                                onPress={(checked) => setActivateNotification(checked)}
                            />
                        </Block>

                        {/* Language */}
                        <Block flex={0}>
                            <Text h4 tertiary>{t('profile.label.language')}</Text>
                            <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                                <Block row>
                                    {languages.map((item, i) => (
                                        <RadioButtons
                                            key={i}
                                            item={item}
                                            checked={languageChecked}
                                            setChecked={() => handleLanguageChanged(item)}
                                        >
                                            <Text p>{item.label}</Text>
                                        </RadioButtons>
                                    ))}
                                </Block>
                            </Block>
                        </Block>

                        {/* Close session */}
                        <Block>
                            <Button color={colors.primary} onPress={logout}>
                                <Text white bold transform="uppercase" paddingHorizontal={sizes.md}>
                                    {t('profile.btn.closeSesion')}
                                </Text>
                            </Button>
                        </Block>
                    </Block>
                </Block>
            )}
        </>
    );
}
