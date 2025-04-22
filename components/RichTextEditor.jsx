import { StyleSheet, View, Text } from "react-native";
import { RichToolbar, actions, RichEditor } from "react-native-pell-rich-editor";
import { theme } from "../constants/theme";

const RichTextEditor = ({ editorRef, onChange }) => {
    return (
        <View style={{ minHeight: 285 }}>
            <RichToolbar
                actions={[
                    actions.setStrikethrough,
                    actions.setBold,
                    actions.setItalic,
                    actions.removeFormat,
                    actions.insertOrderedList,
                    actions.blockquote,
                    actions.alignLeft,
                    actions.alignCenter,
                    actions.alignRight,
                    actions.code,
                    actions.line,
                    actions.heading1,
                    actions.heading4,
                ]}
                iconMap={
                    {
                        [actions.heading1]: (tintColor) => <Text style={{ color: tintColor }}>H1</Text>,
                        [actions.heading4]: (tintColor) => <Text style={{ color : tintColor }}>H4</Text>,
                    }
                }
                selectedIconTint={theme.colors.primaryDark}
                style={styles.richBar}
                flatContainerStyle={styles.faltStyle}
                editor={editorRef}
                disabled={false}
            />

            <RichEditor
                ref={editorRef}
                containerStyle={styles.rich}
                editorStyle={styles.contentStyle}
                placeholder="What's on your mind?"
                onChange={onChange}
            />
        </View>
    );
};

export default RichTextEditor;

const styles = StyleSheet.create({
    richBar: {
        borderTopRightRadius: theme.radius.xl,
        borderTopLeftRadius: theme.radius.xl,
        backgroundColor: theme.colors.gray,
    },
    faltStyle: {
        paddingHorizontal: 8,
        gap: 3,
    },
    rich: {
        minHeight: 240,
        borderWidth: 1.5,
        flex: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: theme.radius.xl,
        borderBottomRightRadius: theme.radius.xl,
        borderColor: theme.colors.gray,
        padding: 5,
    },
    contentStyle: {
        color: theme.colors.textDark,
        placeholderColor: 'gray',
    }
});