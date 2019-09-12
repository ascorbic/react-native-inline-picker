import React, { useCallback, useRef, useState, useEffect } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    FlatListProps,
    StyleProp,
    ListRenderItemInfo,
    ListRenderItem,
    ViewStyle
} from "react-native";
import styles from "./InlinePickerStyle";

interface Props<ItemT> extends Partial<FlatListProps<ItemT>> {
    renderButtonContent?: (
        selectedItem?: ItemT,
        placeholderText?: string
    ) => React.ReactElement<any> | null;
    buttonStyle?: StyleProp<ViewStyle>;
    labelExtractor?: (item: ItemT) => string;
    selectedIndex?: number;
    onChange?: (item: ItemT, index: number) => void;
    data: ItemT[];
    placeholderText?: string;
    listWidth?: number | "auto";
}

type InlinePickerComponent<ItemT = any> = React.SFC<Props<ItemT>>;
const DefaultLabelExtractor = <ItemT extends any>(item: ItemT) =>
    ("value" in item && (item as ItemT & { value: string }).value.toString()) ||
    "";
const DefaultSeparator = () => <View style={styles.separator} />;

export const InlinePicker: InlinePickerComponent = <ItemT extends any>({
    renderButtonContent,
    buttonStyle,
    selectedIndex,
    onChange,
    data,
    placeholderText,
    renderItem,
    labelExtractor = DefaultLabelExtractor,
    ItemSeparatorComponent = DefaultSeparator,
    listWidth = "auto",
    ...listProps
}: Props<ItemT>) => {
    const buttonRef = useRef<TouchableOpacity>(null);
    const listRef = useRef<FlatList<ItemT>>(null);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0
    });
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState("");

    const defaultItemRenderer = useCallback(
        (info: ListRenderItemInfo<ItemT>) => (
            <Text
                style={[
                    styles.item,
                    selectedIndex === info.index && styles.selectedItem
                ]}
            >
                {labelExtractor(info.item)}
            </Text>
        ),
        [selectedIndex, labelExtractor]
    );

    const renderFunction = renderItem || defaultItemRenderer;

    const measure = useCallback(() => {
        if (buttonRef.current) {
            //   buttonRef.current.measureInWindow((x, y, width, height) => {
            //     setStatus(JSON.stringify({ x, y, width, height }));
            //   });
            buttonRef.current.measureInWindow((x, y, width, height) => {
                // setStatus(JSON.stringify({ _x, _y, width, height, pageX, pageY }));

                setPosition({
                    left: x,
                    top: y + height,
                    width: listWidth === "auto" ? width : listWidth
                });
            });
        }
    }, [buttonRef.current]);

    const onLayout = useCallback(() => {
        measure();
    }, [measure]);

    const hidePopup = useCallback(() => {
        setShowModal(false);
    }, []);

    const showPopup = useCallback(() => {
        setShowModal(true);
        measure();
    }, [measure]);

    const itemRenderer: ListRenderItem<ItemT> = useCallback(
        info => (
            <TouchableOpacity
                onPress={() => {
                    setShowModal(false);
                    onChange && onChange(info.item, info.index);
                }}
            >
                {renderFunction(info)}
            </TouchableOpacity>
        ),
        [renderItem, onChange]
    );

    const defaultButtonContent = useCallback(
        (selectedItem?: ItemT, placeholderText?: string) => (
            <>
                <Text style={styles.buttonText}>
                    {selectedItem
                        ? labelExtractor(selectedItem)
                        : placeholderText}
                </Text>
                <View style={styles.chevron} />
            </>
        ),
        [labelExtractor]
    );

    const buttonRender = renderButtonContent || defaultButtonContent;
    const selectedItem =
        (selectedIndex && selectedIndex > 0) || selectedIndex === 0
            ? data[selectedIndex]
            : undefined;

    return (
        <>
            <TouchableOpacity
                style={[styles.button, buttonStyle]}
                onLayout={onLayout}
                onPress={showPopup}
                ref={buttonRef}
            >
                {buttonRender(selectedItem, placeholderText)}
            </TouchableOpacity>
            <Text>{status}</Text>
            <Modal
                visible={showModal}
                onRequestClose={hidePopup}
                transparent={true}
            >
                <View
                    style={styles.overlay}
                    onStartShouldSetResponder={() => true}
                    onResponderRelease={hidePopup}
                >
                    <View style={[styles.modal, position]}>
                        <FlatList
                            {...listProps}
                            ItemSeparatorComponent={ItemSeparatorComponent}
                            style={styles.list}
                            renderItem={itemRenderer}
                            data={data}
                            ref={listRef}
                            initialScrollIndex={selectedIndex}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default InlinePicker;
