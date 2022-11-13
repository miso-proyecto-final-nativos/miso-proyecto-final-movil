import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Block, Text } from '../../components';
import Event, { IEventProps } from '../../components/events/Event';
import LoadingPlaceholder from '../../components/LoadingPlaceholder';
import DataNotFound from '../../components/utils/DataNotFound';
import { useTheme, useTranslation } from '../../hooks';
import useEventEndpoint from '../../services/api/useEventEndpoint';

export default function ProgressEventScreen() {
    // hooks for screen
    const [myProgressEvents, setMyProgressEvents] = useState<IEventProps[]>([]);
    const [isMyProgressEventsLoading, setIsMyProgressEventsLoading] = useState(false);

    // hooks from app
    const { t } = useTranslation();
    const { sizes } = useTheme();
    const { loadMyEventProgress } = useEventEndpoint();
    const isFocused = useIsFocused();

    useEffect(() => {
        setMyProgressEvents([]);
        setIsMyProgressEventsLoading(true);

        loadMyEventProgress('20', true)
            .then((data: IEventProps[]) => setMyProgressEvents(data))
            .catch((error: string) => {})
            .finally(() => setIsMyProgressEventsLoading(false));
    }, [isFocused]);

    return (
        <Block safe padding={sizes.padding}>
            <Block flex={0} align="center" paddingBottom={sizes.s}>
                <Text h3 center>
                    {t('progress.label.title')}
                </Text>
            </Block>
            <Block flex={1} marginBottom={sizes.xl}>
                <FlatList
                    data={myProgressEvents}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => <Event props={item} path='Progress' />}
                    ListEmptyComponent={
                        isMyProgressEventsLoading ? (
                            <LoadingPlaceholder />
                        ) : (
                            <DataNotFound title={t('progress.warning.myProgressEventsNotFound')} />
                        )
                    }
                    showsVerticalScrollIndicator={false}
                />
            </Block>
        </Block>
    );
}
