import { StyleSheet } from "react-native";

export default StyleSheet.create({
    button: {
        borderColor: "#c2c2c2",
        borderWidth: 1,
        alignItems: "center",
        flex: 1,
        backgroundColor: "white",
        flexDirection: "row",
        padding: 20
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "bold",
        padding: 4,
        flex: 1,
        textAlign: "left"
    },
    modal: {
        position: "absolute",
        maxHeight: 200
    },
    separator: {
        borderColor: "#c2c2c2",
        borderTopWidth: 1
    },
    list: {
        flex: 1,
        borderColor: "#c2c2c2",
        borderWidth: 1,
        borderTopWidth: 0,
        backgroundColor: "white"
    },
    item: {
        fontSize: 14,
        fontWeight: "bold",
        flex: 1,
        textAlign: "left",
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingRight: 20,
        color: "#999999"
    },
    selectedItem: {
        color: "black"
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "transparent"
    },
    chevron: {
        borderTopWidth: 2,
        borderRightWidth: 2,
        width: 8,
        height: 8,
        transform: [{ rotate: "135deg" }]
    }
});
